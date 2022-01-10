import React, {useState, useContext, useRef, useEffect} from 'react';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import {useTheme} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
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

import DismissKeyboard from '../../components/DismissKeyboard';
import {MainContext} from '../../components/context';
import {BUTTON_GRADIENT, ERR_CLR, MAIN_COLOR} from '../../constants/colors';

const LoginScreen = ({navigation}) => {
  const [showPwd, setShowPwd] = useState(true);
  const [checkTextInputChange, setCheckTextInputChange] = useState(false);
  const [loginURL, setLoginURL] = useState(null);

  const [state, setState] = useState({username: '', password: ''});
  const {signIn, setUserToken} = useContext(MainContext);
  const {colors} = useTheme();

  const passwordRef = useRef();

  const onChangeHandler = (name, value) => {
    setState({...state, [name]: value});
    if (value.trim().length !== 0) {
      setCheckTextInputChange(true);
    } else {
      setCheckTextInputChange(false);
    }
    // Alert.alert('value', value);
  };

  useEffect(() => {
    getLoginURL();
  }, []);

  const getLoginURL = async () => {
    try {
      const url = await AsyncStorageLib.getItem('url');
      if (url) {
        setLoginURL(url);
        console.log('url found', url);
        return;
      }
      navigation.navigate('OptionsScreen', {screen: 'URLOptionsScreen'});
    } catch (e) {
      console.log('error occured while fetching url from localstorage', e);
    }
  };

  const loginHandler = (username, password) => {
    const res = signIn(username, password);
    if(res){
      console.log('redirect to home screen')
      setUserToken(true)
      return;
    }
    console.log('error show here')
  };
  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={MAIN_COLOR} barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Welcome!</Text>
          {/* <Text>{JSON.stringify(state)}</Text> */}
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
            />
            {checkTextInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          <Animatable.View animation="fadeInLeft" duration={300}>
            <Text style={styles.errorMsg}>Invalid username or password!</Text>
          </Animatable.View>

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
              onChangeText={val => {
                // console.log('val--', val);
                onChangeHandler('password', val);
              }}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => {
                setShowPwd(!showPwd);
              }}>
              <Feather
                name={showPwd ? 'eye-off' : 'eye'}
                color="gray"
                size={20}
              />
            </TouchableOpacity>
          </View>

          {/* buttons */}
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => {
                loginHandler(state.username, state.password);
                // signIn();
              }}>
              <LinearGradient colors={BUTTON_GRADIENT} style={styles.signIn}>
                <Text style={{...styles.textSign, color: '#fff'}}>
                  <FontAwesome name="door-open" size={25} /> Sign In
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('OptionsScreen', {
                  screen: 'URLOptionsScreen',
                });
              }}
              style={{
                ...styles.signIn,
                borderColor: MAIN_COLOR,
                borderWidth: 1,
                marginTop: 15,
              }}>
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
});

export default LoginScreen;
