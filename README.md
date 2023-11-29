# Frontend Assignment - 김명성

## Source Folder Structure
- src
  - assets: 아이콘 및 정적 파일 저장소
    - icons: svg 저장소
  - components: 재사용 컴포넌트 및 스크린에서 사용하는 컴포넌트
    - common: 앱 전역에서 사용하는 공통 컴포넌트
    - pages: 스크린에서 사용하는 컴포넌트 모음
  - context: 전역 상태 관리
  - hooks: 커스텀 훅 및 뷰에서 사용하는 로직 저장소
  - routes: 라우터 구획 
  - screens: 앱 스크린
  - styles: 앱 스타일링 및 테마 
  - types : 타입 정의 
  - util : 유틸리티 함수 및 공통 로직

# Issue & Solve

## A. Animation

1. Bottom Up Slide Animation

<br/>

`KeyboardAvoidingView`를 사용하면 `keyboardVerticalOffset` 값을 하드코딩으로 넣어 맞춰야 해서 다양한 기기에서 정확한 값을 구현하기 어려웠습니다.<br/>
React-native 내장 라이브러리인 `Keyboard`를 사용하여 높이를 구해 값을 구하면 키보드 크기에 맞추어 인풋을 올릴 수 있었으나 올라가는 애니메이션이 부자연스러웠습니다.<br/>

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
      <TextInput style={styles.input} />
    </KeyboardAvoidingView>
  );
};

export default BottomUpSlideComponent;
```

시연영상을 자세히 보니 height값을 통해 에니메이션을 구현하고 있는 것 같았습니다. <br/>
기존 로직을 변경하고 react-native-reanimated를 사용하였고, <br/>
해당 컴포넌트가 쓰이는 곳이 많을 것 같아 커스텀 훅으로 구현하였습니다. <br/>

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

```

실제 해당 컴포넌트를 여러곳에서 사용할 때, 이벤트 리스너 해제가 되지 않아 정상적으로 Input이 랜더링 되지 않는 현상이 발생되었습니다. <br/>
`Error: Attempted to remove more RCtKeyboardObserver listteneners than added` <br/>

이벤트를 변수에 할당하여 `ComponentDidUnmount`시 이밴트를 지우는 방식으로 해결하였습니다. <br/>

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
      // component did unmount일 때 삭제
      keyboardWillShowListener.remove(); 
      keyboardWillHideListener.remove();
    };
  }, []);
