import React, {useState, useEffect, useContext} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {format} from 'date-fns';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import AsyncStorageLib from '@react-native-async-storage/async-storage';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {ERR_CLR, MAIN_COLOR, SUCCESS_COLOR} from '../../constants/colors';
import {GET_TABLES, storageVarNames} from '../../constants';
import {MainContext} from '../../components/context';

const blankOrder = {
  empno: '',
  table_id: '',
  order_date: '',
  order_time: '',
  order: [],
};
const TableScreen = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  // const [wdate, setWdate] = useState('12-DEC-21');
  // const [areaId, setAreaId] = useState(null);
  const [state, setState] = useState([]);
  const [stateBkup, setStateBkup] = useState([]);
  const [searchStr, setSearchStr] = useState('');

  const {user, userArea, setUserArea, setOrder, baseURL} =
    useContext(MainContext);

  const onTablePress = item => {
    const newOrder = {
      empno: user.user_id,
      table_id: item.id,
      order_date: user.wdate,
      order_time: new Date(),
      order: [],
    };
    console.log({item, user, userArea, newOrder});

    setOrder({...newOrder});
    navigation.navigate('Menu', {screen: 'MenuScreen'});
  };

  // useEffect(() => {
  // }, [])

  useEffect(() => {
    console.log('baseURL is', baseURL);
    const unsubscribe = navigation.addListener('focus', e => {
      // getArea();
      getTables();
      setOrder(blankOrder);
      setSearchStr('');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  // const getArea = async () => {
  //   try {
  //     const area = await AsyncStorageLib.getItem(storageVarNames.area);
  //     const parsedArea = JSON.parse(area);
  //     setUserArea(parsedArea);
  //     setAreaId(parsedArea.AREA_ID);

  //     // setArea(JSON.parse(area));
  //   } catch (e) {}
  // };

  const getTables = async () => {
    try {
      // const today = format(new Date(), 'dd-MMM-yy');
      let areaID = null;
      if (!userArea) {
        const area = await AsyncStorageLib.getItem(storageVarNames.area);
        const parsedArea = JSON.parse(area);
        areaID = parsedArea.AREA_ID;
        setUserArea(parsedArea);
      } else {
        areaID = userArea.AREA_ID;
      }

      const wdt = user && user.wdate;

      const url = `${baseURL}${GET_TABLES}?area_id=${areaID}&wdt='${wdt}'`;
      console.log('error url is', url);
      const {data} = await axios.get(url);
      // console.log('tables', data);
      // const t = {...data[0], status: 'BOOKED'};
      // data[0] = {...t};
      setState(data);
      setStateBkup(data);
    } catch (e) {
      // const url = `write_logs.php`;
      // console.log('url is---', url);
      // axios
      //   .get(url)
      //   .then(res => console.log(res.data))
      //   .then(err => console.log('----err---', err.response.data.message));
      console.log('error occured 4---', e.message);
    }
  };

  const searchTables = val => {
    const newState = stateBkup.filter(t => {
      return t.name.toLowerCase().indexOf(val.toLowerCase()) >= 0;
    });
    setSearchStr(val);
    setState([...newState]);
  };

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.row1}>
        <Text style={styles.memberLabel}>Filter : </Text>
        <TextInput
          placeholder="SEARCH TABLE NUMBER"
          placeholderTextColor="#BBB"
          style={{...styles.textInput, width: '70%'}}
          autoCapitalize="words"
          onChangeText={searchTables}
          value={searchStr}
          // onChange={onInputChange}
        />
        <TouchableOpacity
          style={{...styles.button, width: 50}}
          // onPress={getData}
        >
          {/* <Text style={{...styles.text, letterSpacing: 1}}>REFRESH</Text> */}
          <FontAwesome name="search" size={25} style={{color: '#fff'}} />
        </TouchableOpacity>
      </View>
      <FlatList
        // key={this.state.horizontal ? 'h' : 'v'}
        numColumns={2}
        keyExtractor={(item, index) => item.id}
        data={state
          .filter(table => table.status === 'BOOKED')
          .concat(state.filter(table => table.status === 'VACANT'))}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getTables} />
        }
        renderItem={({item}) => {
          const isVacant = item.status === 'VACANT';
          const bgColor = isVacant ? SUCCESS_COLOR : ERR_CLR;
          return (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={e => {
                onTablePress(item);
              }}>
              <View style={{...styles.item, backgroundColor: bgColor}}>
                {/* <MaterialIcons
                  name="table-chair"
                  size={50}
                  style={{
                    backgroundColor:
                      item.status === 'BOOKED' ? ERR_CLR : MAIN_COLOR,
                  }}
                  color="#fff"
                /> */}
                {isVacant ? (
                  <Image
                    source={require(`../../../assets/images/table_green.jpg`)}
                  />
                ) : (
                  <Image
                    source={require(`../../../assets/images/table_red.jpg`)}
                  />
                )}
              </View>
              <View style={styles.itemTxt}>
                <Text style={styles.text}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    // backgroundColor: '#00f',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: '100%',
    height: 130,
    // marginTop: 10,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTxt: {
    width: '100%',
    height: 30,
    // margin: 10,
    // flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#4ffed0',
  },
  text: {
    fontSize: 20,
    fontStyle: 'italic',
  },
  gridItem: {
    marginVertical: 3,
    width: Dimensions.get('window').width / 2.0, //Device width divided in almost a half
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: MAIN_COLOR,
    height: 45,
    // width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 8,
    width: '25%',
  },
  row1: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  textInput: {
    // marginTop: 10,
    // flex: 1,
    marginTop: -2,
    paddingLeft: 10,
    color: '#05375a',
    borderWidth: 1,
    borderColor: '#ccc',
    // borderBottomColor: 'rgba(0,0,0,.7)',
    // borderBottomWidth: 1,
    height: 45,
    // width: '60%',
    fontSize: 16,
  },
  memberLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'flex-start',
  },
});

export default TableScreen;
