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
import AsyncStorage from "@react-native-async-storage/async-storage";
import CrossIcon from "react-native-vector-icons/Entypo";
import Icon from "react-native-vector-icons/Entypo";
import CheckBox from "react-native-vector-icons/AntDesign";
import DownIcon from "react-native-vector-icons/AntDesign";
import Colors from "./color";
import PencilIcon from "react-native-vector-icons/Octicons";
import Header from "./Header/Header";
import { baseUrl, ListSetting, UpdateSetting } from "./baseURL/api";
import { useTheme } from "../theme/ThemeContext";

const SettingPrivcay = ({ navigation }) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const options = ["All Members", "My Contacts Only"];
  const options1 = ["All Members", "My Contacts Only", "NoBody"];
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [selectedValue, setSelectedValue] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [general, setGeneral] = useState(false);
  const [general1, setGeneral1] = useState(false);
  const [general2, setGeneral2] = useState(false);
  const [profileSettCheck, setProfileSettCheck] = useState(false);
  const [selectedValue1, setSelectedValue1] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [userData, setUserData] = useState([]);
  const [settingData, setSettingData] = useState([]);
  const [refreshSettings, setRefreshSettings] = useState(false);
  const [refreshSettings1, setRefreshSettings1] = useState(false);

  const selectOption = (option) => {
    setSelectedValue(option);
    setIsOpen(false);
  };

  const selectOption1 = (option) => {
    setSelectedValue1(option);
    setIsOpen1(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleDropdown1 = () => setIsOpen1(!isOpen1);
  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };

  useEffect(() => {
    UserValue();
  }, []);

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
      console.error("Fetch settings Error:", error);
    }
  };
  const handleProfileSetting = async () => {
    try {
      const response = await fetch(`${baseUrl}${UpdateSetting}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          contactTabvisible: selectedValue,
          activityTabVisible: selectedValue1,
          allowSearchEngines: isChecked ? 1 : 0,
          contactListVisible: profileSettCheck ? 1 : 0,
        }),
      });

      const data = await response.json();

      // Trigger re-render for the first API call
      setRefreshSettings(!refreshSettings);

      // Optionally, handle modal visibility
      setModalVisible1(!!modalVisible1);
    } catch (error) {
      console.error("Update settings Error:", error);
    }
  };
  const handleGeneralSettings = async () => {
    try {
      const response = await fetch(`${baseUrl}${UpdateSetting}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          postGroupSearchEngine: general ? 1 : 0,
          newOpportunities: general1 ? 1 : 0,
          allowFuturePostsComments: general2 ? 1 : 0,
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
      setSelectedValue(settingData.Data.contactTabvisible || "");
      setSelectedValue1(settingData.Data.activityTabVisible || "");
      setIsChecked(settingData.Data.allowSearchEngines || false);
      setProfileSettCheck(settingData.Data.contactListVisible || false);
      setGeneral(settingData?.Data?.postGroupSearchEngine || false);
      setGeneral1(settingData?.Data?.newOpportunities || false);
      setGeneral2(settingData?.Data?.allowFuturePostsComments || false);
    }
  }, [settingData]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title={"Privacy"} navigation={navigation} />
      <View style={{ flex: 1 }}>
        <View style={styles.profilesetting}>
          <Text
            style={{ fontSize: 18, fontWeight: "600", color: colors.textColor }}
          >
            Profile Settings
          </Text>

          <PencilIcon
            onPress={() => setModalVisible1()}
            name="pencil"
            size={20}
            color={colors.placeholderTextColor}
          />
        </View>

        {/* Profile Setting section Body */}
        <View style={{ marginHorizontal: 12, marginTop: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Icon
              name={settingData?.Data?.contactTabvisible ? "check" : "cross"}
              size={settingData?.Data?.contactTabvisible ? 20 : 22}
              color={colors.backIconColor}
              style={styles.iconsCheck}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  flexShrink: 1,
                  color: colors.textColor,
                }}
              >
                The "Contacts" tab in my profile is visible to:{" "}
                <Text style={{ fontWeight: "bold", color: colors.textColor }}>
                  {settingData?.Data?.contactTabvisible}
                </Text>
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              flex: 1,
            }}
          >
            <Icon
              name={settingData?.Data?.activityTabVisible ? "check" : "cross"}
              size={settingData?.Data?.activityTabVisible ? 20 : 22}
              color={colors.backIconColor}
              style={styles.iconsCheck}
            />

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  flexShrink: 1,
                  color: colors.textColor,
                }}
              >
                The "Activity" tab in my profile is visible to:{" "}
                <Text style={{ fontWeight: "bold", color: colors.textColor }}>
                  {settingData?.Data?.activityTabVisible}
                </Text>
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Icon
              name={settingData?.Data?.allowSearchEngines ? "check" : "cross"}
              size={settingData?.Data?.allowSearchEngines ? 20 : 22}
              color={colors.backIconColor}
              style={styles.iconsCheck}
            />
            <Text
              style={{
                fontSize: 16,
                color: colors.textColor,
              }}
            >
              Allow search engines to find my profile
            </Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Icon
              name={settingData?.Data?.contactListVisible ? "check" : "cross"}
              size={settingData?.Data?.contactListVisible ? 20 : 22}
              color={colors.backIconColor}
              style={styles.iconsCheck}
            />
            <Text
              style={{
                fontSize: 16,
                color: colors.textColor,
              }}
            >
              Let other people can see
            </Text>
          </View>
        </View>

        {/* General Setting section  Header*/}
        <View
          style={{
            paddingVertical: 15,
            paddingHorizontal: 12,
            flexDirection: "row",
            justifyContent: "space-between",
            borderWidth: 0.5,
            marginTop: 10,
            borderColor: colors.textinputbordercolor,
          }}
        >
          <Text
            style={{ fontSize: 18, fontWeight: "600", color: colors.textColor }}
          >
            General Settings
          </Text>

          <PencilIcon
            onPress={() => setModalVisible2()}
            name="pencil"
            size={20}
            color={colors.placeholderTextColor}
          />
        </View>

        {/* General Setting section  Body*/}
        <View style={{ marginHorizontal: 12, marginTop: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Icon
              name={
                settingData?.Data?.postGroupSearchEngine ? "check" : "cross"
              }
              size={settingData?.Data?.postGroupSearchEngine ? 20 : 22}
              color={colors.backIconColor}
              style={styles.iconsCheck}
            />
            <Text
              style={{
                fontSize: 16,
                flexShrink: 1,
                color: colors.textColor,
              }}
            >
              Make my public groups and articles available to search engines
            </Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Icon
              name={settingData?.Data?.newOpportunities ? "check" : "cross"}
              size={settingData?.Data?.newOpportunities ? 20 : 22}
              color={colors.backIconColor}
              style={styles.iconsCheck}
            />
            <Text
              style={{
                fontSize: 16,
                flexShrink: 1,
                color: colors.textColor,
              }}
            >
              Let recruiters know that you are open to new opportunities
            </Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Icon
              name={
                settingData?.Data?.allowFuturePostsComments ? "check" : "cross"
              }
              size={settingData?.Data?.allowFuturePostsComments ? 20 : 22}
              color={colors.backIconColor}
              style={styles.iconsCheck}
            />
            <Text
              style={{
                fontSize: 16,
                // flexWrap: 'wrap',
                flexShrink: 1,
                color: colors.textColor,
              }}
            >
              Allow other members to mention you in future posts or comments
            </Text>
          </View>
        </View>

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
                  alignItems: "center",
                  borderBottomWidth: 0.5,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    padding: 15,
                    fontWeight: "700",
                    color: colors.textColor,
                  }}
                >
                  Profile Setting
                </Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginVertical: 10 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: colors.textColor,
                    }}
                  >
                    The "Contacts" tab in my profile is visible to:
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    marginRight: 10,
                    borderColor: colors.textinputbordercolor,
                  }}
                  onPress={toggleDropdown}
                >
                  <Text style={{ ...styles.text, color: colors.textColor }}>
                    {selectedValue || "Select the Value"}
                  </Text>
                  <DownIcon
                    name="down"
                    size={15}
                    color={colors.backIconColor}
                  />
                </TouchableOpacity>
                {isOpen && (
                  <View
                    style={{
                      ...styles.dropdownList,
                      backgroundColor: colors.textinputBackgroundcolor,
                      borderColor: colors.textinputbordercolor,
                    }}
                  >
                    {options.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          ...styles.dropdownItem,
                          borderColor: colors.textinputbordercolor,
                        }}
                        onPress={() => selectOption(option)}
                      >
                        <Text
                          style={{ ...styles.text, color: colors.textColor }}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: colors.textColor,
                    }}
                  >
                    The "Activity" tab in my profile is visible to
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    marginRight: 10,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                  onPress={toggleDropdown1}
                >
                  <Text style={{ ...styles.text, color: colors.textColor }}>
                    {selectedValue1 || "Select the Value"}
                  </Text>
                  <DownIcon
                    name="down"
                    size={15}
                    color={colors.backIconColor}
                  />
                </TouchableOpacity>
                {isOpen1 && (
                  <View
                    style={{
                      ...styles.dropdownList,
                      backgroundColor: colors.textinputBackgroundcolor,
                      borderColor: colors.textinputbordercolor,
                    }}
                  >
                    {options1.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          ...styles.dropdownItem,
                          borderColor: colors.textinputbordercolor,
                        }}
                        onPress={() => selectOption1(option)}
                      >
                        <Text
                          style={{ ...styles.text, color: colors.textColor }}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={{ marginTop: 20, flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      width: 20,
                      height: 20,
                      borderWidth: 1.5,
                      borderColor: colors.textinputbordercolor,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                    onPress={() => setIsChecked(!isChecked)}
                  >
                    <CheckBox
                      name={isChecked ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.textColor,
                    }}
                  >
                    Allow search engines to find my profile
                  </Text>
                </View>

                <View style={{ marginTop: 20, flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      width: 20,
                      height: 20,
                      borderWidth: 1.5,
                      borderColor: colors.textinputbordercolor,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                    onPress={() => setProfileSettCheck(!profileSettCheck)}
                  >
                    <CheckBox
                      name={profileSettCheck ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.textColor,
                    }}
                  >
                    Who can see your Contact list
                  </Text>
                </View>
              </ScrollView>

              <TouchableOpacity
                onPress={() => handleProfileSetting()}
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
                  alignItems: "center",
                  borderBottomWidth: 0.5,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    padding: 15,
                    fontWeight: "700",
                    color: colors.textColor,
                  }}
                >
                  General Setting
                </Text>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginTop: 20, flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      width: 20,
                      height: 20,
                      borderWidth: 1.5,
                      borderColor: colors.textinputbordercolor,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                    onPress={() => setGeneral(!general)}
                  >
                    <CheckBox
                      name={general ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      flexShrink: 1,
                      color: colors.textColor,
                    }}
                  >
                    Make my public groups and articles available to search
                    engines
                  </Text>
                </View>

                <View style={{ marginTop: 20, flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      width: 20,
                      height: 20,
                      borderWidth: 1.5,
                      borderColor: colors.textinputbordercolor,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                    onPress={() => setGeneral1(!general1)}
                  >
                    <CheckBox
                      name={general1 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      flexShrink: 1,
                      color: colors.textColor,
                    }}
                  >
                    Let recruiters know that you are open to new opportunities
                  </Text>
                </View>

                <View style={{ marginTop: 20, flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      width: 20,
                      height: 20,
                      borderWidth: 1.5,
                      borderColor: colors.textinputbordercolor,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                    onPress={() => setGeneral2(!general2)}
                  >
                    <CheckBox
                      name={general2 ? "check" : ""}
                      size={15}
                      color={colors.backIconColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      flexShrink: 1,
                      color: colors.textColor,
                    }}
                  >
                    Allow other members to mention you in future posts or
                    comments
                  </Text>
                </View>
              </ScrollView>

              <TouchableOpacity
                onPress={() => handleGeneralSettings()}
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
  profilesetting: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 0.5,
  },
  iconsCheck: { paddingRight: 5, fontWeight: "800" },

  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  dropdownList: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  headerView: {
    flex: 0.15,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    // flex: 0.74,
    // backgroundColor: 'white',
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
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    fontSize: 15,
    fontWeight: "700",
  },
  text: {
    fontSize: 14,
  },
});

export default SettingPrivcay;
