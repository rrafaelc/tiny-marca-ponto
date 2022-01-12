import React from 'react';

import { Clock } from '../../components/Clock';
import { Calendar } from '../../components/Calendar';

import {
  Container,
  Hour,
  HourText,
  Month,
  MonthText,
  Period,
  PeriodText,
  CalendarNoteText,
} from './styles';

export const Dashboard: React.FC = () => {
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
    </Container>
  );
};
