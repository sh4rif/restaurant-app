import React, {useContext, useEffect} from 'react';
import axios from 'axios';
import {View, Text, StyleSheet, StatusBar, SafeAreaView} from 'react-native';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

import {MAIN_COLOR} from '../../constants/colors';
import {MainContext} from '../../components/context';
import ButtonComponent from '../../components/button';
import {blankOrder, GET_ITEMS, storageVarNames} from '../../constants';

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
      console.log('url for getting items', `${url}${GET_ITEMS}`);
      const {data} = await axios.get(`${url}${GET_ITEMS}`);
      console.log({want_to_run_this: data});
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
        <View style={styles.row2}>
          <Text style={{...styles.text, color: '#fff'}}>
            {user && user.full_name}
          </Text>
        </View>
        <View style={styles.row3}>
          <Text style={styles.text}>
            <ButtonComponent title="Take Order" onPress={onTakeOrderPress} />
          </Text>
        </View>
        <View style={styles.row4}>
          <View style={styles.row4col1}>
            {/* <Text style={styles.text}>{JSON.stringify(userArea)}</Text> */}
          </View>
          <View style={styles.row4col2}>
            {/* <Text style={styles.text}>8</Text> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    //   backgroundColor: '#00f',
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
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row3: {
    flex: 1,
    flexDirection: 'row',
    //   backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row4: {
    flex: 7,
    flexDirection: 'row',
    //   backgroundColor: 'blue',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  view1: {
    flex: 1,
    //   backgroundColor: '#0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  view2: {
    flex: 2,
    //   backgroundColor: '#f0f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  view3: {
    flex: 3,
    //   backgroundColor: '#ff0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row4col1: {
    flex: 1,
    //   backgroundColor: '#0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row4col2: {
    flex: 1,
    //   backgroundColor: '#f0f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 26,
    // color: '#fff',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
