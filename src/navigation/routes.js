import React, {useState, useEffect, useReducer} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import {createDrawerNavigator} from '@react-navigation/drawer';
// import {View} from 'react-native';

import {
  HomeStackScreen,
  SettingsStackScreen,
  MenuStackScreens,
  TableStackScreens,
  OrderStackScreens,
  MenuTabScreen,
} from './HomeStackScreens';
import CustomDrawerContent from './DrawerContent';
import RootStackScreen from './RootStackScreens';
// import AuthStackScreen from './AuthStackScreen';
// import {ActivityIndicator} from 'react-native-paper';
import {MainContext} from '../components/context';
import {MAIN_COLOR} from '../constants/colors';
import {blankOrder} from '../constants';

const Drawer = createDrawerNavigator();

function Routes() {
  const [userToken, setUserToken] = useState(true);
  const [state, setState] = useState({classes: [], items: []});
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState({...blankOrder});
  const [orders, setOrders] = useState([]);

  const signIn = (username, password) => {
    console.log({username, password});
    return true;
  };
  const signOut = () => {
    // clear localstore
    setUserToken(false);
  };

  return (
    <MainContext.Provider
      value={{
        signIn,
        setUserToken,
        signOut,
        state,
        setState,
        user,
        setUser,
        order,
        setOrder,
        orders,
        setOrders,
      }}>
      <Drawer.Navigator
        // initialRouteName="Settings"
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {backgroundColor: MAIN_COLOR},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}>
        {!userToken ? (
          <Drawer.Screen
            name="RootStackScreen"
            options={{headerShown: false}}
            component={RootStackScreen}
          />
        ) : (
          <>
            <Drawer.Screen name="Home" component={HomeStackScreen} />
            <Drawer.Screen name="Tables" component={TableStackScreens} />
            <Drawer.Screen name="Menu" component={MenuTabScreen} />
            <Drawer.Screen name="Orders" component={OrderStackScreens} />
            <Drawer.Screen name="Settings" component={SettingsStackScreen} />
          </>
        )}
      </Drawer.Navigator>
    </MainContext.Provider>
  );
}

export default Routes;
