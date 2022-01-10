import React, {useState, useEffect} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {addDays, format} from 'date-fns';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {ERR_CLR, MAIN_COLOR} from '../../constants/colors';
import axios from '../../constants/axiosClient';
import { GET_TABLES } from '../../constants';

const TableScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [wdate, setWdate] = useState('12-DEC-21');
  const [areaId, setAreaId] = useState(2);
  const [state, setState] = useState([]);

  const onPress = (e, item) => {
    console.log('btn pressed', e, item);
  };

  useEffect(() => {
    getTables();
  }, []);

  const getTables = async () => {
    try {
      const today = format(new Date(), 'dd-MMM-yy');
      const url = `${GET_TABLES}?area_id=${areaId}&wdt='${today}'`;
      // console.log('error url is', url);
      const {data} = await axios.get(url);
      setState(data);
    } catch (e) {
      // const url = `write_logs.php`;
      // console.log('url is---', url);
      // axios
      //   .get(url)
      //   .then(res => console.log(res.data))
      //   .then(err => console.log('----err---', err.response.data.message));
      console.log('error occured---', e.message);
    }
  };


  return (
    <SafeAreaView style={styles.body}>
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
          // console.log('item...', item);
          return (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={e => {
                onPress(e, item);
              }}>
              <View style={styles.item}>
                <MaterialIcons
                  name="table-chair"
                  size={50}
                  style={{
                    backgroundColor:
                      item.status === 'BOOKED' ? ERR_CLR : MAIN_COLOR,
                  }}
                  color="#fff"
                />
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
    height: 120,
    // marginTop: 10,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4ae1fa',
  },
  itemTxt: {
    width: '100%',
    height: 30,
    // margin: 10,
    // flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4ffed0',
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
    backgroundColor: 'orange',
  },
  button: {
    backgroundColor: '#ADD',
    height: 42,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});

export default TableScreen;
