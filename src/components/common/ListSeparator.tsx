import {View} from 'react-native';
import React, {memo} from 'react';

interface Props {
  width: number;
}

const ListSeparator = ({width}: Props) => {
  return <View style={{width}} />;
};

export default memo(ListSeparator);
