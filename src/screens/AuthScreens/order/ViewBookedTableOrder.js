import React, {useState, useEffect, useContext} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

import {MainContext} from '../../../components/context';
import {formatNumber} from '../../../utils/functions';
import DismissKeyboard from '../../../components/DismissKeyboard';
import {ERR_CLR, MAIN_COLOR, SUCCESS_COLOR} from '../../../constants/colors';

const ViewBookedTableOrderScreen = ({navigation}) => {
  const {userArea, selectedTable, bookedOrder, setOrder, order} =
    useContext(MainContext);

  const [total, setTotal] = useState({
    taxable: 0,
    non_taxable: 0,
    tax: 0,
    sum: 0,
  });

  useEffect(() => {
    calculateTotal(bookedOrder.data);
    const unsubscribe = navigation.addListener('focus', e => {
      calculateTotal(bookedOrder.data);
    });

    return unsubscribe;
  }, [navigation, bookedOrder]);

  const calculateTotal = items => {
    let taxable = 0;
    let non_taxable = 0;
    const taxable_amounts = [];
    const taxable_items = items
      .filter(order => order.TAXABLE)
      .forEach(item => {
        const price = parseInt(item.sale_price);
        const tax_rate = parseInt(item.sales_tax);
        const qty = parseInt(item.qty) || 0;
        const row_total = qty * price;
        taxable += row_total;
        const row_tax = (row_total / 100) * tax_rate;
        taxable_amounts.push(row_tax);
      });

    const non_taxable_items = items
      .filter(ord => !ord.TAXABLE && ord.checked)
      .forEach(item => {
        const price = parseInt(item.sale_price);
        const qty = parseInt(item.qty) || 0;
        const row_total = qty * price;
        non_taxable += row_total;
      });

    const tax = Math.ceil(taxable_amounts.reduce((a, b) => a + b, 0));
    const sum = tax + non_taxable + taxable;
    setTotal({...total, non_taxable, taxable, tax, sum});
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

  const addMoreItems = () => {
    setOrder({...order, member_id: bookedOrder.member_id});
    navigation.navigate('Menu', {screen: 'MenuScreen'});
  };

  const ItemHeaders = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={{...styles.header1, width: '10%'}}>
          <Text style={{...styles.headerTxt}}>Sr.</Text>
        </View>
        <View style={{...styles.header1, width: '50%'}}>
          <Text style={{...styles.headerTxt}}>Item Name</Text>
        </View>
        <View style={{...styles.header1, width: '15%'}}>
          <Text style={styles.headerTxt}>KOT SR</Text>
        </View>
        <View style={{...styles.header1, width: '15%'}}>
          <Text style={{...styles.headerTxt}}>Item ID</Text>
        </View>
        <View style={{...styles.header1, width: '10%'}}>
          <Text style={styles.headerTxt}>Qty</Text>
        </View>
      </View>
    );
  };

  const renderItems = ({item, index}) => {
    const bgColor = index % 2 === 0 ? '#fff' : '#f2f2f2';
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: bgColor,
          paddingVertical: 10,
        }}>
        <View style={{...styles.menuBody, width: '5%'}}>
          <Text style={{...styles.bodyTxt}}>{index + 1}</Text>
        </View>
        <View style={{...styles.menuBody, width: '55%'}}>
          <Text style={styles.bodyTxt}>{item.item_name}</Text>
          {item.comments ? (
            <Text style={styles.bodyTxt}>{item.comments}</Text>
          ) : null}
        </View>
        <View style={{...styles.menuBody, alignItems: 'center', width: '15%'}}>
          <Text style={styles.bodyTxt}>{item.qot_sr}</Text>
        </View>
        <View style={{...styles.menuBody, alignItems: 'center', width: '15%'}}>
          <Text style={styles.bodyTxt}>{item.item_id}</Text>
        </View>
        <View style={{...styles.menuBody, alignItems: 'center', width: '10%'}}>
          <Text style={styles.bodyTxtQty}>{item.qty}</Text>
        </View>
      </View>
    );
  };

  return (
    <DismissKeyboard>
      <View style={styles.body}>
        <View style={styles.menuWrapper}>
          <View>
            <View style={{marginBottom: -10, flexDirection: 'row'}}>
              <View style={{width: '50%', flexDirection: 'row'}}>
                <Text style={styles.member}>Member</Text>
                <Text style={styles.main_text}>{bookedOrder.member_id}</Text>
              </View>
              <View style={{width: '50%', flexDirection: 'row'}}>
                <Text style={styles.member}>ORDER NO</Text>
                <Text style={styles.main_text}>
                  {selectedTable && selectedTable.order_no}
                </Text>
              </View>
            </View>
            <View style={{marginBottom: 5, flexDirection: 'row'}}>
              <View style={{width: '50%', flexDirection: 'row'}}>
                <Text style={styles.member}>Area</Text>
                <Text style={styles.main_text}>{userArea.AREA_DESC}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.member}>Table</Text>
                <Text style={{...styles.main_text, color: ERR_CLR}}>
                  {selectedTable && selectedTable.name}
                </Text>
              </View>
            </View>
            <ItemHeaders />
            <FlatList
              numColumns={1}
              keyExtractor={(item, index) => index.toString()}
              data={bookedOrder.data}
              renderItem={renderItems}
            />
            {renderTotal()}
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{...styles.header1, width: '50%'}}>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                navigation.navigate('Tables');
              }}>
              <Text style={{...styles.headerTxt, letterSpacing: 1}}>
                <Icon name="arrow-back" size={26} /> GO BACK
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{...styles.header1, ...styles.addItems}}>
            <TouchableOpacity style={styles.deleteBtn} onPress={addMoreItems}>
              <Text style={{...styles.headerTxt, letterSpacing: 1}}>
                <Icon name="add-circle-outline" size={26} /> ADD ITEMS
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
  },
  headerTxt: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bodyTxt: {fontWeight: '600', fontSize: 16},
  commentsTxt: {fontSize: 16, color: '#ccc'},
  bodyTxtQty: {fontWeight: 'bold', fontSize: 22, color: MAIN_COLOR},
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
  main_text: {
    fontSize: 20,
    paddingHorizontal: 25,
    paddingVertical: 10,
    color: MAIN_COLOR,
    fontWeight: 'bold',
  },
  row: {flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5},
  totalWrapper: {
    marginTop: 50,
    height: 150,
    backgroundColor: 'rgba(0,0,0,.05)',
    justifyContent: 'center',
  },
});

export default ViewBookedTableOrderScreen;
