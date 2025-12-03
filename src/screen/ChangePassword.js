import {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Colors from './color';
import Header from './Header/Header';
import globalStyles from './GlobalCSS';
import {baseUrl, ChangePW, ForgetPW} from './baseURL/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showError} from './components/Toast';
import {useTheme} from '../theme/ThemeContext';

const ChangePassword = ({navigation, route}) => {
  const {Item = {}, Email = {}, AdditionalData = []} = route.params || {};
  const {isDark, colors, toggleTheme} = useTheme();
  const [number, onChangeNumber] = useState(Email?.length > 0 ? Email : '');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [errorOldPass, setErrorOldPass] = useState(false);
  const [errorNewPass, setErrorNewPass] = useState(false);
  const [errorConfirmPass, setErrorConfirmPass] = useState(false);
  const [userData, setUserData] = useState([]);

  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem('userData');
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };
  useEffect(() => {
    UserValue();
  }, []);

  const handleChangePassword = async () => {
    let isValid = true;

    if (!number) {
      setErrorOldPass(true);
      isValid = false;
    } else {
      setErrorOldPass(false);
    }

    if (!newPassword) {
      setErrorNewPass(true);
      isValid = false;
    } else {
      setErrorNewPass(false);
    }

    if (!newPasswordConfirm || newPasswordConfirm !== newPassword) {
      setErrorConfirmPass(true);
      isValid = false;
    } else {
      setErrorConfirmPass(false);
    }

    if (!isValid) return;

    try {
      const response = await fetch(
        `${baseUrl}${Item == 'Forget' ? ForgetPW : ChangePW}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userData?.User?.userId,
            ...(Item === 'Forget' ? {email: number} : {oldPassword: number}),
            newPassword: newPassword,
            confirmPassword: newPasswordConfirm,
          }),
        },
      );

      const data = await response.json();
      console.log('response', data);

      if (response.ok) {
        console.log('Password changed successfully', data);

        showError('Password changed successfully');
        Item === 'Forget' ? navigation.pop(2) : navigation?.goBack();
      } else {
        showError(data?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Failed to change password. Please try again.');
    }
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles?.SafeAreaView,
        backgroundColor: colors.background,
      }}>
      <Header
        title={Item == 'Forget' ? 'Forget Password ' : 'Change Password'}
        navigation={navigation}
      />
      <View style={{...globalStyles?.FX_1_BG_White}}>
        <ScrollView
          style={{
            flex: 1,
            marginTop: 10,
            paddingHorizontal: 12,
          }}>
          <View>
            <Text style={{...globalStyles?.HLChagePW, color: colors.textColor}}>
              {Item == 'Forget' ? 'Email' : 'Old Password'}
            </Text>

            <TextInput
              style={{
                ...globalStyles.textInput,
                paddingTop: 10,
                borderColor: errorOldPass
                  ? Colors.error
                  : colors.textinputbordercolor,
                backgroundColor: colors.textinputBackgroundcolor,
                color: colors.textColor,
              }}
              onChangeText={value => {
                onChangeNumber(value);
                setErrorOldPass(value.trim().length === 0);
              }}
              value={number}
              placeholder="Write your Old Password"
              keyboardType="default"
              multiline
              placeholderTextColor={colors.placeholderTextColor}
              editable={Item == 'Forget' ? false : true}
            />
          </View>

          <View>
            <Text style={{...globalStyles?.HLChagePW, color: colors.textColor}}>
              New Password
            </Text>

            <TextInput
              style={{
                ...globalStyles.textInput,
                paddingTop: 10,
                borderColor: errorNewPass
                  ? Colors.error
                  : colors.textinputbordercolor,
                backgroundColor: colors.textinputBackgroundcolor,
                color: colors.textColor,
              }}
              onChangeText={value => {
                setNewPassword(value);
                setErrorNewPass(value.trim().length === 0);
              }}
              value={newPassword}
              placeholder="Write your New Password"
              keyboardType="default"
              multiline
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>

          <View>
            <Text style={{...globalStyles?.HLChagePW, color: colors.textColor}}>
              New Password Confirmation
            </Text>

            <TextInput
              style={{
                ...globalStyles.textInput,
                borderColor: errorConfirmPass
                  ? Colors.error
                  : colors.textinputbordercolor,
                backgroundColor: colors.textinputBackgroundcolor,
                color: colors.textColor,
                paddingTop: 10,
                // borderColor: errorJob ? Colors.error : Colors.gray,
              }}
              onChangeText={value => {
                setNewPasswordConfirm(value);
                setErrorConfirmPass(value.trim().length === 0);
              }}
              value={newPasswordConfirm}
              placeholder="Write your New Password Confirmation"
              keyboardType="default"
              multiline
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>
          <View style={globalStyles?.SaveBtnView}>
            <TouchableOpacity
              style={{
                ...globalStyles?.SaveBtn,
                backgroundColor: colors.AppmainColor,
              }}
              onPress={handleChangePassword}>
              <Text
                style={[
                  globalStyles?.SaveBtnText,
                  {color: colors.ButtonTextColor},
                ]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
