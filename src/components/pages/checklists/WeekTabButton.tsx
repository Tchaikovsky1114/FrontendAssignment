import {Text, StyleSheet, Pressable} from 'react-native';
import React, {memo} from 'react';
import {useTheme} from '../../../context/ThemeProvider';
import {useWeekContext} from '../../../context/WeekProvider';

interface Props {
  item: number;
  onPress: (tabIndex: number) => void;
}

const WeekTabButton = ({item, onPress}: Props) => {
  const {theme} = useTheme();
  const {selectedWeek} = useWeekContext();

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={[
        styles.weekCard,
        {
          backgroundColor:
            selectedWeek === item ? theme.accent : theme.dirtyWhite,
        },
      ]}>
      <Text
        style={[
          {
            color: selectedWeek === item ? theme.white : theme.grey,
            fontSize: theme.textXS,
          },
        ]}>
        week
      </Text>
      <Text
        style={[
          {
            color: selectedWeek === item ? theme.white : theme.grey,
            fontSize: theme.textL,
          },
          styles.bold,
        ]}>
        {item}
      </Text>
    </Pressable>
  );
};

export default memo(WeekTabButton);

const styles = StyleSheet.create({
  bold: {
    fontWeight: '700',
  },
  weekCard: {
    width: 50,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    paddingTop: 4,
  },
});
