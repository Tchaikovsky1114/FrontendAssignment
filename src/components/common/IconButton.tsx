import {TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {SvgProps} from 'react-native-svg';

interface Props {
  Icon: React.ReactElement<SvgProps>;
  onPress: () => void;
  withFeedback?: boolean;
}

const IconButton = ({Icon, withFeedback, onPress}: Props) => {
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

export default memo(IconButton);
