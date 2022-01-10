import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import { MAIN_COLOR } from '../constants/colors';

const ButtonComponent = ({title, onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={{...styles.text}}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    // fontFamily: 'Inter-Bold',
  },
  button: {
    backgroundColor: MAIN_COLOR,
    height: 42,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 8,
  },
});

export default ButtonComponent;
