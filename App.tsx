import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from './src/context/ThemeProvider';
import Root from './src/routes/Root';
import {WeekProvider} from './src/context/WeekProvider';
import {ToastProvider} from './src/context/ToastProvider';
import {EditProvider} from './src/context/EditProvider';

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <WeekProvider>
        <ToastProvider>
          <EditProvider>
            <NavigationContainer>
              <Root />
            </NavigationContainer>
          </EditProvider>
        </ToastProvider>
      </WeekProvider>
    </ThemeProvider>
  );
}

export default App;
