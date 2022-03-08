import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

export const ClassesMenu = ({data, onPress, selectedClassId}) => {
  return (
    <FlatList
      numColumns={1}
      keyExtractor={(item, index) => item.CLS_ID}
      data={data}
      renderItem={({item}) => {
        return (
          <TouchableOpacity
            style={
              selectedClassId === item.CLS_ID
                ? styles.buttonSelected
                : styles.button
            }
            onPress={() => {
              onPress(item);
            }}>
            <View style={styles.itemTxt}>
              <Text style={styles.clsTxt}>{item.CLS_DESC}</Text>
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
    paddingVertical: 20,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  clsTxt: {fontSize: 20, fontWeight: 'bold'},
  button: {marginTop: 5},
  buttonSelected: {backgroundColor: '#959393', marginTop: 5},
});

export default ClassesMenu;
