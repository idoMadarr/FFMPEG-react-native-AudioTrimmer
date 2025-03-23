import React, {ReactNode} from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {StylesContstant} from '../../utils/types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

interface WavesTimelinePropsType {
  children: ReactNode;
  sliderWidth: number;
}

const WavesTimeline: React.FC<WavesTimelinePropsType> = ({
  sliderWidth,
  children,
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

  const startingTrim = Gesture.Pan()
    .onStart(_event => {
      leftThumbStartPositionX.value = leftThumbPositionX.value;
    })
    .onUpdate(event => {
      leftThumbPositionX.value = Math.max(
        0,
        leftThumbStartPositionX.value + event.translationX,
      );
    });

  const endingTrim = Gesture.Pan()
    .onStart(_event => {
      rightThumbStartPositionX.value = rightThumbPositionX.value;
    })
    .onUpdate(event => {
      rightThumbPositionX.value = Math.min(
        sliderWidth,
        rightThumbStartPositionX.value + event.translationX,
      );
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
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        <View style={[styles.constantRails, {width: sliderWidth}]}>
          {children}
        </View>
        <View style={styles.activeRails}>{children}</View>

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
  },
  constantRails: {
    height: StylesContstant.WAVE_MAX_HIGHT,
    flexDirection: 'row',
  },
  activeRails: {
    height: StylesContstant.WAVE_MAX_HIGHT,
    width: '5%',
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: 'rgba(51, 202, 255, 0.8)',
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
});

export default WavesTimeline;
