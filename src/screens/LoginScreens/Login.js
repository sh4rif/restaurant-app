import React, {useState, useContext, useRef, useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import {useTheme} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from 'react-native';

import DismissKeyboard from '../../components/DismissKeyboard';
import {MainContext} from '../../components/context';
import {BUTTON_GRADIENT, ERR_CLR, MAIN_COLOR} from '../../constants/colors';
import {LOGIN, storageVarNames} from '../../constants';

const LoginScreen = ({navigation}) => {
  const [showPwd, setShowPwd] = useState(true);
  const [checkTextInputChange, setCheckTextInputChange] = useState(false);
  // const [baseURL, setBaseURL] = useState(null);
  const [state, setState] = useState({
    tag: 'login',
    username: '',
    password: '',
  });
  const {
    signIn,
    userArea,
    isLoggedIn,
    setIsLoggedIn,
    setUserArea,
    baseURL,
    setBaseURL,
  } = useContext(MainContext);
  const {colors} = useTheme();

  const passwordRef = useRef();

  const onChangeHandler = (name, value) => {
    setState({...state, [name]: value});
    if (value.trim().length !== 0) {
      setCheckTextInputChange(true);
    } else {
      setCheckTextInputChange(false);
    }
  };

  useEffect(() => {
    // AsyncStorageLib.clear();
    // AsyncStorageLib.removeItem(storageVarNames.area);
    // AsyncStorageLib.removeItem(storageVarNames.url);
    const unsubscribe = navigation.addListener('focus', e => {
      getLoginURL();
    });

    return unsubscribe;
  }, [navigation]);

  const openOptions = () => {
    navigation.navigate('OptionsScreen', {screen: 'AreaOptionsScreen'});
  };

  const getLoginURL = async () => {
    try {
      const url = await AsyncStorageLib.getItem(storageVarNames.url);
      if (!url) {
        navigation.navigate('OptionsScreen', {screen: 'URLOptionsScreen'});
        return;
      }
      setBaseURL(url);
    } catch (e) {
      console.log('error occured while fetching url from localstorage', e);
    }
  };

  const loginHandler = async () => {
    try {
      const {data} = await axios.post(`${baseURL}${LOGIN}`, state);
      if (data.error !== 0) {
        Alert.alert('ERROR!!', data.error_msg);
        return;
      }
      signIn(data);
      const area = await AsyncStorageLib.getItem(storageVarNames.area);
      if (area) {
        setUserArea(JSON.parse(area));
        setIsLoggedIn(true);
      } else {
        navigation.navigate('OptionsScreen', {screen: 'AreaOptionsScreen'});
      }
    } catch (e) {
      console.log('Error Occured 5 -- ', e);
    }
  };
  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={MAIN_COLOR} barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Welcome To Defence Clubs</Text>
        </View>
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          {/* username field */}
          <Text style={styles.text_footer}>Username</Text>
          <View style={styles.action}>
            <Feather name="user" color={colors.text} size={20} />
            <TextInput
              placeholder="Username"
              placeholderTextColor="#666666"
              returnKeyType="next"
              style={{...styles.textInput, color: colors.text}}
              autoCapitalize="none"
              onChangeText={val => onChangeHandler('username', val)}
              // onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
              onSubmitEditing={() => {
                passwordRef.current.focus();
              }}
              blurOnSubmit={false}
              value={state.username}
            />
            {checkTextInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          {/* <Animatable.View animation="fadeInLeft" duration={300}>
            <Text style={styles.errorMsg}>Invalid username or password!</Text>
          </Animatable.View> */}

          {/* password field */}
          <Text style={{...styles.text_footer, marginTop: 35}}>Password</Text>
          <View style={styles.action}>
            <Feather name="lock" color={colors.text} size={20} />
            <TextInput
              ref={passwordRef}
              placeholder="Password"
              secureTextEntry={showPwd}
              placeholderTextColor="#666666"
              style={{...styles.textInput, color: colors.text}}
              onChangeText={val => onChangeHandler('password', val)}
              autoCapitalize="none"
              value={state.password}
            />
            <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
              <Feather
                name={showPwd ? 'eye-off' : 'eye'}
                color="gray"
                size={20}
              />
            </TouchableOpacity>
          </View>

          {/* buttons */}
          <View style={styles.button}>
            <TouchableOpacity style={styles.signIn} onPress={loginHandler}>
              <LinearGradient colors={BUTTON_GRADIENT} style={styles.signIn}>
                <Text style={{...styles.textSign, color: '#fff'}}>
                  <FontAwesome name="door-open" size={25} /> Sign In
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openOptions}
              style={{...styles.signIn, ...styles.optionBtn}}>
              <Text style={{...styles.textSign, color: MAIN_COLOR}}>
                <FontAwesome name="user-cog" size={25} /> Options
              </Text>
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
    // alignItems: 'center',
    // justifyContent: 'center',
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
  optionBtn: {
    borderColor: MAIN_COLOR,
    borderWidth: 1,
    marginTop: 15,
  },
});

export default LoginScreen;
