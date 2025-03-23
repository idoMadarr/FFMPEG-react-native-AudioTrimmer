import {Video} from 'react-native-image-crop-picker';

export type RootStackParamList = {
  ['video-selector']: undefined;
  ['video-convertor']: {video: Video};
  ['audio-trimmer']: {waves: number[]};
};

export type ConvertedFileType = {
  name: string;
  path: string;
  ratesPath: string;
};

export type RMSOptionType = {
  rmsLevel: number;
  minRMS: number;
  maxRMS: number;
  minHight: number;
  maxHight: number;
};

export const enum StylesContstant {
  WAVE_MAX_HIGHT = 70,
  WAVE_WIDTH = 3,
  WAVE_MARGIN = 4,
  THUMB_HIGHT = 70,
  THUMB_WIDTH = 50,
  SLIDER_SIZE = StylesContstant.WAVE_MARGIN + StylesContstant.WAVE_WIDTH,
}
