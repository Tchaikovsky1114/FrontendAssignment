import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { useTheme } from '../../context/ThemeProvider';


interface Props {
  name: string;
}

function NavigationTItle({name}: Props) {
  const {theme} = useTheme();
  return (
    <Text
    style={[
      styles.bold,
      {color: theme.textColor, fontSize: theme.textBase},
    ]}>
    {name}
  </Text>
  )
}

export default NavigationTItle


const styles = StyleSheet.create({
  titleBox: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
  },
  bold: {
    fontWeight: '700',
  },
})