import React, {useState, useEffect} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import {useTheme} from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import axiosClient from '../../constants/axiosClient';
import {BUTTON_GRADIENT, ERR_CLR, MAIN_COLOR} from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import { CheckBox } from 'react-native-elements';
import { GET_AREAS } from '../../constants';


const regEx = /^(ftp|http|https):\/\/[^ ",]+$/;

const AreaOptionsScreen = () => {
  const [state, setState] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [ckbox, setCkbox] = useState(false)
  const {colors} = useTheme();

  useEffect(() => {
    getAreas();
  }, []);

  const getAreas = async () => {
    try {
      const {data} = await axiosClient.get(GET_AREAS);
      console.log('areas', data);
      setState([...data]);
    } catch (e) {
      console.log('error while fetching areas', e);
    }
  };

  const renderAreas = ({item, index}) => {
    const bgColor = selectedArea === item.AREA_ID ? MAIN_COLOR : '#fff';
    const fontColor = selectedArea === item.AREA_ID ? '#fff' : '#000';
    // console.log({index, len: state.length - 1});
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('item', item);
          setSelectedArea(item.AREA_ID);
        }}>
        <View
          style={{
            paddingHorizontal: 10,
            cursor: 'pointer',
            paddingVertical: 10,
            backgroundColor: bgColor,
            borderBottomRightRadius: state.length - 1 === index ? 10 : 0,
            borderBottomLeftRadius: state.length - 1 === index ? 10 : 0,
            borderTopRightRadius: index === 0 ? 10 : 0,
            borderTopLeftRadius: index === 0 ? 10 : 0,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: fontColor}}>
            {item.AREA_DESC}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={MAIN_COLOR} barStyle="light-content" />
      <View style={styles.header}>
      <CheckBox
        checked={ckbox}
        onPress={(val) => {
          console.log('val', ckbox)
          setCkbox(!ckbox)
        }}
        checkedColor='#fff'
      />

        {/* <Text style={styles.text_header}>
          Please Select An Area
        </Text> */}
        {/* <Text>{JSON.stringify(state)}</Text> */}
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        {/* username field */}
        {/* <Text style={styles.text_footer}>AREAS</Text> */}
        <FlatList
          numColumns={1}
          keyExtractor={(item, index) => item.AREA_ID}
          data={state}
          renderItem={renderAreas}
        />

        {/* buttons */}
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => {
              // loginHandler(state.username, state.password);
              // signIn();
            }}>
            <LinearGradient colors={BUTTON_GRADIENT} style={styles.signIn}>
              <Text
                style={{...styles.textSign, color: '#fff', letterSpacing: 1}}>
                <FontAwesome name="door-open" size={25} /> SET AREA
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   body: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 9,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 20,
    letterSpacing: 3,
    fontWeight: 'bold',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AreaOptionsScreen;
