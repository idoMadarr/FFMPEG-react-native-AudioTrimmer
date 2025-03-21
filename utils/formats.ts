import fs from 'react-native-fs';
import {RMSOptionType} from './types';

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

    const minHightWave = 0; // px
    const maxHightWave = 30; // px
    const minRMS = Math.min(...formattedRates);
    const maxRMS = Math.max(...formattedRates);

    const wavesArray = formattedRates.map(rate => {
      return convertRMSRatesToPixelHight({
        rmsLevel: rate,
        minRMS,
        maxRMS,
        minHight: minHightWave,
        maxHight: maxHightWave,
      });
    });

    console.log(wavesArray);
  } catch (error) {
    // return [];
    console.log(error);
  }
};

const convertRMSRatesToPixelHight = (rms: RMSOptionType) => {
  const {rmsLevel, minRMS, maxRMS, minHight, maxHight} = rms;

  const wavePosition = (rmsLevel - minRMS) / (maxRMS - minRMS);
  const waveHight = wavePosition * (maxHight - minHight) + minHight;
  return waveHight;
};
