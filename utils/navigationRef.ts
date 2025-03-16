import {
  createNavigationContainerRef,
  DrawerActions,
} from '@react-navigation/native';
import {RootStackParamList} from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigationReady = () => navigationRef.isReady();

export const navigate = <T extends keyof RootStackParamList>(
  screen: T,
  payload?: RootStackParamList[T],
) => {
  navigationRef.navigate(screen, payload as any);
};

export const openDrawer = () => {
  navigationRef.dispatch(DrawerActions.openDrawer());
};

export const closeDrawer = () => {
  navigationRef.dispatch(DrawerActions.closeDrawer());
};

export const getCurrentRoute = () => {
  navigationRef.getCurrentRoute();
};

export const goBack = () => {
  navigationRef.goBack();
};
