import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {MAIN_COLOR} from '../constants/colors';

const ButtonComponent = ({title, onPress, style, textStyle}) => {
  return (
    <TouchableOpacity style={{...styles.button, ...style}} onPress={onPress}>
      <Text style={{...styles.text, ...textStyle}}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: '#fff',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    // fontFamily: 'Inter-Bold',
  },
  button: {
    backgroundColor: MAIN_COLOR,
    height: 50,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 8,
  },
});

export default ButtonComponent;
