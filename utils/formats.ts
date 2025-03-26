import {Alert} from 'react-native';
import fs from 'react-native-fs';
import {RMSOptionType, StylesContstant} from './types';

type ExtractUrlConfig = {
  trimExt?: boolean;
  seperatedValues?: boolean;
};

const defaultExtractUrlConfig = {
  trimExt: false,
  seperatedValues: false,
};

export const extractUrlString = (
  path: string,
  config: ExtractUrlConfig = defaultExtractUrlConfig,
) => {
  const splittedPath = path.split('/');
  const filePath = splittedPath[splittedPath.length - 1];
  const [fileName, fileExtension] = filePath.split('.');
  const formattedFileName = fileName.replace(/[^a-zA-Z0-9]/g, '_');

  const file = `${formattedFileName}.${fileExtension}`;

  if (config.seperatedValues)
    return {name: formattedFileName, extension: fileExtension};
  if (config.trimExt) return formattedFileName;
  return file;
};

type RangeOptions = {
  value: number;
  inputMin: number;
  inputMax: number;
  outputMin: number;
  outputMax: number;
};

export const calcConvertingProgress = (options: RangeOptions) => {
  const {value, inputMin, inputMax, outputMin, outputMax} = options;
  const progress =
    ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) +
    outputMin;

  if (progress === Infinity || progress < outputMin) return outputMin;
  if (progress > outputMax) return outputMax;

  return progress;
};

// Creating "waves" for the audio rates (UI).
export const calcAudioRates = async (path: string) => {
  try {
    const rates = await fs.readFile(path, 'utf8');
    const ratesArray = rates.split('\n');

    // RMS_level array ["-20.594370", "-41.6932370", ...] each number present decibels [0 - high, -xx - low]
    const formattedRates = ratesArray.reduce<number[]>((acc, cur: string) => {
      if (cur.includes('RMS_level=')) {
        return [...acc, parseFloat(cur.split('RMS_level=')[1])];
      }
      return acc;
    }, []);

    const pureRates = formattedRates.filter(rate => {
      if (!isNaN(rate)) {
        return rate;
      }
    });

    const minHightWave = 0; // px
    const maxHightWave = StylesContstant.WAVE_MAX_HIGHT - 10; // px
    const minRMS = Math.min(...pureRates);
    const maxRMS = Math.max(...pureRates);

    const wavesArray = formattedRates.map(rate => {
      return convertRMSRatesToPixelHight({
        rmsLevel: isNaN(rate) ? minRMS : rate,
        minRMS,
        maxRMS,
        minHight: minHightWave,
        maxHight: maxHightWave,
      });
    });

    return wavesArray;
  } catch (error) {
    Alert.alert('Error', JSON.stringify(error));
    return [];
  }
};

const convertRMSRatesToPixelHight = (rms: RMSOptionType) => {
  const {rmsLevel, minRMS, maxRMS, minHight, maxHight} = rms;

  const wavePosition = (rmsLevel - minRMS) / (maxRMS - minRMS);
  const waveHight = wavePosition * (maxHight - minHight) + minHight;
  return waveHight;
};

export const calcMinAndMaxValues = (
  leftThumbPositionX: number,
  rightThumbPositionX: number,
  min: number,
  max: number,
  step: number,
  sliderWidth: number,
) => {
  'worklet';
  const minSliderValueNormalized = leftThumbPositionX / sliderWidth;
  const stepsInRange = (max - min) / step;
  const stepsFromMin = minSliderValueNormalized * stepsInRange;
  const roundedStepsMin = Math.floor(stepsFromMin);
  const minValue = min + roundedStepsMin * step;

  const maxSliderValueNormalized = rightThumbPositionX / sliderWidth;
  const stepsFromMax = maxSliderValueNormalized * stepsInRange;
  const roundedStepsMax = Math.floor(stepsFromMax);
  const maxValue = min + roundedStepsMax * step;

  return {minValue: minValue, maxValue: maxValue};
};

export const waveToTimestamp = (wave: number, wavePerSecond: number) => {
  const totalSeconds = wave / wavePerSecond;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const centiSeconds = Math.floor((totalSeconds % 1) * 100);

  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  const formattedCentiSeconds = centiSeconds.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}:${formattedCentiSeconds}`;
};
