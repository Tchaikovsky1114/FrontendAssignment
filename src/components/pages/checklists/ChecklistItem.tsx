import React, { useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import IconButton from '../../common/IconButton'
import { NewChecklist } from '../../../types/checklist';
import { useToastContext } from '../../../context/ToastProvider';
import { useEditContext } from '../../../context/EditProvider';
import { ToastType } from '../../../types/toast';
import { useTheme } from '../../../context/ThemeProvider';
import Checked from '../../../assets/icons/Checked.svg';
import UnChecked from '../../../assets/icons/Unchecked.svg';
import MinusIcon from '../../../assets/icons/Minus.svg';

interface Props {
  checklist: NewChecklist;
  onChangeCompleted: (checklist: NewChecklist) => void
  onFocusInput: (checklist: NewChecklist) => void
  deleteChecklist: (checklist: NewChecklist) => void
}

const ChecklisItem = ({ checklist,deleteChecklist,onFocusInput,onChangeCompleted }: Props) => {
  const { isEdit } = useEditContext();
  const {theme} = useTheme();
  const { onChangeMessage, onChangeType } = useToastContext();

  const onPressDeleteButton = useCallback(() => {
    deleteChecklist(checklist)
    onChangeMessage('Checklist deleted')
    onChangeType(ToastType.UNDO)
  },[checklist]); 
  return (
    <TouchableOpacity
          key={checklist.id}
          style={[ styles.checklistCard, {flexDirection: isEdit ? 'row-reverse' : 'row'} ]}
          onPress={() => onFocusInput(checklist)}
          >
          {
            isEdit
            ? <IconButton
                withFeedback={false}
                Icon={<MinusIcon/>}
                onPress={onPressDeleteButton}
              />
            : checklist.isCompleted
              ? <IconButton
                  Icon={<Checked/>}
                  onPress={() => onChangeCompleted(checklist)}
                />
              : <IconButton
                  Icon={<UnChecked/>}
                  onPress={() => onChangeCompleted(checklist)}
                />
          }
      <View style={styles.checklistTextBox}>
        <Text
          numberOfLines={2}
          style={{
            color: checklist.isCompleted ? '#C4C4C4' : theme.dark,
            textDecorationLine: checklist.isCompleted ? 'line-through' : 'none',
          }}
          >
          {checklist.content}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default ChecklisItem

const styles = StyleSheet.create({
  checklistCard: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    
    marginBottom: 4,
  },
  checklistTextBox: {
    flex: 1,
    marginLeft: 12,
  },
  
});