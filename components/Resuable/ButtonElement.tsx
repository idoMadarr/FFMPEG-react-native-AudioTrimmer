import React, {ReactNode} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';

interface ButtonElementPropsType {
  children: ReactNode;
  onPress?(): void;
}

const ButtonElement: React.FC<ButtonElementPropsType> = ({
  children,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').height * 0.065,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2e6eee',
    borderRadius: 8,
    margin: '2%',
  },
});

export default ButtonElement;
