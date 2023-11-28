import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {createContext, useState} from 'react';
import {ToastType} from '../types/toast';

interface ToastContextProps {
  message: string;
  type: ToastType;
  onChangeMessage: (message: string) => void;
  onChangeType: (type: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({children}: PropsWithChildren) => {
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<ToastType>(ToastType.NOTICE);

  const onChangeMessage = useCallback((msg: string) => {
    setMessage(msg);
  }, []);
  const onChangeType = useCallback((toastType: ToastType) => {
    setType(toastType);
  }, []);

  const contextValue: ToastContextProps = useMemo(
    () => ({message, type, onChangeMessage, onChangeType}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message, type],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('Toast Context Error: Provider의 위치를 확인해주세요');
  }
  return context;
};
