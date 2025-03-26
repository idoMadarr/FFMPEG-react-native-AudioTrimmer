import React, {ReactNode} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {PRIMARY_COLOR} from '../../utils/types';

interface ButtonElementPropsType {
  children: ReactNode;
  onPress?(): void;
  enable?: boolean;
}

const ButtonElement: React.FC<ButtonElementPropsType> = ({
  children,
  onPress,
  enable = true,
}) => {
  const CustomeButtonElement = enable ? TouchableOpacity : View;
  return (
    <CustomeButtonElement
      onPress={onPress}
      style={[
        styles.buttonContainer,
        {
          borderColor: enable ? PRIMARY_COLOR : '#696969',
        },
      ]}>
      {children}
    </CustomeButtonElement>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').height * 0.065,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 8,
    margin: '2%',
  },
});

export default ButtonElement;
