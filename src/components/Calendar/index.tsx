import React, { useCallback, useEffect, useState } from 'react';
import { TimerClockRepository } from '../../repositories/TimerClockRepository';
import { getDaysInMonth } from 'date-fns';

import { IDatePropsDTO } from '../../dtos/IDatePropsDTO';
import { sumHoursAndMinutes } from '../../utils/sumHoursAndMinutes';
import { useCalendar } from '../context/calendarContext';

import { Container, Day, LastRowDay, DayText, HourText } from './styles';

interface Day {
  id: string | null;
  text: string;
  hour: string;
  available: boolean;
}

interface CalendarProps {
  month: number;
  year: number;
}

export const Calendar = ({ month, year }: CalendarProps) => {
  const [days, setDays] = useState<Day[]>([]);

  const { reloadValue } = useCalendar();

  const isActive = useCallback((day: string) => {
    if (Number(day) === new Date().getDate()) {
      return true;
    }

    return false;
  }, []);

  const parseDate = useCallback(
    (date: IDatePropsDTO[]) => {
      const parsedDays: Day[] = [];

      for (let i = 1; i <= getDaysInMonth(month); i++) {
        /* Check if has an object with day in current day in month */
        const hasDay = date.filter(item => item.day === i);

        if (hasDay.length > 0) {
          const day = hasDay[0];
          const dates: Date[] = [];

          day.period.forEach(period => dates.push(new Date(period.date)));

          const totalHour = sumHoursAndMinutes(dates).split(':');

          // 00:00:00 -> 00:00
          const hour = `${totalHour[0]}:${totalHour[1]}`;

          parsedDays.push({
            id: day.id,
            text: String(i).padStart(2, '0'), // 01, 02, ...
            hour: hour,
            available: true,
          });
        } else {
          parsedDays.push({
            id: null,
            text: String(i).padStart(2, '0'), // 01, 02, ...
            hour: '--:--',
            available: false,
          });
        }
      }

      return parsedDays;
    },
    [month],
  );

  useEffect(() => {
    const getDays = async () => {
      const timerClockRepository = new TimerClockRepository();

      const parsed = parseDate(await timerClockRepository.getMonthDays(month));

      setDays(parsed);
    };

    getDays();
  }, [year, month, parseDate, reloadValue]);

  return (
    <Container>
      {days.map(
        (day, index) =>
          index < 28 && (
            <Day
              key={day.text}
              isAvailable={day.available}
              isActive={isActive(day.text)}>
              <DayText>{day.text}</DayText>
              <HourText>{day.hour}</HourText>
            </Day>
          ),
      )}

      <LastRowDay>
        {days.map(
          (day, index) =>
            index >= 28 && (
              <Day key={day.text} isAvailable={day.available} isLastRow>
                <DayText>{day.text}</DayText>
                <HourText>{day.hour}</HourText>
              </Day>
            ),
        )}
      </LastRowDay>
    </Container>
  );
};
