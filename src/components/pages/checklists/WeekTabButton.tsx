import {Text, StyleSheet, Pressable} from 'react-native';
import React, {memo} from 'react';
import {useTheme} from '../../../context/ThemeProvider';
import {useWeekContext} from '../../../context/WeekProvider';
import {itemWidth} from '../../../screens/ChecklistsScreen';

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
          width: itemWidth,
          height: itemWidth * 1.24,
          borderRadius: itemWidth * 0.5,
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
    alignItems: 'center',
    justifyContent: 'center',

    paddingTop: 4,
  },
});
