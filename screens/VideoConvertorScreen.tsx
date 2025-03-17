import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {FFmpegKit, FFprobeKit} from 'ffmpeg-kit-react-native';
import fs from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextElement from '../components/Resuable/TextElement';
import {RootStackParamList} from '../utils/types';
import ButtonElement from '../components/Resuable/ButtonElement';
import {extractUrlString} from '../utils/formats';
console.log(FFprobeKit, '!');

type VideoConvertorRouteType = RouteProp<RootStackParamList, 'video-convertor'>;

const VideoConvertorScreen: React.FC<{route: VideoConvertorRouteType}> = ({
  route,
}) => {
  const onConvert = async () => {
    try {
      const path = route.params.video.sourceURL || route.params.video.path;

      // Formatting a new file name
      const {name, extension} = extractUrlString(path, {
        seperatedValues: true,
      }) as {name: string; extension: string};
      const newFilename = `${name}_${Date.now()}.${extension}`;

      // Dir paths
      const cachesDirPath = fs.CachesDirectoryPath;
      const downloadDir = fs.DownloadDirectoryPath + '/Ido.mp4';

      // Copy the video file inside the app cache folder
      const newCacheFilePath = `${cachesDirPath}/${newFilename}`;
      await fs.copyFile(path, newCacheFilePath);

      const mediaInfo = await FFprobeKit.getMediaInformation(newCacheFilePath);
      const mediaOutput = (await mediaInfo.getOutput()) as string;
      const duration = JSON.parse(mediaOutput).format.duration;
      const ffmpegCommand = `-i ${newCacheFilePath} -vn -c:a libmp3lame -qscale:a 2 ${downloadDir}`;

      await FFmpegKit.execute(ffmpegCommand);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <View style={styles.screen}>
      <View>
        <TextElement>
          Convert to audio file and save file on Download dir
        </TextElement>
        <ButtonElement onPress={onConvert}>
          <Icon name={'video-file'} size={34} />
          <TextElement fontSize={'lg'}>Convert</TextElement>
        </ButtonElement>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoConvertorScreen;
