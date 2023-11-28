import {View, FlatList} from 'react-native';
import React, {forwardRef} from 'react';
import ListSeparator from '../../common/ListSeparator';
import WeekTabButton from './WeekTabButton';
import {useWeekContext} from '../../../context/WeekProvider';
import {
  flatlistPadding,
  itemSpacing,
  itemWidth,
} from '../../../screens/ChecklistsScreen';

interface Props {
  tabsToCenter: (tabIndex: number) => void;
  setIsDragging: (isDragging: boolean) => void;
}

const Separator = () => <ListSeparator width={8} />;

const WeekTabs = forwardRef<FlatList, Props>(
  ({setIsDragging, tabsToCenter}, ref) => {
    const {selectWeek} = useWeekContext();

    const onDragStart = () => {
      setIsDragging(true);
    };
    const onDragEnd = () => {
      setIsDragging(false);
    };

    return (
      <View
        style={{
          height: itemWidth * 1.56,
        }}>
        <FlatList
          ref={ref}
          horizontal
          centerContent
          data={Array.from({length: 40}, (_, i) => i + 1)}
          renderItem={({item}) => (
            <WeekTabButton item={item} onPress={tabsToCenter} />
          )}
          onMomentumScrollBegin={onDragStart}
          onMomentumScrollEnd={onDragEnd}
          keyExtractor={item => item + ''}
          alwaysBounceHorizontal={false}
          snapToAlignment="center"
          snapToInterval={62} // item width + gap
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={Separator}
          getItemLayout={(_, index) => ({
            length: 40,
            offset: 62 * index,
            index,
          })}
          contentContainerStyle={{paddingHorizontal: flatlistPadding}}
          onScroll={({nativeEvent}) => {
            const index = Math.round(
              nativeEvent.contentOffset.x / (itemWidth + itemSpacing),
            );
            if (index < 0 || index > 39) {
              return;
            }
            selectWeek(index + 1);
          }}
        />
      </View>
    );
  },
);

export default WeekTabs;
