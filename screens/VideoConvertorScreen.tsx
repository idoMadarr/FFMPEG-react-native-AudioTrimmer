import React from 'react';
import {StyleSheet, View} from 'react-native';
import TextElement from '../components/Resuable/TextElement';

const VideoConvertorScreen = () => {
  return (
    <View style={styles.screen}>
      <TextElement>VideoConvertor Screen</TextElement>
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
