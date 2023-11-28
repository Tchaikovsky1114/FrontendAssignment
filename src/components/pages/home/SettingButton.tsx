import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {useTheme} from '../../../context/ThemeProvider';

interface Props {
  onPress: () => void;
  buttonText: string;
}

const SettingButton = ({onPress, buttonText}: Props) => {
  const {theme} = useTheme();
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[{color: theme.accent}, styles.textBold]}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default memo(SettingButton);

const styles = StyleSheet.create({
  textBold: {
    fontWeight: 'bold',
  },
});
