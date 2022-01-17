import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Container, Text } from './styles';

interface CardSelected {
  id: number;
  month: number;
}

type MonthCardProps = {
  id: number;
  selected: number;
  month: number;
  hour: string;
  minute: string;
  disabled: boolean;
  callback: (data: CardSelected) => void;
};

export const MonthCard: React.FC<MonthCardProps> = ({
  id,
  selected,
  month,
  hour,
  minute,
  disabled,
  callback,
}) => {
  const monthParsed = useMemo(() => {
    const date = new Date().setMonth(month);

    return format(date, 'MMMM', { locale: ptBR });
  }, [month]);

  const handleCallback = useCallback(() => {
    callback({ id, month });
  }, [callback, id, month]);

  return (
    <Container
      activeOpacity={1}
      selected={selected === id}
      disabled={disabled}
      onPress={handleCallback}>
      {disabled ? (
        <ActivityIndicator size="large" color="#d7d7d7" />
      ) : (
        <>
          <Text>{monthParsed}</Text>
          <Text>{`${hour}:${minute}`}</Text>
        </>
      )}
    </Container>
  );
};
