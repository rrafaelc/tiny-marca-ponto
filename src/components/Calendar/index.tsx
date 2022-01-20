import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { TimerClockRepository } from '../../repositories/TimerClockRepository';
import { getDaysInMonth, format, isFuture, isToday } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Toast from 'react-native-toast-message';

import { useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../../routes/app.routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { IDatePropsDTO } from '../../dtos/IDatePropsDTO';
import { sumHoursAndMinutes } from '../../utils/sumHoursAndMinutes';
import { useCalendar } from '../../context/calendarContext';

import {
  Container,
  Loading,
  Day,
  LastRowDay,
  DayText,
  HourText,
} from './styles';

interface Day {
  id: string | null;
  text: string;
  hour: string;
  week: string;
  available: boolean;
}

type EditHoursScreenProp = NativeStackNavigationProp<
  AppStackParamList,
  'EditHours'
>;

interface CalendarProps {
  month: number;
  year: number;
}

export const Calendar: React.FC<CalendarProps> = ({ month, year }) => {
  const [days, setDays] = useState<Day[]>([]);

  const navigation = useNavigation<EditHoursScreenProp>();

  const getDaysDate = useCallback(() => {
    const currentDate = new Date();

    currentDate.setFullYear(year);
    currentDate.setMonth(month);

    return currentDate;
  }, [year, month]);

  const { loading, setCalendarLoading, reloadValue, setCalendarTotalToday } =
    useCalendar();

  const totalTodayHours = useCallback(
    (day: number, hour: string) => {
      if (day === new Date().getDate() && month === new Date().getMonth()) {
        setCalendarTotalToday(hour);
      } else {
        setCalendarTotalToday('--:--');
      }
    },
    [setCalendarTotalToday, month],
  );

  const isActive = useCallback(
    (day: string) => {
      if (
        Number(day) === new Date().getDate() &&
        month === new Date().getMonth()
      ) {
        return true;
      }

      return false;
    },
    [month],
  );

  const parseDate = useCallback(
    (date: IDatePropsDTO[]) => {
      const parsedDays: Day[] = [];

      for (let i = 1; i <= getDaysInMonth(getDaysDate()); i++) {
        /* Check if has an object with day in current day in month */
        const hasDay = date.filter(item => item.day === i);

        const weekDate = new Date();
        weekDate.setDate(i);
        weekDate.setMonth(month);
        weekDate.setFullYear(year);

        const week = format(weekDate, 'EEEEE', { locale: ptBR });

        if (hasDay.length > 0) {
          const day = hasDay[0];
          const dates: Date[] = [];

          day.period.forEach(period => dates.push(new Date(period.date)));

          const totalHour = sumHoursAndMinutes(dates.sort()).split(':');

          // 00:00:00 -> 00:00
          const hour = `${totalHour[0]}:${totalHour[1]}`;

          totalTodayHours(day.day, hour);

          parsedDays.push({
            id: day.id,
            text: String(i).padStart(2, '0'), // 01, 02, ...
            hour: hour,
            week,
            available: true,
          });
        } else {
          parsedDays.push({
            id: null,
            text: String(i).padStart(2, '0'), // 01, 02, ...
            hour: '--:--',
            week,
            available: false,
          });
        }
      }

      return parsedDays;
    },
    [totalTodayHours, getDaysDate, month, year],
  );

  const handleEditHour = useCallback(
    (day: Day) => {
      const localDate = new Date();
      localDate.setMonth(month);
      localDate.setFullYear(year);
      localDate.setDate(Number(day.text));

      if (isFuture(localDate)) {
        Toast.show({
          type: 'info',
          text1: 'Não permitido editar datas futuras',
        });

        return;
      }

      // It's TODAY and has an ID
      if (isToday(localDate) && day.id !== null) {
        navigation.navigate('EditHours', { day_id: day.id });

        return;
      }

      // Is TODAY and don't have an ID
      if (isToday(localDate)) {
        navigation.navigate('CreateCustomDate');

        return;
      }

      /**
       * It's NOT TODAY and don't have an ID,
       * create a hour on this day in a new page
       * for create an ID
       */
      if (day.id === null) {
        console.log('Criar um horario nesse dia, nova pagina');

        return;
      }

      // It's NOT TODAY and has an ID
      navigation.navigate('EditHours', { day_id: day.id });
    },
    [month, year, navigation],
  );

  useEffect(() => {
    const getDays = async () => {
      setCalendarLoading(true);
      const timerClockRepository = new TimerClockRepository();

      const parsed = parseDate(
        await timerClockRepository.getMonthDays(month, year),
      );

      setDays(parsed);

      setCalendarLoading(false);
    };

    getDays();
  }, [month, year, parseDate, reloadValue, setCalendarLoading]);

  return (
    <Container loading={loading}>
      {loading ? (
        <Loading>
          <ActivityIndicator size="large" color="#fff" />
        </Loading>
      ) : (
        <>
          {days.map(
            (day, index) =>
              index < 28 && (
                <Day
                  onPress={() => handleEditHour(day)}
                  key={day.text}
                  isAvailable={day.available}
                  isActive={isActive(day.text)}>
                  <DayText>
                    {day.week} {day.text}
                  </DayText>
                  <HourText>{day.hour}</HourText>
                </Day>
              ),
          )}

          {getDaysInMonth(getDaysDate()) > 28 && (
            <LastRowDay>
              {days.map(
                (day, index) =>
                  index >= 28 && (
                    <Day
                      onPress={() => handleEditHour(day)}
                      key={day.text}
                      isAvailable={day.available}
                      isLastRow>
                      <DayText>
                        {day.week} {day.text}
                      </DayText>
                      <HourText>{day.hour}</HourText>
                    </Day>
                  ),
              )}
            </LastRowDay>
          )}
        </>
      )}
    </Container>
  );
};
