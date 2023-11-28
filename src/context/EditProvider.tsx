import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { NewChecklist } from "../types/checklist";


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
    undoStackRef.current = undoStackRef.current.slice(0, -1);
    
    return lastChecklist;

  }, []);

  const pushUndoStack = useCallback((checklist: NewChecklist) => {
    console.log('pushUndoStack', checklist);
    undoStackRef.current.push(checklist);
  }, []);

  

  const onChangeEdit = useCallback((isEdit: boolean) => {
    setIsEdit(isEdit);
  }, []);

  const contextValue: EditContextProps = useMemo(
    () => ({ isEdit, onChangeEdit, popUndoStack, pushUndoStack}),
    [isEdit],
  );

  return (
    <EditContext.Provider value={contextValue}>{children}</EditContext.Provider>
  );
};

export const useEditContext = () => {
  const context = useContext(EditContext);
  if (context === undefined) {
    throw new Error('edit context 에러');
  }
  return context;
};

