import React, {useState, useEffect, useContext} from 'react';
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
  Alert,
  StatusBar,
} from 'react-native';

import {ERR_CLR, MAIN_COLOR, SUCCESS_COLOR} from '../../constants/colors';
import {GET_ORDER, GET_TABLES, storageVarNames} from '../../constants';
import {MainContext} from '../../components/context';

const blankOrder = {
  id: '',
  empno: '',
  qot: '',
  table_id: '',
  order_id: '',
  order_no: '',
  order_date: '',
  member_id: 'ABC-3',
  order: [],
};

const TableScreen = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = useState([]);
  const [stateBkup, setStateBkup] = useState([]);
  const [searchStr, setSearchStr] = useState('');
  const [data, setData] = useState(null);

  const {
    user,
    userArea,
    setUserArea,
    setOrder,
    baseURL,
    setSelectedTable,
    setBookedOrder,
  } = useContext(MainContext);

  const onTablePress = async item => {
    const newOrder = {
      empno: user.user_id,
      table_id: item.id,
      order_id: item.order_id || null,
      order_date: user.wdate,
      order_time: new Date(),
      member_id: 'ABC-2',
      order: [],
    };

    setOrder({...newOrder});

    setSelectedTable(item);
    if (item.status === 'VACANT') {
      navigation.navigate('Menu', {screen: 'MenuScreen'});
    } else {
      const {id, order_no} = item;
      const {user_id, wdate} = user;
      const url = `${baseURL}${GET_ORDER}?order_no=${order_no}&emp_no=${user_id}&table_id=${id}&working_date='${wdate}'`;
      try {
        const {data} = await axios.get(url);
        console.log({data, item});
        setBookedOrder(data);
        navigation.navigate('OrderDetail', {screen: 'ViewBookedTableOrderScr'});
      } catch (e) {
        setBookedOrder([]);
      }
      // console.log({url, data});
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      getTables();
      setOrder(blankOrder);
      setSearchStr('');
      setSelectedTable(null);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getTables = async () => {
    try {
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
      const url = `${baseURL}${GET_TABLES}?area_id=${areaID}&wdt='${wdt}'&empno=${user.user_id}`;
      const {data} = await axios.get(url);
      setState(data.data);
      setStateBkup(data.data);
      setData(data);
    } catch (e) {
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
      <StatusBar backgroundColor={MAIN_COLOR} barStyle="light-content" />
      <View style={{flexDirection: 'row'}}>
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
          <TouchableOpacity style={{...styles.button, width: 50}}>
            <FontAwesome name="search" size={25} style={{color: '#fff'}} />
          </TouchableOpacity>
        </View>
        <View style={styles.booked}>
          <Text style={styles.memberLabel}>Booked </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              color: ERR_CLR,
              paddingRight: 10,
            }}>
            {data && data.booked_count}
          </Text>
        </View>
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
              onPress={() => {
                onTablePress(item);
              }}>
              <View style={{...styles.item, backgroundColor: bgColor}}>
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
    fontSize: 26,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  gridItem: {
    marginVertical: 3,
    width: Dimensions.get('window').width / 2.0, //Device width divided in almost a half
    height: 160,
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
    // justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 5,
    width: '70%',
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
  booked: {
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 5,
    width: '30%',
  },
});

export default TableScreen;
