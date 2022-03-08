import React, {useContext, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {useTheme} from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  Alert,
} from 'react-native';

import {VERIFY_MEMBER} from '../../../constants';
import {MainContext} from '../../../components/context';
import {ERR_CLR, MAIN_COLOR, SUCCESS_COLOR} from '../../../constants/colors';

const VerifyMember = ({member_id}) => {
  const {colors} = useTheme();
  const [memberID, setMemberID] = useState(member_id || '');
  const [showModal, setShowModal] = useState(false);
  const [bgColor, setBgColor] = useState(MAIN_COLOR);
  const [btnIcon, setBtnIcon] = useState('account-search');
  const [member, setMember] = useState({
    isActive: false,
    memberName: '',
    memberID: '',
    memberPic: null,
    status: '',
    block_status: '',
  });

  const {baseURL, setOrder, order} = useContext(MainContext);

  const verifyMember = async () => {
    if (member.memberID === memberID) {
      setShowModal(true);
      return;
    }
    try {
      const url = `${baseURL}${VERIFY_MEMBER}?memberid=${memberID}`;
      const {data} = await axios.get(url);
      if (data.error) {
        Alert.alert('ERROR', data.message);
        return;
      }
      setShowModal(true);
      const {member_id, member_name, status, block_status, image} =
        data.data[0];
      const isActive = status === 'ACTIVE' && block_status === 'ACTIVE';
      setMember({
        ...member,
        status,
        isActive,
        block_status,
        memberID: member_id,
        memberName: member_name,
        memberPic: image,
      });

      setBgColor(isActive ? SUCCESS_COLOR : ERR_CLR);
      setBtnIcon(isActive ? 'account-check' : 'account-remove');
    } catch (e) {}
  };

  const onMemberIdChange = member_id => {
    setMemberID(member_id);
    setOrder({...order, member_id});
    if (bgColor !== MAIN_COLOR) setBgColor(MAIN_COLOR);
    if (btnIcon !== 'account-search') setBtnIcon('account-search');
  };

  return (
    <>
      <Modal
        visible={showModal}
        animationType="slide"
        hardwareAccelerated
        onRequestClose={() => setShowModal(false)}
        transparent>
        <View style={styles.member_view}>
          <View style={styles.member_modal}>
            <View
              style={{
                ...styles.member_modal_title,
                backgroundColor: member.isActive ? SUCCESS_COLOR : ERR_CLR,
              }}>
              <Text style={styles.text}>
                {member.isActive ? 'ACTIVE' : 'IN-ACTIVE'} MEMBER{' '}
              </Text>
            </View>
            <View style={styles.member_modal_body}>
              {member.memberPic ? (
                <Image
                  // source={{uri: `data:image/bmp;base64,${member.memberPic}`}}
                  source={{uri: member.memberPic}}
                  style={{width: 300, height: 300, resizeMode: 'contain'}}
                />
              ) : (
                <Image
                  source={require('../../../../assets/images/user1.png')}
                  style={{width: 300, height: 300}}
                />
              )}
              <View style={styles.member_modal_body_context}>
                <View style={styles.model_info_left_side}>
                  <Text style={{...styles.modal_text, color: MAIN_COLOR}}>
                    Member ID:
                  </Text>
                </View>
                <View style={{width: 208}}>
                  <Text
                    style={{
                      ...styles.modal_text,
                      letterSpacing: 0,
                      color: '#000',
                    }}>
                    {member.memberID}
                  </Text>
                </View>
              </View>
              <View style={styles.member_modal_body_context}>
                <View style={styles.model_info_left_side}>
                  <Text style={{...styles.modal_text, color: MAIN_COLOR}}>
                    Member Name:
                  </Text>
                </View>
                <View style={{width: 208}}>
                  <Text
                    style={{
                      ...styles.modal_text,
                      letterSpacing: 0,
                      color: '#000',
                    }}>
                    {member.memberName}
                  </Text>
                </View>
              </View>
              <View style={styles.member_modal_body_context}>
                <View style={styles.model_info_left_side}>
                  <Text style={{...styles.modal_text, color: MAIN_COLOR}}>
                    Block Status:
                  </Text>
                </View>
                <View style={{width: 208}}>
                  <Text
                    style={{
                      ...styles.modal_text,
                      letterSpacing: 0,
                      color: '#000',
                    }}>
                    {member.block_status}
                  </Text>
                </View>
              </View>
              <View style={styles.member_modal_body_context}>
                <View style={styles.model_info_left_side}>
                  <Text
                    style={{
                      ...styles.modal_text,
                      color: member.status === 'ACTIVE' ? MAIN_COLOR : ERR_CLR,
                    }}>
                    Status:
                  </Text>
                </View>
                <View
                  style={{
                    width: 208,
                    backgroundColor:
                      member.status === 'ACTIVE' ? 'white' : ERR_CLR,
                  }}>
                  <Text
                    style={{
                      ...styles.modal_text,
                      letterSpacing: 0,
                      color: member.status === 'ACTIVE' ? '#000' : '#fff',
                    }}>
                    {member.status}
                  </Text>
                </View>
              </View>
            </View>
            <Pressable
              style={styles.member_modal_footer}
              onPress={() => setShowModal(false)}>
              <Text
                style={{
                  ...styles.modal_text,
                  fontWeight: 'bold',
                  fontSize: 25,
                }}>
                CLOSE
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.row}>
        <Text style={styles.memberLabel}>Member ID : </Text>
        <TextInput
          placeholder="i.e R-123"
          placeholderTextColor="#CCC"
          style={{...styles.textInput, color: colors.text}}
          autoCapitalize="characters"
          onChangeText={onMemberIdChange}
          value={member_id}
        />
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: memberID.trim().length ? bgColor : '#aaa',
          }}
          onPress={verifyMember}
          disabled={!memberID.trim().length}>
          <Text style={{...styles.text}}>
            <Icon name={btnIcon} size={25} />
            VERIFY
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  memberLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    marginTop: 10,
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
    fontSize: 20,
    fontWeight: '600',
    color: '#20315f',
    color: '#fff',
    letterSpacing: 3,
  },
  button: {
    backgroundColor: MAIN_COLOR,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  member_modal: {
    // padding: 20,
    width: 400,
    height: 650,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
  },
  member_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  member_modal_title: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modal_text: {
    fontSize: 20,
    letterSpacing: 2,
    // fontWeight: '700',
    color: '#fff',
  },
  member_modal_body: {
    height: 538,
    // justifyContent: 'center',
    marginTop: 10,
    alignItems: 'center',
    // backgroundColor: '#0f0f'
  },
  member_modal_footer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MAIN_COLOR,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  member_modal_body_context: {
    flexDirection: 'row',
    // backgroundColor: '#f0f',
    paddingVertical: 5,
    width: 398,
  },
  model_info_left_side: {
    width: 190,
    paddingLeft: 10,
    justifyContent: 'center',
  },
});

export default VerifyMember;
