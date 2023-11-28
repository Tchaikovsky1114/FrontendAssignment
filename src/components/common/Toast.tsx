import {
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {ToastType} from '../../types/toast';
import {useTheme} from '../../context/ThemeProvider';
import Reroll from '../../assets/icons/Reroll.svg';
import useDelay from '../../hooks/useDelay';
import {useToastContext} from '../../context/ToastProvider';

interface Props {
  message?: string;
  type?: ToastType;
  undoCallback: () => void;
}

const Toast = ({message, type, undoCallback}: Props) => {
  const {height: screenHeight} = useWindowDimensions();
  const {theme} = useTheme();
  const {delay} = useDelay();
  const positionY = useSharedValue(screenHeight);
  const {onChangeMessage} = useToastContext();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(positionY.value, {
            stiffness: 50,
          }),
        },
      ],
    };
  });

  useEffect(() => {
    if (message) {
      positionY.value = 0;

      delay(() => {
        onChangeMessage('');
        positionY.value = screenHeight;
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
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
