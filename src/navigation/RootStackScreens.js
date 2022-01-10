import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {View, Text, StyleSheet} from 'react-native';


import LoginScreen from '../screens/LoginScreens/Login';
import AreaOptionsScreen from '../screens/LoginScreens/AreaOptions';
import URLOptionsScreen from '../screens/LoginScreens/URLOptions';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { MAIN_COLOR } from '../constants/colors';

const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const RootStackScreen = ({navigation}) => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="LoginScreen"
        options={{headerShown: false}}
        component={LoginScreen}
      />
      <RootStack.Screen
        name="OptionsScreen"
        options={{
          title: 'Options',
          headerStyle: {backgroundColor: MAIN_COLOR},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
        component={OptionsTabScreen}
      />
    </RootStack.Navigator>
  );
};

const OptionsTabScreen = () => {
  return (
    <Tab.Navigator initialRouteName="AreaOptionsScreen" activeColor="#fff">
      <Tab.Screen
        name="AreaOptionsScreen"
        component={AreaOptionsScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Area Options',
          tabBarColor: '#009387',
          tabBarIcon: ({color}) => (
            <AntDesign name="rest" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="URLOptionsScreen"
        component={URLOptionsScreen}
        // shifting={true}
        options={{
          tabBarLabel: 'URL Option',
          headerShown: false,
          tabBarColor: '#0087ff',
          tabBarIcon: ({color, focused}) => (
            <Icon name="web" color={color} size={26} />
          ),
          // tabBarBadge: 3,
          // tabBarBadgeStyle: {
          //   color: '#f0f',
          //   fontWeight: 'bold',
          //   backgroundColor: 'white',
          // },
        }}
      />
    </Tab.Navigator>
  );
};

const AreaOptionsScreen1 = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'red'}}>
      <Text>Area Options Screen</Text>
    </View>
  );
};

export default RootStackScreen;
