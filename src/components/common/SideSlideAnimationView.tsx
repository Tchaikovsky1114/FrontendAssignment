import React, { PropsWithChildren, useEffect } from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated'
import useDelay from '../../hooks/useDelay';
import { useTheme } from '../../context/ThemeProvider';

interface Props {
  selectedWeek: number;
  prevSelectedWeek: number;
  onChangePrevSelectedWeek: (week: number) => void;
  isDragging: boolean;
}

const SideSlideAnimationView = ({children,selectedWeek, isDragging, prevSelectedWeek, onChangePrevSelectedWeek}:PropsWithChildren<Props>) => {
  const {theme} = useTheme();
  const { delay } = useDelay();
  const { width: screenWidth } = useWindowDimensions();
  const slideOutAnimation = useSharedValue(0);
  const slideInAnimation = useSharedValue(0);

  const slideInAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideInAnimation.value }],
    }
  })
  
  const slideOutAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideOutAnimation.value }],
    }
  })

  useEffect(() => {
    
    if(isDragging) return;

    // 바뀌기 전 상태로 SlideOut 애니메이션 
    delay(() => {
      slideOutAnimation.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(selectedWeek > prevSelectedWeek ? -screenWidth : screenWidth, { duration: 300 })
      );
    },200)

    // 바깥에서 상태변경
    onChangePrevSelectedWeek(selectedWeek);

    // 바뀐 상태로 카드가 안으로 들어옴
    delay(() => {
      // onChangePrevSelectedWeek(selectedWeek);
      slideInAnimation.value = withSequence(
        withTiming(selectedWeek > prevSelectedWeek ? screenWidth : -screenWidth, { duration: 0 }),
        withTiming(0, { duration: 300 })
      );
    },400)
    
  }, [isDragging, selectedWeek, prevSelectedWeek]);

  return (
    <Animated.View style={[
      slideOutAnimationStyle,
      slideInAnimationStyle,
      styles.container,
      {
        width:screenWidth,
        backgroundColor:theme.backgroundColor,
      }]}>
      {children}
    </Animated.View>
  )
}

export default SideSlideAnimationView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
})