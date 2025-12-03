import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from '../Home';
import FindMentor from '../FindMentor';
import Articles from '../Articles';
import JobOpportunities from './JobOpportunities';
import GuestSpeakersTrainers from './GuestSpeakersTrainers';
import CompanyProfiles from './CompanyProfiles';
import CareerEnhancers from './CareerEnhancers';
import JobFairRegistration from './JobFairRegistration';
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const [userProfileData, setUserProfileData] = useState({});

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userProfileData');
        if (storedData) setUserProfileData(JSON.parse(storedData));
      } catch (error) {
        console.error('Failed to retrieve profile data', error);
      }
    };

    getProfileData();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        <Image
          source={{uri: userProfileData?.profilePhoto}}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>
          {userProfileData?.firstName} {userProfileData?.lastName}
        </Text>
        <Text style={styles.userEmail}>{userProfileData?.email}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="FindMentor" component={FindMentor} />
      <Drawer.Screen name="Articles" component={Articles} />
      <Drawer.Screen name="JobOpportunities" component={JobOpportunities} />
      <Drawer.Screen
        name="GuestSpeakersTrainers"
        component={GuestSpeakersTrainers}
      />
      <Drawer.Screen name="CompanyProfiles" component={CompanyProfiles} />
      <Drawer.Screen name="CareerEnhancers" component={CareerEnhancers} />
      <Drawer.Screen
        name="JobFairRegistration"
        component={JobFairRegistration}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
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
  userEmail: {
    fontSize: 14,
    color: 'gray',
  },
});
