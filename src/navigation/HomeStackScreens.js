import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/AuthScreens/Home';
import MenuScreen from '../screens/AuthScreens/Menu';
import OrderScreen from '../screens/AuthScreens/Orders';
import SettingsScreen from '../screens/AuthScreens/Settings';
import TableScreen from '../screens/AuthScreens/Tables';
import FlatMenuScreen from '../screens/AuthScreens/Menu/FlatMenu';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MAIN_COLOR} from '../constants/colors';
import ViewOrderScreen from '../screens/AuthScreens/order/ViewOrder';
import ViewBookedTableOrderScr from '../screens/AuthScreens/order/ViewBookedTableOrder';

const MenuStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MenuStackTwo = createStackNavigator();

export const TableStackScreens = ({navigation}) => {
  return (
    <MenuStack.Navigator screenOptions={{headerShown: false}}>
      <MenuStack.Screen name={'TableScreen'} component={TableScreen} />
    </MenuStack.Navigator>
  );
};

export const MenuStackScreens = ({navigation}) => {
  return (
    <MenuStack.Navigator screenOptions={{headerShown: false}}>
      <MenuStack.Screen name={'MenuScreen'} component={MenuScreen} />
    </MenuStack.Navigator>
  );
};

export const OrderStackScreens = ({navigation}) => {
  return (
    <MenuStack.Navigator screenOptions={{headerShown: false}}>
      <MenuStack.Screen name={'OrderScreen'} component={OrderScreen} />
    </MenuStack.Navigator>
  );
};

export const SettingsStackScreen = ({navigation}) => {
  return (
    <MenuStack.Navigator screenOptions={{headerShown: false}}>
      <MenuStack.Screen name={'SettingsScreen'} component={SettingsScreen} />
    </MenuStack.Navigator>
  );
};

export const HomeStackScreen = ({navigation}) => {
  return (
    <MenuStack.Navigator screenOptions={{headerShown: false}}>
      <MenuStack.Screen name={'HomeScreenStack'} component={HomeScreen} />
    </MenuStack.Navigator>
  );
};

export const MenuTabScreen = ({navigation}) => {
  return (
    <Tab.Navigator initialRouteName="MenuScreen" activeColor="#fff">
      <Tab.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'MENU',
          tabBarColor: MAIN_COLOR,
          tabBarIcon: ({color}) => (
            <MIcon
              name="order-alphabetical-ascending"
              color={color}
              size={30}
            />
          ),
        }}
      />
      <Tab.Screen
        name="FlatMenuScreen"
        component={FlatMenuScreen}
        // shifting={true}
        options={{
          tabBarLabel: 'SEARCH',
          headerShown: false,
          tabBarColor: MAIN_COLOR,
          tabBarIcon: ({color}) => (
            <MIcon name="database-search" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="ViewOrderScreen"
        component={ViewOrderScreen}
        // shifting={true}
        options={{
          tabBarLabel: 'REVIEW ORDER',
          headerShown: false,
          tabBarColor: MAIN_COLOR,
          tabBarIcon: ({color}) => (
            <MIcon
              name="order-bool-descending-variant"
              color={color}
              size={30}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const BookedTableTabScreen = ({navigation}) => {
  return (
    <MenuStackTwo.Navigator activeColor="#fff">
      <MenuStackTwo.Screen
        name="ViewBookedTableOrderScr"
        component={ViewBookedTableOrderScr}
        options={{headerShown: false}}
      />
    </MenuStackTwo.Navigator>
  );
};
