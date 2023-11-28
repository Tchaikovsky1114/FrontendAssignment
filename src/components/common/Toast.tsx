import { Text, StyleSheet, Pressable, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { ToastType } from '../../types/toast'
import { useTheme } from '../../context/ThemeProvider';
import Reroll from '../../assets/icons/Reroll.svg';

interface Props {
  message?: string;
  type?: ToastType;
  undoCallback: () => void;
}

const Toast = ({ message, type, undoCallback }: Props) => {
  const {height: screenHeight} = useWindowDimensions();
  const positionY = useSharedValue( screenHeight);
  const {theme} = useTheme();


  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(positionY.value,{
        stiffness: 50,
      })}],
    };
  });

  useEffect(() => {
    let flag:NodeJS.Timeout;

    if (message) {
      positionY.value = 0;
      flag = setTimeout(() => {
        positionY.value = screenHeight;
      }, 5000);
    }
    return () => clearTimeout(flag);
  }, [message]);
  
  
  return (
    <Animated.View
      style={[ styles.container, animatedStyle, ]}
    >
      <Text style={{color:'#ffffff'}}>{message}</Text>
      {
        type === ToastType.UNDO && (
          <TouchableOpacity
            style={styles.undoButton}
            onPress={undoCallback}
          >
            <Reroll width={18} height={18} />
            <Text style={{color:theme.accent,fontWeight:'bold'}}>Undo</Text>
          </TouchableOpacity>
        )
      }
    </Animated.View>
  );
};
export default Toast;


const styles = StyleSheet.create({
  
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 46,
    borderRadius: 12,
    margin: 8,
    padding: 16,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    opacity: 0.8,
    position: 'absolute',
    right: 0,
    left: 0,
    zIndex: 9999,
    bottom: 0,
    backgroundColor: '#000000',
  },
  undoButton: {
    flexDirection:'row',
    height:44,
    justifyContent:'center',
    alignItems:'center',
  }
});