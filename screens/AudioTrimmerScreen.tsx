import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, StylesContstant} from '../utils/types';
import WavesTimeline from '../components/AudioTrimmerPartials/WavesTimeline';

type AudioTrimmerRouteType = RouteProp<RootStackParamList, 'audio-trimmer'>;

const AudioTrimmerScreen: React.FC<{route: AudioTrimmerRouteType}> = ({
  route,
}) => {
  const waves = route.params.waves;

  return (
    <SafeAreaView style={styles.screen}>
      <WavesTimeline sliderWidth={waves.length * StylesContstant.SLIDER_SIZE}>
        {waves.map((rate, index) => (
          <View
            key={index}
            style={[
              styles.wave,
              {
                height: rate + 1,
                width: StylesContstant.WAVE_WIDTH,
                borderRadius: 6,
                marginRight:
                  index === waves.length - 1 ? 0 : StylesContstant.WAVE_MARGIN,
                top: -(rate / 2),
                transform: [{translateY: StylesContstant.WAVE_MAX_HIGHT / 2}],
              },
            ]}
          />
        ))}
      </WavesTimeline>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  wave: {
    backgroundColor: 'white',
  },
});

export default AudioTrimmerScreen;
