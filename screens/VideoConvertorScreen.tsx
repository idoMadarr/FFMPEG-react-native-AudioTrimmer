import React, {Fragment, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TextElement from '../components/Resuable/TextElement';
import {RootStackParamList} from '../utils/types';
import ButtonElement from '../components/Resuable/ButtonElement';
import LoadingProgress from '../components/LoadingProgress/LoadingProgress';
import useFFMPEG from '../hooks/useFFMPEG';

type VideoConvertorRouteType = RouteProp<RootStackParamList, 'video-convertor'>;

const VideoConvertorScreen: React.FC<{route: VideoConvertorRouteType}> = ({
  route,
}) => {
  const [savedFileName, setSavedFileName] = useState('');

  const {onExtract, onSave, loadingProgress} = useFFMPEG();

  const extractAudio = async () => {
    if (savedFileName.length) {
      const path = route.params.video.sourceURL || route.params.video.path;
      onExtract(path, savedFileName);
    }
  };

  const onTrim = async () => {};

  return (
    <View style={styles.screen}>
      {loadingProgress === 0 && (
        <Fragment>
          <ButtonElement
            onPress={extractAudio}
            enable={savedFileName.length ? true : false}>
            <MaterialCommunityIcon
              name={'filmstrip'}
              size={34}
              style={styles.icon}
            />
            <TextElement fontSize={'lg'}>Extract</TextElement>
          </ButtonElement>
          <TextInput
            value={savedFileName}
            onChangeText={setSavedFileName}
            placeholder={'File name'}
          />
        </Fragment>
      )}

      {loadingProgress > 99 && (
        <Fragment>
          <ButtonElement onPress={onSave}>
            <Icon name={'save'} size={34} style={styles.icon} />
            <TextElement fontSize={'lg'}>Save</TextElement>
          </ButtonElement>
          <ButtonElement onPress={onTrim}>
            <Icon name={'content-cut'} size={34} style={styles.icon} />
            <TextElement fontSize={'lg'}>Trim</TextElement>
          </ButtonElement>
        </Fragment>
      )}

      {loadingProgress > 0 && loadingProgress < 99 && (
        <LoadingProgress progress={loadingProgress} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 6,
  },
});

export default VideoConvertorScreen;
