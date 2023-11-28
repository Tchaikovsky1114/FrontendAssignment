import {View, StyleSheet, FlatList, useWindowDimensions, Keyboard, TextInput} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import {useTheme} from '../context/ThemeProvider';
import {useWeekContext} from '../context/WeekProvider';
import Checklist from '../components/pages/checklists/Checklist';
import BottomUpSlideComponent from '../components/common/BottomUpSlideComponent';
import useDelay from '../hooks/useDelay';
import Toast from '../components/common/Toast';
import { useToastContext } from '../context/ToastProvider';
import SideSlideAnimationView from '../components/common/SideSlideAnimationView';
import useChecklists from '../hooks/useChecklists';
import WeekTabs from '../components/pages/checklists/WeekTabs';
import FloatingAddChecklistButton from '../components/pages/checklists/FloatingAddChecklistButton';

export const itemWidth = 50; // item width
export const itemSpacing = 8; // gap
export const flatlistPadding = 150; // flatlist padding

const ChecklistsScreen = () => {
  const weekTabsRef = useRef<FlatList>(null);
  const createChecklistRef = useRef<TextInput | null>(null);
  const updateChecklistInputRef = useRef<TextInput | null>(null);
  const { selectedWeek } = useWeekContext();
  const { message, type } = useToastContext();
  const { theme } = useTheme();
  const { delay } = useDelay();
  const { width: screenWidth } = useWindowDimensions();
  const { allChecklists, editMode, editText, newChecklistContent, isDragging,prevSelectedWeek,selectedChecklists,
          createChecklist, updateChecklistChanges, deleteChecklist, recoveryUndoChecklist, onSubmitUpdateContent,
          setEditMode,  onChangeEditText,  onChangeNewChecklistContent, onFocusUpdateInput, onFocusCreateInput,
          onChangePrevSelectedWeek, setSelectedChecklist,setIsDragging } = useChecklists();

  const tabsToCenter = useCallback(
    (tabIndex: number) => {
      weekTabsRef.current?.scrollToOffset({
        offset:
          (itemWidth + itemSpacing) * (tabIndex - 1)
          - screenWidth / 2
          + itemWidth / 2
          + flatlistPadding,
        animated: true,
      });
    },[screenWidth]);

  useEffect(() => {
    tabsToCenter(selectedWeek);
  }, []);

  useEffect(() => {
    const keyboardDismissListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setEditMode('await'))
    return () => keyboardDismissListener.remove();  
  },[])

  useEffect(() => {
    if(editMode === 'create') createChecklistRef.current?.focus();
    else if(editMode === 'update') updateChecklistInputRef.current?.focus();
  },[editMode])

  useEffect(() => {
    if(!allChecklists || isDragging) return;
    delay(() => setSelectedChecklist(allChecklists[selectedWeek]),500)
  },[allChecklists,selectedWeek,isDragging])

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>

      {/* Tabs Buttons */}
      <WeekTabs ref={weekTabsRef} tabsToCenter={tabsToCenter} setIsDragging={setIsDragging} />

      {/* Checklist with animation */}

      <SideSlideAnimationView
        isDragging={isDragging}
        selectedWeek={selectedWeek}
        prevSelectedWeek={prevSelectedWeek}
        onChangePrevSelectedWeek={onChangePrevSelectedWeek}
      >
      <Checklist
        checklists={selectedChecklists}
        updateChecklistChanges={updateChecklistChanges}
        onFocusInput={ onFocusUpdateInput}
        deleteChecklist={deleteChecklist}
      />

      </SideSlideAnimationView>

      {/* Delete Checklist Toast */}
      {message && <Toast message={message} type={type} undoCallback={recoveryUndoChecklist} />}  

      {/* Floating Add Checklist Button */}
      <FloatingAddChecklistButton onFocusCreateInput={onFocusCreateInput}/>

      {/* Update & Create Checklist Bottom Up Input */}
      {
        editMode === 'create' &&
        <BottomUpSlideComponent onSubmit={createChecklist}>
          <TextInput
            ref={createChecklistRef}
            style={[ styles.input, {borderColor: theme.lightGrey, fontSize: theme.textXS}]}
            value={newChecklistContent + ''}
            placeholder='체크리스트를 입력해주세요'
            onChangeText={onChangeNewChecklistContent}
            selectionColor={theme.accent}
            keyboardType='default'
          />
        </BottomUpSlideComponent>
      }
      {
        editMode === 'update' &&
        <BottomUpSlideComponent onSubmit={onSubmitUpdateContent}>
          <TextInput
            ref={updateChecklistInputRef}
            style={[styles.input,{borderColor: theme.lightGrey, fontSize: theme.textXS}]}
            value={editText + ''}
            placeholder='수정할 내용을 입력해주세요'
            onChangeText={onChangeEditText}
            selectionColor={theme.accent}
            keyboardType='default'

          />
       </BottomUpSlideComponent>
      }
    </View>
  );
};

export default ChecklistsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: '90%',
    height: 42,
    paddingLeft: 8,
    paddingRight: 42,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAE9ED',
  },
});
