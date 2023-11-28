import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {createContext, useState} from 'react';

interface WeekContextProps {
  selectedWeek: number;
  selectWeek: (week: number | string) => void;
}

const WeekContext = createContext<WeekContextProps | undefined>(undefined);

export const WeekProvider = ({children}: PropsWithChildren) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(15);

  const selectWeek = useCallback((week: string | number) => {
    typeof week === 'string' ? setSelectedWeek(+week) : setSelectedWeek(week);
  }, []);

  const contextValue: WeekContextProps = useMemo(
    () => ({selectedWeek, selectWeek}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedWeek],
  );

  return (
    <WeekContext.Provider value={contextValue}>{children}</WeekContext.Provider>
  );
};

export const useWeekContext = () => {
  const context = useContext(WeekContext);
  if (context === undefined) {
    throw new Error('Week Context Error: Provider의 위치를 확인해주세요');
  }
  return context;
};
