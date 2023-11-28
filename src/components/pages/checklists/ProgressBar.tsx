import {View, Text, StyleSheet} from 'react-native';
import React, {memo, useEffect} from 'react';
import {useTheme} from '../../../context/ThemeProvider';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  completedCount: number;
  inCompletedCount: number;
}

const ProgressBar = ({completedCount, inCompletedCount}: Props) => {
  const {theme} = useTheme();
  const progressBarWidth = useSharedValue(0);
  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progressBarWidth.value}%`,
      height: 6,
      backgroundColor: '#44CEC6',
    };
  });

  useEffect(() => {
    progressBarWidth.value = withTiming(
      Math.round((completedCount / inCompletedCount) * 100),
      {duration: 300},
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedCount]);

  return (
    <View style={styles.progressWrapper}>
      <View style={styles.progressTitleBox}>
        <Text style={[{fontSize: theme.textBase}, styles.textBold]}>
          {completedCount} of {inCompletedCount} completed
        </Text>
        <Text style={[{color: theme.accent}, styles.textBold]}>
          {Math.round((completedCount / inCompletedCount) * 100)}%
        </Text>
      </View>
      <View style={[{backgroundColor: theme.dirtyWhite}, styles.progressBar]}>
        <Animated.View
          style={[progressBarStyle, {backgroundColor: theme.accent}]}
        />
      </View>
    </View>
  );
};

export default memo(ProgressBar);

const styles = StyleSheet.create({
  progressWrapper: {
    height: 45,
    marginBottom: 24,
  },
  progressTitleBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textBold: {
    fontWeight: 'bold',
  },
  progressBar: {
    width: '100%',
    height: 6,
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
});
