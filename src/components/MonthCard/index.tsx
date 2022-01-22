import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Container, Text } from './styles';

interface CardSelected {
  id: string;
  month: number;
  year: number;
}

type MonthCardProps = {
  id: string;
  selected: string;
  month: number;
  year: number;
  hour: string;
  minute: string;
  callback: (data: CardSelected) => void;
};

export const MonthCard: React.FC<MonthCardProps> = ({
  id,
  selected,
  month,
  year,
  hour,
  minute,
  callback,
}) => {
  const monthParsed = useMemo(() => {
    const date = new Date().setMonth(month);

    return format(date, 'MMM', { locale: ptBR });
  }, [month]);

  const handleCallback = useCallback(() => {
    callback({ id, month, year });
  }, [callback, id, month, year]);

  return (
    <Container
      activeOpacity={1}
      selected={selected === id}
      onPress={handleCallback}>
      <Text>
        {monthParsed} {year}
      </Text>

      <Text>{`${hour}:${minute}`}</Text>
    </Container>
  );
};
