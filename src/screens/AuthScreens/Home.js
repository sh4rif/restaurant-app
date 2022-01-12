import AsyncStorageLib from '@react-native-async-storage/async-storage';
import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, StatusBar, SafeAreaView} from 'react-native';
import ButtonComponent from '../../components/button';
import {MainContext} from '../../components/context';
import {GET_ITEMS, storageVarNames} from '../../constants';
import axios from '../../constants/axiosClient';
import {MAIN_COLOR} from '../../constants/colors';

const HomeScreen = ({navigation}) => {
  const {state, setState, user, userArea, signOut} = useContext(MainContext);

  useEffect(() => {
    console.log('home component did mout ran', state);
    getData();
  }, []);

  const getData = async () => {
    try {
      const {data} = await axios.get(GET_ITEMS);
      setState({
        ...state,
        items: data.items,
        classes: data.classes,
      });
    } catch (e) {
      console.log('error occured 1---', e.message);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={MAIN_COLOR} barStyle="light-content" />
      <View style={styles.body}>
        <View style={styles.row1}>
          {/* <View style={styles.view1}>
        <Text style={styles.text}>1</Text>
        </View>
        <View style={styles.view2}>
        <Text style={styles.text}>2</Text>
        </View> */}
          <View style={styles.view3}>
            <Text style={styles.text}>Thur 30/12/2021</Text>
          </View>
          <View style={styles.view3}>
            <Text style={styles.text}>Login Time: 15:26</Text>
          </View>
        </View>
        <View style={styles.row2}>
          <Text style={{...styles.text, color: '#fff'}}>
            Muhammad Usman Sharif
          </Text>
        </View>
        <View style={styles.row3}>
          <Text style={styles.text}>
            <ButtonComponent
              title="Take Order"
              onPress={() => {
                // navigation.navigate('Tables');
                console.log({state, user, userArea})
                AsyncStorageLib.clear();
                AsyncStorageLib.removeItem(storageVarNames.area);
                signOut();
              }}
            />
          </Text>
        </View>
        <View style={styles.row4}>
          <View style={styles.row4col1}>
            {/* <Text style={styles.text}>7</Text> */}
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
    fontSize: 24,
    // color: '#fff',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
