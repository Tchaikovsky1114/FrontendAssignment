import {useEffect} from 'react';
import {useWindowDimensions} from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useToastContext} from '../context/ToastProvider';
import useDelay from './useDelay';

const useToastAnimation = () => {
  const {height: screenHeight} = useWindowDimensions();
  const positionY = useSharedValue(screenHeight);
  const {toastQueue, removeToastQueue} = useToastContext();
  const {delay} = useDelay();
  const toastAnimationStyle = useAnimatedStyle(() => {
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
    if (toastQueue && toastQueue.length > 0) {
      positionY.value = withSpring(-screenHeight * 0.05, {
        stiffness: 50,
      });
      delay(() => {
        removeToastQueue();
      }, 3000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastQueue]);

  return {toastAnimationStyle};
};

export default useToastAnimation;
