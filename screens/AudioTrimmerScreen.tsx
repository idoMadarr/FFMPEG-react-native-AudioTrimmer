import React, {useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, StylesContstant} from '../utils/types';
import WavesTimeline from '../components/AudioTrimmerPartials/WavesTimeline';
import {waveToTimestamp} from '../utils/formats';
import {AUDIO_SIZE} from '../hooks/useFFMPEG';
import ButtonElement from '../components/Resuable/ButtonElement';
import TextElement from '../components/Resuable/TextElement';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {goBack} from '../utils/navigationRef';

type AudioTrimmerRouteType = RouteProp<RootStackParamList, 'audio-trimmer'>;

const AudioTrimmerScreen: React.FC<{route: AudioTrimmerRouteType}> = ({
  route,
}) => {
  const waves = route.params.waves;
  const path = route.params.path;
  const onTrim = route.params.onTrim;

  const [values, setValues] = useState<{minValue: number; maxValue: number}>({
    minValue: 0,
    maxValue: waves.length,
  });

  const onExport = async () => {
    const min = waveToTimestamp(values.minValue, AUDIO_SIZE);
    const max = waveToTimestamp(values.maxValue, AUDIO_SIZE);
    onTrim(path, min, max);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TouchableOpacity onPress={goBack} style={styles.backContainer}>
        <MaterialCommunityIcon
          name={'arrow-left'}
          size={34}
          style={styles.icon}
        />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <TextElement fontSize={'xl'}>Audio Trimmer</TextElement>
        <TextElement cStyle={styles.title}>
          Choose your audio segment and export it with a single click
        </TextElement>
      </View>
      <WavesTimeline
        min={0}
        max={waves.length}
        step={1}
        sliderWidth={waves.length * StylesContstant.SLIDER_SIZE}
        timestampsStart={waveToTimestamp(values.minValue, AUDIO_SIZE)}
        timestampsEnd={waveToTimestamp(values.maxValue, AUDIO_SIZE)}
        onChangeHandler={values => {
          setValues(values);
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
      <ButtonElement onPress={onExport}>
        <TextElement>Export</TextElement>
      </ButtonElement>
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
  backContainer: {
    position: 'absolute',
    left: '4%',
    top: '4%',
    padding: 8,
  },
  titleContainer: {
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.8,
  },
  title: {
    textAlign: 'center',
  },
  wave: {
    backgroundColor: 'white',
  },
  icon: {
    color: 'white',
  },
});

export default AudioTrimmerScreen;
