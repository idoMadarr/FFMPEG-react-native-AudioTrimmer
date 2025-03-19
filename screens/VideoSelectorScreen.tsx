import React from 'react';
import {Alert, SafeAreaView, StyleSheet, View} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import ButtonElement from '../components/Resuable/ButtonElement';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import TextElement from '../components/Resuable/TextElement';
import {navigate} from '../utils/navigationRef';

const VideoSelectorScreen = () => {
  const uploadFile = async () => {
    try {
      const videoFile = await ImageCropPicker.openPicker({mediaType: 'video'});
      if (videoFile) {
        return navigate('video-convertor', {video: videoFile});
      }
    } catch (error) {
      Alert.alert('Error:', JSON.stringify(error));
    }
  };

  const openCamera = async () => {
    try {
      const videoFile = await ImageCropPicker.openCamera({});
      if (videoFile) {
        console.log('video', videoFile);
        return;
      }
    } catch (error) {
      Alert.alert('Error:', JSON.stringify(error));
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TextElement fontSize={'xl'}>Select your video file:</TextElement>
      <View style={styles.row}>
        <ButtonElement onPress={uploadFile}>
          <FontAwesomeIcon name={'upload'} size={22} style={styles.icon} />
          <TextElement fontSize={'lg'}>Select</TextElement>
        </ButtonElement>
        <ButtonElement onPress={openCamera}>
          <FontAwesomeIcon name={'camera'} size={22} style={styles.icon} />
          <TextElement fontSize={'lg'}>Camera</TextElement>
        </ButtonElement>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 0.85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 6,
  },
});

export default VideoSelectorScreen;
