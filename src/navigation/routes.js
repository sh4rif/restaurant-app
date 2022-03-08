import React, {useState, useEffect, useReducer} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import {
  HomeStackScreen,
  SettingsStackScreen,
  TableStackScreens,
  OrderStackScreens,
  MenuTabScreen,
  BookedTableTabScreen,
} from './HomeStackScreens';

import CustomDrawerContent from './DrawerContent';
import RootStackScreen from './RootStackScreens';
import {MainContext} from '../components/context';
import {MAIN_COLOR} from '../constants/colors';
import {blankOrder, storageVarNames} from '../constants';

const Drawer = createDrawerNavigator();

function Routes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userArea, setUserArea] = useState(null);
  const [user, setUser] = useState(null);
  const [state, setState] = useState({classes: [], items: []});
  const [order, setOrder] = useState({...blankOrder});
  const [orders, setOrders] = useState([]);
  const [baseURL, setBaseURL] = useState(null);
  const [member, setMember] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [bookedOrder, setBookedOrder] = useState({member_id: null, data: []});

  useEffect(() => {
    getArea();
  }, []);

  const getArea = async () => {
    try {
      const area = await AsyncStorageLib.getItem(storageVarNames.area);
      setUserArea(JSON.parse(area));
    } catch (e) {}
  };

  const signIn = payload => {
    setUser({...payload});
  };
  const signOut = () => {
    setUser(null);
    setIsLoggedIn(null);
    setUserArea(null);
    setState({classes: [], items: []});
    setOrder({...blankOrder});
    setOrders([]);
    setBaseURL(null);
    setMember(null);
  };

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        signIn,
        signOut,
        state,
        setState,
        userArea,
        setUserArea,
        user,
        order,
        setOrder,
        orders,
        setOrders,
        baseURL,
        setBaseURL,
        member,
        setMember,
        selectedTable,
        setSelectedTable,
        bookedOrder,
        setBookedOrder,
      }}>
      <Drawer.Navigator
        // initialRouteName="Settings"
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {backgroundColor: MAIN_COLOR},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}>
        {isLoggedIn ? (
          <>
            <Drawer.Screen name="Home" component={HomeStackScreen} />
            <Drawer.Screen name="Tables" component={TableStackScreens} />
            <Drawer.Screen name="Menu" component={MenuTabScreen} />
            <Drawer.Screen name="Orders" component={OrderStackScreens} />
            <Drawer.Screen name="Settings" component={SettingsStackScreen} />
            <Drawer.Screen
              name="OrderDetail"
              component={BookedTableTabScreen}
              options={{headerShown: true, headerTitle: 'Order Details'}}
            />
          </>
        ) : (
          <Drawer.Screen
            name="RootStackScreen"
            options={{headerShown: false}}
            component={RootStackScreen}
          />
        )}
      </Drawer.Navigator>
    </MainContext.Provider>
  );
}

export default Routes;
