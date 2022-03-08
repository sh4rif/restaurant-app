import React, {useState, useEffect, useContext} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';

import {BUTTON_GRADIENT, MAIN_COLOR} from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import {GET_AREAS, storageVarNames} from '../../constants';
import {MainContext} from '../../components/context';

const AreaOptionsScreen = ({navigation}) => {
  const [state, setState] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);

  const {setUserArea, user, setIsLoggedIn, baseURL, setBaseURL} =
    useContext(MainContext);

  useEffect(() => {
    getAreas();
    getSelectedArea();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      getAreas();
      getSelectedArea();
    });

    return unsubscribe;
  }, [navigation]);

  const getAreas = async () => {
    let url = baseURL;
    try {
      if (!baseURL) {
        const base_url = await AsyncStorageLib.getItem(storageVarNames.url);
        if (!base_url) {
          navigation.navigate('URLOptionsScreen');
          return;
        }
        setBaseURL(base_url);
        url = base_url;
      }
      const {data} = await axios.get(`${url}${GET_AREAS}`);
      setState([...data]);
    } catch (e) {
      console.log('error while fetching areas', e);
    }
  };

  const getSelectedArea = async () => {
    try {
      const area = await AsyncStorageLib.getItem(storageVarNames.area);
      setSelectedArea(JSON.parse(area));
      setUserArea(JSON.parse(area));
    } catch (e) {
      console.log('error while fetching area---', e);
    }
  };
  const setArea = async () => {
    if (!selectedArea) {
      Alert.alert('ERROR!!', 'Please Select an area');
      return;
    }
    try {
      const payload = JSON.stringify(selectedArea);
      await AsyncStorageLib.setItem(storageVarNames.area, payload);
      if (user) {
        setIsLoggedIn(true);
      } else {
        navigation.navigate('LoginScreen');
      }
    } catch (e) {}
  };

  const renderAreas = ({item, index}) => {
    const aid = selectedArea && selectedArea.AREA_ID;
    const bgColor = aid === item.AREA_ID ? MAIN_COLOR : '#fff';
    const fontColor = aid === item.AREA_ID ? '#fff' : '#000';
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedArea({...item});
        }}>
        <View
          style={{
            paddingHorizontal: 10,
            cursor: 'pointer',
            paddingVertical: 10,
            backgroundColor: bgColor,
            borderBottomRightRadius: state.length - 1 === index ? 10 : 0,
            borderBottomLeftRadius: state.length - 1 === index ? 10 : 0,
            borderTopRightRadius: index === 0 ? 10 : 0,
            borderTopLeftRadius: index === 0 ? 10 : 0,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: fontColor}}>
            {item.AREA_DESC}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={MAIN_COLOR} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Please Select An Area</Text>
        {/* <Text>{JSON.stringify(state)}</Text> */}
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <FlatList
          numColumns={1}
          keyExtractor={(item, index) => item.AREA_ID}
          data={state}
          renderItem={renderAreas}
        />

        {/* buttons */}
        <View style={styles.button}>
          <TouchableOpacity style={styles.signIn} onPress={setArea}>
            <LinearGradient colors={BUTTON_GRADIENT} style={styles.signIn}>
              <Text style={styles.textSign}>
                <FontAwesome name="door-open" size={25} /> SET AREA
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </SafeAreaView>
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
    flex: 9,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 20,
    letterSpacing: 3,
    fontWeight: 'bold',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
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
    letterSpacing: 1,
    color: '#fff',
  },
});

export default AreaOptionsScreen;
