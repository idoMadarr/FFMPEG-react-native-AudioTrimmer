import {useState} from 'react';
import {Alert} from 'react-native';
import fs from 'react-native-fs';
import {FFmpegKit, FFprobeKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {calcConvertingProgress, extractUrlString} from '../utils/formats';
import {ConvertedFileType} from '../utils/types';

const useFFMPEG = () => {
  const [convertedFile, setConvertedFile] = useState<ConvertedFileType>();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [availableRates, setAvailableAudioRates] = useState(false);

  // Extract audio from video file:
  // MP4: When you open an MP4, the system assumes it's a video file and plays it in the default media player.
  // MP3: When you open an MP3, the system assumes it's audio-only and suggests a dedicated music player (Spotify, SoundCloud, etc.).
  const onExtract = async (path: string, savedFileName: string) => {
    try {
      // Rates
      setAvailableAudioRates(false);
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
            const ratesPath = (await storeAudioRates(
              newCacheFilePath,
            )) as string;
            setAvailableAudioRates(true);
            return setConvertedFile({
              name: `${savedFileName}.mp4`,
              path: convertedCachesFilePath,
              ratesPath,
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

  const storeAudioRates = async (path: string) => {
    try {
      // Storing audio rates inside CachesDir
      // Audio rates looks like this:
      // frame:52   pts:154720  pts_time:3.50839
      // lavfi.astats.Overall.RMS_level=-31.166752
      // frame:53   pts:157660  pts_time:3.57506
      // lavfi.astats.Overall.RMS_level=-33.684179
      // frame:54   pts:160600  pts_time:3.64172
      // lavfi.astats.Overall.RMS_level=-31.354921
      const cachesDir = fs.CachesDirectoryPath;
      const filename = `${Date.now()}_log.txt`;
      const outputPath = `${cachesDir}/${filename}`;

      const AUDIO_SIZE = 15;
      // 44.1 kHz
      const samples = 44100 / AUDIO_SIZE;

      const ffmpegCommand = `-i ${path} -af asetnsamples=${samples},astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=${outputPath} -f null -`;

      await FFmpegKit.execute(ffmpegCommand);
      return outputPath;
    } catch (error) {
      console.log('Error:', JSON.stringify(error));
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
        return true;
      } catch (error) {
        Alert.alert('Error', 'Operation failed, audio file can not be saved.');
        return false;
      }
    }
  };

  return {convertedFile, onExtract, onSave, availableRates, loadingProgress};
};

export default useFFMPEG;
