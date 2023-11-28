import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../context/ThemeProvider';

interface Props {
  name: string;
}

function NavigationTItle({name}: Props) {
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.bold,
          {color: theme.textColor, fontSize: theme.textBase},
        ]}>
        {name}
      </Text>
    </View>
  );
}

export default NavigationTItle;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
});
