import {Keyboard} from 'react-native';
import {useEffect, useState} from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  additionalHeight: number;
}

const useKeyboardHeight = ({additionalHeight}: Props) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const height = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  useEffect(() => {
    height.value = withTiming(keyboardHeight + additionalHeight, {
      duration: 500,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardHeight]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      e => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardHeight(0);
      },
    );
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);
  return {
    keyboardHeight,
    height: height.value,
    animatedStyle,
  };
};

export default useKeyboardHeight;
