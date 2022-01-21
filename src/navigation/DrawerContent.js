import React, {useState} from 'react';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, StyleSheet} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import {MainContext} from '../components/context';

function CustomDrawerContent(props) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const {signOut, user} = React.useContext(MainContext);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };
  const {navigation} = props;
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Avatar.Image
                size={50}
                source={{
                  uri: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg',
                }}
              />
              <View style={{flexDirection: 'column', marginLeft: 15}}>
                <Title style={styles.title}>{user && user.full_name}</Title>
                <Caption style={styles.caption}>{user && user.empno}</Caption>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.section}>
                <Caption style={styles.caption}>Login@ </Caption>
                <Paragraph style={{...styles.paragraph, ...styles.caption}}>
                  {/* 15:20 */}
                  {user && user.login_time}
                </Paragraph>
              </View>
              <View style={styles.section}>
                <Caption style={styles.caption}>Date</Caption>
                <Paragraph style={{...styles.paragraph, ...styles.caption}}>
                  : {user && user.wdate}
                </Paragraph>
              </View>
            </View>
          </View>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              label="Home"
              icon={({color, size}) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              onPress={() => {
                navigation.navigate('Home');
              }}
            />
            <DrawerItem
              label="Tables"
              icon={({color, size}) => (
                <Icon name="table-chair" color={color} size={size} />
              )}
              onPress={() => {
                navigation.navigate('Tables');
              }}
              
            />
            <DrawerItem
              label="Orders"
              icon={({color, size}) => (
                <Icon name="cart-outline" color={color} size={size} />
              )}
              onPress={() => {
                // navigation.navigate('Orders');
              }}
            />
            {/* <DrawerItem
              label="Menu"
              icon={({color, size}) => (
                <Icon name="bookmark-outline" color={color} size={size} />
              )}
              onPress={() => {
                navigation.navigate('Menu', {screen: 'MenuScreen'});
              }}
            /> */}
            <DrawerItem
              label="Settings"
              icon={({color, size}) => (
                <Icon name="cog-outline" color={color} size={size} />
              )}
              onPress={() => {
                // navigation.navigate('Settings');
              }}
            />
            <DrawerItem
              label="Support"
              icon={({color, size}) => (
                <Icon name="account-check-outline" color={color} size={size} />
              )}
              onPress={() => {}}
            />
          </Drawer.Section>
          <Drawer.Section title="Preferences">
            <TouchableRipple onPress={() => toggleTheme()}>
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={isDarkTheme} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          label="Sign Out"
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          onPress={() => {
            signOut();
            navigation.closeDrawer();
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default CustomDrawerContent;
