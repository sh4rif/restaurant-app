import React, {useContext, useEffect} from 'react';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

import {MAIN_COLOR, SUCCESS_COLOR} from '../../constants/colors';
import {MainContext} from '../../components/context';
import ButtonComponent from '../../components/button';
import {GET_ITEMS, storageVarNames} from '../../constants';
const blankOrder = {
  id: '',
  empno: '',
  qot: '',
  table_id: '',
  order_id: '',
  order_no: '',
  order_date: '',
  member_id: '',
  order: [],
};

const HomeScreen = ({navigation}) => {
  const {state, setState, user, setOrder, baseURL, setBaseURL} =
    useContext(MainContext);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      getData();
    });

    return unsubscribe;
  }, [navigation]);

  const getData = async () => {
    try {
      let url = baseURL;
      if (!baseURL) {
        const base_url = await AsyncStorageLib.getItem(storageVarNames.url);
        url = base_url;
        setBaseURL(base_url);
      }
      const {data} = await axios.get(`${url}${GET_ITEMS}`);
      setState({
        ...state,
        items: data.items,
        classes: data.classes,
      });
      setOrder({...blankOrder});
    } catch (e) {
      console.log('error occured 1---', e.message);
    }
  };

  const onTakeOrderPress = () => {
    navigation.navigate('Tables');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={MAIN_COLOR} barStyle="light-content" />
      <View style={styles.body}>
        <View style={styles.row1}>
          <View style={styles.view3}>
            <Text style={styles.text}>Date : {user && user.wdate}</Text>
          </View>
          <View style={styles.view3}>
            <Text style={styles.text}>
              Login Time: {user && user.login_time}
            </Text>
          </View>
        </View>
        {/* <View style={styles.row2}>
          <Text style={{...styles.text, color: '#fff'}}>
            {user && user.full_name}
          </Text>
        </View> */}
        <View style={styles.row2}>
          <TouchableOpacity onPress={onTakeOrderPress}>
            <Text style={{...styles.text, color: '#fff'}}>
              {user && user.full_name}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row3}>
          <ButtonComponent
            title="Take Order"
            onPress={onTakeOrderPress}
            style={{width: '100%', height: 70}}
          />
        </View>
        <View style={styles.row4}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={{width: 300, height: 300}}
          />
        </View>
        <View style={styles.row3}>
          <View style={styles.row4col1}></View>
          <View style={styles.row4col2}></View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
  row1: {
    flex: 1,
    flexDirection: 'row',
  },
  row2: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: SUCCESS_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row3: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row4: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  view1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view2: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view3: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row4col1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row4col2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 26,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
