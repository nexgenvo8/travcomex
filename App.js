import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Linking,
  AppState,
  TouchableOpacity,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Login from "./src/screen/Login";
import Home from "./src/screen/Home";
import Contacts from "./src/screen/Contact";
import Groups from "./src/screen/Groups";
import Profile from "./src/screen/Profile";
import FindMentor from "./src/screen/FindMentor";
import Articles from "./src/screen/Articles";
import JobOpportunities from "./src/screen/Drawer/JobOpportunities";
import GuestSpeakersTrainers from "./src/screen/Drawer/GuestSpeakersTrainers";
import CompanyProfiles from "./src/screen/Drawer/CompanyProfiles";
import CareerEnhancers from "./src/screen/Drawer/CareerEnhancers";
import JobFairRegistration from "./src/screen/Drawer/JobFairRegistration";
import EventCalcander from "./src/screen/Drawer/EventCalcander";
import IntershipProject from "./src/screen/Drawer/IntershipProject";
import Setting from "./src/screen/Drawer/Setting";
import AddExperience from "./src/screen/AddExperience";
import AddEducation from "./src/screen/AddEducation";
import EditProfileDetails from "./src/screen/EditProfileDetails";
import MyAcount from "./src/screen/MyAccount";
import SettingPrivcay from "./src/screen/SettingPrivcay";
import ChangePassword from "./src/screen/ChangePassword";
import SettingNoticafication from "./src/screen/SettingNoticafication";
import ImageSelecter from "./src/screen/ImagesSelecter";
import GroupDetails from "./src/screen/GroupDetails";
import ListLike from "./src/screen/Post/ListLike";
import ContactList from "./src/screen/Contacts/ContactList";
import ProfileDetails from "./src/screen/Profile/ProfileDetails";
import ProfileHighLight from "./src/screen/Profile/ProfileHighLight";
import ArticlesList from "./src/screen/ArticleList";
import ArticleAdd from "./src/screen/ArticleAdd";
import ArticlesUserList from "./src/screen/ArticlesUserList";
import IntershipDetails from "./src/screen/IntershipProject/IntershipDetails";
import AddIntership from "./src/screen/IntershipProject/AddIntership";
import AddJob from "./src/screen/JOBOpportunities/AddJob";
import JobListComponent from "./src/screen/JOBOpportunities/JobListComponent";
import JobDetails from "./src/screen/JOBOpportunities/JobDetails";
import CompanyDetails from "./src/screen/Company/CompantDetails";
import AddCompany from "./src/screen/Company/AddCompany";
import ViewAllCompany from "./src/screen/Company/ViewAllComapany";
import AddUpdatePost from "./src/screen/Company/AddUpdatePost";
import Chat from "./src/screen/Chat/Chat";
import ChatDetails from "./src/screen/Chat/ChatDetails";
import EventDetails from "./src/screen/Events/EventDetails";
import AddEvent from "./src/screen/Events/AddEvent";
import ChatGroups from "./src/screen/Groups/ChatGroups";
import AddCareer from "./src/screen/CareerEnhancers/AddCareer";
import MentorChat from "./src/screen/MentorChat/MentorChat";
import KnowledgeHub from "./src/screen/KnowledgeHub/KnowledgeHub";
import globalStyles from "./src/screen/GlobalCSS";
import AddKnowledgeHub from "./src/screen/KnowledgeHub/AddKnowledgeHub";
import KnowledgeDetails from "./src/screen/KnowledgeHub/KnowledgeDetails";
import GuestDetails from "./src/Guest_Seapker/GuestDetails";
import AddTelentProfile from "./src/Guest_Seapker/AddTelentProfile";
import { PermissionsAndroid } from "react-native";
// import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from "@notifee/react-native";
import NotificationsScreen from "./src/screen/Notifications/NotificationsList";
import Toast from "react-native-toast-message";
import {
  baseUrl,
  contactList,
  HighLight,
  Profile_Detail,
  SendDeviceToken,
} from "./src/screen/baseURL/api";
import ForgetPassword from "./src/screen/PassWord/ForgetPassword";
import {
  fetchContactList,
  fetchHiglight,
} from "./src/screen/baseURL/ExperienceList";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import Registration from "./src/screen/Registration";
import GlobalSearch from "./src/screen/GlobalSearch";
import TEDxJMI from "./TEDxJMI";
import NoticeBoard from "./src/NoticeBoard";
import NoticeBoardDetails from "./src/screen/NoticeBoardDetails";
import CustomDrawerContent from "./src/screen/CustomDrawerContent";
import PlacementRegistration from "./src/screen/PlacementRegistration";
import PrivacyScreen from "./src/screen/PrivacyScreen";
import TermsScreen from "./src/screen/TermsScreen";
import AboutScreen from "./src/screen/AboutScreen";
import ContactUsScreen from "./src/screen/ContactUsScreen";
import FAQScreen from "./src/screen/FAQScreen";
import SharedPostScreen from "./src/screen/SharedPostScreen";
import { useTheme } from "./src/theme/ThemeContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import AnimatedTabBar from "./src/screen/components/AnimatedTabBar";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator(props) {
  const { isDark, colors, toggleTheme } = useTheme();
  const [userProfileData, setUserProfileData] = useState({});
  const [contacts, setContacts] = useState([]);
  const [highlight, setHighlight] = useState([]);

  const fetchUserProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;
      const parsedUserData = JSON.parse(userData);

      const response = await fetch(`${baseUrl}${Profile_Detail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parsedUserData?.User?.userId }),
      });

      const profile = await response.json();

      if (response.ok && profile?.Data) {
        setUserProfileData(profile);
        fetchContactList(profile, baseUrl, contactList, setContacts, () => {});
        fetchHiglight(profile, baseUrl, HighLight, setHighlight, () => {});
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.background,
        },
        drawerActiveTintColor: colors.AppmainColor,
        drawerInactiveTintColor: colors.textColor,
      }}
      drawerContent={(drawerProps) => (
        <CustomDrawerContent
          {...drawerProps}
          userProfileData={userProfileData}
          contacts={contacts}
          highlight={highlight}
          fetchUserProfile={fetchUserProfile}
        />
      )}
    >
      <Drawer.Screen
        name="Tabs"
        component={TabNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="person-search" size={size} color={color} />
          ),
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name={
          userProfileData?.Data?.usersType == 1
            ? "FindMentor"
            : "Become A Mentor"
        }
        component={FindMentor}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="person-search" size={size} color={color} />
          ),
          drawerLabel:
            userProfileData?.Data?.usersType == 1
              ? "Connect with DMC"
              : "Connect with B2B Agent",
        }}
      />
      <Drawer.Screen
        name="Articles"
        component={Articles}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="article" size={size} color={color} />
          ),
          drawerLabel: "Travel Blogs",
        }}
      />
      <Drawer.Screen
        name="EventCalcander"
        component={EventCalcander}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="event" size={size} color={color} />
          ),
          drawerLabel: "Event & Exhibitions",
        }}
      />
      <Drawer.Screen
        name="IntershipProject"
        component={IntershipProject}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="work" size={size} color={color} />
          ),
          drawerLabel: "Internships & Projects",
        }}
      />
      <Drawer.Screen
        name="JobOpportunities"
        component={JobOpportunities}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="business-center" size={size} color={color} />
          ),
          drawerLabel: "Job Opportunities",
        }}
      />
      <Drawer.Screen
        name="GuestSpeakersTrainers"
        component={GuestSpeakersTrainers}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="mic" size={size} color={color} />
          ),
          drawerLabel: "Industry Speakers & Trainers",
        }}
      />
      <Drawer.Screen
        name="CompanyProfiles"
        component={CompanyProfiles}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="apartment" size={size} color={color} />
          ),
          drawerLabel: "Company Profiles",
        }}
      />
      <Drawer.Screen
        name="CareerEnhancers"
        component={CareerEnhancers}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="insert-chart" size={size} color={color} />
          ),
          drawerLabel: "Industry Service Providers",
        }}
      />
      {/* <Drawer.Screen
        name="TEDxJMI"
        component={TEDxJMI}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="thumb-up" size={size} color={color} />
          ),
          drawerLabel: 'TEDx JMI',
        }}
      /> */}
      <Drawer.Screen
        name="Notice Board"
        component={NoticeBoard}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="description" size={size} color={color} />
          ),
          drawerLabel: "News & Updates",
        }}
      />
      {/* {userProfileData?.Data?.usersType == 1 && (
        <Drawer.Screen
          name="Placement Registration"
          component={PlacementRegistration}
          options={{
            drawerIcon: ({ color, size }) => (
              <FontAwesome name="address-card" size={20} color={color} />
            ),
            drawerLabel: "Placement Registration",
          }}
        />
      )} */}
      <Drawer.Screen
        name="Setting"
        component={Setting}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
          drawerLabel: "Settings",
        }}
      />
    </Drawer.Navigator>
  );
}

// Tab Navigator
function TabNavigator() {
  const [mentorModalVisible, setMentorModalVisible] = useState(false);
  const { isDark, colors, toggleTheme } = useTheme();
  const tabBarVisible = useSharedValue(true);
  return (
    <>
      <Tab.Navigator
        tabBar={(props) => (
          <AnimatedTabBar {...props} tabBarVisible={tabBarVisible} />
        )}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") iconName = "home";
            else if (route.name === "Contacts") iconName = "contacts";
            else if (route.name === "Groups") iconName = "group";
            // else if (route.name === 'Mentor') iconName = 'key';
            else if (route.name === "Profile") iconName = "person";

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.AppmainColor,
          tabBarInactiveTintColor: colors.placeholderTextColor,
          tabBarStyle: {
            backgroundColor: colors.background,
          },
        })}
      >
        <Tab.Screen
          name="Home"
          //component={Home}
          children={(props) => (
            <Home {...props} tabBarVisible={tabBarVisible} />
          )}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Home", { scrollToTop: true });
            },
          })}
        />
        <Tab.Screen
          name="Contacts"
          //   component={Contacts}
          children={(props) => (
            <Contacts {...props} tabBarVisible={tabBarVisible} />
          )}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Contacts", { scrollToTop: true });
              setMentorModalVisible(false);
            },
          })}
        />
        <Tab.Screen
          name="Groups"
          // component={Groups}
          children={(props) => (
            <Groups {...props} tabBarVisible={tabBarVisible} />
          )}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Groups", { scrollToTop: true });
              setMentorModalVisible(false);
            },
          })}
        />

        {/* Prevent Navigation and Show Modal for Mentor */}
        {/* <Tab.Screen
          name="Mentor"
          component={Mentor}
          listeners={() => ({
            tabPress: e => {
              e.preventDefault(); // Prevent default navigation
              setMentorModalVisible(true); // Show modal instead
            },
          })}
        /> */}

        <Tab.Screen
          name="Profile"
          // component={Profile}
          children={(props) => (
            <Profile {...props} tabBarVisible={tabBarVisible} />
          )}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Profile", { scrollToTop: true });
              setMentorModalVisible(false);
            },
          })}
        />
      </Tab.Navigator>
    </>
  );
}

function StackNavigator({ initialRoute }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AddExperience" component={AddExperience} />
      <Stack.Screen name="AddEducation" component={AddEducation} />
      <Stack.Screen name="EditProfileDetails" component={EditProfileDetails} />
      <Stack.Screen name="MyAcount" component={MyAcount} />
      <Stack.Screen name="SettingPrivcay" component={SettingPrivcay} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="NoticeBoardDetails" component={NoticeBoardDetails} />
      <Stack.Screen
        name="SettingNoticafication"
        component={SettingNoticafication}
      />
      <Stack.Screen name="SharedPost" component={SharedPostScreen} />
      <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
      <Stack.Screen name="TermsScreen" component={TermsScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
      <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
      <Stack.Screen name="FAQScreen" component={FAQScreen} />
      <Stack.Screen name="ImageSelecter" component={ImageSelecter} />
      <Stack.Screen name="GroupDetails" component={GroupDetails} />
      <Stack.Screen name="ListLike" component={ListLike} />
      <Stack.Screen name="ContactList" component={ContactList} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
      <Stack.Screen name="ProfileHighLight" component={ProfileHighLight} />
      <Stack.Screen name="Articles" component={Articles} />
      <Stack.Screen name="ArticlesList" component={ArticlesList} />
      <Stack.Screen name="ArticleAdd" component={ArticleAdd} />
      <Stack.Screen name="ArticlesUserList" component={ArticlesUserList} />
      <Stack.Screen name="IntershipDetails" component={IntershipDetails} />
      <Stack.Screen name="AddIntership" component={AddIntership} />
      <Stack.Screen name="IntershipProject" component={IntershipProject} />
      <Stack.Screen name="AddJob" component={AddJob} />
      <Stack.Screen name="JobListComponent" component={JobListComponent} />
      <Stack.Screen name="JobDetails" component={JobDetails} />
      <Stack.Screen name="JobOpportunities" component={JobOpportunities} />
      <Stack.Screen name="CompanyDetails" component={CompanyDetails} />
      <Stack.Screen name="AddCompany" component={AddCompany} />
      <Stack.Screen name="ViewAllCompany" component={ViewAllCompany} />
      <Stack.Screen name="CompanyProfiles" component={CompanyProfiles} />
      <Stack.Screen name="AddUpdatePost" component={AddUpdatePost} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="ChatDetails" component={ChatDetails} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
      <Stack.Screen name="AddEvent" component={AddEvent} />
      <Stack.Screen name="ChatGroups" component={ChatGroups} />
      <Stack.Screen name="AddCareer" component={AddCareer} />
      <Stack.Screen name="MentorChat" component={MentorChat} />
      <Stack.Screen name="KnowledgeHub" component={KnowledgeHub} />
      <Stack.Screen name="AddKnowledgeHub" component={AddKnowledgeHub} />
      <Stack.Screen name="KnowledgeDetails" component={KnowledgeDetails} />
      <Stack.Screen name="GuestDetails" component={GuestDetails} />
      <Stack.Screen name="AddTelentProfile" component={AddTelentProfile} />
      <Stack.Screen name="GlobalSearch" component={GlobalSearch} />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
      <Stack.Screen name="Groups" component={Groups} />
      <Stack.Screen name="Contacts" component={Contacts} />
    </Stack.Navigator>
  );
}
// Main App Component
export default function App() {
  const { isDark, colors, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState(null);
  const [userData, setUserData] = useState([]);
  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };
  useEffect(() => {
    UserValue();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setInitialRoute(token ? "Drawer" : "Login");
      } catch (error) {
        console.error("Error fetching token:", error);
        setInitialRoute("Login");
      }
      // Do not set isLoading here anymore
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    requestPermissionAndroid();
    // requestUserPermissionIos();
    // handleNotificationClick();
  }, []);

  const requestPermissionAndroid = async () => {
    const granted = PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    }
  };
  // const requestUserPermissionIos = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //     getToken();
  //   }
  // };

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     if (remoteMessage?.notification) {
  //       handleNotificationClick(remoteMessage);
  //       if (remoteMessage.messageId) {
  //         if (seenNotifications.has(remoteMessage.messageId)) {
  //           return;
  //         }
  //         seenNotifications.add(remoteMessage.messageId);
  //       }

  //       onDisplayNotification(remoteMessage);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  const seenNotifications = new Set();

  const onDisplayNotification = async (remoteMessage) => {
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      android: {
        channelId,
        smallIcon: "name-of-a-small-icon",
        pressAction: {
          id: "default",
        },
      },
    });
  };
  const getToken = async () => {
    const token = await messaging().getToken();
    const userId = userData?.User?.userId;
    await sendFcmTokenToServer(userId, token);
  };
  const sendFcmTokenToServer = async (userId, fcmToken) => {
    const payload = JSON.stringify({
      // userId: userData?.User?.userId,
      userId: userId,
      fcm_token: fcmToken,
    });
    try {
      const response = await fetch(
        `${baseUrl}${SendDeviceToken}`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
        }
      );

      const result = await response.json();

      if (response.ok) {
      } else {
        console.error("Error sending FCM token:", result);
      }
    } catch (error) {
      console.error("Network error in FCM token:", error);
    }
  };
  // const handleNotificationClick = item => {
  //   let handledMessageId = null;

  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     if (remoteMessage && remoteMessage.messageId !== handledMessageId) {
  //       handledMessageId = remoteMessage.messageId;
  //     }
  //   });

  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
  //       if (remoteMessage && remoteMessage.messageId !== handledMessageId) {
  //         handledMessageId = remoteMessage.messageId;
  //       }
  //     });

  //   notifee.onForegroundEvent(({type, detail}) => {
  //     if (
  //       type === EventType.PRESS &&
  //       detail.notification.id !== handledMessageId
  //     ) {
  //       handledMessageId = detail.notification.id;
  //       console.log('User tapped the notification:', detail.notification);
  //       // navigateToScreen(item);
  //     }
  //   });
  // };

  if (isLoading || initialRoute === null) {
    return (
      <View style={styles.loaderContainer}>
        <Image
          source={
            isDark
              ? require("./src/assets/splash_dark.png")
              : require("./src/assets/splash.png")
          }
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </View>
    );
  }
  const linking = {
    prefixes: [
      "https://travcomexapi.vecospace.com",
      "https://travcomexapi.vecospace.com",
    ],
    config: {
      screens: {
        SharedPost: {
          path: "api/shared-post",
          parse: {
            postId: (id) => `${id}`,
            postType: (type) => `${type}`,
          },
        },
      },
    },
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
          {/* <BottomSheetModalProvider> */}
          <NavigationContainer linking={linking}>
            <StackNavigator initialRoute={initialRoute} />
          </NavigationContainer>
          <Toast />
          {/* </BottomSheetModalProvider> */}
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
