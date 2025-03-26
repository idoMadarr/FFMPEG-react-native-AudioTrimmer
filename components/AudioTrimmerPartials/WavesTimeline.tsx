import React, {ReactNode} from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {PRIMARY_COLOR, StylesContstant} from '../../utils/types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {calcMinAndMaxValues} from '../../utils/formats';
import TextElement from '../Resuable/TextElement';

interface WavesTimelinePropsType {
  children: ReactNode;
  sliderWidth: number;
  min: number;
  max: number;
  step: number;
  onChangeHandler(values: {minValue: number; maxValue: number}): void;
  timestampsStart: string;
  timestampsEnd: string;
}

const WavesTimeline: React.FC<WavesTimelinePropsType> = ({
  children,
  sliderWidth,
  min,
  max,
  step,
  onChangeHandler,
  timestampsStart,
  timestampsEnd,
}) => {
  const rightThumbPositionX = useSharedValue(sliderWidth);
  const rightThumbStartPositionX = useSharedValue(0);
  const leftThumbPositionX = useSharedValue(0);
  const leftThumbStartPositionX = useSharedValue(0);

  const leftThumbPositionXAnimation = useAnimatedStyle(() => ({
    transform: [{translateX: leftThumbPositionX.value}],
  }));

  const rightThumbPositionXAnimation = useAnimatedStyle(() => ({
    transform: [{translateX: rightThumbPositionX.value}],
  }));

  const activeRailsAnimation = useAnimatedStyle(() => ({
    width: rightThumbPositionX.value - leftThumbPositionX.value,
    transform: [{translateX: leftThumbPositionX.value}],
  }));

  const innerActiveRailsAnimation = useAnimatedStyle(() => ({
    transform: [{translateX: -leftThumbPositionX.value}],
  }));

  const startingTrim = Gesture.Pan()
    .onStart(_event => {
      leftThumbStartPositionX.value = leftThumbPositionX.value;
    })
    .onUpdate(event => {
      const position = leftThumbStartPositionX.value + event.translationX;
      const minClamp = 0;
      const maxClamp = rightThumbPositionX.value - 100;
      leftThumbPositionX.value = Math.max(
        minClamp,
        Math.min(position, maxClamp),
      );
    })
    .onEnd(() => {
      const values = calcMinAndMaxValues(
        leftThumbPositionX.value,
        rightThumbPositionX.value,
        min,
        max,
        step,
        sliderWidth,
      );
      runOnJS(onChangeHandler)(values);
    });

  const endingTrim = Gesture.Pan()
    .onStart(_event => {
      rightThumbStartPositionX.value = rightThumbPositionX.value;
    })
    .onUpdate(event => {
      const position = rightThumbStartPositionX.value + event.translationX;
      const minClamp = leftThumbPositionX.value + 100;
      const maxClamp = sliderWidth;

      rightThumbPositionX.value = Math.max(
        minClamp,
        Math.min(position, maxClamp),
      );
    })
    .onEnd(() => {
      const values = calcMinAndMaxValues(
        leftThumbPositionX.value,
        rightThumbPositionX.value,
        min,
        max,
        step,
        sliderWidth,
      );

      runOnJS(onChangeHandler)(values);
    });

  const thumbRight = {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  };

  const thumbLeft = {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  };

  return (
    <View style={styles.timelineContainer}>
      <View style={styles.timestampsContainer}>
        <TextElement>{timestampsStart}</TextElement>
        <TextElement>{timestampsEnd}</TextElement>
      </View>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        <View style={[styles.constantRails, {width: sliderWidth}]}>
          {children}
        </View>

        <Animated.View style={[styles.activeRails, activeRailsAnimation]}>
          <Animated.View
            style={[styles.activeRails, innerActiveRailsAnimation]}>
            {children}
          </Animated.View>
        </Animated.View>

        <GestureDetector gesture={startingTrim}>
          <Animated.View
            style={[styles.thumb, leftThumbPositionXAnimation, {left: 0}]}>
            <View style={[styles.iconContainer, thumbLeft]}>
              <AntDesign name={'caretleft'} size={28} style={styles.icon} />
            </View>
          </Animated.View>
        </GestureDetector>

        <GestureDetector gesture={endingTrim}>
          <Animated.View
            style={[
              styles.thumb,
              rightThumbPositionXAnimation,
              {transform: [{translateX: sliderWidth}]},
            ]}>
            <View style={[styles.iconContainer, thumbRight]}>
              <AntDesign name={'caretright'} size={28} style={styles.icon} />
            </View>
          </Animated.View>
        </GestureDetector>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  timelineContainer: {
    height: Dimensions.get('window').height * 0.15,
    marginVertical: '16%',
  },
  constantRails: {
    height: StylesContstant.WAVE_MAX_HIGHT,
    flexDirection: 'row',
  },
  activeRails: {
    height: StylesContstant.WAVE_MAX_HIGHT,
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: PRIMARY_COLOR,
    overflow: 'hidden',
    borderRadius: 16,
  },
  innerActiveRails: {
    height: StylesContstant.WAVE_MAX_HIGHT,
    flexDirection: 'row',
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: 16,
  },
  thumb: {
    width: StylesContstant.THUMB_WIDTH,
    height: StylesContstant.THUMB_HIGHT,
    position: 'absolute',
    left: -StylesContstant.THUMB_WIDTH,
  },
  iconContainer: {
    height: '100%',
    backgroundColor: 'rgba(60, 60, 60, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'white',
  },
  timestampsContainer: {
    marginBottom: '2%',
    marginHorizontal: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default WavesTimeline;
