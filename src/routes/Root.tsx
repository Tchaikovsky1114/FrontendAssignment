import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from '../context/ThemeProvider';
import HomeScreen from '../screens/HomeScreen';
import ChecklistsScreen from '../screens/ChecklistsScreen';
import {StatusBar} from 'react-native';

import Appbar from '../components/appBar/Appbar';

const Stack = createNativeStackNavigator();

const Root = () => {
  const {theme} = useTheme();

  return (
    <>
      <StatusBar
        barStyle={
          theme.backgroundColor === '#ffffff' ? 'dark-content' : 'light-content'
        }
      />
      <Stack.Navigator
        screenOptions={{
          header: props => Appbar({name: props.route.name}),
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
          }}
        />
        <Stack.Screen
          name="Checklists"
          component={ChecklistsScreen}
          options={{
            title: 'Checklists',
          }}
        />
      </Stack.Navigator>
    </>
  );
};

export default Root;
