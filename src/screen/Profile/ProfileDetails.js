import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
  TextInput,
  ActivityIndicator,
  Button,
} from "react-native";
import globalStyles from "../GlobalCSS";
import Header from "../Header/Header";
import Colors from "../color";
import Icon1 from "react-native-vector-icons/Entypo";
import Icon from "../Icons/Icons";
import {
  baseUrl,
  blockcontact,
  unblockcontact,
  contactList,
  SendMessage,
  Profile_Detail,
  RemoveConnection,
  Addprofileview,
  reportcontact,
} from "../baseURL/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getExperienceList,
  getEducationList,
  SkillsList,
  fetchExploringListUpdate,
  InterestsList,
  fetchArticles,
  fetchContactList,
} from "../baseURL/ExperienceList";
import RenderHTML from "react-native-render-html";
import RNFS from "react-native-fs";
import CommonLoader from "../components/CommonLoader";
import ImageViewer from "react-native-image-zoom-viewer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { showError, showSuccess } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";
import { universityFullName } from "../constants";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const ProfileDetails = ({ navigation, route }) => {
  const { Item = {}, groupId = {} } = route.params || {};
  const [ItemValue, setItemValue] = useState(Item?.IsUserBlocked);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const { isDark, colors, toggleTheme } = useTheme();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState([]);
  const [listExperience, setListExperience] = useState([]);
  const [listEducation, setListEducation] = useState([]);
  const [keyValue, setKeyValue] = useState([]);
  const [jmiValue, setJmiValue] = useState([]);
  const [interestsValue, setInterestsValue] = useState([]);
  const [articleList, setArticleList] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [modalVisibleShare, setModalVisibleShare] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [contacts, setContacts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const { width, height } = Dimensions.get("window");
  const [isreportModalVisible, setreportModalVisible] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const reportQuestions = [
    "Spam messages",
    "Abusive behavior",
    "Harassment",
    "Fake profile",
    "Other",
  ];

  const toggleQuestion = (question) => {
    if (selectedQuestions.includes(question)) {
      setSelectedQuestions(selectedQuestions.filter((q) => q !== question));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const screenWidth = Dimensions.get("window").width;
  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };

  useEffect(() => {
    UserValue();
    if (userData?.User?.userId) {
      GetProfileData();
    }
    if (profileData?.userId) {
      getExperienceList(profileData?.userId, setListExperience);
      getEducationList(profileData?.userId, setListEducation);
      SkillsList(profileData?.userId, setKeyValue);
      fetchExploringListUpdate(profileData?.userId, setJmiValue);
      InterestsList(profileData?.userId, setInterestsValue);
      fetchArticles(profileData?.userId, 1, 1, "self", setArticleList);
    }
  }, [userData?.User?.userId, profileData?.userId]);

  const RemoveConnectionApi = async () => {
    try {
      const url = `${baseUrl}${RemoveConnection}`;
      console.log("Final URL:", url);
      const payload = JSON.stringify({
        userId: Item.UserId,
        groupId: groupId,
      });
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: payload,
      });
      console.log("Response Status:", response.status);
      const data = await response.json();
      console.log("API Response Data:", data);
      if (response.ok) {
        showSuccess(JSON.stringify(data.Message));
      } else {
        console.error("API Error:", data);
        showError(data.Message);
      }
    } catch (error) {
      console.error("Fetch Error:", error.Message);
    }
  };
  const confirmBlock = () => {
    setIsBlockModalVisible(true);
  };

  const onBlockCancel = () => {
    setIsBlockModalVisible(false);
  };

  const onBlockConfirm = () => {
    blockUser();
    setIsBlockModalVisible(false);
  };
  const blockUser = async () => {
    try {
      const isUnblocking = ItemValue;
      const url = `${baseUrl}${isUnblocking ? unblockcontact : blockcontact}`;

      // console.log("Final URL:", url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blockBy: userData?.User?.userId,
          blockTo: Item?.UserId || Item?.UserDetail?.UserId,
        }),
      });

      console.log("Response Status:", response.status);
      const data = await response.json();
      console.log("API Response Data:", data);

      if (response.ok) {
        showSuccess(data?.Message);
        setItemValue(!ItemValue);
      } else {
        console.error("API Error:", data);
        showError(data?.Message || "Something went wrong");
      }
    } catch (error) {
      console.error("Fetch Error:", error.message);
      showError("Network error");
    }
  };
  const submitReport = async () => {
    if (selectedQuestions.length === 0) {
      showError("Please select at least one reason");
      return;
    }

    const data = {
      reportBy: userData?.User?.userId,
      reportTo: Item?.UserId || Item?.UserDetail?.UserId,
      report_question: selectedQuestions,
    };
    try {
      const response = await fetch(`${baseUrl}${reportcontact}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showSuccess("Report submitted successfully!");
        setreportModalVisible(false);
        setSelectedQuestions([]);
      } else {
        showError("Error submitting report.");
      }
    } catch (error) {
      console.log("Network error:", error.message);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  const GetProfileData = async () => {
    const resolvedUserId =
      Item?.UserId ||
      Item?.userId ||
      Item?.UserDetail?.UserId ||
      Item?.optionalId;

    setInitialLoading(true);
    try {
      const response = await fetch(`${baseUrl}${Profile_Detail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: resolvedUserId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setInitialLoading(false);
        setProfileData(data.Data);
      } else {
        showError(data.message || "Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setInitialLoading(false);
    }
  };
  const renderExperienceList = (item) => {
    return (
      <View
        style={{
          ...globalStyles.listEucation,
          marginHorizontal: 0,
          backgroundColor: colors.textinputBackgroundcolor,
        }}
      >
        <View>
          <Text
            style={{ fontSize: 16, fontWeight: "600", color: colors.textColor }}
          >
            {item?.item?.JobTitle}
          </Text>
          <Text style={{ color: colors.textColor }}>
            {item?.item?.CompanyName}
          </Text>
          <View style={globalStyles.flexRow}>
            <Text style={{ color: colors.textColor }}>
              {item.item?.FromMonth} {item?.item?.FromYear} -
            </Text>
            <Text style={{ color: colors.textColor }}>
              {item.item?.ToMonth} {item.item?.ToYear} | {item?.item?.TotalYear}
            </Text>
          </View>
          <Text style={{ color: colors.textColor }}>
            {item.item?.JobLocation}
          </Text>
        </View>
        <View style={globalStyles.flexRow}></View>
      </View>
    );
  };
  const renderExperienceLis1 = (item) => {
    return (
      <View
        style={{
          ...globalStyles.listEucation,
          marginHorizontal: 0,
          backgroundColor: colors.textinputBackgroundcolor,
        }}
      >
        <View>
          <Text
            style={{ fontSize: 16, fontWeight: "600", color: colors.textColor }}
          >
            {item?.item?.Degree}
          </Text>
          <Text style={{ color: colors.textColor }}>
            {item?.item?.UniversitySchool}
          </Text>
          <View style={globalStyles.flexRow}>
            <Text style={{ color: colors.textColor }}>
              {item.item?.FromMonth} {item?.item?.FromYear} -
            </Text>
            <Text style={{ color: colors.textColor }}>
              {item.item?.ToMonth} {item.item?.ToYear} | {item?.item?.TotalYear}
            </Text>
          </View>
        </View>
        <View style={globalStyles.flexRow}></View>
      </View>
    );
  };
  // Function to safely extract the image URL
  const getImageUrl = () => {
    if (
      articleList &&
      Array.isArray(articleList.Data) &&
      articleList.Data.length > 0
    ) {
      const firstDataItem = articleList.Data[0];
      if (
        firstDataItem.Images &&
        Array.isArray(firstDataItem.Images) &&
        firstDataItem.Images.length > 0
      ) {
        return firstDataItem.Images[0].PostImage;
      }
    }
    return null; // Return null if no image is found
  };
  const postImage = getImageUrl();

  // this is for shot the article text's truncateText or shortText
  const truncateText = (html, percentage) => {
    // Remove HTML tags to calculate the plain text length
    const plainText = html.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags
    const truncatedLength = Math.floor(plainText.length * percentage); // Calculate length to truncate
    const truncatedText = plainText.substring(0, truncatedLength); // Get the substring
    return `<p>${truncatedText}...</p>`; // Wrap in a <p> tag and add ellipsis
  };

  let shortText = "<p>No content available.</p>"; // Declare it before using

  if (articleList?.Data) {
    shortText = truncateText(
      articleList?.Data[0]?.PostText || "<p>No content available.</p>",
      0.25
    );
  }

  useEffect(() => {
    if (modalVisibleShare && userData) {
      fetchContactList(
        userData,
        baseUrl,
        contactList,
        setContacts,
        setLoadingContacts
      );
    }
  }, [modalVisibleShare]);
  const openModal = () => {
    setModalVisibleShare(true);
  };

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      setFilteredContacts(contacts);
    }
  }, [contacts]);
  const handleContactSearch = (query) => {
    setUsername(query);
    if (query.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter((user) =>
        user?.UserName?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  };

  const toggleSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };
  const sendMessage = async (receiverId, selectedUsers) => {
    const convertUrlToLocalFile = async (url) => {
      try {
        const fileName = url.split("/").pop();
        const downloadDest = `${RNFS.CachesDirectoryPath}/${fileName}`;

        const response = await RNFS.downloadFile({
          fromUrl: url,
          toFile: downloadDest,
        }).promise;

        if (response.statusCode === 200) {
          return `file://${downloadDest}`;
        } else {
          console.error("File download failed:", response);
          return null;
        }
      } catch (error) {
        console.error("Error downloading file:", error);
        return null;
      }
    };

    const filePath = selectedUsers?.ProfilePhoto
      ? await convertUrlToLocalFile(selectedUsers.ProfilePhoto)
      : null;

    const formData = new FormData();
    formData.append("senderId", `${userData?.User?.userId}`);
    formData.append("receiverId", `${receiverId}`);
    formData.append("chatText", selectedUsers?.UserName || "No message");
    formData.append("attachmentName", filePath ? "send.jpg" : "");
    formData.append("optionalType", "ProfileShare");

    if (filePath) {
      formData.append("attachment", {
        uri: filePath,
        name: "send.jpg",
        type: "image/jpeg",
      });
    }

    try {
      const response = await fetch(`${baseUrl}${SendMessage}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Message Sent Successfully");
      } else {
        console.error("Message Sending Failed:", await response.text());
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  useEffect(() => {
    if (userData && Item) {
      AddprofileviewApi(userData, Item);
    }
  }, [userData, Item]);
  const AddprofileviewApi = async () => {
    try {
      const payload = JSON.stringify({
        profileId:
          Item?.UserId ||
          Item?.UserDetail?.UserId ||
          Item?.SenderUserDetail?.UserId,

        viewerId: userData?.User?.userId,
      });
      //console.log(payload, 'payloadpayloadpayloadpayloadpayloadpayload');

      const response = await fetch(`${baseUrl}${Addprofileview}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });
      // const text = await response.text();
      // console.log(text, 'texttexttexttext');

      const data = await response.json();
      console.log("Profile view added:", data);
    } catch (error) {
      console.error("Error adding profile view:", error);
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
      <Header title="Profile Details" navigation={navigation} />
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: "#92C4F2",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setModalImages([{ url: profileData?.profilePhoto }]);
                setModalIndex(0);
                setModalImageVisible(true);
              }}
            >
              <Image
                source={
                  profileData?.profilePhoto
                    ? {
                        uri: profileData?.profilePhoto,
                      }
                    : require("../../assets/placeholderprofileimage.png")
                }
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <View
              style={{
                marginHorizontal: 6,
                flex: 1,
              }}
            >
              <Text
                style={{
                  ...styles.userName,
                  //  color: colors.textColor
                }}
              >
                {profileData?.firstName} {profileData?.lastName}
              </Text>

              <Text
                style={[
                  styles.companyName,
                  {
                    flexShrink: 1,
                    flexWrap: "wrap",
                    //  color: colors.textColor
                  },
                ]}
              >
                {profileData?.locationName}
                {profileData?.locationName ? "," : ""}
                {profileData?.cityName}
                {profileData?.cityName ? "," : ""}
                {profileData?.countryName}
                {profileData?.countryName ? "," : ""}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginVertical: 12,
              marginHorizontal: 12,
              borderColor: colors.textinputbordercolor,
              backgroundColor: colors.AppmainColor,
              paddingHorizontal: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              borderRadius: 5,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProfileHighLight", {
                  Item: Item,
                })
              }
              style={{
                paddingVertical: 5,
                borderRightWidth: 1,
                flex: 1,
                borderColor: colors.textinputbordercolor,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  marginVertical: 5,
                  color: colors.ButtonTextColor,
                }}
              >
                Activity
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ContactList", {
                  Item: Item,
                })
              }
              style={{
                paddingVertical: 5,
                borderRightWidth: 1,
                flex: 1,
                borderColor: colors.textinputbordercolor,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  marginVertical: 5,
                  color: colors.ButtonTextColor,
                }}
              >
                Contacts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 5,
                alignItems: "center",
                justifyContent: "center",
                flex: 1.2,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  marginVertical: 5,
                  color: colors.ButtonTextColor,
                }}
              >
                Completed Profile
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("ChatDetails", { Item: Item })}
              style={styles.sendMessageButton}
            >
              <Text style={styles.sendMessageText}>Send Message</Text>
            </TouchableOpacity>
            {/* {interestsValue.length > 0 ? ( */}
            <TouchableOpacity
              style={styles.dotsButton}
              onPress={toggleDropdown}
            >
              <Icon1
                name="dots-three-horizontal"
                size={20}
                color={colors.textColor}
              />
            </TouchableOpacity>
            {/* ) : null} */}
          </View>

          {isDropdownVisible && (
            <View
              style={[
                styles.dropdownContainer,
                {
                  position: "absolute",
                  right: 10,
                  top: 230,
                },
              ]}
            >
              <View
                style={{
                  ...styles.dropdown,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.modelBackground,
                }}
              >
                <TouchableOpacity
                  style={{
                    ...styles.dropdownItem,
                    borderColor: colors.textinputbordercolor,
                  }}
                  onPress={() => {
                    openModal();
                    setIsDropdownVisible(false);
                  }}
                >
                  <Text
                    style={{ ...styles.dropdownText, color: colors.textColor }}
                  >
                    Share Profile
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.dropdownItem,
                    borderColor: colors.textinputbordercolor,
                  }}
                  onPress={() => {
                    setIsDropdownVisible(false);
                    setreportModalVisible(true);
                  }}
                >
                  <Text
                    style={{ ...styles.dropdownText, color: colors.textColor }}
                  >
                    Report
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.dropdownItem,
                    borderColor: colors.textinputbordercolor,
                  }}
                  onPress={() => {
                    confirmBlock();
                    setIsDropdownVisible(false);
                  }}
                >
                  <Text
                    style={{ ...styles.dropdownText, color: colors.textColor }}
                  >
                    {ItemValue ? "UnBlock" : "Block"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.dropdownItem,
                    borderColor: colors.textinputbordercolor,
                  }}
                  onPress={() => {
                    RemoveConnectionApi();
                    setIsDropdownVisible(false);
                  }}
                >
                  <Text
                    style={{ ...styles.dropdownText, color: colors.textColor }}
                  >
                    Remove Connection
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {profileData?.taglineText?.length > 0 ? (
            <>
              <View
                style={{
                  ...globalStyles.PDMainView,
                  padding: 10,
                  borderRadius: 10,
                  borderBottomWidth: 2,
                  borderColor: colors.AppmainColor,
                }}
              >
                <Text style={{ fontSize: 15, color: colors.textColor }}>
                  {profileData?.taglineText}
                </Text>
              </View>
            </>
          ) : null}

          {articleList?.Data?.length > 0 ? (
            <>
              <View
                style={{
                  ...globalStyles.PDMainView,
                  borderBottomWidth: 0,
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
                  Articles
                </Text>
              </View>

              <View
                style={{
                  ...globalStyles.PDMainView,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalImages([{ url: postImage }]);
                    setModalIndex(0);
                    setModalImageVisible(true);
                  }}
                >
                  <Image
                    source={{
                      uri: postImage,
                    }}
                    style={{
                      width: screenWidth - 20,
                      height: 200,
                      resizeMode: "cover",
                      borderRadius: 10,
                      alignSelf: "center",
                    }}
                  />
                </TouchableOpacity>
                {articleList?.Data?.length > 0 ? (
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      marginTop: 10,
                      color: colors.textColor,
                    }}
                  >
                    {articleList?.Data[0]?.PostTitle}{" "}
                  </Text>
                ) : null}

                {articleList?.Data?.length > 0 ? (
                  <RenderHTML
                    contentWidth={screenWidth}
                    source={{
                      html: shortText,
                    }}
                    tagsStyles={{
                      p: { color: colors.textColor, fontSize: 14 },
                      h4: {
                        color: colors.AppmainColor,
                        fontWeight: "700",
                        marginBottom: 10,
                      },
                    }}
                  />
                ) : null}
              </View>
            </>
          ) : null}

          {articleList?.Data?.length > 0 ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ArticlesUserList", {
                  Item: profileData,
                })
              }
              style={{
                marginHorizontal: 12,
                paddingVertical: 10,
                borderBottomWidth: 1,
                alignItems: "center",
                borderColor: colors.textinputbordercolor,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: colors.AppmainColor,
                }}
              >
                See all articles
              </Text>
            </TouchableOpacity>
          ) : null}

          {listExperience.length > 0 ? (
            <View
              style={{
                ...globalStyles.PDMainView,
                borderColor: colors.textinputbordercolor,
              }}
            >
              <Text
                style={{
                  ...globalStyles.ProfileDetailViewText,
                  color: colors.textColor,
                }}
              >
                Professional experience
              </Text>

              <FlatList
                data={listExperience}
                keyExtractor={(item) => item.Id.toString()}
                renderItem={renderExperienceList}
              />
            </View>
          ) : null}

          {listEducation.length > 0 ? (
            <View
              style={{
                ...globalStyles.PDMainView,
                borderColor: colors.textinputbordercolor,
              }}
            >
              <Text
                style={{
                  ...globalStyles.ProfileDetailViewText,
                  color: colors.textColor,
                }}
              >
                Educational background
              </Text>

              <FlatList
                data={listEducation}
                keyExtractor={(item) => item.Id.toString()}
                renderItem={renderExperienceLis1}
              />
            </View>
          ) : null}

          {keyValue.length > 0 ? (
            <>
              <View
                style={{
                  ...globalStyles.PDMainView,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  style={{
                    ...globalStyles.ProfileDetailViewText,
                    color: colors.textColor,
                  }}
                >
                  Skills
                </Text>
              </View>
              <View
                style={{
                  ...globalStyles.skillValueMainView,
                  marginHorizontal: 12,
                  marginTop: 10,
                }}
              >
                {keyValue.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      ...globalStyles.skllSecondView,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                  >
                    <Text
                      style={{
                        ...globalStyles.skillText,
                        color: colors.textColor,
                      }}
                    >
                      {typeof item === "object" ? item.skillText : item}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {jmiValue.length > 0 ? (
            <>
              <View
                style={{
                  ...globalStyles.PDMainView,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  style={{
                    ...globalStyles.ProfileDetailViewText,
                    color: colors.textColor,
                  }}
                >
                  What am I exploring on {universityFullName}
                </Text>
              </View>
              <View
                style={{
                  ...globalStyles.skillValueMainView,
                  marginHorizontal: 12,
                  marginTop: 10,
                }}
              >
                {jmiValue.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      ...globalStyles.skllSecondView,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                  >
                    <Text
                      style={{
                        ...globalStyles.skillText,
                        color: colors.textColor,
                      }}
                    >
                      {typeof item === "object" ? item.exploringText : item}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {interestsValue.length > 0 ? (
            <>
              <View
                style={{
                  ...globalStyles.PDMainView,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  style={{
                    ...globalStyles.ProfileDetailViewText,
                    color: colors.textColor,
                  }}
                >
                  Interests
                </Text>
              </View>
              <View
                style={{
                  ...globalStyles.skillValueMainView,
                  marginHorizontal: 12,
                  marginTop: 10,
                }}
              >
                {interestsValue.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      ...globalStyles.skllSecondView,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                  >
                    <Text
                      style={{
                        ...globalStyles.skillText,
                        color: colors.textColor,
                      }}
                    >
                      {typeof item === "object" ? item.interestText : item}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          <Modal visible={modalVisibleShare} transparent animationType="slide">
            <View style={globalStyles.shareModalMain}>
              <View
                style={{
                  ...globalStyles.shareModalMain2,
                  backgroundColor: colors.modelBackground,
                }}
              >
                <View style={globalStyles.FD_Row_JC_SB}>
                  <Text
                    style={{
                      ...globalStyles.shareText1,
                      color: colors.textColor,
                    }}
                  >
                    Search User
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisibleShare(false), setSelectedUsers([]);
                    }}
                  >
                    <Icon
                      name="cross"
                      size={15}
                      color={colors.backIconColor}
                      type="Entypo"
                    />
                  </TouchableOpacity>
                </View>

                {/* Search Input */}
                <TextInput
                  value={username}
                  placeholder="Enter user name"
                  style={{
                    ...globalStyles.shareInput,
                    borderColor: colors.textinputbordercolor,
                    color: colors.textColor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                  onChangeText={handleContactSearch}
                  placeholderTextColor={colors.placeholderTextColor}
                />

                {/* Contact List */}
                {loadingContacts ? (
                  <ActivityIndicator size="large" color={colors.AppmainColor} />
                ) : (
                  <FlatList
                    data={filteredContacts} // Use filtered contacts
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{
                          ...globalStyles.contantlistMainView,
                          padding: 5,
                          borderColor: colors.textinputbordercolor,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => toggleSelection(item.UserId)}
                          style={{
                            width: 20,
                            height: 20,
                            borderWidth: 2,
                            borderColor: selectedUsers.includes(item.UserId)
                              ? colors.AppmainColor
                              : "#aaa",
                            backgroundColor: selectedUsers.includes(item.UserId)
                              ? "blue"
                              : "transparent",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 5,
                            marginRight: 10,
                          }}
                        >
                          {selectedUsers.includes(item.UserId) && (
                            <Text
                              style={{
                                color: "white",
                                fontWeight: "bold",
                              }}
                            >
                              ✓
                            </Text>
                          )}
                        </TouchableOpacity>
                        <View>
                          <Image
                            style={globalStyles.contantlistImage}
                            source={
                              item?.ProfilePhoto
                                ? {
                                    uri: item?.ProfilePhoto,
                                  }
                                : require("../../assets/placeholderprofileimage.png")
                            }
                          />
                        </View>
                        <View style={{ padding: 10, flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "600",
                              color: colors.textColor,
                            }}
                          >
                            {item?.UserName}
                          </Text>
                          <Text
                            style={{
                              color: colors.placeholderTextColor,
                              marginBottom: 5,
                            }}
                          >
                            {item?.JobTitle} at {item?.CompanyName}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                )}

                <TouchableOpacity
                  onPress={async () => {
                    for (const userId of selectedUsers) {
                      await sendMessage(userId, Item);
                    }
                    setSelectedUsers([]);
                    setModalVisibleShare(false);
                  }}
                  style={{
                    ...globalStyles.shareModal,
                    backgroundColor: colors.AppmainColor,
                  }}
                >
                  <Text
                    style={{
                      ...globalStyles.shareText,
                      color: colors.ButtonTextColor,
                    }}
                  >
                    Share
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
      <ConfirmDeleteModal
        isVisible={isBlockModalVisible}
        onCancel={onBlockCancel}
        onConfirm={onBlockConfirm}
        confirmButtonText={ItemValue ? "Unblock" : "Block"}
        title={ItemValue ? "Confirm Unblock" : "Confirm Block"}
        message={`Are you sure you want to ${ItemValue ? "Unblock" : "Block"}?`}
      />

      <Modal
        visible={modalImageVisible}
        transparent={true}
        onRequestClose={() => setModalImageVisible(false)}
      >
        <ImageViewer
          imageUrls={modalImages}
          index={modalIndex}
          onCancel={() => setModalImageVisible(false)}
          enableSwipeDown={true}
          onSwipeDown={() => setModalImageVisible(false)}
          renderIndicator={() => null}
          renderHeader={() => (
            <TouchableOpacity
              hitSlop={15}
              style={styles.closeImageButton}
              onPress={() => setModalImageVisible(false)}
            >
              <MaterialIcons name="close" size={14} color="black" />
            </TouchableOpacity>
          )}
        />
      </Modal>
      <Modal
        transparent
        animationType="slide"
        visible={isreportModalVisible}
        onBackdropPress={() => setreportModalVisible(false)}
        backdropOpacity={0.5}
        style={{ justifyContent: "center", alignItems: "center", margin: 0 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: width * 0.9, // 90% of screen width
              maxHeight: height * 0.6, // max 60% of screen height
              backgroundColor: colors.modelBackground,
              borderRadius: 15,
              padding: 20,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 15,
                color: colors.textColor,
              }}
            >
              Select reasons for reporting:
            </Text>

            <ScrollView
              style={{ flexGrow: 0, maxHeight: height * 0.35 }}
              showsVerticalScrollIndicator={true}
            >
              {reportQuestions.map((question, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => toggleQuestion(question)}
                    style={{
                      width: 20,
                      height: 20,
                      borderWidth: 2,
                      borderColor: selectedQuestions.includes(question)
                        ? colors.AppmainColor
                        : colors.placeholderTextColor,
                      backgroundColor: selectedQuestions.includes(question)
                        ? colors.AppmainColor
                        : "transparent",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                  >
                    {selectedQuestions.includes(question) && (
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </Text>
                    )}
                  </TouchableOpacity>

                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      flexShrink: 1,
                      color: colors.textColor,
                    }}
                  >
                    {question}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginRight: 10,
                  backgroundColor: colors.AppmainColor,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}
                onPress={submitReport}
              >
                <Text
                  style={{
                    color: colors.ButtonTextColor,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  marginLeft: 10,
                  backgroundColor: colors.textinputBackgroundcolor,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}
                onPress={() => setreportModalVisible(false)}
              >
                <Text
                  style={{
                    color: colors.textColor,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 90,
    borderWidth: 2,
    margin: 10,
    borderWidth: 3,
    borderColor: "yellow",
  },
  userName: { fontSize: 18, fontWeight: "500" },
  designation: { fontSize: 18, fontWeight: "500" },
  companyName: { fontSize: 18, fontWeight: "500" },
  sendMessageButton: {
    backgroundColor: "#92C4F2",
    paddingVertical: 5,
    alignItems: "center",
    flex: 0.95,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  sendMessageText: { fontSize: 17, color: Colors.white, fontWeight: "700" },
  dotsButton: { borderWidth: 1, padding: 3, borderRadius: 20 },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: "flex-end",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    // borderBottomColor: Colors.lightGray,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownContainer: {
    zIndex: 10,
  },
  closeImageButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 4,
    backgroundColor: "grey",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default ProfileDetails;
