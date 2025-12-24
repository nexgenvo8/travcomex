import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
} from "react-native";
import PencilIcon from "react-native-vector-icons/Octicons";
import Icon1 from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/Entypo";
import CrossIcon from "react-native-vector-icons/Entypo";
import Colors from "./color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "react-native-vector-icons/AntDesign";
import Header from "./Header/Header";
import globalStyles from "./GlobalCSS";
import { baseUrl, ListSetting, UpdateSetting } from "./baseURL/api";
import { useTheme } from "../theme/ThemeContext";
import { universityFullName } from "./constants";

const SettingNoticafication = ({ navigation }) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [userData, setUserData] = useState([]);
  const [settingData, setSettingData] = useState([]);

  // this for checkbox's
  const [e_mail, setE_mail] = useState(false);
  const [e_mail1, setE_mail1] = useState(false);
  const [e_mail2, setE_mail2] = useState(false);
  const [e_mail3, setE_mail3] = useState(false);
  const [e_mail4, setE_mail4] = useState(false);
  const [e_mail5, setE_mail5] = useState(false);
  const [e_mail6, setE_mail6] = useState(false);
  const [e_mail7, setE_mail7] = useState(false);

  const [notifyMe, setNotifyMe] = useState(false);
  const [notifyMe1, setNotifyMe1] = useState(false);
  const [notifyMe2, setNotifyMe2] = useState(false);
  const [notifyMe3, setNotifyMe3] = useState(false);
  const [notifyMe4, setNotifyMe4] = useState(false);
  const [notifyMe5, setNotifyMe5] = useState(false);
  const [notifyMe6, setNotifyMe6] = useState(false);
  const [notifyMe7, setNotifyMe7] = useState(false);
  const [notifyMe8, setNotifyMe8] = useState(false);
  const [notifyMe9, setNotifyMe9] = useState(false);

  const [refreshSettings, setRefreshSettings] = useState(false);
  const [refreshSettings1, setRefreshSettings1] = useState(false);

  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };
  useEffect(() => {
    UserValue();
  }, []);

  // this section for api's
  useEffect(() => {
    if (userData?.User?.userId) {
      getSettingData();
    }
  }, [userData?.User?.userId, refreshSettings, refreshSettings1]);

  const getSettingData = async () => {
    try {
      const response = await fetch(`${baseUrl}${ListSetting}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
        }),
      });

      const data = await response.json();
      setSettingData(data);
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleNotificationSetting = async () => {
    try {
      const response = await fetch(`${baseUrl}${UpdateSetting}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          sendMeEmail: e_mail,
          emailCommentLike: e_mail1,
          emailPostLike: e_mail2,
          newContactRequest: e_mail3,
          pendingContactRequest: e_mail4,
          emailApplyProject: e_mail5,
          emailContactNewPosition: e_mail6,
          notiJoiningGroup: e_mail7,
        }),
      });
      const data = await response.json();
      setRefreshSettings(!refreshSettings);
      setModalVisible1(!!modalVisible1);
    } catch (error) {
      console.error("Update settings Error:", error);
    }
  };
  const handleNotify = async () => {
    try {
      const response = await fetch(`${baseUrl}${UpdateSetting}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          notiPostGroup: notifyMe,
          notiTagingCompany: notifyMe1,
          notiPostCommentsAllow: notifyMe2,
          notiPostLikesAllow: notifyMe3,
          notiNewPositionEmployer: notifyMe4,
          notiMeetingRequest: notifyMe5,
          notiProjectApplied: notifyMe6,
          notiJoinGroupRequestAllow: notifyMe7,
          notiNewArticlesAllow: notifyMe8,
          userBirthdayAllow: notifyMe9,
        }),
      });
      const data = await response.json();
      setRefreshSettings1(!refreshSettings1);
      setModalVisible2(!!modalVisible2);
    } catch (error) {
      console.error("Update settings Error:", error);
    }
  };

  useEffect(() => {
    if (settingData?.Data) {
      setE_mail(settingData.Data.sendMeEmail || false);
      setE_mail1(settingData.Data.emailCommentLike || false);
      setE_mail2(settingData.Data.emailPostLike || false);
      setE_mail3(settingData.Data.newContactRequest || false);
      setE_mail4(settingData?.Data?.pendingContactRequest || false);
      setE_mail5(settingData?.Data?.emailApplyProject || false);
      setE_mail6(settingData?.Data?.emailContactNewPosition || false);
      setE_mail7(settingData?.Data?.notiJoiningGroup || false);
      setNotifyMe(settingData.Data.notiPostGroup || false);
      setNotifyMe1(settingData.Data.notiTagingCompany || false);
      setNotifyMe2(settingData.Data.notiPostCommentsAllow || false);
      setNotifyMe3(settingData.Data.notiPostLikesAllow || false);
      setNotifyMe4(settingData?.Data?.notiNewPositionEmployer || false);
      setNotifyMe5(settingData?.Data?.notiMeetingRequest || false);
      setNotifyMe6(settingData?.Data?.notiProjectApplied || false);
      setNotifyMe7(settingData?.Data?.notiJoinGroupRequestAllow || false);
      setNotifyMe8(settingData?.Data?.notiNewArticlesAllow || false);
      setNotifyMe9(settingData?.Data?.userBirthdayAllow || false);
    }
  }, [settingData]);

  return (
    <SafeAreaView
      style={{
        ...globalStyles?.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header title={"Notifications"} navigation={navigation} />
      <View style={globalStyles?.FX_1_BG_White}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 0.9 }}>
          <View
            style={{
              paddingVertical: 15,
              paddingHorizontal: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              borderWidth: 0.5,
              borderColor: colors.textinputbordercolor,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.textColor,
              }}
            >
              {" "}
              I would like to be notified by e-mail...
            </Text>

            <PencilIcon
              onPress={() => setModalVisible1()}
              name="pencil"
              size={20}
              color={colors.placeholderTextColor}
            />
          </View>

          <View
            style={{
              marginHorizontal: 12,
              marginTop: 10,
              // backgroundColor: "red",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Icon
                name={settingData?.Data?.sendMeEmail ? "check" : "cross"}
                size={settingData?.Data?.sendMeEmail ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textColor,
                }}
              >
                When someone sends me a message
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Icon
                name={settingData?.Data?.emailCommentLike ? "check" : "cross"}
                size={settingData?.Data?.emailCommentLike ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  flexShrink: 1,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                When someone comments on something I posted or commented on
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Icon
                name={settingData?.Data?.emailPostLike ? "check" : "cross"}
                size={settingData?.Data?.emailPostLike ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                When someone likes something I posted
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={settingData?.Data?.newContactRequest ? "check" : "cross"}
                size={settingData?.Data?.newContactRequest ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                When I receive new contact requests
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={
                  settingData?.Data?.pendingContactRequest ? "check" : "cross"
                }
                size={settingData?.Data?.pendingContactRequest ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                If I have any pending contact requests
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={settingData?.Data?.emailApplyProject ? "check" : "cross"}
                size={settingData?.Data?.emailApplyProject ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                When someone applies to the Project I posted
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={
                  settingData?.Data?.emailContactNewPosition ? "check" : "cross"
                }
                size={settingData?.Data?.emailContactNewPosition ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  flexShrink: 1,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                When a contact of mine has a new position or employer
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={settingData?.Data?.notiJoiningGroup ? "check" : "cross"}
                size={settingData?.Data?.notiJoiningGroup ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  flexShrink: 1,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                When someone sends group joining request to My Group
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingVertical: 15,
              paddingHorizontal: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center", // Ensure proper alignment
              borderWidth: 0.5,
              flexWrap: "wrap",
              borderColor: colors.textinputbordercolor,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                flex: 1,
                color: colors.textColor,
              }}
            >
              Notify me on {universityFullName}
            </Text>

            <PencilIcon
              onPress={() => setModalVisible2()}
              name="pencil"
              size={20}
              style={{ marginLeft: 10 }}
              color={colors.placeholderTextColor}
            />
          </View>

          <View style={{ marginHorizontal: 12, marginVertical: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Icon
                name={settingData?.Data?.notiPostGroup ? "check" : "cross"}
                size={settingData?.Data?.notiPostGroup ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                When someone posts in My Group
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={settingData?.Data?.notiTagingCompany ? "check" : "cross"}
                size={settingData?.Data?.notiTagingCompany ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                When someone tags your company in his post
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={
                  settingData?.Data?.notiPostCommentsAllow ? "check" : "cross"
                }
                size={settingData?.Data?.notiPostCommentsAllow ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                When someone comments on something I posted or commented on
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={settingData?.Data?.notiPostLikesAllow ? "check" : "cross"}
                size={settingData?.Data?.notiPostLikesAllow ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                When someone likes something I posted
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={
                  settingData?.Data?.notiNewPositionEmployer ? "check" : "cross"
                }
                size={settingData?.Data?.notiNewPositionEmployer ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                When a contact of mine has a new position or employer
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={settingData?.Data?.notiMeetingRequest ? "check" : "cross"}
                size={settingData?.Data?.notiMeetingRequest ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                When a contact of mine sends me a meeting request
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={settingData?.Data?.notiProjectApplied ? "check" : "cross"}
                size={settingData?.Data?.notiProjectApplied ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                {" "}
                When someone applies to a Project I posted
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={
                  settingData?.Data?.notiJoinGroupRequestAllow
                    ? "check"
                    : "cross"
                }
                size={settingData?.Data?.notiJoinGroupRequestAllow ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  flexShrink: 1,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                When someone wants to Join a group that I have created
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={
                  settingData?.Data?.notiNewArticlesAllow ? "check" : "cross"
                }
                size={settingData?.Data?.notiNewArticlesAllow ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  flexShrink: 1,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                {" "}
                When a contact of mine publishes a new article
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                width: "100%",
              }}
            >
              <Icon
                name={settingData?.Data?.userBirthdayAllow ? "check" : "cross"}
                size={settingData?.Data?.userBirthdayAllow ? 20 : 22}
                color={colors.backIconColor}
                style={styles.iconsCheck}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textColor,
                  flex: 1,
                  flexWrap: "wrap",
                }}
              >
                {" "}
                On the Birthday of a contact of mine
              </Text>
            </View>
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            setModalVisible1(true);
          }}
        >
          <View style={styles.centeredView}>
            <View
              style={{
                ...styles.modalView,
                flex: 0.6,
                padding: 20,
                backgroundColor: colors.modelBackground,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setModalVisible1(false);
                }}
                style={{ alignSelf: "flex-end" }}
              >
                <CrossIcon
                  name="cross"
                  size={25}
                  color={colors.backIconColor}
                />
              </TouchableOpacity>

              <View
                style={{
                  ...styles.mainHeaderView,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  style={{ ...styles.textModalheader, color: colors.textColor }}
                >
                  I would like to be notified by E -mail
                </Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setE_mail(!e_mail)}
                  >
                    <CheckBox
                      name={e_mail ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When someone sends me a message
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setE_mail1(!e_mail1)}
                  >
                    <CheckBox
                      name={e_mail1 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When someone comments on something I posted or commented on
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setE_mail2(!e_mail2)}
                  >
                    <CheckBox
                      name={e_mail2 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When someone likes something I posted
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setE_mail3(!e_mail3)}
                  >
                    <CheckBox
                      name={e_mail3 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When I receive new contact requests
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setE_mail4(!e_mail4)}
                  >
                    <CheckBox
                      name={e_mail4 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    If I have any pending contact requests
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setE_mail5(!e_mail5)}
                  >
                    <CheckBox
                      name={e_mail5 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When someone applies to the Project I posted
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setE_mail6(!e_mail6)}
                  >
                    <CheckBox
                      name={e_mail6 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When a contact of mine has a new position or employer
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setE_mail7(!e_mail7)}
                  >
                    <CheckBox
                      name={e_mail7 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When someone sends group joining request to My Group
                  </Text>
                </View>
              </ScrollView>

              <TouchableOpacity
                onPress={() => handleNotificationSetting()}
                style={{ ...styles.save, backgroundColor: colors.AppmainColor }}
              >
                <Text
                  style={{ ...styles.saveText, color: colors.ButtonTextColor }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible2(true);
          }}
        >
          <View style={styles.centeredView}>
            <View
              style={{
                ...styles.modalView,
                flex: 0.6,
                padding: 20,
                backgroundColor: colors.modelBackground,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setModalVisible2(false);
                }}
                style={{ alignSelf: "flex-end" }}
              >
                <CrossIcon
                  name="cross"
                  size={25}
                  color={colors.backIconColor}
                />
              </TouchableOpacity>

              <View
                style={{
                  ...styles.mainHeaderView,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  style={{ ...styles.textModalheader, color: colors.textColor }}
                >
                  Notify me on {universityFullName}
                </Text>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setNotifyMe(!notifyMe)}
                  >
                    <CheckBox
                      name={notifyMe ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When someone posts in My Group
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setNotifyMe1(!notifyMe1)}
                  >
                    <CheckBox
                      name={notifyMe1 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When someone tags your company in his post
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setNotifyMe2(!notifyMe2)}
                  >
                    <CheckBox
                      name={notifyMe2 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When someone comments on something I posted or commented on
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setNotifyMe3(!notifyMe3)}
                  >
                    <CheckBox
                      name={notifyMe3 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When someone likes something I posted
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setNotifyMe4(!notifyMe4)}
                  >
                    <CheckBox
                      name={notifyMe4 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When a contact of mine has a new position or employer
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setNotifyMe5(!notifyMe5)}
                  >
                    <CheckBox
                      name={notifyMe5 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When a contact of mine sends me a meeting request
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setNotifyMe6(!notifyMe6)}
                  >
                    <CheckBox
                      name={notifyMe6 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When someone applies to a Project I posted
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setNotifyMe7(!notifyMe7)}
                  >
                    <CheckBox
                      name={notifyMe7 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When someone wants to Join a group that I have created
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setNotifyMe8(!notifyMe8)}
                  >
                    <CheckBox
                      name={notifyMe8 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    When a contact of mine publishes a new article
                  </Text>
                </View>

                <View style={styles.ViewSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.checkBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                    onPress={() => setNotifyMe9(!notifyMe9)}
                  >
                    <CheckBox
                      name={notifyMe9 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...styles.modalTextSection,
                      color: colors.textColor,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    On the Birthday of a contact of mine
                  </Text>
                </View>
              </ScrollView>

              <TouchableOpacity
                onPress={() => handleNotify()}
                style={{ ...styles.save, backgroundColor: colors.AppmainColor }}
              >
                <Text
                  style={{ ...styles.saveText, color: colors.ButtonTextColor }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainHeaderView: {
    borderBottomWidth: 1,
    paddingBottom: 10,
    // borderColor: Colors.borderColor,
  },
  textModalheader: {
    fontSize: 16,
    fontWeight: "600",
  },
  ViewSection: { marginTop: 20, flexDirection: "row" },
  modalTextSection: {
    fontSize: 14,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  headerView: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  iconsCheck: { paddingRight: 5, fontWeight: "800" },

  dropdownList: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },

  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 35,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
  },
  save: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  saveText: {
    fontSize: 15,
    fontWeight: "700",
  },
  text: {
    fontSize: 14,
  },
});

export default SettingNoticafication;
