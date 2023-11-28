import {Keyboard,StyleSheet,TextInput,View} from 'react-native';
import React, {useCallback, useRef} from 'react';
import {useTheme} from '../context/ThemeProvider';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import SettingButton from '../components/pages/home/SettingButton';
import BottomUpSlideComponent from '../components/common/BottomUpSlideComponent';
import useInput from '../hooks/useInput';
import {useWeekContext} from '../context/WeekProvider';
import useDelay from '../hooks/useDelay';

interface Props {
  navigation: NativeStackNavigationProp<any, any>;
}

const HomeScreen = ({navigation}: Props) => {
  const inputRef = useRef<TextInput | null>(null);
  const {theme, toggleTheme} = useTheme();
  const {value: week, onChange} = useInput(15);
  const {selectWeek} = useWeekContext();
  const {delay} = useDelay();

  const navigateToChecklists = useCallback(() => {
    navigation.navigate('Checklists');
  },[]);

  const onToggleTheme =  useCallback(() => {
    toggleTheme();
  },[]);

  const onClickFocusInput = useCallback(() => {
    inputRef.current?.focus();
  },[]);

  const onSubmitSelectedWeek = useCallback(() => {
    if(!week) return;
    selectWeek(week);
    delay(() => {
      Keyboard.dismiss();
    },1000)
    
  },[week]);

  const onChangeWeek = useCallback((weekCount: string) => {
    if ( +weekCount > 40) return;
    
    onChange(weekCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <View
        style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <SettingButton
          onPress={onClickFocusInput}
          buttonText="시작 주 변경하기"
        />
        <SettingButton
          onPress={navigateToChecklists}
          buttonText="체크리스트로 이동"
        />
        <SettingButton onPress={onToggleTheme} buttonText="다크모드 변경" />
        <BottomUpSlideComponent onSubmit={onSubmitSelectedWeek}>
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                {borderColor: theme.lightGrey, fontSize: theme.textXS},
              ]}
              value={week + ''}
              placeholder='체크리스트를 입력해주세요'
              onChangeText={onChangeWeek}
              selectionColor={theme.accent}
              keyboardType='numeric'
            />
      </BottomUpSlideComponent>
      </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 24,
  },
  textBold: {
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    height: 42,
    paddingLeft: 8,
    paddingRight: 42,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    borderWidth: 1,
  },
});
