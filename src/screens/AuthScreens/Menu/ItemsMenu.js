import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

import {MAIN_COLOR} from '../../../constants/colors';

export const ItemsMenu = ({data, onPress}) => {
  return (
    <FlatList
      numColumns={1}
      keyExtractor={(item, index) => item.CLS_ID}
      data={data}
      renderItem={({item}) => {
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={e => {
              onPress(e, item);
            }}>
            <View style={styles.itemTxt}>
              <Text style={styles.classView}>{item.CLS_DESC}</Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  itemTxt: {
    width: '100%',
    // height: 30,
    // margin: 10,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#4ffed0',
  },
  classView: {fontSize: 16, margin: 3},
  button: {backgroundColor: MAIN_COLOR, marginTop: 5},
});

export default ItemsMenu;
