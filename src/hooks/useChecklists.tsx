import { Keyboard } from 'react-native'
import { useCallback, useState } from 'react'
import { AllChecklists, NewChecklist } from '../types/checklist';
import useDelay from './useDelay';
import { useEditContext } from '../context/EditProvider';
import useInput from './useInput';
import { useWeekContext } from '../context/WeekProvider';
import { fetchAllDefaultChecklists } from '../util/fetchAllDefaultChecklists';
import { useToastContext } from '../context/ToastProvider';

const useChecklists = () => {
  const { delay } = useDelay();
  const { isEdit, onChangeEdit, popUndoStack, pushUndoStack } = useEditContext()
  const [allChecklists, setAllChecklists] = useState<AllChecklists | null>(fetchAllDefaultChecklists());
  const [editMode, setEditMode] = useState<'update' | 'create' | 'await'>('await');
  const [submitValue, setSubmitValue] = useState<NewChecklist | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedChecklists, setSelectedChecklist] = useState<NewChecklist[]>([]);
  const [prevSelectedWeek, setPrevSelectedWeek] = useState(0);
  const { value: editText, onChange: onChangeEditText } = useInput();
  const { onChangeMessage } = useToastContext();
  const { value: newChecklistContent, onChange: onChangeNewChecklistContent } = useInput('');
  const {selectedWeek} = useWeekContext();

  /**
   * @description 체크리스트를 생성하는 함수입니다. 생성된 체크리스트는 allChecklists state에 저장됩니다.
   */
  const createChecklist = useCallback(() => {
    const mutableCopyChecklist = {...allChecklists};
    const newChecklist: NewChecklist = {
      id: Date.now() + '',
      content: newChecklistContent,
      isCompleted: false,
      weekNumber: selectedWeek,
    };
    mutableCopyChecklist[selectedWeek] = [newChecklist, ...mutableCopyChecklist[selectedWeek]];
    delay(() => {
      setAllChecklists(mutableCopyChecklist);
      onChangeNewChecklistContent('');
      Keyboard.dismiss();
      setEditMode('await');
    },800);
  },[selectedWeek,newChecklistContent])


  /**
   * @description 체크리스트를 수정하는 함수입니다. 수정된 체크리스트는 allChecklists state에 저장됩니다.
   * @param newChecklist 수정된 체크리스트
   * @paramType NewChecklist
   * 
   */
  const updateChecklistChanges = useCallback((newChecklist:NewChecklist) => {
    const mutableCopyChecklist = {...allChecklists};
    const weekNumber = newChecklist.weekNumber;
    const index = mutableCopyChecklist[weekNumber].findIndex(
      checklist => checklist.id === newChecklist.id,
    );
    if(index < 0) return;
      mutableCopyChecklist[weekNumber][index] = newChecklist; 
      setAllChecklists(mutableCopyChecklist);
  },[allChecklists])

  /**
   * @description 체크리스트를 삭제하는 함수입니다. 삭제된 체크리스트는 allChecklists state에 저장됩니다.
   * @param checklist 삭제된 체크리스트
   * @paramType NewChecklist
   */
  const deleteChecklist = useCallback((checklist: NewChecklist) => {
    pushUndoStack(checklist);
    const mutableCopyChecklist = {...allChecklists};
    const weekNumber = checklist.weekNumber;
    const filteredChecklists = mutableCopyChecklist[weekNumber].filter(
      item => item.id !== checklist.id,
    );
    mutableCopyChecklist[weekNumber] = filteredChecklists;
    
    setAllChecklists(mutableCopyChecklist);
  },[allChecklists])

  /**
   * @description 삭제된 체크리스트를 복구하는 함수입니다. 복구된 체크리스트는 allChecklists state에 저장됩니다.
   * @description undoStack의 가장 최근에 저장된 체크리스트를 가져와 복구합니다.
   * @param checklist 복구된 체크리스트
   * @paramType NewChecklist
   * 
   */
  const recoveryUndoChecklist = useCallback(() => {
    const mutableCopyChecklist = {...allChecklists};
    const weekNumber = selectedWeek;
    const undoChecklist = popUndoStack();
    if(!undoChecklist) return;
    mutableCopyChecklist[weekNumber] = [undoChecklist, ...mutableCopyChecklist[weekNumber]];
    setAllChecklists(mutableCopyChecklist);
    onChangeMessage('')
  },[allChecklists,selectedWeek])
  

  /**
   * @description 체크리스트의 content를 수정하는 함수입니다. updateChecklistChanges 함수를 호출합니다.
   * @description editMode state가 변경되면 호출됩니다.
   * @see editMode 
   */
  const onSubmitUpdateContent = useCallback(() => {
    if(!editText || !submitValue) return;
    
      updateChecklistChanges({
        ...submitValue,
        content: editText,
      });
      setEditMode('await');

    delay(() => {
      Keyboard.dismiss();
    },800);
  },[editText,submitValue])

  /**
   * @description 체크리스트를 수정할 때 사용하는 Input을 활성화하는 함수입니다.
   * @description editMode state가 'update'일 때 호출됩니다.
   * @description editText를 현재 체크리스트의 content로 변경합니다.
   * @param checklist 수정할 체크리스트
   * @paramType NewChecklist
   * @see editMode
   * @see submitValue 
   */
  const onFocusUpdateInput = useCallback((checklist: NewChecklist) => {
    setEditMode('update');
    setSubmitValue(checklist)
    onChangeEditText(checklist.content);
  },[])


  /**
   * @description 체크리스트를 생성할 때 사용하는 Input을 활성화하는 함수입니다.
   * @description editMode state가 'create'일 때 호출됩니다.
   * @see editMode
   */
  const onFocusCreateInput = useCallback(() => {
    setEditMode('create');
  },[])

  /**
   * @description 애니메이션을 위한 PrevSelectedweek state를 변경하는 함수입니다.
   * @description prevSelectedWeek state가 변경되면 체크리스트가 사이드로 사라지는 Slide-Out애니메이션이 실행됩니다.
   * @param week 변경할 value
   * @paramType number
   * @see prevSelectedWeek
   */
  const onChangePrevSelectedWeek = useCallback((week: number) => {
    setPrevSelectedWeek(week);
  },[])
  
  return {
    createChecklist,
    updateChecklistChanges,
    deleteChecklist,
    recoveryUndoChecklist,
    onSubmitUpdateContent,
    allChecklists,
    editMode,
    setEditMode,
    editText,
    onChangeEditText,
    newChecklistContent,
    onChangeNewChecklistContent,
    isEdit,
    onChangeEdit,
    submitValue,
    setSubmitValue,
    onFocusUpdateInput,
    onFocusCreateInput,
    selectedChecklists,
    setSelectedChecklist,
    isDragging,
    setIsDragging,
    prevSelectedWeek,
    setPrevSelectedWeek,
    onChangePrevSelectedWeek
  }
}

export default useChecklists