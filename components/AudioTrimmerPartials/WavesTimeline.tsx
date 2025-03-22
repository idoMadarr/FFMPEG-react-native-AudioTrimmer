import React, {ReactNode} from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {StylesContstant} from '../../utils/types';

interface WavesTimelinePropsType {
  children: ReactNode;
}

const WavesTimeline: React.FC<WavesTimelinePropsType> = ({children}) => {
  return (
    <View style={styles.timelineContainer}>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        <View style={styles.constantRails}>{children}</View>
        <View style={styles.activeRails}>{children}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  timelineContainer: {
    height: Dimensions.get('window').height * 0.15,
  },
  constantRails: {
    height: StylesContstant.WAVE_HIGHT,
    flexDirection: 'row',
  },
  activeRails: {
    height: StylesContstant.WAVE_HIGHT,
    width: '10%',
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: 'rgba(0, 45, 207, 0.65)',
    overflow: 'hidden',
  },
});

export default WavesTimeline;
