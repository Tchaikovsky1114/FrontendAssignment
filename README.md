# Frontend Assignment - 김명성

## Source Folder Structure
- src
  - assets: 아이콘 및 정적 파일 저장소
    - icons: svg 저장소
  - components: 재사용 컴포넌트 및 스크린에서 사용하는 컴포넌트
    - common: 앱 전역에서 사용하는 공통 컴포넌트
    - pages: 스크린에서 사용하는 컴포넌트 모음
  - context: 전역 상태 관리
  - hooks: 커스텀 훅 및 뷰에서 사용한느 로직 저장소
  - routes: 라우터 구획 
  - screens: 앱 스크린
  - styles: 앱 스타일링 및 테마 
  - types : 타입 정의 
  - util : 유틸리티 함수 및 공통 로직

# Issue & Solve

## A. Animation

1. Bottom Up Slide Animation
`KeyboardAvoidingView`를 사용하면 `keyboardVerticalOffset`의 값을 하드코딩으로 넣어 맞춰야 해서 다양한 기기에서 정확한 값을 구현하기 어려웠습니다.<br/>
RN이 기본 제공하는 Keyboard를 사용하여 높이를 구해 연산을 하면 키보드에 맞추어 인풋을 올려보낼 수 있었으나 애니메이션이 부자연스러웠습니다.<br/>

그 당시 코드는 아래와 같습니다.<br/>
```tsx

const BottomUpSlideComponent = () => {
  const {width} = useWindowDimensions();
  const {theme} = useTheme();
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.container,
        {height: keyboardHeight + 12 + 40},
        {backgroundColor: theme.backgroundColor, width: width},
      ]}>
      {/* keyboardHeight + paddingTopHeight + inputHeight */}

      <TextInput style={styles.input} />
    </KeyboardAvoidingView>
  );
};

export default BottomUpSlideComponent;
```

시연영상을 자세히 보니 height값을 통해 에니메이션을 주고 있는 것 같았습니다. <br/>
기존 로직을 변경하고 react-native-reanimated를 사용하였고, <br/>
쓰이는 곳이 많을 것 같아 커스텀 훅으로 구현하였습니다. <br/>

**useKeybardHeight**
```tsx
import {Keyboard} from 'react-native';
import {useEffect, useState} from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  additionalHeight: number;
}

const useKeyboardHeight = ({additionalHeight}: Props) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const height = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  useEffect(() => {
    height.value = withTiming(keyboardHeight + additionalHeight, {
      duration: 100,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardHeight]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);
  return {
    keyboardHeight,
    height: height.value,
    animatedStyle,
  };
};

export default useKeyboardHeight;
```

**BottomUpSlideComponent**

```tsx
import React, {forwardRef} from 'react';
import {StyleSheet, TextInput} from 'react-native';

import useKeyboardHeight from '../../hooks/useKeyboardHeight';
import Animated from 'react-native-reanimated';

const BottomUpSlideComponent = forwardRef<TextInput, {}>((_, ref) => {
  const {animatedStyle} = useKeyboardHeight({
    additionalHeight: 64,
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TextInput ref={ref} style={styles.input} />
    </Animated.View>
  );
});

export default BottomUpSlideComponent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: -10,
    left: 0,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  input: {
    height: 42,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
  },
});

```

실제 해당 컴포넌트를 여러곳에서 사용할 때, 이벤트 리스너 해제를 제대로 하지 않아 정상적으로 Input이 랜더링 되지 않는 현상이 발생되었습니다. <br/>
`Error: Attempted to remove more RCtKeyboardObserver listteneners than added` <br/>

이벤트를 변수에 할당하여 ComponentDidUnmount시 해당 이밴트를 지우는 방식으로 해결하였습니다. <br/>

