import React, { createContext, useContext, useCallback, useState } from 'react';

type CalendarContextData = {
  loading: boolean;
  setCalendarLoading: (value: boolean) => void;
  reloadValue: number;
  reloadCalendar: () => void;
  totalToday: string;
  setCalendarTotalToday: (today: string) => void;
};

const CalendarContext = createContext<CalendarContextData>(
  {} as CalendarContextData,
);

const CalendarProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [reloadValue, setReloadValue] = useState(0);
  const [totalToday, setTotalToday] = useState('--:--');

  const setCalendarLoading = useCallback((value: boolean) => {
    setLoading(value);
  }, []);

  const reloadCalendar = useCallback(() => {
    setReloadValue(reloadValue + 1);
  }, [reloadValue]);

  const setCalendarTotalToday = useCallback((date: string) => {
    setTotalToday(date);
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        loading,
        setCalendarLoading,
        reloadValue,
        reloadCalendar,
        totalToday,
        setCalendarTotalToday,
      }}>
      {children}
    </CalendarContext.Provider>
  );
};

const useCalendar = (): CalendarContextData => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within an CalendarProvider');
  }

  return context;
};

export { CalendarProvider, useCalendar };
