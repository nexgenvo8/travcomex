import React, {useEffect, useState} from 'react';
import {
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import globalStyles from '../screen/GlobalCSS';
import {useDrawerStatus} from '@react-navigation/drawer';
import {useTheme} from '../theme/ThemeContext';

export default function CustomDrawerContent({
  fetchUserProfile,
  userProfileData,
  contacts,
  highlight,
  ...props
}) {
  const drawerStatus = useDrawerStatus();
  const {isDark, colors, toggleTheme} = useTheme();
  useEffect(() => {
    if (drawerStatus === 'open') {
      fetchUserProfile();
    }
  }, [drawerStatus]);

  const profileUrl = userProfileData?.Data?.profilePhoto;
  const cleanUrl = profileUrl
    ? profileUrl.includes('?')
      ? `${profileUrl}&t=${Date.now()}`
      : `${profileUrl}?t=${Date.now()}`
    : null;

  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{paddingBottom: 20}}
        keyboardShouldPersistTaps="handled">
        <View style={styles.profileContainer}>
          <Image
            source={
              profileUrl
                ? {uri: cleanUrl}
                : require('../assets/placeholderprofileimage.png')
            }
            style={styles.profileImage}
          />
          <Text
            style={[styles.userName, {marginTop: 20, color: colors.textColor}]}>
            {userProfileData?.Data?.firstName} {userProfileData?.Data?.lastName}
          </Text>
        </View>

        <View style={globalStyles.AI}>
          <View style={globalStyles.ActionView}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('Contacts', {
                  ContactsScreen: 'ContactsScreen',
                })
              }
              style={globalStyles.AI}>
              <Text style={{...globalStyles.FW_B, color: colors.textColor}}>
                Contacts
              </Text>
              <Text
                style={{...globalStyles.ValueText, color: colors.AppmainColor}}>
                {Array.isArray(contacts)
                  ? contacts.length
                  : typeof contacts === 'number'
                  ? contacts
                  : 0}
              </Text>
            </TouchableOpacity>
            <View style={globalStyles.AI}>
              <Text style={{...globalStyles.FW_B, color: colors.textColor}}>
                Views
              </Text>
              <Text
                style={{...globalStyles.ValueText, color: colors.AppmainColor}}>
                {userProfileData?.Data?.views}
              </Text>
            </View>
            <View style={globalStyles.AI}>
              <Text style={{...globalStyles.FW_B, color: colors.textColor}}>
                Actions
              </Text>
              <Text
                style={{...globalStyles.ValueText, color: colors.AppmainColor}}>
                {highlight}
              </Text>
            </View>
          </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity
        onPress={() => Linking.openURL('https://www.corrintech.com/')}
        style={styles.poweredByContainer}>
        <Text style={{...styles.poweredByText, color: colors.textColor}}>
          Powered by
        </Text>
        <Image
          source={
            isDark
              ? require('../assets/corrintech_dark.png')
              : require('../assets/corrintech.png')
          }
          style={styles.poweredByLogo}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  poweredByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 20,
  },
  poweredByText: {
    fontSize: 14,
    paddingRight: 10,
  },
  poweredByLogo: {
    width: 50,
    height: 50,
  },
});
