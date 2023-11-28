import React from 'react';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {NewChecklist} from '../types/checklist';

interface EditContextProps {
  isEdit: boolean;
  onChangeEdit: (isEdit: boolean) => void;
  popUndoStack: () => NewChecklist;
  pushUndoStack: (checklist: NewChecklist) => void;
}

const EditContext = createContext<EditContextProps | undefined>(undefined);

export const EditProvider = ({children}: PropsWithChildren) => {
  const [isEdit, setIsEdit] = useState(false);
  const undoStackRef = useRef<NewChecklist[]>([]);

  const popUndoStack = useCallback(() => {
    const lastChecklist = undoStackRef.current[undoStackRef.current.length - 1];
    undoStackRef.current = [];

    return lastChecklist;
  }, []);

  const pushUndoStack = useCallback((checklist: NewChecklist) => {
    undoStackRef.current.push(checklist);
  }, []);

  const onChangeEdit = useCallback((edit: boolean) => {
    setIsEdit(edit);
  }, []);

  const contextValue: EditContextProps = useMemo(
    () => ({isEdit, onChangeEdit, popUndoStack, pushUndoStack}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEdit],
  );

  return (
    <EditContext.Provider value={contextValue}>{children}</EditContext.Provider>
  );
};

export const useEditContext = () => {
  const context = useContext(EditContext);
  if (context === undefined) {
    throw new Error('Edit Context Error: Provider의 위치를 확인해주세요');
  }
  return context;
};
