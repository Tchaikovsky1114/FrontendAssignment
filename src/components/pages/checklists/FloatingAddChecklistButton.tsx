import React, {memo} from 'react';
import PlusIcon from '../../../assets/icons/Plus.svg';
import {StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';

interface Props {
  onFocusCreateInput: () => void;
}

const FloatingAddChecklistButton = ({onFocusCreateInput}: Props) => {
  const {height: screenHeight} = useWindowDimensions();
  return (
    <TouchableOpacity
      style={[
        styles.floatingButton,
        {
          bottom: screenHeight * 0.05,
        },
      ]}
      onPress={onFocusCreateInput}>
      <PlusIcon width={52} height={52} />
    </TouchableOpacity>
  );
};

export default memo(FloatingAddChecklistButton);

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',

    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#44CEC6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
