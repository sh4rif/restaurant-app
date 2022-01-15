import React, {useState, useEffect, useContext} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {CheckBox} from 'react-native-elements';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

import {MainContext} from '../../../components/context';
import {ERR_CLR, MAIN_COLOR, SUCCESS_COLOR} from '../../../constants/colors';
import DismissKeyboard from '../../../components/DismissKeyboard';
import {formatNumber} from '../../../utils/functions';
import {PLACE_ORDER} from '../../../constants';
import axios from 'axios';

const ViewOrderScreen = ({navigation}) => {
  const [showComments, setShowComments] = useState(false);
  const [total, setTotal] = useState({
    taxable: 0,
    non_taxable: 0,
    tax: 0,
    sum: 0,
  });
  const {order, setOrder, baseURL, user, userArea} = useContext(MainContext);

  useEffect(() => {
    calculateTotal(order.order);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      calculateTotal(order.order);
    });

    return unsubscribe;
  }, [navigation]);

  const placeOrder = async () => {
    const orderItems = order.order.filter(o => o.qty > 0 && o.checked);
    const orderToSumbit = {
      ...order,
      qot: user.QOT,
      area_id: userArea.AREA_ID,
      orders: orderItems,
    };
    delete orderToSumbit.order;
    delete orderToSumbit.order_time;
    const url = `${baseURL}${PLACE_ORDER}`;
    try {
      const {data} = await axios.post(url, orderToSumbit);
      console.log(data);
      if (data.error !== 0) {
        Alert.alert('Order', 'Order failed!, please try again');
        return;
      }
      
      Alert.alert('Order', 'Order Placed Successfully!');
      setOrder({
        empno: '',
        table_id: '',
        order_date: '',
        order_time: '',
        order: [],
      });
      navigation.navigate('Home');
    } catch (e) {
      console.log('error while saving order', e);
    }
    console.log({
      orderToSumbit,
      url: url,
      user,
      userArea,
    });
  };

  const onValChange = (keyName, value, item, index) => {
    const orderItems = order.order;
    orderItems[index] = {...item, [keyName]: value};

    if (keyName === 'qty') {
      if (value === '0') {
        deleteRow(index);
      }
      calculateTotal(orderItems);
    }

    setOrder({...order, order: orderItems});
  };

  const deleteRow = index => {
    const orderItems = order.order;
    orderItems.splice(index, 1);
    calculateTotal(orderItems);
    setOrder({...order, order: orderItems});
  };

  const addMoreItems = () => {
    navigation.navigate('Menu', {screen: 'MenuScreen'});
  };

  const calculateTotal = items => {
    let taxable = 0;
    let non_taxable = 0;
    const taxable_amounts = [];
    const taxable_items = items
      .filter(order => order.TAXABLE && order.checked)
      .forEach(item => {
        const price = parseInt(item.SALE_PRICE);
        const tax_rate = parseInt(item.TAX_RATE);
        const qty = parseInt(item.qty) || 0;
        const row_total = qty * price;
        taxable += row_total;
        const row_tax = (row_total / 100) * tax_rate;
        taxable_amounts.push(row_tax);
        // console.log({price, tax_rate, qty, row_total, row_tax});
      });

    const non_taxable_items = items
      .filter(ord => !ord.TAXABLE && ord.checked)
      .forEach(item => {
        const price = parseInt(item.SALE_PRICE);
        const qty = parseInt(item.qty) || 0;
        const row_total = qty * price;
        non_taxable += row_total;
      });

    const tax = Math.ceil(taxable_amounts.reduce((a, b) => a + b, 0));
    const sum = tax + non_taxable + taxable;
    // console.log({tax, sum});
    setTotal({...total, non_taxable, taxable, tax, sum});
  };

  const ItemHeaders = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={{...styles.header1, width: '10%'}}>
          <Text style={{...styles.headerTxt}}>Sr.</Text>
        </View>
        <View style={{...styles.header1, width: '40%'}}>
          <Text style={{...styles.headerTxt, letterSpacing: 2}}>Item Name</Text>
        </View>
        <View style={{...styles.header1, width: '20%'}}>
          <Text style={styles.headerTxt}>Item ID</Text>
        </View>
        <View style={{...styles.header1, width: '18%'}}>
          <Text style={styles.headerTxt}>Qty</Text>
        </View>
        <View style={{...styles.header1, width: '12%'}}></View>
      </View>
    );
  };

  const renderItems = ({item, index}) => {
    const bgColor = index % 2 === 0 ? '#fff' : '#f2f2f2';
    return (
      <>
        <View style={{flexDirection: 'row', backgroundColor: bgColor}}>
          <View style={{...styles.menuBody, width: '5%'}}>
            <Text style={{...styles.bodyTxt}}>{index + 1}</Text>
          </View>
          <View style={{...styles.menuBody, width: '50%'}}>
            <Text style={styles.bodyTxt}>{item.ITEM_NAME}</Text>
          </View>
          <View
            style={{...styles.menuBody, alignItems: 'center', width: '15%'}}>
            <Text style={styles.bodyTxt}>{item.ITEM_ID}</Text>
          </View>
          <View
            style={{...styles.menuBody, alignItems: 'center', width: '17%'}}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="words"
              keyboardType="numeric"
              onChangeText={val => onValChange('qty', val, item, index)}
              value={item.qty}
              // onChange={onInputChange}
            />
          </View>
          <TouchableOpacity
            style={{...styles.deleteBtn, width: '12%'}}
            onPress={() => deleteRow(index)}>
            <Icon name="ios-trash-bin" size={26} color={ERR_CLR} />
          </TouchableOpacity>
        </View>
        {showComments && item.qty > 0 ? (
          <View style={{...styles.comments, backgroundColor: bgColor}}>
            <Text style={{fontWeight: '600', color: '#aaa'}}>COMMENTS : </Text>
            <TextInput
              style={{...styles.textInput, width: '83%'}}
              autoCapitalize="words"
              onChangeText={val => onValChange('comments', val, item, index)}
              value={item.comments}
            />
          </View>
        ) : null}
      </>
    );
  };

  const renderTotal = () => {
    return (
      <View style={styles.totalWrapper}>
        <View style={{marginRight: 20}}>
          <View style={styles.row}>
            <Text style={styles.totalRow}>Total Taxable :</Text>
            <Text style={styles.numbers}>{formatNumber(total.taxable)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalRow}>Total Non-Taxable :</Text>
            <Text style={styles.numbers}>
              {formatNumber(total.non_taxable)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={{...styles.totalRow, borderBottomWidth: 1}}>
              Tax :
            </Text>
            <Text style={{...styles.numbers, borderBottomWidth: 1}}>
              {formatNumber(total.tax)}
            </Text>
          </View>
          <View style={{...styles.row, marginBottom: 0}}>
            <Text style={{...styles.totalRow, ...styles.totalTxt}}>
              Total :
            </Text>
            <Text style={{...styles.numbers, ...styles.totalTxt}}>
              {formatNumber(total.sum)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (!order.order.length) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: MAIN_COLOR,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 30, color: '#fff'}}>NO ORDER</Text>
        </View>
      </View>
    );
  }

  return (
    <DismissKeyboard>
      <View style={styles.body}>
        <View style={styles.menuWrapper}>
          <View>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <View style={{width: '50%', flexDirection: 'row'}}>
                <Text style={styles.member}>Member</Text>
                <Text
                  style={{
                    ...styles.member,
                    color: MAIN_COLOR,
                    fontWeight: 'bold',
                  }}>
                  R-369
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.member}>
                  {showComments ? 'Hide' : 'Show'} Comments
                </Text>
                <CheckBox
                  checked={showComments}
                  onPress={() => {
                    setShowComments(!showComments);
                  }}
                  checkedColor={SUCCESS_COLOR}
                />
              </View>
            </View>
            <ItemHeaders />
            <FlatList
              numColumns={1}
              keyExtractor={(item, index) => item.ITEM_ID}
              data={order.order.filter(o => o.checked)}
              renderItem={renderItems}
            />
            {renderTotal()}
            {/* <View style={{flexDirection: 'row'}}>
              <View style={{...styles.header1, ...styles.addItems}}>
                <TouchableOpacity style={styles.deleteBtn} onPress={addMoreItems}>
                  <Text style={{...styles.headerTxt, letterSpacing: 1}}>
                    <Icon name="add-circle-outline" size={26} /> ADD ITEMS
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{...styles.header1, width: '50%'}}>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => {}}>
                  <Text style={{...styles.headerTxt, letterSpacing: 1}}>
                    Place Order <Icon name="checkmark-done-outline" size={26} />
                  </Text>
                </TouchableOpacity>
              </View>
            </View> */}
          </View>

          {/* <View>
            <Text>Bottom area</Text>
          </View> */}
        </View>
        {/* <View style={styles.menuWrapper}>
          <Text>Footer</Text>
        </View> */}
        <View style={{flexDirection: 'row'}}>
          <View style={{...styles.header1, ...styles.addItems}}>
            <TouchableOpacity style={styles.deleteBtn} onPress={addMoreItems}>
              <Text style={{...styles.headerTxt, letterSpacing: 1}}>
                <Icon name="add-circle-outline" size={26} /> ADD ITEMS
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{...styles.header1, width: '50%'}}>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                placeOrder(order.order);
              }}>
              <Text style={{...styles.headerTxt, letterSpacing: 1}}>
                Place Order <Icon name="checkmark-done-outline" size={26} />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </DismissKeyboard>
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

  menuWrapper: {
    backgroundColor: '#fff',
    flex: 1,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // alignItems: 'flex-start',
  },
  headerTxt: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  bodyTxt: {fontWeight: '600', fontSize: 16},
  menuBody: {justifyContent: 'center', padding: 5},
  textInput: {
    marginTop: -2,
    paddingLeft: 10,
    color: '#05375a',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
    width: '100%',
    fontSize: 18,
  },
  deleteBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  comments: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addItems: {
    backgroundColor: SUCCESS_COLOR,
    width: '50%',
  },
  totalRow: {fontSize: 20, fontWeight: 'bold', width: 200},
  totalTxt: {fontSize: 26, color: MAIN_COLOR},
  numbers: {
    width: 150,
    fontSize: 20,
    textAlign: 'right',
    fontWeight: 'bold',
    // borderLeftWidth: 1
  },
  member: {
    fontSize: 20,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  row: {flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5},
  totalWrapper: {
    marginTop: 50,
    height: 150,
    backgroundColor: 'rgba(0,0,0,.05)',
    justifyContent: 'center',
  },
});

export default ViewOrderScreen;
