import React, {useState, useEffect, useContext} from 'react';
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
  StatusBar,
} from 'react-native';

import {ERR_CLR, MAIN_COLOR} from '../../../constants/colors';
import VerifyMember from './VerifyMember';
import DismissKeyboard from '../../../components/DismissKeyboard';
import {MainContext} from '../../../components/context';

const FlatMenuScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const [stateBkup, setStateBkup] = useState([]);
  const [items, setItems] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchStr, setSearchStr] = useState('');

  const {order, state, setOrder} = useContext(MainContext);
  const {colors} = useTheme();

  useEffect(() => {
    setSearchStr('');
    getData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      setSearchStr('');
      getData();
    });

    return unsubscribe;
  }, [navigation]);

  const getData = () => {
    try {
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

  const onChkBoxPress = item => {
    const orders = order.order;
    const isOrdered = orders.find(({ITEM_ID}) => ITEM_ID === item.ITEM_ID);

    if (!isOrdered) return;

    const orderIdx = orders.findIndex(({ITEM_ID}) => ITEM_ID === item.ITEM_ID);

    orders[orderIdx] = {...isOrdered, checked: !isOrdered.checked};
    setOrder({...order, order: orders});
  };

  const onQtyChange = (value, item) => {
    const ord = order.order;
    const existingOrder = ord.find(({ITEM_ID}) => item.ITEM_ID === ITEM_ID);
    const idx = ord.findIndex(({ITEM_ID}) => item.ITEM_ID === ITEM_ID);

    if (!value || value === '0') {
      if (idx !== -1) {
        ord.splice(idx, 1);
      }
      setOrder({...order, order: ord});
      return;
    }

    if (existingOrder) {
      ord[idx] = {...existingOrder, qty: value};
    } else {
      ord.push({...item, qty: value});
    }
    setOrder({...order, order: ord});
  };

  const search = val => {
    setSearchStr(val);
    if (!val.trim()) {
      setData(stateBkup);
      return;
    }

    const filteredItems = items.filter(item => {
      return (
        item.ITEM_NAME.toLowerCase().indexOf(val.toLowerCase()) >= 0 ||
        item.ITEM_ID.indexOf(val.trim()) >= 0
      );
    });

    const newState = classes
      .map(cls => {
        const items = getSelectedIClassItem(filteredItems, cls.CLS_ID);
        return {...cls, title: cls.CLS_DESC, data: items};
      })
      .filter(cls => cls.data.length);

    setData(newState);
  };

  const ItemHeaders = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={{...styles.header1, width: '10%'}}>
          <Text style={styles.headerTitles}>Add</Text>
        </View>
        <View style={{...styles.header1, width: '60%'}}>
          <Text style={styles.headerTitles}>Item Name</Text>
        </View>
        <View style={{...styles.header1, width: '15%'}}>
          <Text style={styles.headerTitles}>Item ID</Text>
        </View>
        <View style={{...styles.header1, width: '15%'}}>
          <Text style={styles.headerTitles}>Qty</Text>
        </View>
      </View>
    );
  };

  const renderItems = ({item, index}) => {
    const bgColor = index % 2 === 0 ? '#fff' : '#f2f2f2';
    const orderedItem = order.order.find(it => item.ITEM_ID === it.ITEM_ID);
    let isChecked = (orderedItem && orderedItem.checked) || item.checked;
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: bgColor,
          paddingBottom: 10,
        }}>
        <View style={{...styles.menuBody, width: '10%'}}>
          <CheckBox
            center
            checked={isChecked}
            onPress={() => {
              onChkBoxPress(item);
            }}
            checkedColor={MAIN_COLOR}
          />
        </View>
        <View style={{...styles.menuBody, width: '60%'}}>
          <Text style={styles.headerTxt}>{item.ITEM_NAME}</Text>
        </View>
        <View style={{...styles.menuBody, alignItems: 'center', width: '15%'}}>
          <Text style={styles.headerTxt}>{item.ITEM_ID}</Text>
        </View>
        <View style={{...styles.menuBody, alignItems: 'center', width: '13%'}}>
          <TextInput
            style={{...styles.textInput, color: colors.text, width: '100%'}}
            autoCapitalize="words"
            keyboardType="numeric"
            onChangeText={value => {
              onQtyChange(value, item);
            }}
            value={(orderedItem && orderedItem.qty) || ''}
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

  return (
    <>
      <StatusBar backgroundColor={MAIN_COLOR} barStyle="light-content" />
      <View style={styles.body}>
        <VerifyMember member_id={order.member_id} />
        <DismissKeyboard>
          <View style={styles.row1}>
            <Text style={styles.memberLabel}>Filter : </Text>
            <TextInput
              placeholder="ITEM NAME OR ID HERE..."
              placeholderTextColor="#BBB"
              style={{...styles.textInput, color: colors.text, width: '50%'}}
              autoCapitalize="words"
              onChangeText={search}
              value={searchStr}
            />
            <TouchableOpacity
              style={{...styles.button, width: 130, backgroundColor: ERR_CLR}}
              onPress={() => search('')}>
              <Text style={styles.text}>
                <FontAwesome name="eraser" size={20} style={{color: '#fff'}} />
                CLEAR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{...styles.button, width: 50}}
              onPress={getData}>
              <FontAwesome name="refresh" size={25} style={{color: '#fff'}} />
            </TouchableOpacity>
          </View>
        </DismissKeyboard>
        <View style={styles.menuWrapper}>
          <View>
            <ItemHeaders />
            <SectionList
              keyboardShouldPersistTaps="always"
              sections={data}
              keyExtractor={(item, index) => index.toString()}
              renderSectionHeader={renderHeader}
              renderItem={renderItems}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: 10,
  },
  header1: {
    backgroundColor: MAIN_COLOR,
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    margin: 10,
    letterSpacing: 2,
  },
  menuBody: {
    justifyContent: 'center',
  },
  headerTitles: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
    color: '#fff',
    textTransform: 'uppercase',
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
    // borderBottomColor: 'rgba(0,0,0,.7)',
    // borderBottomWidth: 1,
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
