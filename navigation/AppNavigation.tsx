import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from '../utils/navigationRef';
import AudioTrimmerScreen from '../screens/AudioTrimmerScreen';
import VideoSelectorScreen from '../screens/VideoSelectorScreen';
import VideoConvertorScreen from '../screens/VideoConvertorScreen';
import {RootStackParamList} from '../utils/types';

const AppNavigator = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
      <AppNavigator.Navigator screenOptions={{headerShown: false}}>
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
