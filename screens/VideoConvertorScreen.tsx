import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {FFmpegKit, FFprobeKit} from 'ffmpeg-kit-react-native';
import fs from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextElement from '../components/Resuable/TextElement';
import {RootStackParamList} from '../utils/types';
import ButtonElement from '../components/Resuable/ButtonElement';
import {extractUrlString, calcConvertingProgress} from '../utils/formats';

type VideoConvertorRouteType = RouteProp<RootStackParamList, 'video-convertor'>;

const VideoConvertorScreen: React.FC<{route: VideoConvertorRouteType}> = ({
  route,
}) => {
  const [filename, setFilename] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const onConvert = async () => {
    try {
      // The file path to use
      const path = route.params.video.sourceURL || route.params.video.path;

      // Formatting a new file name
      const {name, extension} = extractUrlString(path, {
        seperatedValues: true,
      }) as {name: string; extension: string};
      const newFilename = `${name}_${Date.now()}.${extension}`;

      // Dir paths
      // MP4: When you open an MP4, the system assumes it's a video file and plays it in the default media player.
      // MP3: When you open an MP3, the system assumes it's audio-only and suggests a dedicated music player (Spotify, SoundCloud, etc.).
      const cachesDirPath = fs.CachesDirectoryPath;
      const downloadDir = fs.DownloadDirectoryPath + `/${filename}.mp4`;

      // Copy the video file inside the app cache folder
      // Files from external sources (e.g. picked from the gallery or recorded from the camera) might have restricted access due to Android/iOS security.
      // By copying the file to the app’s cache folder, you ensure FFmpeg has full read access.
      const newCacheFilePath = `${cachesDirPath}/${newFilename}`;
      await fs.copyFile(path, newCacheFilePath);

      // mediaOutput contain all the data from the video in string type
      const mediaInfo = await FFprobeKit.getMediaInformation(newCacheFilePath);
      const mediaOutput = (await mediaInfo.getOutput()) as string;
      const duration = JSON.parse(mediaOutput).format.duration;
      const durationInMillis = duration * 1000;
      const ffmpegCommand = `-i ${newCacheFilePath} -vn -c:a libmp3lame -qscale:a 2 ${downloadDir}`;

      // Extract the entire audio from the video file and store it inside downloadDir
      await FFmpegKit.executeAsync(
        ffmpegCommand,
        session => {},
        log => {
          // console.log(log.getMessage());
        },
        statistics => {
          // Getting in real time precentage of the finish proccess (for dynamic progress bar)
          const progress = calcConvertingProgress({
            value: statistics.getTime(),
            inputMin: 0,
            inputMax: durationInMillis,
            outputMin: 0,
            outputMax: 100,
          });

          setLoadingProgress(Math.floor(progress));
          console.log(progress, 'progress');
        },
      );
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
        <TextInput
          value={filename}
          onChangeText={setFilename}
          placeholder={'File name'}
        />
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
