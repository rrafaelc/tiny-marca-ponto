import React, { useCallback, useEffect, useMemo } from 'react';
import { TimerClockRepository } from '../../repositories/TimerClockRepository';
import { getDaysInMonth } from 'date-fns';

import { Container, Day, LastRowDay, DayText, HourText } from './styles';

type Day = {
  text: string;
  available: boolean;
  hour: string;
};

export const Calendar = () => {
  const days: Day[] = useMemo(() => {
    let objectDays: Day[] = [];

    for (let i = 1; i <= 31; i++) {
      const random = Math.random();

      objectDays.push({
        text: String(i).padStart(2, '0'),
        available: random > 0.5 ? true : false,
        hour: random > 0.5 ? '4:45' : '--:--',
      });
    }

    return objectDays;
  }, []);

  const isActive = useCallback((day: string) => {
    if (Number(day) === 25) {
      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    const f = async () => {
      console.log(getDaysInMonth(new Date()) + ' Dias');

      const timerClockRepository = new TimerClockRepository();

      timerClockRepository.getMonthDays(1);
    };

    f();
  }, []);

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
