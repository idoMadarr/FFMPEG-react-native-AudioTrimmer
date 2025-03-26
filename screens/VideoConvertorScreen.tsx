import React, {Fragment, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TextElement from '../components/Resuable/TextElement';
import {RootStackParamList} from '../utils/types';
import ButtonElement from '../components/Resuable/ButtonElement';
import LoadingProgress from '../components/LoadingProgress/LoadingProgress';
import useFFMPEG from '../hooks/useFFMPEG';
import {navigate} from '../utils/navigationRef';
import {calcAudioRates} from '../utils/formats';

type VideoConvertorRouteType = RouteProp<RootStackParamList, 'video-convertor'>;

const VideoConvertorScreen: React.FC<{route: VideoConvertorRouteType}> = ({
  route,
}) => {
  const [savedFileName, setSavedFileName] = useState('');
  const [anotherFile, setAnotherFile] = useState(false);

  const {
    onExtract,
    onTrim,
    onSave,
    convertedFile,
    availableRates,
    loadingProgress,
  } = useFFMPEG();

  const extractAudio = async () => {
    if (savedFileName.length) {
      const path = route.params.video.sourceURL || route.params.video.path;
      onExtract(path, savedFileName);
    }
  };

  const storeAudioFile = async () => {
    const result = await onSave();
    if (result) setAnotherFile(_ => true);
  };

  const selectAnother = () => {
    setAnotherFile(false);
    navigate('video-selector');
  };

  const trimNavigate = async () => {
    if (convertedFile) {
      const wavesArray = await calcAudioRates(convertedFile.ratesPath);
      navigate('audio-trimmer', {
        waves: wavesArray,
        path: convertedFile.path,
        onTrim,
      });
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {loadingProgress === 0 && (
        <Fragment>
          <ButtonElement
            onPress={extractAudio}
            enable={savedFileName.length ? true : false}>
            <MaterialCommunityIcon
              name={'filmstrip'}
              size={26}
              style={styles.icon}
            />
            <TextElement>Extract</TextElement>
          </ButtonElement>
          <TextInput
            value={savedFileName}
            onChangeText={setSavedFileName}
            placeholder={'File name'}
            placeholderTextColor={'white'}
            style={styles.textinput}
          />
        </Fragment>
      )}

      {loadingProgress > 99 && (
        <Fragment>
          <ButtonElement onPress={anotherFile ? selectAnother : storeAudioFile}>
            <MaterialIcons
              name={anotherFile ? 'upload' : 'save'}
              size={34}
              style={styles.icon}
            />
            <TextElement>{anotherFile ? 'Select New' : 'Save'}</TextElement>
          </ButtonElement>
          <ButtonElement onPress={availableRates ? trimNavigate : undefined}>
            {availableRates ? (
              <Fragment>
                <MaterialIcons
                  name={'content-cut'}
                  size={30}
                  style={styles.icon}
                />
                <TextElement>Trim</TextElement>
              </Fragment>
            ) : (
              <View>
                <ActivityIndicator size={'small'} color={'white'} />
                <TextElement fontSize={'sm'}>LOADING RATES</TextElement>
              </View>
            )}
          </ButtonElement>
        </Fragment>
      )}

      {loadingProgress > 0 && loadingProgress < 99 && (
        <LoadingProgress progress={loadingProgress} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  icon: {
    marginHorizontal: 6,
    color: 'white',
  },
  textinput: {
    paddingLeft: '5%',
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').height * 0.065,
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
  },
});

export default VideoConvertorScreen;
