import {useState} from 'react';
import {Alert} from 'react-native';
import fs from 'react-native-fs';
import {FFmpegKit, FFprobeKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {calcConvertingProgress, extractUrlString} from '../utils/formats';
import {ConvertedFileType} from '../utils/types';

const useFFMPEG = () => {
  const [convertedFile, setConvertedFile] = useState<ConvertedFileType>();
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Extract audio from video file:
  // MP4: When you open an MP4, the system assumes it's a video file and plays it in the default media player.
  // MP3: When you open an MP3, the system assumes it's audio-only and suggests a dedicated music player (Spotify, SoundCloud, etc.).
  const onExtract = async (path: string, savedFileName: string) => {
    try {
      // Formatting a new file name
      const {name, extension} = extractUrlString(path, {
        seperatedValues: true,
      }) as {name: string; extension: string};
      const newFilename = `${name}_${Date.now()}.${extension}`; // 1742410663308_1742410673483.mp4
      const cachesDirPath = fs.CachesDirectoryPath;

      // Copy the video file inside the app cache folder.
      // Files from external sources (e.g. picked from the gallery or recorded from the camera) might have restricted access due to Android/iOS security.
      // By copying the file to the app’s cache folder, you ensure FFmpeg has full read access.
      const newCacheFilePath = `${cachesDirPath}/${newFilename}`;
      await fs.copyFile(path, newCacheFilePath);

      // mediaOutput contain all the data from the video in string type
      const mediaInfo = await FFprobeKit.getMediaInformation(newCacheFilePath);
      const mediaOutput = (await mediaInfo.getOutput()) as string;
      const duration = JSON.parse(mediaOutput).format.duration;
      const durationInMillis = duration * 1000;

      // Save the entire converted file inside the app cache folder as well.
      // The idea is allowing the user trim the audio file BEFORE saving it to the DownloadDir.
      const convertedCachesFilePath = `${cachesDirPath}/${savedFileName}.mp4`;
      const ffmpegCommand = `-i ${newCacheFilePath} -vn -c:a libmp3lame -qscale:a 2 ${convertedCachesFilePath}`;

      // Extract the entire audio from the video file and store it.
      await FFmpegKit.executeAsync(
        ffmpegCommand,
        async session => {
          // Getting final results
          const returnCode = await session.getReturnCode();
          if (ReturnCode.isSuccess(returnCode)) {
            return setConvertedFile({
              name: `${savedFileName}.mp4`,
              path: convertedCachesFilePath,
            });
          }

          if (ReturnCode.isCancel(returnCode)) {
            return Alert.alert(
              'Operation Cancelled',
              'You have cancelled the operation. No changes were made.',
            );
          }

          Alert.alert('Error', 'Something went worng during the proccess.');
        },
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

          setLoadingProgress(Math.round(progress));
        },
      );
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onSave = async () => {
    // Notice: From android 10+ does't allow to store files in sub-folders
    if (convertedFile) {
      try {
        await fs.copyFile(
          convertedFile.path,
          `${fs.DownloadDirectoryPath}/${convertedFile.name}`,
        );
        Alert.alert('Success', 'file saved in Download folder.');
      } catch (error) {
        Alert.alert('Error', 'Operation failed, audio file can not be saved.');
      }
    }
  };

  return {onExtract, onSave, loadingProgress};
};

export default useFFMPEG;
