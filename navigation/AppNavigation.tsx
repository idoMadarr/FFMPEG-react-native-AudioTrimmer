import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import AudioTrimmerScreen from '../screens/AudioTrimmerScreen';
import VideoSelectorScreen from '../screens/VideoSelectorScreen';
import VideoConvertorScreen from '../screens/VideoConvertorScreen';

type NavigationScreenParams = {
  ['video-selector']: undefined;
  ['video-convertor']: undefined;
  ['audio-trimmer']: undefined;
};

const AppNavigator = createNativeStackNavigator<NavigationScreenParams>();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <AppNavigator.Navigator>
        <AppNavigator.Screen
          name={'video-selector'}
          component={VideoSelectorScreen}
          options={{headerTitle: 'Video Selector'}}
        />
        <AppNavigator.Screen
          name={'video-convertor'}
          component={VideoConvertorScreen}
          options={{headerTitle: 'Video Convertor'}}
        />
        <AppNavigator.Screen
          name={'audio-trimmer'}
          component={AudioTrimmerScreen}
          options={{headerTitle: 'Audio Trimmer'}}
        />
      </AppNavigator.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
