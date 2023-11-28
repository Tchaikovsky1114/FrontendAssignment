import React, {PropsWithChildren, useCallback, useContext, useEffect, useMemo} from 'react';
import { createContext, useState} from 'react';
import { ToastType } from '../types/toast';

interface ToastContextProps {
  message: string;
  type: ToastType;
  onChangeMessage: (message: string) => void;
  onChangeType: (type: ToastType) => void;
  
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({children}: PropsWithChildren) => {

  const [message, setMessage] = useState<string>('')
  const [type, setType] = useState<ToastType>(ToastType.NOTICE)

  const onChangeMessage = useCallback((message: string) => {
    setMessage(message);

  },[])
  const onChangeType = useCallback((type: ToastType) => {
    setType(type);
  },[])

  

  const contextValue: ToastContextProps = useMemo(
    () => ({message, type, onChangeMessage, onChangeType}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message, type]);

  useEffect(() => {
    let flag:NodeJS.Timeout;

    if (message) {
      
      flag = setTimeout(() => {
        onChangeMessage('');
      }, 3000);
    }
    return () => clearTimeout(flag);
  },[message])


  return (
    <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('toast context 에러');
  }
  return context;
};
