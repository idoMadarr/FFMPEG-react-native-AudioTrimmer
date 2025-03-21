import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import TextElement from '../components/Resuable/TextElement';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../utils/types';
import WavesTimeline from '../components/WavesTimeline/WavesTimeline';

type AudioTrimmerRouteType = RouteProp<RootStackParamList, 'audio-trimmer'>;

const AudioTrimmerScreen: React.FC<{route: AudioTrimmerRouteType}> = ({
  route,
}) => {
  const waves = route.params.waves;

  return (
    <SafeAreaView style={styles.screen}>
      <WavesTimeline waves={waves} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioTrimmerScreen;
