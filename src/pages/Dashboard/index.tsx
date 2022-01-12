import React from 'react';

import { Clock } from '../../components/Clock';
import { Calendar } from '../../components/Calendar';
import { MonthCard } from '../../components/MonthCard';

import {
  Container,
  Hour,
  HourText,
  Month,
  MonthText,
  Period,
  PeriodText,
  CalendarNoteText,
  MonthCardList,
} from './styles';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface MonthCardProps {
  id: string;
  month: number;
  hour: number;
  minute: number;
}

const monthCards: MonthCardProps[] = [
  {
    id: String(Math.random()),
    month: 4,
    hour: 205,
    minute: 42,
  },
  {
    id: String(Math.random()),
    month: 3,
    hour: 205,
    minute: 42,
  },
  {
    id: String(Math.random()),
    month: 2,
    hour: 205,
    minute: 42,
  },
];

export const Dashboard: React.FC = () => {
  // const date = new Date();
  // const test = new Date(date.setMonth(4 - 1));
  // console.log(format(test, 'MMMM', { locale: ptBR }));

  return (
    <Container>
      <Clock />
      <Hour>
        <HourText>207 horas e 10 minutos</HourText>
      </Hour>

      <Month>
        <MonthText>Maio</MonthText>
        <Period>
          <PeriodText>Manhã - 4:45</PeriodText>
          <PeriodText>Tarde - 4:45</PeriodText>
        </Period>
      </Month>

      <Calendar />
      <CalendarNoteText>Nota: Clique em um dia para editar</CalendarNoteText>

      <MonthCardList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={monthCards}
        renderItem={({ item: card }) => (
          <MonthCard month={card.month} hour={card.hour} minute={card.minute} />
        )}
        keyExtractor={card => card.id}
      />
    </Container>
  );
};
