import React, {useState, useEffect} from 'react';
import axios from '../../../constants/axiosClient';
import _ from 'lodash';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';

import {useTheme} from 'react-native-paper';
import {ERR_CLR, MAIN_COLOR} from '../../../constants/colors';
import ClassesMenu from './ClassesMenu';
import VerifyMember from './VerifyMember';
import DismissKeyboard from '../../../components/DismissKeyboard';
import { GET_ITEMS } from '../../../constants';

const FlatMenuScreen = ({navigation}) => {
  const [state, setState] = useState([]);
  const [items, setItems] = useState([]);
  const [itemsBkup, setItemsBkup] = useState([]);
  const [classes, setClasses] = useState([]);
  const [order, setOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const {colors} = useTheme();

  useEffect(() => {
    getData();
  }, []);

  const getSelectedIClassItem = (items, class_id) => {
    return items.filter(item => item.CLS_ID === class_id);
  };

  const getData = async () => {
    try {
      const {data} = await axios.get(GET_ITEMS);

      const clses = data.classes;

      const newState = clses.map(cls => {
        const items = getSelectedIClassItem(data.items, cls.CLS_ID);
        return {...cls, items};
      });
      const clsid = clses[0].CLS_ID;
      setSelectedClassId(clsid);
      setSelectedClass(clses[0]);
      const selectedItem = getSelectedIClassItem(data.items, clsid);
      setSelectedItems([...selectedItem]);
      setState(newState);
      console.log({
        data,
        newState,
        clsid,
        cls: clses[0],
        selectedItems: selectedItem,
      });
      setSelectedItems([...selectedItem]);
      setClasses([...clses]);
      setItems([...data.items]);
      setItemsBkup([...data.items]);
    } catch (e) {
      console.log('error occured---', e.message);
    }
  };

  const verifyMemberonPress = value => {
    console.log(value);
  };

  const search = val => {
    if (val) {
      const a = itemsBkup.filter(item => {
        return item.ITEM_NAME.toLowerCase().indexOf(val.toLowerCase()) >= 0;
      });

      setItems([...a]);
    } else {
      setItems(itemsBkup);
    }
    // setTimeout(() => {
    //   console.log('value', val);
    // }, 1000);
    // _.debounce(() => {
    //   console.log('ran...');
    // }, 500);
  };

  return (
    <DismissKeyboard>
      <View style={styles.body}>
        <VerifyMember onPress={verifyMemberonPress} />
        <View style={styles.row1}>
          <Text style={styles.memberLabel}>Filter : </Text>
          <TextInput
            placeholder="Item name"
            placeholderTextColor="#CCC"
            style={{...styles.textInput, color: colors.text, width: '80%'}}
            autoCapitalize="words"
            onChangeText={search}
          />
        </View>

        <View style={styles.menuWrapper}>
          <View style={styles.rightSide}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  ...styles.header1,
                  width: '10%',
                  backgroundColor: 'wheat',
                }}>
                <Text style={styles.headerTxt}>Add</Text>
              </View>
              <View
                style={{
                  ...styles.header1,
                  width: '50%',
                  backgroundColor: 'purple',
                }}>
                <Text style={styles.headerTxt}>Item Name</Text>
              </View>
              <View
                style={{
                  ...styles.header1,
                  width: '20%',
                  backgroundColor: 'wheat',
                }}>
                <Text style={styles.headerTxt}>Item ID</Text>
              </View>
              <View style={{...styles.header1, width: '20%'}}>
                <Text style={styles.headerTxt}>Qty</Text>
              </View>
            </View>
            <FlatList
              numColumns={1}
              keyExtractor={(item, index) => item.ITEM_ID}
              data={items}
              renderItem={({item}) => {
                return (
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        ...styles.menuBody,
                        width: '10%',
                        backgroundColor: 'wheat',
                      }}>
                      <Text style={styles.headerTxt}>Add</Text>
                    </View>
                    <View
                      style={{
                        ...styles.menuBody,
                        width: '50%',
                        backgroundColor: 'purple',
                      }}>
                      <Text style={styles.headerTxt}>{item.ITEM_NAME}</Text>
                    </View>
                    <View
                      style={{
                        ...styles.menuBody,
                        width: '20%',
                        backgroundColor: 'wheat',
                      }}>
                      <Text style={styles.headerTxt}>{item.ITEM_ID}</Text>
                    </View>
                    <View style={{...styles.menuBody, width: '20%'}}>
                      <Text style={styles.headerTxt}>Qty</Text>
                    </View>
                  </View>
                );
              }}
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
    backgroundColor: '#00f',
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  menuBody: {
    backgroundColor: '#00f',
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerTxt: {color: '#fff', fontWeight: '600', fontSize: 16},
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  leftSide: {width: '30%', borderRightWidth: 2, borderColor: '#ccc'},
  rightSide: {
    flex: 1,
    backgroundColor: 'orange',
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
    backgroundColor: 'red',
  },
  memberLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    // marginTop: 10,
    // flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -2,
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
});

export default FlatMenuScreen;
