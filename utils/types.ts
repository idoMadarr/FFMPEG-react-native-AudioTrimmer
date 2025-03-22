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
  WAVE_HIGHT = 70,
  WAVE_PICKER = 60,
  WAVE_WIDTH = 1,
  WAVE_MARGIN = 4,
}
