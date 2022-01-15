import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TimerClockRepository } from '../../repositories/TimerClockRepository';
import { getDaysInMonth } from 'date-fns';

import { IDatePropsDTO } from '../../dtos/IDatePropsDTO';

import { Container, Day, LastRowDay, DayText, HourText } from './styles';

interface Day {
  id: string;
  text: string;
  available: boolean;
  hour: string;
}

interface CalendarProps {
  month: number;
  year: number;
}

export const Calendar = ({ month, year }: CalendarProps) => {
  const [days, setDays] = useState<Day[]>([]);

  const isActive = useCallback((day: string) => {
    if (Number(day) === new Date().getDate()) {
      return true;
    }

    return false;
  }, []);

  const sumHoursAndMinutes = useCallback((date: string[]) => {
    const diferenca = new Date(date[1]).getTime() - new Date(date[0]).getTime();

    const hours = [];

    for (let i = 0; i < date.length; i++) {
      if (i + 1 >= date.length) {
        break;
      }

      // const localDate = new Date(date[i]);

      const dif = new Date(date[i + 1]).getTime() - new Date(date[i]).getTime();

      // Return 3 hours timezone difference
      const correctTimezone = new Date(dif + 3 * 60 * 60 * 1000).toTimeString();

      hours.push(correctTimezone.split(' GMT')[0]);

      // console.log(new Date(dif).toTimeString());
    }

    console.log(hours);

    const timestrToSec = (timestr: string) => {
      var parts = timestr.split(':');
      return Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
    };

    const pad = (num: number) => {
      if (num < 10) {
        return '0' + num;
      } else {
        return '' + num;
      }
    };

    const formatTime = (seconds: number) => {
      return [
        pad(Math.floor(seconds / 3600)),
        pad(Math.floor(seconds / 60) % 60),
        pad(seconds % 60),
      ].join(':');
    };

    const workHours: string[] = [];

    for (let i = 0; i < hours.length; i++) {
      if (i % 2 === 0) {
        workHours.push(hours[i]);
      }
    }

    const sumHours = workHours.reduce((acc, curr) => {
      return formatTime(timestrToSec(curr) + timestrToSec(acc));
    });

    console.log(sumHours);

    // console.log(h);

    // const d = new Date(diferenca);

    // console.log(d.toTimeString());
  }, []);

  const parseDate = useCallback(
    (date: IDatePropsDTO[]) => {
      const daysParsed: Array<{
        day: number;
        dates: Array<{ id: string; date: string }>;
      }> = [];

      date.forEach(d => {
        daysParsed.push({
          day: d.day,
          dates: d.period,
        });
      });

      console.log('====PARSED====');
      // console.log(JSON.stringify(daysParsed));
      daysParsed.forEach(d =>
        d.dates.forEach(d => console.log(new Date(d.date).toString())),
      );
      console.log('====END-PARSED====');

      1;

      let objectDays: Day[] = [];

      for (let i = 1; i <= getDaysInMonth(month); i++) {
        const hasDay = date.filter(d => d.day === i);

        // console.log(`HasDay - ${i} - ` + JSON.stringify(hasDay));

        if (hasDay.length > 0) {
          const dates: string[] = [];

          hasDay[0].period.forEach(period => dates.push(period.date));

          const totalHour = sumHoursAndMinutes(dates);

          console.log('Horas somadas: ' + totalHour);

          // console.log('Tem dia');
          // objectDays.push({
          //   id: hasDay[0].id,
          //   text: String(i).padStart(2, '0'),
          //   available: true,
          //   hour: hasDay
          // });
        } else {
          // console.log('nao tem dia');
        }
      }
      return objectDays;
    },
    [month, sumHoursAndMinutes],
  );

  useEffect(() => {
    const getDays = async () => {
      console.log(getDaysInMonth(new Date(year, month, 1)) + ' Dias');

      const timerClockRepository = new TimerClockRepository();

      parseDate(await timerClockRepository.getMonthDays(month));
    };

    getDays();
  }, [year, month, parseDate]);

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
