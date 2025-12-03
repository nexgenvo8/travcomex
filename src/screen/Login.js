import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  ImageBackground,
  Image,
  TextInput,
  StatusBar,
  Dimensions,
} from "react-native";

import CheckBox from "@react-native-community/checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "./color";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  Addlogindetails,
  baseUrl,
  LoginApi,
  Profile_Detail,
} from "./baseURL/api";
import { showError, showSuccess } from "./components/Toast";
import DeviceInfo from "react-native-device-info";
import { NetworkInfo } from "react-native-network-info";
import { useTheme } from "../theme/ThemeContext";
import { SafeAreaView } from "react-native";
import {
  loginbackgroundimage,
  loginbackgroundimage_dark,
  loginlogoimage,
  logintopTextImage,
  logintopTextImage_dark,
  registrationbackgroundimage,
} from "./constants";
const { width, height } = Dimensions.get("window");
export default function Login({ navigation }) {
  const { isDark, colors, toggleTheme } = useTheme();
  const [isChecked, setIsChecked] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailError2, setEmailError2] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [value, setValue] = useState(false);
  const getSessionDataAndSendToBackend = async ({ userId }) => {
    try {
      const ip = await NetworkInfo.getIPAddress();
      const systemName = DeviceInfo.getSystemName();
      const systemVersion = DeviceInfo.getSystemVersion();
      const deviceName = await DeviceInfo.getDeviceName();
      const brand = DeviceInfo.getBrand();
      const sessionData = {
        userId: userId?.User?.userId,
        deviceName: `${brand} ${deviceName}`,
        ipAddress: ip,
      };
      console.log("Session data to send:", sessionData);
      const response = await fetch(`${baseUrl}${Addlogindetails}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const responseData = await response.json();
      // console.log('Success response from backend:', responseData);
    } catch (error) {
      console.error("Error sending session data:", error);
    }
  };
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        // Navigate to Home if token exists
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      console.log("!email", !email);
      setEmailError(true);
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError2(true);
      return;
    } else {
      setEmailError(false);
    }

    if (!password) {
      console.log("!password", !password);
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    try {
      const response = await fetch(`${baseUrl}${LoginApi}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem("userToken", data.Token);
        await AsyncStorage.setItem("userData", JSON.stringify(data));
        GetProfileData({ userId: data });
        getSessionDataAndSendToBackend({ userId: data });
      } else {
        showError(data.Message);
        console.log("response", data);
      }
    } catch (error) {
      showError("Failed to log in. Please try again later.");
      console.error("Login Error:", error);
    }
  };
  const GetProfileData = async ({ userId }) => {
    try {
      const response = await fetch(`${baseUrl}${Profile_Detail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId?.User?.userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userProfileData", JSON.stringify(data));
        console.log("Navigating to TabNav...");
        navigation.replace("Drawer");
      } else {
        showError(data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1 }}>
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={loginlogoimage}
              style={{width: 50, height: 50}}
              resizeMode="contain"
            />

            <Image
              source={isDark ? logintopTextImage_dark : logintopTextImage}
              style={{width: 150, height: 150}}
              resizeMode="contain"
            />
          </View> */}
          <View
            style={{
              // flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={loginlogoimage}
              style={{ width: 70, height: 72, marginTop: 30 }}
              resizeMode="contain"
            />

            <Image
              source={logintopTextImage}
              style={{ width: 170, height: 60 }}
              resizeMode="contain"
            />
          </View>
          <TextInput
            style={{
              ...styles.input,
              borderColor: emailError ? "red" : colors.textinputbordercolor,
              backgroundColor: colors.textinputBackgroundcolor,
              color: colors.textColor,
            }}
            onChangeText={(text) => {
              setEmail(text), setEmailError();
              setEmailError2();
            }}
            value={email}
            placeholder="Email"
            placeholderTextColor={colors.placeholderTextColor}
          />
          {emailError ? showError("Please enter email address.") : null}

          {emailError2 ? (
            <Text
              style={{ paddingHorizontal: 12, color: emailError2 ? "red" : "" }}
            >
              Please enter a valid email address.
            </Text>
          ) : null}

          <View style={{ backgroundColor: "" }}>
            <TextInput
              style={{
                ...styles.input,
                borderColor: passwordError
                  ? "red"
                  : colors.textinputbordercolor,
                color: colors.textColor,
                backgroundColor: colors.textinputBackgroundcolor,
              }}
              // onChangeText={setPassword}

              onChangeText={(text) => {
                setPassword(text), setPasswordError();
              }}
              value={password}
              placeholder="Password"
              placeholderTextColor={colors.placeholderTextColor}
              secureTextEntry={!isPasswordVisible} // Control visibility based on state
            />
            {passwordError ? (
              <Text style={{ padding: 12, color: passwordError ? "red" : "" }}>
                Please enter password
              </Text>
            ) : null}

            <TouchableOpacity
              style={{
                position: "absolute",
                alignSelf: "flex-end",
                right: 20,
                top: 20,
              }}
              onPress={togglePasswordVisibility}
            >
              <Icon
                name={isPasswordVisible ? "visibility" : "visibility-off"} // Change icon based on state
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",

              // justifyContent:'center',
              marginHorizontal: 12,
            }}
          >
            <CheckBox
              value={isChecked}
              onValueChange={(newValue) => setIsChecked(newValue)}
              style={{
                transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                // margin: 10,
                color: Colors.main_primary,
              }}
            />

            <Text style={{ bottom: 2, fontSize: 12, color: colors.textColor }}>
              I agree Terms & Conditions
            </Text>
          </View>

          <TouchableOpacity
            style={{
              alignItems: "flex-end",
              //  marginHorizontal: 20,
              marginHorizontal: 20,
              marginBottom: 20,
              // top: -26,
            }}
            onPress={() => navigation.navigate("ForgetPassword")}
          >
            <Text style={{ color: colors.AppSecondColor, fontSize: 15 }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingVertical: 6,
              //  marginTop: 20,
            }}
          >
            <Text style={{ color: colors.textColor }}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Registration")}
            >
              <Text
                style={{
                  alignSelf: "center",
                  color: colors.AppSecondColor,
                }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {isChecked ? (
            <TouchableOpacity
              // onPress={() => navigation.navigate("TabNav")}

              onPress={handleLogin}
              style={{
                alignItems: "center",
                backgroundColor: colors.AppmainColor,
                marginHorizontal: 12,
                padding: 10,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 18, color: colors.ButtonTextColor }}>
                Log in
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              onPress={() => console.log("isChecked", isChecked)}
              style={{
                alignItems: "center",
                backgroundColor: Colors.lite_gray,
                marginHorizontal: 12,
                padding: 10,
              }}
            >
              <Text style={{ fontSize: 18, color: Colors.black }}>Log in</Text>
            </View>
          )}

          <View style={{ backgroundColor: "", flex: 1 }}>
            <Image
              source={isDark ? loginbackgroundimage_dark : loginbackgroundimage}
              resizeMode="cover"
              style={{
                paddingHorizontal: 12,
                marginTop: 10,

                width: width,
                height: height * 0.43,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                padding: 6,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("PrivacyScreen")}
              >
                <Text style={{ color: colors.textColor }}>Privacy</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 6, color: colors.textColor }}>
                |
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("TermsScreen")}
              >
                <Text style={{ color: colors.textColor }}>Terms</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 6, color: colors.textColor }}>
                |
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("AboutScreen")}
              >
                <Text style={{ color: colors.textColor }}>About</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 6, color: colors.textColor }}>
                |
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("ContactUsScreen")}
              >
                <Text style={{ color: colors.textColor }}>Contact Us</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 6, color: colors.textColor }}>
                |
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("FAQScreen")}
              >
                <Text style={{ color: colors.textColor }}>FAQ's</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 48,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 12,
  },
});
