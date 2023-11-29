import {Keyboard} from 'react-native';
import {useCallback, useMemo, useState} from 'react';
import {AllChecklists, NewChecklist} from '../types/checklist';
import useDelay from './useDelay';
import {useEditContext} from '../context/EditProvider';
import useInput from './useInput';
import {useWeekContext} from '../context/WeekProvider';
import {fetchAllDefaultChecklists} from '../util/fetchAllDefaultChecklists';
import {useToastContext} from '../context/ToastProvider';
import {deepCopy} from '../util/deepCopy';

const useChecklists = () => {
  const {delay} = useDelay();
  const {isEdit, onChangeEdit, popUndoStack, pushUndoStack} = useEditContext();
  const {selectedWeek} = useWeekContext();
  const {onChangeMessage} = useToastContext();
  const [allChecklists, setAllChecklists] = useState<AllChecklists | null>(
    fetchAllDefaultChecklists(),
  );
  const [editMode, setEditMode] = useState<'update' | 'create' | 'await'>(
    'await',
  );
  const [submitValue, setSubmitValue] = useState<NewChecklist | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedChecklists, setSelectedChecklist] = useState<NewChecklist[]>(
    [],
  );
  const [prevSelectedWeek, setPrevSelectedWeek] = useState(0);
  const {value: editText, onChange: onChangeEditText} = useInput();

  const {value: newChecklistContent, onChange: onChangeNewChecklistContent} =
    useInput('');

  /**
   * @description allChecklists state를 DeepCopy하여 사용합니다.
   */
  const mutableCopyChecklist = useMemo(
    () => deepCopy(allChecklists),
    [allChecklists],
  );

  /**
   * @description 체크리스트를 생성하는 함수입니다. 생성된 체크리스트는 allChecklists state에 저장됩니다.
   */
  const createChecklist = useCallback(() => {
    if (!mutableCopyChecklist) {
      return;
    }
    const newChecklist: NewChecklist = {
      id: Date.now() + '',
      content: newChecklistContent,
      isCompleted: false,
      weekNumber: selectedWeek,
    };

    mutableCopyChecklist[selectedWeek] = [
      newChecklist,
      ...mutableCopyChecklist[selectedWeek],
    ];

    setAllChecklists(mutableCopyChecklist);
    delay(() => {
      onChangeNewChecklistContent('');
      setEditMode('await');
      Keyboard.dismiss();
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutableCopyChecklist, selectedWeek, newChecklistContent]);

  /**
   * @description 체크리스트를 수정하는 함수입니다. 수정된 체크리스트는 allChecklists state에 저장됩니다.
   * @param newChecklist 수정된 체크리스트
   * @paramType NewChecklist
   *
   */
  const updateChecklistChanges = useCallback(
    (newChecklist: NewChecklist) => {
      if (!mutableCopyChecklist) {
        return;
      }

      const weekNumber = newChecklist.weekNumber;
      const index = mutableCopyChecklist[weekNumber].findIndex(
        checklist => checklist.id === newChecklist.id,
      );
      if (index < 0) {
        return;
      }
      mutableCopyChecklist[weekNumber][index] = newChecklist;
      setAllChecklists(mutableCopyChecklist);
    },
    [mutableCopyChecklist],
  );

  /**
   * @description 체크리스트를 삭제하는 함수입니다. 삭제된 체크리스트는 allChecklists state에 저장됩니다.
   * @param checklist 삭제된 체크리스트
   * @paramType NewChecklist
   */
  const deleteChecklist = useCallback(
    (checklist: NewChecklist) => {
      if (!mutableCopyChecklist) {
        return;
      }
      const weekNumber = checklist.weekNumber;

      const filteredChecklists = mutableCopyChecklist[weekNumber].filter(
        item => item.id !== checklist.id,
      );

      mutableCopyChecklist[weekNumber] = filteredChecklists;

      setAllChecklists(mutableCopyChecklist);
      pushUndoStack(checklist);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutableCopyChecklist, allChecklists],
  );

  /**
   * @description 삭제된 체크리스트를 복구하는 함수입니다. 복구된 체크리스트는 allChecklists state에 저장됩니다.
   * @description undoStack의 가장 최근에 저장된 체크리스트를 가져와 복구합니다.
   * @param checklist 복구된 체크리스트
   * @paramType NewChecklist
   */
  const recoveryUndoChecklist = useCallback(() => {
    if (!mutableCopyChecklist) {
      return;
    }
    const weekNumber = selectedWeek;
    const undoChecklist = popUndoStack();
    if (!undoChecklist) {
      return;
    }
    mutableCopyChecklist[weekNumber] = [
      undoChecklist,
      ...mutableCopyChecklist[weekNumber],
    ];
    setAllChecklists(mutableCopyChecklist);
    onChangeMessage('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek, mutableCopyChecklist]);

  /**
   * @description 체크리스트의 content를 수정하는 함수입니다. updateChecklistChanges 함수를 호출합니다.
   * @description editMode state가 변경되면 호출됩니다.
   * @see editMode
   */
  const onSubmitUpdateContent = useCallback(() => {
    if (!editText || !submitValue) {
      return;
    }
    updateChecklistChanges({
      ...submitValue,
      content: editText,
    });
    setEditMode('await');
    Keyboard.dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editText, submitValue]);

  /**
   * @description 체크리스트를 수정할 때 사용하는 Input을 활성화하는 함수입니다.
   * @description editMode state가 'update'일 때 호출됩니다.
   * @param checklist 수정할 체크리스트
   * @paramType NewChecklist
   * @see editMode
   * @see submitValue
   */
  const onFocusUpdateInput = useCallback((checklist: NewChecklist) => {
    setEditMode('update');
    setSubmitValue(checklist);
    onChangeEditText(checklist.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * @description 체크리스트를 생성할 때 사용하는 Input을 활성화하는 함수입니다.
   * @description editMode state가 'create'일 때 호출됩니다.
   * @see editMode
   */
  const onFocusCreateInput = useCallback(() => {
    setEditMode('create');
  }, []);

  /**
   * @description 애니메이션을 위한 PrevSelectedweek state를 변경하는 함수입니다.
   * @description prevSelectedWeek state가 변경되면 체크리스트가 사이드로 사라지는 Slide-Out애니메이션이 실행됩니다.
   * @param week prevSelectedWeek State에 입력될 과거에 선택된 주차
   * @paramType number
   * @see prevSelectedWeek
   */
  const onChangePrevSelectedWeek = useCallback((week: number) => {
    setPrevSelectedWeek(week);
  }, []);

  return {
    allChecklists,
    editMode,
    editText,
    newChecklistContent,
    isEdit,
    submitValue,
    selectedChecklists,
    isDragging,
    prevSelectedWeek,
    createChecklist,
    updateChecklistChanges,
    deleteChecklist,
    recoveryUndoChecklist,
    onSubmitUpdateContent,
    setEditMode,
    onChangeEditText,
    onChangeNewChecklistContent,
    onChangeEdit,
    setSubmitValue,
    onFocusUpdateInput,
    onFocusCreateInput,
    setSelectedChecklist,
    setIsDragging,
    setPrevSelectedWeek,
    onChangePrevSelectedWeek,
  };
};

export default useChecklists;
