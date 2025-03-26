import React from 'react';
import {Alert, Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
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
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const errorObj = error as {code: string};
        if (errorObj.code.includes('CANCELLED')) return;
      }

      Alert.alert('Error:', JSON.stringify(error));
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.titleContainer}>
        <TextElement fontSize={'xl'}>Upload Video File</TextElement>
        <TextElement cStyle={styles.title}>
          Easily extract audio from any video and trim it to perfection. Select
          your clip, cut the best part, and export in high quality.
        </TextElement>
      </View>
      <ButtonElement onPress={uploadFile}>
        <FontAwesomeIcon name={'upload'} size={22} style={styles.icon} />
        <TextElement>Select</TextElement>
      </ButtonElement>
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
  titleContainer: {
    width: Dimensions.get('window').width * 0.85,
    alignItems: 'center',
    marginVertical: '6%',
  },
  title: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 6,
    color: 'white',
  },
});

export default VideoSelectorScreen;
