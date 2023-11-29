import React, {memo, useCallback} from 'react';
import {StyleSheet, useWindowDimensions, FlatList} from 'react-native';
import {NewChecklist} from '../../../types/checklist';
import EmptyChecklistComponent from './EmptyChecklistComponent';
import ProgressBar from './ProgressBar';
import ChecklistItem from './ChecklistItem';

interface Props {
  checklists: NewChecklist[];
  updateChecklistChanges: (newChecklist: NewChecklist) => void;
  onFocusInput: (checklist: NewChecklist) => void;
  deleteChecklist: (checklist: NewChecklist) => void;
}

const Checklist = ({
  checklists,
  updateChecklistChanges,
  deleteChecklist,
  onFocusInput,
}: Props) => {
  const {width} = useWindowDimensions();
  const completedChecklistCount = checklists?.filter(
    checklist => checklist.isCompleted,
  ).length;

  const onChangeCompleted = (checklist: NewChecklist) => {
    updateChecklistChanges({
      ...checklist,
      isCompleted: !checklist.isCompleted,
    });
  };

  const ProgressBarComponent = useCallback(
    ({
      completedCount,
      inCompletedCount,
    }: {
      completedCount: number;
      inCompletedCount: number;
    }) => {
      return (
        <ProgressBar
          completedCount={completedCount}
          inCompletedCount={inCompletedCount}
        />
      );
    },
    [],
  );

  const listHeader =
    checklists?.length > 0 ? (
      <ProgressBarComponent
        completedCount={completedChecklistCount}
        inCompletedCount={checklists.length}
      />
    ) : null;

  return (
    <FlatList
      style={[styles.container, {width}]}
      data={checklists}
      keyExtractor={item => item.id}
      ListEmptyComponent={EmptyChecklistComponent}
      ListHeaderComponent={listHeader}
      showsVerticalScrollIndicator={false}
      renderItem={({item: checklist}) => (
        <ChecklistItem
          checklist={checklist}
          onFocusInput={onFocusInput}
          deleteChecklist={deleteChecklist}
          onChangeCompleted={onChangeCompleted}
        />
      )}
    />
  );
};

export default memo(Checklist);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
});
