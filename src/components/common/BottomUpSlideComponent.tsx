import React, {PropsWithChildren, useEffect, useState} from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import Upload from '../../assets/icons/Upload.svg';
import useKeyboardHeight from '../../hooks/useKeyboardHeight';
import Animated from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeProvider';

interface Props {
  onSubmit: () => void;
}
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const BottomUpSlideComponent = ({onSubmit,children}:PropsWithChildren<Props>) => {
  const {width} = useWindowDimensions();
  const {theme} = useTheme();
  const {keyboardHeight, animatedStyle} = useKeyboardHeight({
    additionalHeight: 64,
  });
  const [fakeLoading, setFakeLoading] = useState(false);

  useEffect(() => {
    if(!fakeLoading) return;

    const flag = setTimeout(() => {
      setFakeLoading(false)
    },1000)
    return () => clearTimeout(flag)
  },[fakeLoading])

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        /* eslint-disable react-native/no-inline-styles */
        {width, bottom: keyboardHeight ? 0 : -100},
      ]}
      >
        {children}
      <AnimatedTouchable
        onPress={() => {
          onSubmit();
          setFakeLoading(true);
        }}
        style={styles.submitButton}>
          {
            fakeLoading
            ? <ActivityIndicator color={theme.grey} size="small" />
            : <Upload width={32} height={32} fill={theme.accent} />
          }
      </AnimatedTouchable>
    </Animated.View>
    
  );
}

export default BottomUpSlideComponent;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingVertical: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  submitButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 42,
    borderRadius: 12,
    right: 20,
    top: 12
  },
});
