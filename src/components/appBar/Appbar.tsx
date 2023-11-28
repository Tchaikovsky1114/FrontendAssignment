import {View, StyleSheet, Platform, StatusBar} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeProvider';
import EditButton from './EditButton';

import BackButton from './BackButton';
import {useNavigation} from '@react-navigation/native';
import NavigationTitle from './NavigationTitle';

interface Props {
  name: string;
}

const getStatusBarHeight = () => {
  if (Platform.OS === 'android') {
    return StatusBar.currentHeight || 0;
  } else if (Platform.OS === 'ios') {
    return StatusBar.currentHeight || 20;
  }
  return 0;
};

const Appbar = ({name}: Props) => {
  const {theme} = useTheme();
  const statusBarHeight = getStatusBarHeight();
  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.backgroundColor,
          height: 60 + statusBarHeight,
        },
      ]}>
      <View style={styles.titleBox}>
        {navigation.canGoBack() ? (
          <>
            <BackButton />
            <NavigationTitle name={name} />
            <EditButton />
          </>
        ) : (
          <NavigationTitle name={name} />
        )}
      </View>
    </View>
  );
};

export default Appbar;

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBox: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
  },
});
