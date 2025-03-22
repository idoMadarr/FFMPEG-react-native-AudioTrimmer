import React, {ReactNode} from 'react';
import {StyleSheet, Text} from 'react-native';

interface TextElementType {
  children: ReactNode;
  fontSize?: string;
  cStyle?: object;
}

const TextElement: React.FC<TextElementType> = ({
  children,
  fontSize,
  cStyle = {},
}) => {
  const setFontSize = (size: string = 'm') => {
    const fontSize =
      size === 'sm' ? 10 : size === 'm' ? 14 : size === 'lg' ? 18 : 26;

    return fontSize;
  };

  const styles = StyleSheet.create({
    constants: {
      fontSize: setFontSize(fontSize),
      color: 'white',
    },
  });

  return (
    <Text style={[styles.constants, {...cStyle}]} allowFontScaling={false}>
      {children}
    </Text>
  );
};

export default TextElement;
