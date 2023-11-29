import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {createContext} from 'react';
import {ToastMessage} from '../types/toast';

interface ToastContextProps {
  toastQueue: ToastMessage[];
  addToastQueue: (message: ToastMessage) => void;
  removeToastQueue: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({children}: PropsWithChildren) => {
  const [toastQueue, setToastQueue] = useState<ToastMessage[]>([]);

  const addToastQueue = useCallback((msg: ToastMessage) => {
    console.log('excuting addToastQueue', msg);
    setToastQueue(prev => [...prev, msg]);
  }, []);

  const removeToastQueue = useCallback(() => {
    console.log('excuting removeToastQueue');
    setToastQueue(prev => prev.slice(1));
  }, []);

  const contextValue: ToastContextProps = useMemo(
    () => ({
      toastQueue,
      addToastQueue,
      removeToastQueue,
    }),
    [addToastQueue, removeToastQueue, toastQueue],
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