```
또한 BottomUpSlideInput을 여러곳에서 사용하다보니 TextInput에 할당한 useRef의 중복으로 인한 랜더링 이슈가 발생했습니다. <br/>

forwardRef와 useImperativeHandle을 사용하여 부모 컴포넌트에서 자식 컴포넌트를 제어하는 경우, <br/>
각 자식 컴포넌트에 대해 별도의 ref를 생성해야 하는데,  한개의 인풋을 여러 부모컴포넌트가 ref 이어 공유하다보니, <br/>
실제 사용할 때에는 원하는 컴포넌트가 아닌 스크린 최상위 컴포넌트에 선언된 BottomUpSlideInput 컴포넌트가 랜더링 되는 현상이 발생되었습니다. <br/>
해결 방법으로는 BottomUpSlideInput 컴포넌트 내에서 사용처에 맞게 ref와 input을 생성하고 인풋에 달아주는 방법이 있었으나 <br/>
코드의 의도를 쉽게 파악할 수 없고, 추가 사용처가 생길때마다 인풋과 ref를 해당 컴포넌트에 추가 해주어야하고, <br/>
input외 다른 요소들이 들어올 수 없어 재사용성이 떨어지는 이유로 컴포넌트 리팩터링을 진행하게 되었습니다.

BottomUpSlideInput 컴포넌트를 BottomUpSliderComponent로 이름을 바꿔주고  <br/>
Input을 children으로 전달한 뒤 `editMode` State를 통해 Input을 컨트롤 하였습니다. <br/>

변경한 코드는 아래와 같습니다.

```tsx
const BottomUpSlideComponent = ({
  onSubmit,
  children,
}: PropsWithChildren<Props>) => {
  const {width} = useWindowDimensions();
  const {theme} = useTheme();
  const {delay} = useDelay(); // timeout custom hook
  const {keyboardHeight, animatedStyle} =
  useKeyboardHeight({ additionalHeight: 64, }); // animation custom hook
  
  const [fakeLoading, setFakeLoading] = useState(false); // fake loading state

  const onPressSubmit = () => {
    onSubmit();
    setFakeLoading(true);
    delay(() => {
      setFakeLoading(false);
    }, 500);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          width,
          bottom: keyboardHeight ? 0 : -100,
          backgroundColor: theme.backgroundColor,
        },
      ]}>
      {children}
      <TouchableOpacity onPress={onPressSubmit} style={styles.submitButton}>
        {fakeLoading ? (
          <ActivityIndicator color={theme.grey} size="small" />
        ) : (
          <Upload width={32} height={32} fill={theme.accent} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default BottomUpSlideComponent;

```

`BottomUpSlideComponent`를 사용한 예시입니다.

```tsx
{
  editMode === 'create' &&
  <BottomUpSlideComponent onSubmit={createChecklist}>
          {/* Children */}
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
            {/* Children */}
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

Dry 원칙도 중요하나 한 눈에 의도를 알아 볼 수 있는 점이 더 클린하다고 생각하여 고민한 끝에 위처럼 사용하게 되었습니다.

___

## B. 앱의 규모와 목적에 맞는 상태관리

1. Checklists의 상태를 non-persistent local state로 유지하기 위해 노력하였습니다. <br/>
전역상태 또는 Context Api를 통해 관리하는 것이 아니라 useChecklists 커스텀 훅을 작성하여 내부에 상태를 저장하고 조작하는 로직을 두고, <br/>
사용하는 컴포넌트에 내려주는 방식으로 local state를 지키려고 노력하였습니다. <br/>

2. 그 외 앱 전역으로 필요한 상태들은 어플리케이션의 규모에 적합한 Context Api를 선택하여 관리하였습니다. <br/>

프로젝트의 규모를 보면 Context Api만으로도 충분히 관리할 수 있다고 생각하였고, useContext 훅을 통해 사용을 단순화 할 수 있었습니다. <br/>
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

  4. 체크리스트의 CRUD
  체크리스트를 업데이트하는 과정에서 세 가지 로직을 고민하였습니다. <br/>
  각각의 로직은 불변성, 코드 가독성 측면에서 장단점을 가지고 있어서 선택하기 어려웠고, 어떤 것이 더 좋은 코드인지 고심하였습니다. <br/>
  
  - 첫번째 방법. 불변성 그리고 복잡성<br/>
  첫 번째 방법은 useMemo와 함께 깊은 복사를 통해 불변성을 확보하고자 했습니다. <br/>
  현재 체크리스트는 2뎁스의 객체이지만 추가적인 프로퍼티나 요구사항이 고도화 될 때의 확장성에 초점을 맞추었습니다. <br/>
  다만 깊은 복사 로직이 추가되고, `useMemo`를 사용함으로서 관리해야하는 의존성 배열이 늘어난다는 단점이 있었습니다. <br/>
  또한 Memoization은 성능상 이점을 가져올 수 있지만, 상태 업데이트마다 새로운 객체를 생성하는 부분에서 성능을 떨어뜨릴 수 있을 것이라는 고민이 있었습니다. <br/>

```tsx
const mutableCopyChecklist = useMemo(
  () => deepCopy(allChecklists),
  [allChecklists],
);

const updateChecklistChanges = useCallback(
  (newChecklist: NewChecklist) => {
    if (!mutableCopyChecklist) {
      return;
    }

    const weekNumber = newChecklist.weekNumber;
    const index = mutableCopyChecklist[weekNumber].findIndex(
      checklist => checklist.id === newChecklist.id,
    );
    if (index < 0) {
      return;
    }
    mutableCopyChecklist[weekNumber][index] = newChecklist;
    setAllChecklists(mutableCopyChecklist);
  },
  [mutableCopyChecklist],
);
```

  - 두 번째 방법. 간결함과 확장성 <br/>
  두 번째 방법은 얕은 복사를 중첩 사용하여 코드를 더 간단하게 만들고자 했습니다. <br/>
  현재의 체크리스트 구조에서는 2단계 정도의 깊이이기 때문에 얕은복사 또한 적절할 것으로 판단했습니다. <br/>
  하지만 추가적인 프로퍼티를 사용하거나 깊이가 깊어지는 요구사항에 적절하게 대처하기 어려울 수 있고, <br/>
  생성, 삭제, 수정 등 데이터를 조작하는 로직에 중복된 내부 로직이 증가하는 단점이 있었습니다.


```tsx
  const updateChecklistChanges = useCallback((newChecklist: NewChecklist) => {
    const weekNumber = newChecklist.weekNumber;
    setAllChecklists(prev => {
      if (!prev) {
        return {};
      }
      const mutable = {
        ...prev,
        [weekNumber]: [...prev[weekNumber]],
      };
      const index = prev[weekNumber].findIndex(
        checklist => checklist.id === newChecklist.id,
      );
      if (index < 0) {
        return prev;
      }
      mutable[weekNumber][index] = newChecklist;
      return mutable;
    });
  }, []);
```

  - 세 번째 방법. 간결함과 확장성 <br/>
  2번째와는 달리 코드 양이 줄어들었고, 불변성을 유지하면서도 코드를 간결하게 유지할 수 있는 방법으로 보였습니다.<br/>
  하지만 이 역시 2번째 방법이 갖는 확장성 부족과 여러 곳에서 사용 할 때 중복 로직이라는 단점이 있었으며,<br/>
  코드의 양은 줄어들었지만 주관적 가독성이 상대적으로 낮아졌습니다. <br/>
  특히, 업데이트된 체크리스트를 찾아내는 로직이 한 줄에 모두 표현되어 있어 코드를 유지보수 할 때 난해할 수 있다고 생각했습니다. <br/>

```tsx
const updateChecklistChanges = useCallback((newChecklist: NewChecklist) => {
  setAllChecklists(prev => {
    if (!prev) {
      return {};
    }
    const weekNumber = newChecklist.weekNumber;
    const mutableChecklists = {
      ...prev,
      [weekNumber]: prev[weekNumber]?.map(item =>
        item.id === newChecklist.id ? newChecklist : item
      ),
    };
    return mutableChecklists;
  });
}, []);
```

### 선택

저는 첫번째 방법을 선택하였습니다. <br/>
그 이유는 불변성 유지와 확장성 측면에서의 안정성을 중시했기 때문입니다. <br/>

1. 불변성의 확보 <br/>
useMemo와 함께 깊은 복사를 통해 불변성을 확보하는데 주력했습니다. <br/>

2. 확장성에 대한 고려 <br/>
현재 체크리스트는 2단계의 객체이지만, 추가적인 프로퍼티나 요구사항이 고도화될 때의 확장성에 초점을 맞추었습니다. <br/>

3. Memoization을 통한 성능 최적화 <br/>
useMemo를 사용하여 성능을 최적화하고자 했습니다. <br/>
이는 불변성을 유지하면서도, 성능적인 이점을 가져올 수 있는 방법으로 판단했습니다. <br/>

4. 코드 가독성의 유지 <br/>
코드를 작성하면서 불변성을 확실히 유지하면서도 가독성을 최대한 유지하려고 노력했습니다. <br/>
깊은 복사 로직이 추가되어 코드가 복잡해지는 단점이 있지만, 코드를 이해하는데 있어서 명확성을 유지하는 것이 중요하다고 판단했습니다. <br/>

___

## D. 디바이스 크기를 고려한 디자인

사용자들의 다양한 기기에서 일관된 및 향상된 앱 경험을 누릴 수 있도록 고민했습니다. <br/>
다양한 iPhone 디바이스 크기를 고려하여 체크리스트 탭 크기를 잡았습니다. <br/>
간단한 시연 영상을 첨부합니다.

![example](https://github.com/Tchaikovsky1114/FrontendAssignment/assets/96774661/b5217115-42c7-4535-8b55-aada07e776bf)

### Etc

사용한 3rd 라이브러리

1. react-native-reanimated@3
2. react-native-svg, react-native-svg-transformer
3. react-navigation@6
