import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeProvider';
import {useEditContext} from '../../context/EditProvider';

const EditButton = () => {
  const {theme} = useTheme();
  const {isEdit, onChangeEdit} = useEditContext();

  return (
    <TouchableOpacity
      onPress={() => onChangeEdit(!isEdit)}
      style={styles.editButton}>
      <Text style={{color: theme.grey, fontSize: theme.textBase}}>
        {isEdit ? 'Done' : 'Edit'}
      </Text>
    </TouchableOpacity>
  );
};

export default EditButton;

const styles = StyleSheet.create({
  editButton: {
    position: 'absolute',
    right: 0,
    marginRight: 16,
  },
});
