import {View, StyleSheet, Platform, StatusBar, Dimensions} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeProvider';
import EditButton from './EditButton';

import BackButton from './BackButton';
import {useNavigation} from '@react-navigation/native';
import NavigationTitle from './NavigationTitle';

interface Props {
  name: string;
}

const {height: screenHeight} = Dimensions.get('window');

const getStatusBarHeight = () => {
  if (Platform.OS === 'android') {
    return StatusBar.currentHeight || 0;
  } else if (Platform.OS === 'ios') {
    return screenHeight < 800 ? 0 : 20;
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
          paddingTop: 60 + statusBarHeight,
          paddingBottom: screenHeight < 800 ? 20 : 0,
        },
      ]}>
      <View style={[styles.wrapper]}>
        {navigation.canGoBack() ? (
          <View style={styles.inner}>
            <BackButton />
            <NavigationTitle name={name} />
            <EditButton />
          </View>
        ) : (
          <View style={styles.inner}>
            <NavigationTitle name={name} />
          </View>
        )}
      </View>
    </View>
  );
};

export default Appbar;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
