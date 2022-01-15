import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ButtonComponent from '../../components/button';
// import {TABLE_STACK_SCREEN} from '../../navigation/constants';

const OrderScreen = ({navigation}) => {
    const onPressHandler = () => {
      navigation.navigate(TABLE_STACK_SCREEN);
    };
  return (
    <View style={styles.body}>
      <Text>Order Screen here</Text>
      <ButtonComponent
        title="Go to Tables"
        onPress={() => {
          onPressHandler();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default OrderScreen;
