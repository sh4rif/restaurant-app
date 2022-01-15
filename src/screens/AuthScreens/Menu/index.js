import React, {useState, useEffect, useContext} from 'react';
import {CheckBox} from 'react-native-elements';
import {useTheme} from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  TextInput,
} from 'react-native';

import {MAIN_COLOR} from '../../../constants/colors';
import ClassesMenu from './ClassesMenu';
import VerifyMember from './VerifyMember';
import DismissKeyboard from '../../../components/DismissKeyboard';
// import {blankOrder} from '../../../constants';
import {MainContext} from '../../../components/context';

const MenuScreen = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  // const [order, setOrder] = useState({...blankOrder});
  // const [selectedClass, setSelectedClass] = useState(null);

  const {state, order, setOrder} = useContext(MainContext);

  const {colors} = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      getData();
      // getLoginURL();
    });

    return unsubscribe;
  }, [navigation]);

  const getSelectedIClassItem = (items, class_id) => {
    const filteredItems = items
      .filter(item => item.CLS_ID === class_id)
      .map(item => {
        return {...item, checked: false, comments: ''};
      });
    return filteredItems;
  };

  const getData = async () => {
    try {
      const clses = state.classes;

      const clsid = clses[0].CLS_ID;
      setSelectedClassId(clsid);
      // setSelectedClass(clses[0]);
      const selectedItem = getSelectedIClassItem(state.items, clsid);

      setSelectedItems([...selectedItem]);
      setClasses([...clses]);
      setItems([...state.items]);
    } catch (e) {
      console.log('error occured 5---', e.message);
    }
  };
  const onClassClick = item => {
    // console.log({item});
    // setSelectedClass(item);
    setSelectedClassId(item.CLS_ID);
    // const a = getSelectedIClassItem(items, item.CLS_ID);
    const classItems = getSelectedIClassItem(items, item.CLS_ID);
    setSelectedItems([...classItems]);
  };

  const verifyMemberonPress = value => {
    // console.log(value);
    // const orderFromCtx = state.order;
    console.log({order, state, items});
    // console.log(JSON.stringify(order));
  };

  const onChkBoxPress = item => {
    const orders = order.order;
    const isOrdered = orders.find(({ITEM_ID}) => ITEM_ID === item.ITEM_ID);

    if (!isOrdered) return;

    const orderIdx = orders.findIndex(({ITEM_ID}) => ITEM_ID === item.ITEM_ID);

    orders[orderIdx] = {...isOrdered, checked: !isOrdered.checked};
    setOrder({...order, order: orders});

    // set items checked to true
    const idx = selectedItems.findIndex(
      ({ITEM_ID}) => ITEM_ID === item.ITEM_ID,
    );
    // console.log({idx, item});
    const items = [...selectedItems];
    items[idx] = {...item, checked: !item.checked};
    setSelectedItems([...items]);
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

  const renderMenuBody = ({item, index}) => {
    const orderedItem = order.order.find(it => item.ITEM_ID === it.ITEM_ID);
    let isChecked = (orderedItem && orderedItem.checked) || item.checked;
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: index % 2 === 0 ? '#fff' : '#f2f2f2',
        }}>
        <View style={{...styles.menuBody, width: '10%'}}>
          <Text style={styles.headerTxt}>
            <CheckBox
              // disabled={true}
              // checked={(item.checked)}
              checked={isChecked}
              onPress={() => {
                onChkBoxPress(item);
                // const idx = selectedItems.findIndex(
                //   ({ITEM_ID}) => ITEM_ID === item.ITEM_ID,
                // );
                // console.log({idx, item});
                // const items = [...selectedItems];
                // items[idx] = {...item, checked: !item.checked};
                // setSelectedItems([...items]);
              }}
              checkedColor={MAIN_COLOR}
            />
          </Text>
        </View>
        <View
          style={{
            ...styles.menuBody,
            width: '55%',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}>
          <Text style={styles.headerTxt}>{item.ITEM_NAME}</Text>
        </View>
        <View style={{...styles.menuBody, width: '18%'}}>
          <Text style={styles.headerTxt}>{item.ITEM_ID}</Text>
        </View>
        <View style={{...styles.menuBody, width: '17%'}}>
          <TextInput
            style={{...styles.textInput, color: colors.text, width: '100%'}}
            autoCapitalize="words"
            keyboardType="numeric"
            onChangeText={value => {
              onQtyChange(value, item);
            }}
            value={(orderedItem && orderedItem.qty) || ''}
            // onChange={onInputChange}
          />
        </View>
      </View>
    );
  };
  return (
    <DismissKeyboard>
      <View style={styles.body}>
        {/* <View style={styles.row1}>
        <Text style={styles.memberLabel}>Member ID : </Text>
        <TextInput
          placeholder="i.e R-123"
          placeholderTextColor="#CCC"
          style={{...styles.textInput, color: colors.text}}
          autoCapitalize="characters"
          onChangeText={val => {}}
        />
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={{...styles.text}}>Verify</Text>
        </TouchableOpacity>
      </View> */}
        <VerifyMember onPress={verifyMemberonPress} />
        <View style={styles.menuWrapper}>
          <View style={styles.leftSide}>
            <View style={{...styles.header1, marginBottom: 5}}>
              <Text style={{...styles.headerTxt, color: '#fff'}}>
                CATEGORIES
              </Text>
            </View>
            <ClassesMenu
              data={classes}
              onPress={onClassClick}
              selectedClassId={selectedClassId}
            />
          </View>
          <View style={styles.rightSide}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  ...styles.header1,
                  width: '12%',
                }}>
                <Text style={{...styles.headerTxt, color: '#fff'}}>ADD</Text>
              </View>
              <View style={{...styles.header1, width: '50%'}}>
                <Text
                  style={{
                    ...styles.headerTxt,
                    letterSpacing: 1,
                    color: '#fff',
                  }}>
                  ITEM NAME
                </Text>
              </View>
              <View style={{...styles.header1, width: '20%'}}>
                <Text style={[styles.headerTxt, {color: '#fff'}]}>ITEM ID</Text>
              </View>
              <View style={{...styles.header1, width: '18%'}}>
                <Text style={{...styles.headerTxt, color: '#fff'}}>QTY</Text>
              </View>
            </View>
            <FlatList
              numColumns={1}
              keyExtractor={(item, index) => item.ITEM_ID}
              data={selectedItems}
              renderItem={renderMenuBody}
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
    // paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  menuBody: {
    // backgroundColor: '#00f',
    paddingHorizontal: 5,
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerTxt: {fontWeight: '600', fontSize: 16},
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    // paddingHorizontal: 5,
  },
  leftSide: {width: '30%', borderRightWidth: 1, borderColor: '#959393'},
  rightSide: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 3,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
    // backgroundColor: 'purple',
  },
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
    marginTop: 10,
    // flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -2,
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
    // color: '#fff',
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
});

export default MenuScreen;
