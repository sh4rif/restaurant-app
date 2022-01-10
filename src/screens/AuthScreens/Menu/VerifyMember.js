import React, {forwardRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {MAIN_COLOR} from '../../../constants/colors';

const TextField = forwardRef(
  ({placeholder, style, autoCapitalize, onChangeText}, ref) => {
    return (
      <TextInput
        ref={ref}
        placeholder={placeholder}
        placeholderTextColor="#CCC"
        style={{...styles.textInput, color: colors.text, ...style}}
        autoCapitalize={autoCapitalize || 'characters'}
        onChangeText={onChangeText}
      />
    );
  },
);

const VerifyMember = ({onPress, onChangeText, ref}) => {
  const {colors} = useTheme();
  const [state, setState] = React.useState(null);

  return (
    <View style={styles.row}>
      <Text style={styles.memberLabel}>Member ID : </Text>
      <TextInput
        ref={ref}
        placeholder="i.e R-123"
        placeholderTextColor="#CCC"
        style={{...styles.textInput, color: colors.text}}
        autoCapitalize="characters"
        onChangeText={onChangeText}
      />
      {/* <TextField placeholder="i.e R-123"  /> */}
      <TouchableOpacity style={styles.button} onPress={() => onPress(state)}>
        <Text style={{...styles.text}}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  memberLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    marginTop: 10,
    marginTop: Platform.OS === 'ios' ? 0 : -2,
    paddingLeft: 10,
    color: '#05375a',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 45,
    width: '45%',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#20315f',
    color: '#fff',
    letterSpacing: 3,
  },
  button: {
    backgroundColor: MAIN_COLOR,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
  },
});

export default VerifyMember;
