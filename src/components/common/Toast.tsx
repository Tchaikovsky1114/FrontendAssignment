import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

import {ToastType} from '../../types/toast';
import {useTheme} from '../../context/ThemeProvider';
import Reroll from '../../assets/icons/Reroll.svg';

import useToastAnimation from '../../hooks/useToastAnimation';
import Animated from 'react-native-reanimated';

interface Props {
  message: string;
  messageKey: string;
  type: ToastType;
  undoCallback: () => void;
}

const Toast = ({message, messageKey, type, undoCallback}: Props) => {
  const {theme} = useTheme();

  const {toastAnimationStyle} = useToastAnimation();

  return (
    <Animated.View
      key={messageKey}
      style={[styles.container, toastAnimationStyle]}>
      <Text style={{color: theme.white}}>{message}</Text>
      {type === ToastType.UNDO && (
        <TouchableOpacity style={styles.undoButton} onPress={undoCallback}>
          <Reroll width={18} height={18} />
          <Text style={[{color: theme.accent}, styles.textBold]}>Undo</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};
export default Toast;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 46,
    margin: 8,
    padding: 16,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    borderRadius: 12,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    opacity: 0.8,
    zIndex: 9999,
    backgroundColor: '#000000',
  },
  undoButton: {
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  },
});
