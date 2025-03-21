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
