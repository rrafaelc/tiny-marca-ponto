import React from 'react';

import { CalendarProvider } from './calendarContext';

export const AppProvider: React.FC = ({ children }) => {
  return <CalendarProvider>{children}</CalendarProvider>;
};
