import {
  StyleSheet,
  FlatList,
  // useWindowDimensions,
  Keyboard,
  TextInput,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import {useTheme} from '../context/ThemeProvider';
import {useWeekContext} from '../context/WeekProvider';
import Checklist from '../components/pages/checklists/Checklist';
import BottomUpSlideComponent from '../components/common/BottomUpSlideComponent';
import useDelay from '../hooks/useDelay';
import Toast from '../components/common/Toast';
import SideSlideAnimationView from '../components/common/SideSlideAnimationView';
import useChecklists from '../hooks/useChecklists';
import WeekTabs from '../components/pages/checklists/WeekTabs';
import FloatingAddChecklistButton from '../components/pages/checklists/FloatingAddChecklistButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ToastType} from '../types/toast';
import {useToastContext} from '../context/ToastProvider';

const {width: screenWidth} = Dimensions.get('window');

export const itemWidth = screenWidth / 7; // item width
export const itemSpacing = 8; // gap
export const flatlistPadding = itemWidth * 3; // flatlist padding

const ChecklistsScreen = () => {
  const weekTabsRef = useRef<FlatList>(null);
  const createChecklistRef = useRef<TextInput | null>(null);
  const updateChecklistInputRef = useRef<TextInput | null>(null);
  const {selectedWeek} = useWeekContext();
  const {toastQueue} = useToastContext();
  const {theme} = useTheme();
  const {delay} = useDelay();

  const {
    allChecklists,
    editMode,
    editText,
    newChecklistContent,
    isDragging,
    prevSelectedWeek,
    selectedChecklists,
    createChecklist,
    updateChecklistChanges,
    deleteChecklist,
    recoveryUndoChecklist,
    onSubmitUpdateContent,
    setEditMode,
    onChangeEditText,
    onChangeNewChecklistContent,
    onFocusUpdateInput,
    onFocusCreateInput,
    onChangePrevSelectedWeek,
    setSelectedChecklist,
    setIsDragging,
  } = useChecklists();

  const tabsToCenter = useCallback((tabIndex: number) => {
    weekTabsRef.current?.scrollToOffset({
      offset:
        (itemWidth + itemSpacing) * (tabIndex - 1) -
        screenWidth / 2 +
        itemWidth / 2 +
        flatlistPadding,
      animated: true,
    });
  }, []);

  console.log('ChecklistsScreen: toastQueue', toastQueue);
  useEffect(() => {
    tabsToCenter(selectedWeek);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const keyboardDismissListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setEditMode('await'),
    );
    return () => keyboardDismissListener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editMode === 'create') {
      createChecklistRef.current?.focus();
    } else if (editMode === 'update') {
      updateChecklistInputRef.current?.focus();
    }
  }, [editMode]);

  useEffect(() => {
    if (!allChecklists || isDragging) {
      return;
    }
    delay(() => setSelectedChecklist(allChecklists[selectedWeek]), 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allChecklists, selectedWeek, isDragging]);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      {/* Tabs Buttons */}
      <WeekTabs
        ref={weekTabsRef}
        tabsToCenter={tabsToCenter}
        setIsDragging={setIsDragging}
      />

      {/* Checklist with animation */}

      <SideSlideAnimationView
        isDragging={isDragging}
        selectedWeek={selectedWeek}
        prevSelectedWeek={prevSelectedWeek}
        onChangePrevSelectedWeek={onChangePrevSelectedWeek}>
        <Checklist
          checklists={selectedChecklists}
          updateChecklistChanges={updateChecklistChanges}
          onFocusInput={onFocusUpdateInput}
          deleteChecklist={deleteChecklist}
        />
      </SideSlideAnimationView>

      {/* Toast */}
      {toastQueue.map(message => (
        <Toast
          key={message.messageKey}
          messageKey={message.messageKey}
          message={message.message}
          type={message.type as ToastType}
          undoCallback={recoveryUndoChecklist}
        />
      ))}

      {/* Floating Add Checklist Button */}
      <FloatingAddChecklistButton onFocusCreateInput={onFocusCreateInput} />

      {/* Update & Create Checklist Bottom Up Input */}
      {editMode === 'create' && (
        <BottomUpSlideComponent onSubmit={createChecklist}>
          <TextInput
            ref={createChecklistRef}
            style={[
              styles.input,
              {borderColor: theme.lightGrey, fontSize: theme.textXS},
            ]}
            value={newChecklistContent + ''}
            placeholder="체크리스트를 입력해주세요"
            onChangeText={onChangeNewChecklistContent}
            selectionColor={theme.accent}
            keyboardType="default"
          />
        </BottomUpSlideComponent>
      )}
      {editMode === 'update' && (
        <BottomUpSlideComponent onSubmit={onSubmitUpdateContent}>
          <TextInput
            ref={updateChecklistInputRef}
            style={[
              styles.input,
              {borderColor: theme.lightGrey, fontSize: theme.textXS},
            ]}
            value={editText + ''}
            placeholder="수정할 내용을 입력해주세요"
            onChangeText={onChangeEditText}
            selectionColor={theme.accent}
            keyboardType="default"
          />
        </BottomUpSlideComponent>
      )}
    </SafeAreaView>
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
