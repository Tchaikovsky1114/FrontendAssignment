import {TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import React from 'react';
import {SvgProps} from 'react-native-svg';

interface Props {
  Icon: React.ReactElement<SvgProps>;
  onPress: () => void;
  withFeedback?: boolean;
}

const IconButton = ({Icon, onPress, withFeedback}: Props) => {
  if (withFeedback) {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        {Icon}
      </TouchableWithoutFeedback>
    );
  } else {
    return <TouchableOpacity onPress={onPress}>{Icon}</TouchableOpacity>;
  }
};

export default IconButton;