```tsx
  useEffect(() => {
    // 변수 할당
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      // component will unmount일 때 삭제
      keyboardWillShowListener.remove(); 
      keyboardWillHideListener.remove();
    };
  }, []);
```
또한 BottomUpSlideInput 내부의 Input에 Ref 중복으로 인한 랜더링 이슈가 발생했습니다. <br/>

forwardRef와 useImperativeHandle을 사용하여 부모 컴포넌트에서 자식 컴포넌트를 제어하는 경우, <br/>
각 자식 컴포넌트에 대해 별도의 ref를 생성해야 하는데 한개의 인풋을 여러 부모컴포넌트가 ref로 공유하다보니, <br/>
원하는 컴포넌트가 아닌 최상위의 BottomUpSlideInput 컴포넌트만이 랜더링 되는 현상이 발생되었습니다. <br/>
BottomUpSlideInput 컴포넌트를 내에서 사용처에 맞게 별도의 ref를 생성하고 인풋에 달아주며 문제를 해결할 수 있으나 오히려 가독성이 떨어지고, <br/>
사용할 때마다 인풋과 ref를 추가해주어야 한다는 점에서 BottomUpSlideInput 컴포넌트를 BottomUpSliderComponent로 바꾸고 <br/>
Input을 children으로 전달한 뒤 `editMode` State를 통해 Input을 컨트롤 하였습니다. <br/>

```tsx
{
        editMode === 'create' &&
      <BottomUpSlideComponent onSubmit={createChecklist}>
        <TextInput
          ref={createChecklistRef}
          style={[
            styles.input,
            {borderColor: theme.lightGrey, fontSize: theme.textXS},
          ]}
          value={newChecklistContent + ''}
          placeholder='체크리스트를 입력해주세요'
          onChangeText={onChangeNewChecklistContent}
          selectionColor={theme.accent}
          keyboardType='default'
        />
      </BottomUpSlideComponent>
      }
      {
        editMode === 'update' &&
        <BottomUpSlideComponent onSubmit={onSubmitUpdateContent}>
          <TextInput
          ref={updateChecklistInputRef}
          style={[
            styles.input,
            {borderColor: theme.accent, fontSize: theme.textXS},
          ]}
          value={editText + ''}
          placeholder='수정할 내용을 입력해주세요'
          onChangeText={onChangeEditText}
          selectionColor={theme.accent}
          keyboardType='default'
        />
       </BottomUpSlideComponent>
      }
```

Dry 원칙도 중요하나 한 눈에 의도를 알아 볼 수 있는 점이 더 클린하다고 생각하여 위처럼 코드를 작성하였습니다.

___

## B. 앱의 규모와 목적에 맞는 상태관리

1. Checklists의 상태를 non-persistent local state로 유지하기 위해 노력하였습니다. <br/>
전역상태 또는 Context Api를 통해 관리하는 것이 아니라 useChecklists 커스텀 훅을 작성하여 내부에 상태를 저장하고 조작하는 로직을 두고, <br/>
사용하는 컴포넌트에 내려주는 방식으로 local state를 지키려고 노력하였습니다. <br/>

2. 어플리케이션의 규모에 맞는 상태 관리를 생각하였고 그 결과 Context Api로 상태관리를 하였습니다. <br/>

프로젝트가 규모를 보면 Context Api만으로도 충분히 상태 관리를 할 수 있다고 생각하였고, useContext 훅을 통해 사용을 단순화 할 수 있었습니다. <br/>
또한 Context Api는 React에 내장되어 있어 다른 Hook들과 함께 잘 작동하므로 useState, useEffect와 같은 훅과 함께 사용하여 상태를 관리할 수 있다는 장점도 있습니다. <br/>

Context Api를 사용할 때 구독하는 모든 컴포넌트가 리랜더링 되는 부분에 주의를 기울여 내려주는 값과 함수들에 useMemo와 useCallback을 사용하여 리랜더링을 최소화 하였습니다. <br/>

___

## C. 앱 퍼포먼스 측면에 대한 최적화에 대한 고민

