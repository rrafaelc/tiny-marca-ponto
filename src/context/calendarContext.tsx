import React, { createContext, useContext, useCallback, useState } from 'react';

type CalendarContextData = {
  loading: boolean;
  setCalendarLoading: (value: boolean) => void;
  reloadValue: number;
  reloadCalendar: () => void;
};

const CalendarContext = createContext<CalendarContextData>(
  {} as CalendarContextData,
);

const CalendarProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [reloadValue, setReloadValue] = useState(0);

  const setCalendarLoading = useCallback((value: boolean) => {
    setLoading(value);
  }, []);

  const reloadCalendar = useCallback(() => {
    setReloadValue(reloadValue + 1);
  }, [reloadValue]);

  return (
    <CalendarContext.Provider
      value={{ loading, setCalendarLoading, reloadValue, reloadCalendar }}>
      {children}
    </CalendarContext.Provider>
  );
};

const useCalendar = (): CalendarContextData => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export { CalendarProvider, useCalendar };
