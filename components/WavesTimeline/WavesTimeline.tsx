import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import TextElement from '../Resuable/TextElement';

interface WavesTimelinePropsType {
  waves: number[];
}

const WavesTimeline: React.FC<WavesTimelinePropsType> = ({waves}) => {
  return (
    <View style={styles.timelineContainer}>
      <TextElement fontSize={'lg'}>Timeline:</TextElement>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        <View style={styles.rails}>
          {waves.map((rate, index) => {
            return (
              <View
                key={index}
                style={{
                  height: rate,
                  width: 2,
                  backgroundColor: 'gray',
                  marginRight: 4,
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  timelineContainer: {
    height: Dimensions.get('window').height * 0.15,
  },
  rails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default WavesTimeline;
