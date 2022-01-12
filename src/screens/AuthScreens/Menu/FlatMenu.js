import React, {useState, useEffect, useRef, useContext} from 'react';
import {CheckBox} from 'react-native-elements';
import {useTheme} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SectionList,
  TouchableOpacity,
} from 'react-native';

import axios from '../../../constants/axiosClient';
import {MAIN_COLOR, SUCCESS_COLOR} from '../../../constants/colors';
import VerifyMember from './VerifyMember';
import DismissKeyboard from '../../../components/DismissKeyboard';
import {blankOrder, GET_ITEMS} from '../../../constants';
import {MainContext} from '../../../components/context';
// import {useTheme} from 'react-native-paper';
let timeOutId;
const debounce = (func, delay) => {
  if (timeOutId) clearTimeout(timeOutId);
  return (...args) => {
    timeOutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const FlatMenuScreen = ({navigation}) => {
  // const [state, setState] = useState([]);
  const [data, setData] = useState([]);
  // const [dataBkup, setDataBkup] = useState([])
  const [stateBkup, setStateBkup] = useState([]);
  const [items, setItems] = useState([]);
  const [classes, setClasses] = useState([]);
  const {order, state, setOrder} = useContext(MainContext);
  const {colors} = useTheme();

  const filterRef = useRef(null);
  const memberRef = useRef(null);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // console.log('ran on screen change')
    const unsubscribe = navigation.addListener('focus', e => {
      // The screen is focused
      // Call any action
      filterRef.current.clear();
      // setData(stateBkup);
      getData();
      console.log('screen change triggered', e);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getData = () => {
    try {
      console.log('getting data....');

      // const {data} = await axios.get(GET_ITEMS);

      const clses = state.classes;

      const newState = clses.map(cls => {
        const items = getSelectedIClassItem(state.items, cls.CLS_ID);
        return {...cls, title: cls.CLS_DESC, data: items};
      });
      setData(newState);
      setStateBkup([...newState]);
      setClasses([...clses]);
      setItems([...state.items]);
    } catch (e) {
      console.log('error occured 3---', e.message);
    }
  };

  const getSelectedIClassItem = (items, class_id) => {
    return items.filter(item => item.CLS_ID === class_id);
  };

  const verifyMemberonPress = value => {
    console.log(value);
  };

  const search = val => {
    if (val) {
      const filteredItems = items.filter(item => {
        return item.ITEM_NAME.toLowerCase().indexOf(val.toLowerCase()) >= 0;
      });

      const newState = classes
        .map(cls => {
          const items = getSelectedIClassItem(filteredItems, cls.CLS_ID);
          return {...cls, title: cls.CLS_DESC, data: items};
        })
        .filter(cls => cls.data.length);

      setData(newState);
    } else {
      setData(stateBkup);
    }
  };

  const ItemHeaders = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            ...styles.header1,
            width: '12%',
            // backgroundColor: 'wheat',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#fff',
              textTransform: 'uppercase',
            }}>
            Add
          </Text>
        </View>
        <View
          style={{
            ...styles.header1,
            width: '50%',
            // backgroundColor: 'purple',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              letterSpacing: 2,
              color: '#fff',
              textTransform: 'uppercase',
            }}>
            Item Name
          </Text>
        </View>
        <View
          style={{
            ...styles.header1,
            width: '20%',
            // backgroundColor: 'wheat',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#fff',
              textTransform: 'uppercase',
            }}>
            Item ID
          </Text>
        </View>
        <View style={{...styles.header1, width: '20%'}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#fff',
              textTransform: 'uppercase',
            }}>
            Qty
          </Text>
        </View>
      </View>
    );
  };

  const renderItems = ({item, index}) => {
    const bgColor = index % 2 === 0 ? '#fff' : '#f2f2f2';
    return (
      <View style={{flexDirection: 'row', backgroundColor: bgColor}}>
        <View style={{...styles.menuBody, width: '12%'}}>
          {/* <Text style={styles.headerTxt}>Add</Text> */}
          <CheckBox
            center
            checked={false}
            onPress={() => {}}
            checkedColor={MAIN_COLOR}
          />
        </View>
        <View style={{...styles.menuBody, width: '50%'}}>
          <Text style={styles.headerTxt}>{item.ITEM_NAME}</Text>
        </View>
        <View style={{...styles.menuBody, alignItems: 'center', width: '20%'}}>
          <Text style={styles.headerTxt}>{item.ITEM_ID}</Text>
        </View>
        <View style={{...styles.menuBody, alignItems: 'center', width: '15%'}}>
          {/* <Text style={styles.headerTxt}>Qty</Text> */}
          <TextInput
            ref={filterRef}
            style={{...styles.textInput, color: colors.text, width: '100%'}}
            autoCapitalize="words"
            keyboardType="numeric"
            onChangeText={() => {}}
            // onChange={onInputChange}
          />
        </View>
      </View>
    );
  };

  const renderHeader = ({section}) => {
    return (
      <View style={{backgroundColor: '#959393'}}>
        <Text style={styles.titleText}>{section.CLS_DESC}</Text>
      </View>
    );
  };

  // const onInputChange = ({nativeEvent}) => {
  //   const {text} = nativeEvent
  //   console.log('nativeeVENT', nativeEvent);
  //   debouncedFunc(text)
  // }

  // const debouncedFunc = debounce(search, 200)

  return (
    <DismissKeyboard>
      <View style={styles.body}>
        {/* <VerifyMember onPress={verifyMemberonPress} ref={memberRef} /> */}

        <View style={styles.row}>
          <Text style={styles.memberLabel}>Member ID : </Text>
          <TextInput
            ref={memberRef}
            placeholder="i.e R-123"
            placeholderTextColor="#BBB"
            style={{...styles.textInput, color: colors.text}}
            autoCapitalize="characters"
            onChangeText={() => {}}
          />
          {/* <TextField placeholder="i.e R-123"  /> */}
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={{...styles.text}}>VERIFY</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row1}>
          <Text style={styles.memberLabel}>Filter : </Text>
          <TextInput
            ref={filterRef}
            placeholder="ITEM NAME HERE..."
            placeholderTextColor="#BBB"
            style={{...styles.textInput, color: colors.text, width: '70%'}}
            autoCapitalize="words"
            onChangeText={search}
            // onChange={onInputChange}
          />
          <TouchableOpacity
            style={{...styles.button, width: 50}}
            onPress={getData}>
            {/* <Text style={{...styles.text, letterSpacing: 1}}>REFRESH</Text> */}
            <FontAwesome name="refresh" size={25} style={{color: '#fff'}} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuWrapper}>
          <View>
            <ItemHeaders />
            <SectionList
              sections={data}
              keyExtractor={(item, index) => index.toString()}
              renderSectionHeader={renderHeader}
              renderItem={renderItems}
            />
          </View>
        </View>
      </View>
    </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'orange',
    paddingTop: 10,
  },
  header1: {
    backgroundColor: MAIN_COLOR,
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
    // borderRightWidth: 1,
  },
  titleText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    margin: 10,
    letterSpacing: 2,
  },
  menuBody: {
    // backgroundColor: '#00f',
    // paddingHorizontal: 5,
    // paddingVertical: 10,
    // alignItems: 'center',
    // padding: 1,
    justifyContent: 'center',
  },
  headerTxt: {fontWeight: '600', fontSize: 16},
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  leftSide: {width: '30%', borderRightWidth: 2, borderColor: '#ccc'},
  menuWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    // backgroundColor: 'red',
  },
  memberLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    // marginTop: 10,
    // flex: 1,
    marginTop: -2,
    paddingLeft: 10,
    color: '#05375a',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 45,
    width: '45%',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#20315f',
    // fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 3,

    // fontFamily: 'Inter-Bold',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  // memberLabel: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  // },
  // textInput: {
  //   marginTop: 10,
  //   marginTop: Platform.OS === 'ios' ? 0 : -2,
  //   paddingLeft: 10,
  //   color: '#05375a',
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   height: 45,
  //   width: '45%',
  //   fontSize: 16,
  // },
});

export default FlatMenuScreen;
