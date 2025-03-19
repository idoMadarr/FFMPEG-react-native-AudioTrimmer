import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import TextElement from '../Resuable/TextElement';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface LoadingProgressPropsTyps {
  progress: number;
}

const LoadingProgress: React.FC<LoadingProgressPropsTyps> = ({progress}) => {
  const progressWidthAnimation = useSharedValue(0);

  useEffect(() => {
    progressWidthAnimation.value = progress;
  }, [progress]);

  const animatedProgress = useAnimatedStyle(() => {
    return {
      width: withTiming(`${progressWidthAnimation.value}%`),
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progress, animatedProgress]} />
      </View>
      <TextElement cStyle={styles.label}>{progress + '%'}</TextElement>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  progressContainer: {
    width: 200,
    height: 10,
    borderWidth: 2,
    borderColor: '#BFD3F3',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2e6eee',
    borderRadius: 5,
  },
  label: {
    textAlign: 'center',
  },
});

export default LoadingProgress;
