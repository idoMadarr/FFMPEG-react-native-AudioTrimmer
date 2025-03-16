import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextElement from '../components/Resuable/TextElement';
import {RootStackParamList} from '../utils/types';
import ButtonElement from '../components/Resuable/ButtonElement';
import {extractUrlString} from '../utils/formats';

type VideoConvertorRouteType = RouteProp<RootStackParamList, 'video-convertor'>;

const VideoConvertorScreen: React.FC<{route: VideoConvertorRouteType}> = ({
  route,
}) => {
  const onConvert = () => {
    const path = route.params.video.sourceURL || route.params.video.path;
    const {name, extension} = extractUrlString(path, {
      seperatedValues: true,
    }) as {name: string; extension: string};

    const newFilename = `${name}_${Date.now()}_${extension}`;
    console.log(newFilename);
  };

  return (
    <View style={styles.screen}>
      <ButtonElement onPress={onConvert}>
        <Icon name={'video-file'} size={34} />
        <TextElement fontSize={'lg'}>Convert</TextElement>
      </ButtonElement>
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
