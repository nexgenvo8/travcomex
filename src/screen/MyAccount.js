import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import Colors from './color';
import PersonIcon from 'react-native-vector-icons/Octicons';
import Header from './Header/Header';
import globalStyles from './GlobalCSS';
import {baseUrl, logindetailslist} from './baseURL/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '../theme/ThemeContext';
import {universityFullName} from './constants';

const MyAcount = ({navigation}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const [sessionData, setSessionData] = useState([]);
  const [userData, setUserData] = useState([]);
  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem('userData');
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };
  useEffect(() => {
    UserValue();
    LogindetailslistApi();
  }, []);
  const LogindetailslistApi = async () => {
    try {
      const payload = JSON.stringify({
        userId: userData?.User?.userId,
      });
      const response = await fetch(`${baseUrl}${logindetailslist}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });
      // const text = await response.text();
      // console.log(text, 'texttexttexttext');
      const data = await response.json();
      console.log('Response data:', data);
      setSessionData(data?.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: colors.textinputBackgroundcolor,
          margin: 10,
          flexDirection: 'row',
          paddingVertical: 10,
        }}>
        <View
          style={{
            margin: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <PersonIcon
            name="dot-fill"
            size={25}
            color={colors.AppmainColor}
            // style={{color: '#00e800'}}
            onPress={() => navigation.goBack()}
          />
        </View>

        <View>
          <Text style={{color: colors.textColor}}>Login From</Text>
          <Text style={{color: colors.textColor}}>
            Device: {item.deviceName}
          </Text>
          <Text style={{color: colors.textColor}}>IP: {item.ipAddress}</Text>
          <Text style={{color: colors.textColor}}>
            Login on: {item.loginDateTime}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles?.SafeAreaView,
        backgroundColor: colors.background,
      }}>
      <Header title={'My Account'} navigation={navigation} />

      <View style={globalStyles?.FX_1_BG_White}>
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <View
            style={{
              borderBottomWidth: 0.5,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginTop: 10,
              borderBottomColor: colors.textinputbordercolor,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.textColor,
              }}>
              E-mail address
            </Text>
            <Text style={{fontSize: 14, color: colors.textColor}}>
              {userData?.User?.email}
            </Text>
          </View>

          <View
            style={{
              borderBottomWidth: 0.5,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginTop: 10,
              borderBottomColor: colors.textinputbordercolor,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.textColor,
              }}>
              Password
            </Text>
            <Text style={{fontSize: 14, color: colors.textColor}}>
              ********
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 0.5,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginTop: 10,
              borderBottomColor: colors.textinputbordercolor,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.textColor,
              }}>
              Your {universityFullName} sessions
            </Text>
          </View>

          <View>
            <FlatList
              data={sessionData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </View>
        </ScrollView>
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
    borderBottomWidth: 0.5,
  },
});

export default MyAcount;