1. 체크리스트에 아이템을 많이 등록하여도 랜더링에 문제가 없게끔 체크리스트 컴포넌트를 Flatlist로 작성하였습니다. <br/>

```tsx

  <FlatList
    style={[styles.container,{ width }]}
    data={checklists}
    keyExtractor={item => item.id}
    ListEmptyComponent={EmptyChecklistComponent}
    // 아래 코드는 인라인 함수로 리랜더링을 초래합니다. 3번에 해결 과정에 적어두었습니다.
    ListHeaderComponent={
      () => checklists.length > 0 &&
      <ProgressBar completedCount={completedChecklistCount} inCompletedCount={checklists.length} />
    }
    renderItem={({ item: checklist }) => (
      <ChecklistItem
        checklist={checklist}
        onFocusInput={onFocusInput}
        deleteChecklist={deleteChecklist}
        onChangeCompleted={onChangeCompleted}
      />
    )}
  />
```

2. 사용하는 아이콘은 react-native-svg 라이브러리를 통해 svg로 구현하였습니다. <br/>

```tsx

import Checked from '../../../assets/icons/Checked.svg';
// ...
<IconButton
  Icon={<Checked/>}
  onPress={() => onChangeCompleted(checklist)}
/>
// ...
```

3. 프롭스로 전달하는 인라인 함수의 리랜더링 문제 <br/>

리액트 컴포넌트의 최적화 관련해서 조심하지 못한 부분이 있었습니다. <br/>
프롭스로 인라인 함수를 전달할 때 발생할 수 있는 불필요한 리렌더링 문제였는데요,

문제가 발생한 코드는 아래와 같습니다.

```tsx

<FlatList
  // ...
  ListHeaderComponent={
    () => checklists.length > 0 &&
    <ProgressBar completedCount={completedChecklistCount} inCompletedCount={checklists.length} />
  }
  // ...
/>
```
위 코드에서 문제는 FlatList 컴포넌트가 리렌더링될 때마다 ListHeaderComponent 프롭스로 전달된 인라인 함수가 항상 새로 생성된다는 것입니다. <br/>

결과적으로 FlatList가 리렌더링될 때마다 ListHeaderComponent는 새로운 값으로 갱신되어 불필요한 리렌더링이 발생하였고, <br/>
해당 프로그래스는 진척도를 의미하는 에니메이션을 계속 0부터 실행하는 이슈가 발생하였습니다. <br/>

이 문제를 해결하기 위해서는 인라인 함수를 컴포넌트 바깥으로 빼내어 변수에 할당하는 방법이 있지만, <br/>
useCallback 훅을 활용하여 함수를 메모이제이션하는 것이 좋다고 생각하고 리펙터링을 진행했습니다. <br/>

아래는 이를 적용한 수정된 코드입니다.

```tsx

const ProgressBarComponent = useCallback(({ completedCount, inCompletedCount }: {
    completedCount: number,
    inCompletedCount: number,
  }) => {
    return <ProgressBar completedCount={completedCount} inCompletedCount={inCompletedCount} />
  },[checklists])

  const listHeader = checklists?.length > 0
        ? <ProgressBarComponent completedCount={completedChecklistCount} inCompletedCount={checklists.length} />
        : null;

  return (    
    <FlatList
      style={[styles.container,{ width }]}
      data={checklists}
      keyExtractor={item => item.id}
      ListEmptyComponent={EmptyChecklistComponent}
      ListHeaderComponent={listHeader}
      renderItem={({ item: checklist }) => (
        <ChecklistItem
          checklist={checklist}
          onFocusInput={onFocusInput}
          deleteChecklist={deleteChecklist}
          onChangeCompleted={onChangeCompleted}
        />
      )}
    />
  );
```



### Etc

사용한 3rd 라이브러리

1. react-native-reanimated@3
2. react-native-svg, react-native-svg-transformer
3. react-navigation@6