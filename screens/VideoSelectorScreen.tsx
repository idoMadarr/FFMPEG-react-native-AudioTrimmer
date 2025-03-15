import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import ButtonElement from '../components/Resuable/ButtonElement';
import Icon from 'react-native-vector-icons/FontAwesome';
import TextElement from '../components/Resuable/TextElement';

const VideoSelectorScreen = () => {
  const uploadFile = async () => {
    try {
      const videoFile = await ImageCropPicker.openPicker({mediaType: 'video'});
      if (videoFile) {
        console.log('video', videoFile);
        return;
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const openCamera = async () => {
    try {
      const videoFile = await ImageCropPicker.openCamera({});
      if (videoFile) {
        console.log('video', videoFile);
        return;
      }
      console.log('not yet');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TextElement fontSize={'xl'}>Select your video file:</TextElement>
      <View style={styles.row}>
        <ButtonElement onPress={uploadFile}>
          <Icon name={'upload'} size={34} />
          <TextElement fontSize={'lg'}>Upload</TextElement>
        </ButtonElement>
        <ButtonElement onPress={openCamera}>
          <Icon name={'camera'} size={34} />
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
});

export default VideoSelectorScreen;
