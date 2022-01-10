import React, {useState, useEffect, useContext} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import {useTheme} from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {MainContext} from '../../../components/context';
import axios from '../../../constants/axiosClient';
import {ERR_CLR, MAIN_COLOR, SUCCESS_COLOR} from '../../../constants/colors';
import DismissKeyboard from '../../../components/DismissKeyboard';
// import VerifyMember from './VerifyMember';
// import {blankOrder, GET_ITEMS} from '../../../constants';

const ViewOrderScreen = ({navigation}) => {
  //   const [order, setOrder] = useState({});
  const {order, setOrder} = useContext(MainContext);
  const {colors} = useTheme();

  //   useEffect(() => {
  //     console.log(state.order);
  //   }, []);

  //   useEffect(() => {
  //     // console.log('ran on screen change')
  //     const unsubscribe = navigation.addListener('focus', e => {
  //     //   setOrder({...state.order});
  //       console.log('revuew order screen ran', e);
  //     });

  //     return unsubscribe;
  //   }, [navigation]);

  const deleteRow = (item, index) => {
    console.log({item, index});
  };

  const ItemHeaders = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={{...styles.header1, width: '50%'}}>
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
          <View style={{...styles.menuBody, width: '50%'}}>
            <Text style={styles.bodyTxt}>{item.ITEM_NAME}</Text>
          </View>
          <View
            style={{...styles.menuBody, alignItems: 'center', width: '20%'}}>
            <Text style={styles.bodyTxt}>{item.ITEM_ID}</Text>
          </View>
          <View
            style={{...styles.menuBody, alignItems: 'center', width: '17%'}}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="words"
              keyboardType="numeric"
              onChangeText={val => {
                console.log('val---', val);
              }}
              value={item.qty}
              // onChange={onInputChange}
            />
          </View>
          <TouchableOpacity
            style={{...styles.deleteBtn, width: '12%'}}
            onPress={() => deleteRow(item, index)}>
            <Icon name="ios-trash-bin" size={26} color={ERR_CLR} />
          </TouchableOpacity>
        </View>
        <View style={{...styles.comments, backgroundColor: bgColor}}>
          <Text style={{fontWeight: '600', color: '#aaa'}}>COMMENTS : </Text>
          <TextInput
            style={{...styles.textInput, width: '80%'}}
            autoCapitalize="words"
            onChangeText={val => {
              console.log('val---', val);
            }}
            value={item.comments}
          />
        </View>
        {/* <View style={{paddingBottom: 10, backgroundColor: bgColor}}>
            <Text style={{fontWeight: '600',}}>COMMENTS : </Text>
          <TextInput
            style={{...styles.textInput}}
            autoCapitalize="words"
            onChangeText={val => {
              console.log('val---', val);
            }}
            value={item.comments}
          />
        </View> */}
      </>
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
            <ItemHeaders />
            <FlatList
              numColumns={1}
              keyExtractor={(item, index) => item.ITEM_ID}
              data={order.order.filter(order => order.checked)}
              renderItem={renderItems}
            />
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  ...styles.header1,
                  backgroundColor: SUCCESS_COLOR,
                  width: '50%',
                }}>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => {}}>
                  <Text style={{...styles.headerTxt, letterSpacing: 1}}>
                    <Icon name="add-circle-outline" size={26} /> ADD ITEMS
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{...styles.header1, width: '50%'}}>
                {/* <Text style={{...styles.headerTxt, letterSpacing: 2}}>
                  Item Name
                </Text> */}
                <TouchableOpacity style={styles.deleteBtn} onPress={() => {}}>
                  <Text style={{...styles.headerTxt, letterSpacing: 1}}>
                    Place Order <Icon name="checkmark-done-outline" size={26} />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* <View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteRow(item, index)}>
              <Icon name="ios-trash-bin" size={26} color={ERR_CLR} />
            </TouchableOpacity>
          </View> */}
        </View>
        {/* <View style={styles.menuWrapper}>
          <Text>Footer</Text>
        </View> */}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
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
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ViewOrderScreen;
