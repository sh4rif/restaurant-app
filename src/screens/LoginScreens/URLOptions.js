import React, {useState, useEffect} from 'react';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import {useTheme} from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import DismissKeyboard from '../../components/DismissKeyboard';
import {BUTTON_GRADIENT, ERR_CLR, MAIN_COLOR} from '../../constants/colors';
import {baseURL, storageVarNames} from '../../constants';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

const URLOptionsScreen = ({navigation}) => {
  const {colors} = useTheme();
  const [url, setUrl] = useState(baseURL);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      getStoredUrl();
    });

    return unsubscribe;
  }, []);

  const getStoredUrl = async () => {
    try {
      const url = await AsyncStorageLib.getItem(storageVarNames.url);
      setUrl(url || 'http://192.168.2.15/api/');
    } catch (e) {}
  };

  const setUrlOnPress = async () => {
    let address = url;
    if (!url.endsWith('/')) {
      address = address + '/';
    }
    try {
      await AsyncStorageLib.setItem(storageVarNames.url, address);
      navigation.navigate('LoginScreen');
    } catch (e) {
      console.log('error:-', e);
    }
  };
  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={MAIN_COLOR} barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>URL Option!</Text>
          {/* <Text>{JSON.stringify(state)}</Text> */}
        </View>
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          {/* username field */}
          <Text style={styles.text_footer}>URL</Text>
          <View style={styles.action}>
            <Feather name="user" color={colors.text} size={20} />
            <TextInput
              placeholder="http(s)://yourdomain.com/"
              placeholderTextColor="#666666"
              returnKeyType="next"
              style={{...styles.textInput, color: colors.text}}
              autoCapitalize="none"
              onChangeText={val => setUrl(val)}
              value={url}
            />
            <Animatable.View animation="bounceIn">
              <Feather
                name={url ? 'check-circle' : 'x-circle'}
                color={url ? MAIN_COLOR : ERR_CLR}
                size={20}
              />
            </Animatable.View>
          </View>

          {/* buttons */}
          <View style={styles.button}>
            <TouchableOpacity style={styles.signIn} onPress={setUrlOnPress}>
              <LinearGradient colors={BUTTON_GRADIENT} style={styles.signIn}>
                <Text style={{...styles.textSign, color: '#fff'}}>
                  <FontAwesome name="door-open" size={25} /> Set URL
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </SafeAreaView>
    </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: ERR_CLR,
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: ERR_CLR,
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default URLOptionsScreen;
