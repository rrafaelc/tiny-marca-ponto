import React, { useCallback, useMemo } from 'react';

import { Container, Day, LastRowDay, DayText, HourText } from './styles';

// Para salvar usa o asyncStorage
// https://react-native-async-storage.github.io/async-storage/

type Day = {
  text: string;
  available: boolean;
  hour: string;
  isLastDays: boolean;
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
        isLastDays: i > 28 ? true : false,
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

  return (
    <Container>
      {days.map(
        day =>
          !day.isLastDays && (
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
          day =>
            day.isLastDays && (
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
