import React, { useMemo } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Container, Text } from './styles';

type MonthCardProps = {
  month: number;
  hour: number;
  minute: number;
};

export const MonthCard: React.FC<MonthCardProps> = ({
  month,
  hour,
  minute,
}) => {
  const monthParsed = useMemo(() => {
    const date = new Date().setMonth(month - 1);

    return format(date, 'MMMM', { locale: ptBR });
  }, [month]);

  return (
    <Container>
      <Text>{monthParsed}</Text>
      <Text>{`${hour}:${minute}`}</Text>
    </Container>
  );
};
