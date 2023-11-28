import {StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import ChecklistsIcon from '../../../assets/icons/ChecklistsIcon.svg';
import {useTheme} from '../../../context/ThemeProvider';

function EmptyChecklistComponent() {
  const {theme} = useTheme();
  return (
    <View style={styles.container}>
      <ChecklistsIcon fill={theme.accent} />
      <Text
        style={[
          styles.textBold,
          {fontSize: theme.textXL, color: theme.deepGrey},
        ]}>
        No checklists
      </Text>
      <Text style={{fontSize: theme.textBase, color: theme.deepGrey}}>
        Add checklists that should be checked weekly.
      </Text>
    </View>
  );
}

export default memo(EmptyChecklistComponent);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  textBold: {
    fontWeight: 'bold',
  },
});
