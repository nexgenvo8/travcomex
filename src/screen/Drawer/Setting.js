import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Colors from '../color';
import Icon from 'react-native-vector-icons/AntDesign';
import PersonIcon from 'react-native-vector-icons/Ionicons';
import LockIcon from 'react-native-vector-icons/Feather';
import BellIcon from 'react-native-vector-icons/FontAwesome';
import PassIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl, UpdateBasicDetails} from '../baseURL/api';
import {showSuccess} from '../components/Toast';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import {useTheme} from '../../theme/ThemeContext';
import Header from '../Header/Header';

const Setting = ({navigation}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const [userData, setUserData] = useState([]);
  const [isModalVisibldelete, setIsModalVisibledelete] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem('userData');
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };
  useEffect(() => {
    UserValue();
  }, []);
  const confirmLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const onLogoutCancel = () => {
    setIsLogoutModalVisible(false);
  };

  const onLogoutConfirm = async () => {
    setIsLogoutModalVisible(false);
    try {
      await AsyncStorage.clear();
      console.log('Logged out successfully');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     const loggedOut = await AsyncStorage.clear();
  //     // AsyncStorage.AsyncStorage.clear()('userToken');
  //     console.log('Logged out successfully', loggedOut);
  //     navigation.replace('Login'); // Navigate back to Login
  //   } catch (error) {
  //     console.error('Error logging out:', error);
  //   }
  // };
  const confirmDelete = () => {
    setIsModalVisibledelete(true);
  };

  const onCancel = () => {
    setIsModalVisibledelete(false);
  };

  const onConfirm = () => {
    deactivateAccount();
    setIsModalVisibledelete(false);
  };
  const deactivateAccount = async () => {
    try {
      const response = await fetch(`${baseUrl}${UpdateBasicDetails}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          activeYN: 'N',
        }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        showSuccess('Your account has been deactivated successfully.');
        handleLogout();
      } else {
        console.error('Deactivation failed:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <View style={{flex: 1}}>
        <Header title="Settings" navigation={navigation} />
        <ScrollView style={{flex: 1, marginTop: 10}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyAcount')}
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: colors.textinputbordercolor,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <PersonIcon
                name="person-outline"
                size={20}
                color={colors.backIconColor}
                style={{paddingLeft: 10, paddingRight: 10}}
                onPress={() => navigation.goBack()}
              />
              <Text style={{fontSize: 17, color: colors.textColor}}>
                My Account
              </Text>
            </View>

            <Icon
              name="right"
              size={20}
              color={colors.backIconColor}
              style={{paddingLeft: 10}}
              //   onPress={() => navigation.navigate("MyAcount")}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SettingPrivcay')}
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: colors.textinputbordercolor,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <LockIcon
                name="lock"
                size={20}
                color={colors.backIconColor}
                style={{paddingLeft: 10, paddingRight: 10}}
                // onPress={() => navigation.goBack()}
              />
              <Text style={{fontSize: 17, color: colors.textColor}}>
                Privacy
              </Text>
            </View>

            <Icon
              name="right"
              size={20}
              color={colors.backIconColor}
              style={{paddingLeft: 10}}
              // onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SettingNoticafication')}
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: colors.textinputbordercolor,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <BellIcon
                name="bell-o"
                size={20}
                color={colors.backIconColor}
                style={{paddingLeft: 10, paddingRight: 10}}
                // onPress={() => navigation.goBack()}
              />
              <Text style={{fontSize: 17, color: colors.textColor}}>
                Notifications
              </Text>
            </View>

            <Icon
              name="right"
              size={20}
              color={colors.backIconColor}
              style={{paddingLeft: 10}}
              // onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ChangePassword')}
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: colors.textinputbordercolor,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <PassIcon
                name="lock-reset"
                size={22}
                color={colors.backIconColor}
                style={{paddingLeft: 10, paddingRight: 10}}
                // onPress={() => navigation.goBack()}
              />
              <Text style={{fontSize: 17, color: colors.textColor}}>
                Change Password
              </Text>
            </View>

            <Icon
              name="right"
              size={20}
              color={colors.backIconColor}
              style={{paddingLeft: 10}}
              // onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={confirmDelete}
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: colors.textinputbordercolor,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <PassIcon
                name="account-remove"
                size={22}
                color={colors.backIconColor}
                style={{paddingLeft: 10, paddingRight: 10}}
              />
              <Text style={{fontSize: 17, color: colors.textColor}}>
                Delete account
              </Text>
            </View>

            <Icon
              name="right"
              size={20}
              color={colors.backIconColor}
              style={{paddingLeft: 10}}
              // onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={confirmLogout}
            // onPress={() => handleLogout()}
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: colors.textinputbordercolor,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <PassIcon
                name="lock-reset"
                size={22}
                color={colors.backIconColor}
                style={{paddingLeft: 10, paddingRight: 10}}
                // onPress={() => navigation.goBack()}
              />
              <Text style={{fontSize: 17, color: colors.textColor}}>
                Logout
              </Text>
            </View>

            <Icon
              name="right"
              size={20}
              color={colors.backIconColor}
              style={{paddingLeft: 10}}
              // onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
        </ScrollView>
        <ConfirmDeleteModal
          isVisible={isModalVisibldelete}
          onCancel={onCancel}
          onConfirm={onConfirm}
          title="Confirm Deletion"
          message="Are you sure you want to delete your account?"
        />
        <ConfirmDeleteModal
          isVisible={isLogoutModalVisible}
          onCancel={onLogoutCancel}
          onConfirm={onLogoutConfirm}
          confirmButtonText="Logout"
          title="Confirm Logout"
          message="Are you sure you want to log out?"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flex: 0.09,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderBottomWidth: 0.5,
  },
});

export default Setting;
