import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import Header from "./Header/Header";
import globalStyles from "./GlobalCSS";
import { useIsFocused } from "@react-navigation/native";
import Colors from "./color";
import Icon from "./Icons/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AcceptRequestMentor,
  baseUrl,
  BecomeMentor_Api,
  FindMentor_Api,
  RemoveMentorRequest,
  SentRequestToMentor,
  UpdateBasicDetails,
  CancelRequestMentor,
} from "./baseURL/api";
import { showError, showSuccess } from "./components/Toast";
import CommonLoader from "./components/CommonLoader";
import { useTheme } from "../theme/ThemeContext";

const FindMentor = ({ navigation }) => {
  const isFocused = useIsFocused();
  const abortControllerRef = useRef(null);
  const debounceTimer = useRef(null);
  const { isDark, colors, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfileData, setUserProfileData] = useState([]);
  const [mentorList, setMentorList] = useState([]);
  const [status, setStatus] = useState("");
  const [modalRemoveRequest, setModalRemoveRequest] = useState(false);
  const [takeRemoveRequest, setTakeRemoveRequest] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedValue1, setSelectedValue1] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userProfileData");
        if (storedData) {
          setUserProfileData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Failed to retrieve profile data", error);
      }
    };
    getProfileData();
  }, []);
  useEffect(() => {
    if (
      mentorList?.AcceptedStudent != null &&
      mentorList?.RemainingStudent != null
    ) {
      const total =
        parseInt(mentorList.AcceptedStudent) +
        parseInt(mentorList.RemainingStudent);
      setSelectedValue1(total.toString());
    }
  }, [mentorList]);
  const getMentorList = async () => {
    const url = `${baseUrl}${
      userProfileData?.Data?.usersType == 1 ? FindMentor_Api : BecomeMentor_Api
    }`;
    // setInitialLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId:
            // 7358,
            userProfileData?.Data?.userId,
          search: searchQuery,
          per_page: 20,
          page: 1,
        }),
      });
      const data = await response.json();

      setMentorList(data || []);
      setInitialLoading(false);
      console.log("url", url);
      if (url == "https://travcomexapi.vecospace.com/api/becomementor") {
        setStatus("BecomeMentor");
      }
      if (url == "https://travcomexapi.vecospace.com/api/findmentor") {
        setStatus("FindMentor");
      }
    } catch (error) {
      console.error("Error fetching chat users:", error);
    } finally {
      //setLoading(false);
      setInitialLoading(false);
    }
  };
  const cancelRequestToMentor = async (item) => {
    console.log("Cancel Request ----->", item);
    const url = `${baseUrl}${CancelRequestMentor}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userProfileData?.Data?.userId,
          mentorId: item?.UserId,
        }),
      });
      const data = await response.json();
      console.log("Cancel Request Response ----->", data);
      showSuccess(data?.Message);
      getMentorList();
    } catch (error) {
      console.error("Error cancelling mentor request:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendRequestForMentor = async (item, type) => {
    console.log("Request ----->", item, type);
    const url = `${baseUrl}${
      type == "Send" ? SentRequestToMentor : AcceptRequestMentor
    }`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: type == "Send" ? userProfileData?.Data?.userId : item?.UserId,
          mentorId: type == "Send" ? item?.UserId : 7358,
        }),
      });
      const data = await response.json();
      console.log(
        "userId",
        type == "Send" ? userProfileData?.Data?.userId : item?.UserId
      );
      console.log("mentorId", type == "Send" ? item?.UserId : 7358);
      console.log(`${type} Request ForMentor ----->`, data);
      getMentorList();
    } catch (error) {
      console.error("Error fetching chat users:", error);
    } finally {
      setLoading(false);
    }
  };
  const RemoveRequestForMentor = async (item) => {
    if (!takeRemoveRequest.trim()) {
      setErrorMessage("Please enter a message before proceeding.");
      return;
    }

    console.log("Remove Request For Mentor ----->", item?.UserId);
    const url = `${baseUrl}${RemoveMentorRequest}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item?.Id,
          userId: item?.UserId,
          mentorId: userProfileData?.Data?.userId,
          reason: takeRemoveRequest || "",
        }),
      });

      const data = await response.json();
      console.log("Remove Request For Mentor ----->", data);

      setModalRemoveRequest(false);
      setTakeRemoveRequest("");
      setErrorMessage("");

      getMentorList();
    } catch (error) {
      console.error("Error fetching chat users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userProfileData) {
      getMentorList();
    }
  }, [userProfileData, isFocused]);
  const handleSearch = (value) => {
    setSearchQuery(value);
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const mentorListData =
        mentorList?.MentorList || mentorList?.StudentList || [];

      const searchFiltered = mentorListData?.filter((item) =>
        item?.UserName?.toLowerCase().includes(value.toLowerCase())
      );

      const pendingFiltered = searchFiltered?.filter((item) =>
        status === "BecomeMentor"
          ? item.IsRequestSent === "Approved"
          : item.IsRequestSent === "Pending" ||
            item.IsRequestSent === "Accepted"
      );

      const finalFilteredData =
        pendingFiltered?.length > 0 ? pendingFiltered : searchFiltered;

      setFilteredData(value ? finalFilteredData : mentorListData);
    }, 300);
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          status == "BecomeMentor"
            ? navigation.navigate("ProfileDetails", {
                Item: item,
              })
            : navigation.navigate("ChatDetails", { Item: item, Type: "Mentor" })
        }
        style={{
          backgroundColor: colors.textinputBackgroundcolor,
          margin: 5,
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View>
          <Image
            source={
              item?.ProfilePhoto
                ? { uri: item?.ProfilePhoto }
                : require("../assets/placeholderprofileimage.png")
            }
            style={{
              width: 70,
              height: 70,
              borderRadius: 80,
              backgroundColor: Colors.gray,
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.AppmainColor,
              paddingLeft: 5,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            {item?.UserName}
          </Text>
          <Text style={{ color: colors.textColor, paddingLeft: 5 }}>
            {item?.CompanyName}
          </Text>
          {status == "BecomeMentor" ? (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                disabled={
                  item?.IsRequestSent === "Approved" ||
                  mentorList?.RemainingStudent <= 0
                }
                onPress={() => sendRequestForMentor(item, "Accept")}
                style={{
                  backgroundColor:
                    item?.IsRequestSent === "Approved" ||
                    mentorList?.RemainingStudent <= 0
                      ? Colors.gray
                      : colors.AppmainColor,
                  padding: 5,
                  borderRadius: 5,
                  margin: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.ButtonTextColor,
                    fontWeight: "bold",
                  }}
                >
                  {item?.IsRequestSent == "Approved" ? "Accepted" : "Accept"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSelectedItem(item);
                  setTakeRemoveRequest("");
                  setErrorMessage("");
                  setModalRemoveRequest(true);
                }}
                style={{
                  backgroundColor: colors.AppmainColor,
                  padding: 5,
                  borderRadius: 5,
                  margin: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.ButtonTextColor,
                    fontWeight: "bold",
                  }}
                >
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {status == "BecomeMentor" ||
        item.IsRequestSent === "Accepted" ? null : (
          <View
            style={{
              flex: 0,
              paddingHorizontal: 5,
            }}
          >
            {item?.IsRequestSent == "Pending" ? (
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Cancel Request",
                    "Are you sure you want to cancel this request?",
                    [
                      {
                        text: "No",
                        style: "cancel",
                      },
                      {
                        text: "Yes",
                        onPress: () => cancelRequestToMentor(item),
                      },
                    ],
                    { cancelable: true }
                  )
                }
                style={{
                  backgroundColor: colors.AppmainColor,
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  width: 90,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="clip"
                  style={{
                    fontSize: 14,
                    color: colors.ButtonTextColor,
                    fontWeight: "bold",
                  }}
                >
                  Pending
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => sendRequestForMentor(item, "Send")}
                style={{
                  backgroundColor: colors.AppmainColor,
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  width: 90,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="clip"
                  style={{
                    fontSize: 14,
                    color: colors.ButtonTextColor,
                    fontWeight: "bold",
                  }}
                >
                  Select
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };
  const renderItemChat = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ChatDetails", { Item: item, Type: "Mentor" })
        }
        style={{
          backgroundColor: colors.textinputBackgroundcolor,
          margin: 5,
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View>
          <Image
            source={
              item?.ProfilePhoto
                ? { uri: item?.ProfilePhoto }
                : require("../assets/placeholderprofileimage.png")
            }
            style={{
              width: 70,
              height: 70,
              borderRadius: 80,
              backgroundColor: Colors.gray,
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.AppmainColor,
              paddingLeft: 5,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            {item?.UserName}
          </Text>
          <Text style={{ color: colors.textColor, paddingLeft: 5 }}>
            {item?.CompanyName}
          </Text>
        </View>

        {status == "BecomeMentor" ||
        item.IsRequestSent === "Accepted" ? null : (
          <View style={{ flex: item?.IsRequestSent == "Pending" ? 0.25 : 0.2 }}>
            <TouchableOpacity
              onPress={() => sendRequestForMentor(item, "Send")}
              style={{
                backgroundColor: colors.AppmainColor,
                padding: 5,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: colors.ButtonTextColor,
                  fontWeight: "bold",
                }}
              >
                {item?.IsRequestSent == "Pending"
                  ? item?.IsRequestSent
                  : "Select"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    if (mentorList) {
      const mentorListData =
        mentorList?.MentorList || mentorList?.StudentList || [];

      const pendingData = mentorListData?.filter((item) =>
        status === "BecomeMentor"
          ? item.IsRequestSent === "Approved"
          : item.IsRequestSent === "Pending" ||
            item.IsRequestSent === "Accepted"
      );

      setFilteredData(pendingData?.length > 0 ? pendingData : mentorListData);
    }
  }, [mentorList, status]);
  const [isOpen2, setIsOpen2] = useState(false);
  const toggleDropdown2 = () => setIsOpen2(!isOpen2);
  const options2 = ["1", "2", "3", "4", "5"];

  const selectOption2 = async (option) => {
    console.log("Selected Option:", option);
    setSelectedValue1(option);
    setIsOpen2(false);

    const requestData = {
      userId: userProfileData?.Data?.userId,
      numberofMentees: parseInt(option, 10),
    };

    try {
      const response = await fetch(`${baseUrl}${UpdateBasicDetails}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("API Response:", result);
        showSuccess("Mentees updated successfully!");

        getMentorList();
      } else {
        throw new Error(result.message || "Failed to update mentees.");
      }
    } catch (error) {
      console.error("API Error:", error);
      showError(error.message || "Something went wrong.");
    }
  };

  if (initialLoading) {
    return <CommonLoader visible={true} />;
  }

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header
        title={
          status == "BecomeMentor"
            ? "Connect with B2B Agent"
            : "Connect with DMC"
        }
        navigation={navigation}
      />
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              padding: 10,
            }}
          >
            <TextInput
              placeholder="Search By Name"
              style={{
                ...globalStyles.SerachInput,
                borderColor: colors.textinputbordercolor,
                color: colors.textColor,
                backgroundColor: colors.textinputBackgroundcolor,
              }}
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>
          {status == "BecomeMentor" ? null : (
            <View
              style={{
                ...globalStyles.ViewINter1,
                backgroundColor: colors.textinputBackgroundcolor,
              }}
            >
              <Text
                style={{
                  ...globalStyles.headlineText,
                  color: colors.textColor,
                }}
              >
                Connect with DMC
              </Text>
            </View>
          )}

          {status == "BecomeMentor" ? (
            <View
              style={{
                ...globalStyles.ViewINter1,
                flexDirection: "row",
                justifyContent: "space-between",
                marginRight: 10,
                backgroundColor: colors.textinputBackgroundcolor,
              }}
            >
              <Text
                style={{
                  ...globalStyles.headlineText,
                  position: "relative",
                  color: colors.textColor,
                }}
              >
                I Want To DMC
              </Text>
              <View>
                <Text
                  style={{
                    ...globalStyles.headlineText,
                    color: colors.textColor,
                  }}
                >
                  Students
                </Text>

                <View>
                  <TouchableOpacity
                    onPress={toggleDropdown2}
                    style={{
                      backgroundColor: colors.AppmainColor,
                      justifyContent: "center",
                      flexDirection: "row",
                      padding: 5,
                      margin: 5,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ color: colors.ButtonTextColor }}>
                      {selectedValue1}
                    </Text>
                    <Icon
                      type="AntDesign"
                      name="down"
                      size={18}
                      color={colors.ButtonTextColor}
                      style={{ paddingLeft: 10 }}
                    />
                  </TouchableOpacity>

                  {isOpen2 && (
                    <View
                      style={{
                        position: "absolute",
                        top: 40,
                        left: 10,
                        backgroundColor: colors.modelBackground,
                        borderRadius: 5,
                        elevation: 5,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        padding: 10,
                        zIndex: 999,
                      }}
                    >
                      <ScrollView>
                        {options2.map((option, index) => (
                          <TouchableOpacity
                            key={index}
                            style={{
                              ...globalStyles.dropdownItemShare,
                              borderColor: colors.textinputbordercolor,
                            }}
                            onPress={() => selectOption2(option)}
                          >
                            <Text
                              style={{ fontSize: 14, color: colors.textColor }}
                            >
                              {option}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ) : null}

          {status == "BecomeMentor" ? (
            mentorList?.Message ? (
              <View
                style={{
                  // flex: 1,
                  backgroundColor: Colors.lite_gray,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <Text style={{ fontSize: 18, color: colors.textColor }}>
                  Any Request Not Found
                </Text>
              </View>
            ) : (
              <View
                style={{
                  ...globalStyles.ViewINter1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: colors.textinputBackgroundcolor,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.AppmainColor,
                    padding: 5,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      ...globalStyles.headlineText,
                      color: colors.ButtonTextColor,
                      fontSize: 16,
                    }}
                  >
                    Accepted {mentorList?.AcceptedStudent} Students
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#4e4e4e",
                    padding: 5,
                    borderRadius: 4,
                    marginRight: 5,
                  }}
                >
                  <Text
                    style={{
                      ...globalStyles.headlineText,
                      color: colors.ButtonTextColor,
                      fontSize: 16,
                    }}
                  >
                    Remaining {mentorList?.RemainingStudent} Students
                  </Text>
                </View>
              </View>
            )
          ) : null}

          {status == "BecomeMentor" ? (
            <>
              {mentorList?.Message ? null : (
                <View
                  style={{
                    ...globalStyles.ViewINter1,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                >
                  <Text
                    style={{
                      ...globalStyles.headlineText,
                      position: "relative",
                      color: colors.textColor,
                    }}
                  >
                    MENTEES Chat
                  </Text>
                </View>
              )}

              <View>
                <FlatList
                  data={filteredData}
                  renderItem={renderItemChat}
                  keyExtractor={(item) => item?.UserId?.toString()}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </>
          ) : null}

          {status == "BecomeMentor" ? (
            mentorList?.Message ? null : (
              <View
                style={{
                  ...globalStyles.ViewINter1,
                  backgroundColor: colors.textinputBackgroundcolor,
                }}
              >
                <Text
                  style={{
                    ...globalStyles.headlineText,
                    position: "relative",
                    color: colors.textColor,
                  }}
                >
                  Request Of MENTEES
                </Text>
              </View>
            )
          ) : null}

          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item?.UserId?.toString()}
            showsVerticalScrollIndicator={false}
            inverted
          />
        </ScrollView>
        <Modal visible={modalRemoveRequest} transparent animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: colors.modelBackground,
                padding: 20,
                borderRadius: 10,
                width: "80%",
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 10,
                    color: colors.AppmainColor,
                  }}
                >
                  Do You Really Want To Remove?
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 10,
                    color: colors.textColor,
                  }}
                >
                  {selectedItem?.UserName}
                </Text>
              </View>
              <TextInput
                placeholderTextColor={colors.placeholderTextColor}
                placeholder="Enter your message"
                value={takeRemoveRequest}
                onChangeText={(val) => {
                  setTakeRemoveRequest(val), setErrorMessage("");
                }}
                style={{
                  borderWidth: 1,
                  borderColor: colors.textinputbordercolor,
                  color: colors.textColor,
                  backgroundColor: colors.textinputBackgroundcolor,
                  padding: 10,
                  borderRadius: 4,
                  marginBottom: 15,
                }}
              />
              {/* Error Message */}
              {errorMessage ? (
                <Text style={{ color: "red", marginBottom: 10 }}>
                  {errorMessage}
                </Text>
              ) : null}

              {/* Action Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => setModalRemoveRequest(false)}
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    backgroundColor: colors.textinputBackgroundcolor,
                    borderColor: colors.textinputbordercolor,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: colors.textColor, fontWeight: "bold" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!takeRemoveRequest.trim()) {
                      setErrorMessage(
                        "Please enter a message before proceeding."
                      );
                      return;
                    }
                    RemoveRequestForMentor(selectedItem);
                  }}
                  style={{
                    padding: 10,
                    backgroundColor: colors.AppmainColor,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      color: colors.ButtonTextColor,
                      fontWeight: "bold",
                    }}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default FindMentor;
