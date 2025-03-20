import {Video} from 'react-native-image-crop-picker';

export type RootStackParamList = {
  ['video-selector']: undefined;
  ['video-convertor']: {video: Video};
  ['audio-trimmer']: undefined;
};

export type ConvertedFileType = {
  name: string;
  path: string;
};
