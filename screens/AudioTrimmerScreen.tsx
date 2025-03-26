import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, StylesContstant} from '../utils/types';
import WavesTimeline from '../components/AudioTrimmerPartials/WavesTimeline';
import {waveToTimestamp} from '../utils/formats';
import {AUDIO_SIZE} from '../hooks/useFFMPEG';

type AudioTrimmerRouteType = RouteProp<RootStackParamList, 'audio-trimmer'>;

const AudioTrimmerScreen: React.FC<{route: AudioTrimmerRouteType}> = ({
  route,
}) => {
  const waves = route.params.waves;

  const [values, setValues] = useState<{minValue: number; maxValue: number}>({
    minValue: 0,
    maxValue: waves.length,
  });

  return (
    <SafeAreaView style={styles.screen}>
      <WavesTimeline
        min={0}
        max={waves.length}
        step={1}
        sliderWidth={waves.length * StylesContstant.SLIDER_SIZE}
        timestampsStart={waveToTimestamp(values.minValue, AUDIO_SIZE)}
        timestampsEnd={waveToTimestamp(values.maxValue, AUDIO_SIZE)}
        onChangeHandler={values => {
          setValues(values);
          console.log(values, 'asdad');
        }}>
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
