import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
} from "react-native";
import Colors from "../color";
import Header from "../Header/Header";
import globalStyles from "../GlobalCSS";
import Icon from "../Icons/Icons";
import {
  baseUrl,
  contactList,
  Deleteknowledge,
  ListKnowledgeHub,
  SendMessage,
  ViewCountKHub,
} from "../baseURL/api";
import LikeIcon from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import { ViewCountApi, fetchContactList } from "../baseURL/ExperienceList";
import { showError, showSuccess } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";

const KnowledgeDetails = ({ navigation, route }) => {
  const { Item = {} } = route.params || {};
  const { isDark, colors, toggleTheme } = useTheme();
  const [userData, setUserData] = useState([]);
  const [isLiked, setIsLiked] = useState(Item?.IsLiked);
  const [totalLikes, setTotalLikes] = useState(Item?.TotalLike || 0);
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };

  useEffect(() => {
    UserValue();
  }, []);

  // This is use for Count the KnowledgeHub Views
  useEffect(() => {
    if (userData) {
      ViewCountApi(ViewCountKHub, Item?.id, userData, setLoadingContacts);
      // console.log("userData",userData?.User?.userId)
    }
  }, [userData]);
  const openFile = async () => {
    try {
      if (!Item?.documentFile) {
        showError("No file available");
        return;
      }

      let fileUrl = Item.documentFile; // Directly use the documentFile as URL

      // Extract the file extension
      const fileExtension = fileUrl.split(".").pop();

      // Define the local file path
      const localFilePath = `${RNFS.DocumentDirectoryPath}/temp_file.${fileExtension}`;

      // Download the file
      const downloadOptions = {
        fromUrl: fileUrl,
        toFile: localFilePath,
      };

      await RNFS.downloadFile(downloadOptions).promise;
      console.log("File downloaded to:", localFilePath);

      // Open the downloaded file
      await FileViewer.open(localFilePath);
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };
  const handleDeleteComment = (item) => {
    console.log("item", item);
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this Post?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes", // If Yes is pressed, proceed with deletion
          onPress: async () => {
            try {
              const response = await fetch(`${baseUrl}${Deleteknowledge}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: item,
                }),
              });

              const data = await response.json();

              if (response.ok) {
                navigation.goBack();
              } else {
                showError("Failed to delete the Post.");
              }
            } catch (error) {
              console.error("Delete Error:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const toggleLike = async () => {
    if (userData?.User?.userId) {
      try {
        const response = await fetch(
          "https://travcomexapi.vecospace.com/api/addlike",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              postId: Item?.id,
              postType: 20,
              userId: userData?.User?.userId,
            }),
          }
        );

        const data = await response.json();
        console.log("Like Response:", data);

        if (data.Status === 1) {
          setIsLiked(data.IsLiked);
          setTotalLikes(data.TotalRecord);
        } else {
          showError("Failed to like/unlike the post.");
        }
      } catch (error) {
        console.error("Like API Error:", error);
      }
    }
  };
  useEffect(() => {
    if (modalVisible && userData) {
      fetchContactList(
        userData,
        baseUrl,
        contactList,
        (res) => {
          setContacts(res);
          setFilteredContacts(res);
        },
        setLoadingContacts
      );
    }
  }, [modalVisible]);
  const openModal = (item) => {
    fetchContactList(userData);
    setSelectedItem(item); // Store the selected item
    setModalVisible(true);
  };
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
  const sendMessage = async (receiverId, selectedUsers) => {
    console.log("Sending to:", receiverId, "Post:", selectedUsers);

    const cleanHtmlWithSpacing = (html) => {
      if (!html) return "";
      return html
        .replace(/<\/(div|p|br|h[1-6])>/gi, " ")
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    };

    const downloadFileAsAttachment = async (url) => {
      const fileName = `file_${Date.now()}.pdf`;
      const downloadDest = `${RNFS.CachesDirectoryPath}/${fileName}`;

      try {
        const result = await RNFS.downloadFile({
          fromUrl: url,
          toFile: downloadDest,
        }).promise;

        if (result.statusCode === 200) {
          return {
            uri: `file://${downloadDest}`,
            name: fileName,
            type: "application/pdf",
          };
        } else {
          console.warn("⚠️ File download failed:", result.statusCode);
          return null;
        }
      } catch (error) {
        console.error("Download error:", error);
        return null;
      }
    };

    let fileData = null;
    if (selectedUsers?.documentFile) {
      fileData = await downloadFileAsAttachment(selectedUsers.documentFile);
    }

    const formData = new FormData();
    formData.append("senderId", userData?.User?.userId?.toString());
    formData.append("receiverId", receiverId?.toString());
    formData.append(
      "chatText",
      cleanHtmlWithSpacing(selectedUsers?.name || selectedUsers?.title || "")
    );
    formData.append("optionalType", "types");
    formData.append("optionalId", selectedUsers?.id?.toString() || "");

    if (fileData) {
      formData.append("attachmentName", fileData.name);
      formData.append("attachment", fileData);
    } else {
      formData.append("attachmentName", "");
    }

    try {
      const response = await fetch(`${baseUrl}${SendMessage}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const resText = await response.text();

      if (response.ok) {
        const result = JSON.parse(resText);
        console.log("✅ Message sent:", result);
        showSuccess(result.message || "Message sent successfully");
        setModalVisible(false);
      } else {
        console.error("Server error:", resText);
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setModalVisible(false);
    }
  };

  const toggleSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>
        <Header title="Knowledge Hub" navigation={navigation} />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View
            style={{
              padding: 0,
              paddingVertical: 20,
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                margin: 10,
                color: colors.textColor,
              }}
            >
              {Item?.name}
            </Text>
            <Text
              style={{
                fontSize: 15,
                margin: 10,
                color: colors.placeholderTextColor,
              }}
            >
              View: {Item?.views}
            </Text>
          </View>
          {userData?.User?.userId === Item.UserDetail?.UserId ? (
            <View
              style={{
                ...globalStyles.flexRow,
                justifyContent: "flex-end",
                marginRight: 10,
                marginVertical: 10,
              }}
            >
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() =>
                  navigation.navigate("AddKnowledgeHub", {
                    Item: Item,
                  })
                }
              >
                <Icon
                  name="pencil"
                  size={17}
                  color={colors.placeholderTextColor}
                  type="Octicons"
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDeleteComment(Item.id)}>
                <Icon
                  name="delete"
                  size={17}
                  color={colors.placeholderTextColor}
                  type="MaterialCommunityIcons"
                />
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={openFile}
            style={{
              ...globalStyles.selectImgArticle,
              margin: 10,
              borderColor: colors.AppmainColor,
            }}
          >
            <Text
              style={{
                ...globalStyles.FS_18_FW_600,
                color: colors.AppmainColor,
                fontWeight: "700",
              }}
            >
              {"View the File "}
            </Text>
          </TouchableOpacity>
          <View style={{ marginHorizontal: 10 }}>
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() =>
                navigation.navigate("ListLike", {
                  postId: Item.id,
                  postType: 20,
                })
              }
            >
              <Text style={{ color: colors.textColor }}>
                {Item.TotalLike} Like
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 10,
              borderBottomWidth: 2,
              paddingHorizontal: 15,
              borderColor: colors.textinputbordercolor,
            }}
          >
            <TouchableOpacity
              style={globalStyles.shareButtonView}
              onPress={toggleLike}
            >
              <LikeIcon
                name={isLiked ? "like1" : "like2"}
                size={20}
                // color={isLiked ? '#007AFF' : '#888'}
                color={
                  isLiked ? colors.AppmainColor : colors.placeholderTextColor
                }
                style={{ paddingRight: 5 }}
              />
              <Text style={{ color: colors.textColor }}>{totalLikes} Like</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openModal(Item)}
              style={globalStyles.shareButtonView}
            >
              <Icon
                name="share"
                size={20}
                color={colors.placeholderTextColor}
                type="FontAwesome"
                style={{ paddingRight: 5 }}
              />

              <Text style={{ color: colors.textColor }}>Share</Text>
            </TouchableOpacity>
          </View>

          <Modal visible={modalVisible} transparent animationType="slide">
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  backgroundColor: colors.modelBackground,
                  padding: 20,
                  borderRadius: 10,
                  marginHorizontal: 20,
                  marginTop: 20,
                  height: "70%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 10,
                      color: colors.textColor,
                    }}
                  >
                    Search User
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false), setSelectedUsers([]);
                    }}
                  >
                    <Icon
                      name="cross"
                      size={22}
                      color={colors.backIconColor}
                      type="Entypo"
                    />
                  </TouchableOpacity>
                </View>

                {/* Search Input */}
                <TextInput
                  placeholderTextColor={colors.placeholderTextColor}
                  placeholder="Enter user name"
                  style={{
                    borderWidth: 1,
                    borderColor: colors.textinputbordercolor,
                    color: colors.textColor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    borderRadius: 5,
                    padding: 10,
                    marginBottom: 10,
                  }}
                  value={username}
                  onChangeText={handleContactSearch} // Call search function
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
                        {/* Custom Checkbox */}
                        <TouchableOpacity
                          onPress={() => toggleSelection(item.UserId)}
                          style={{
                            width: 20,
                            height: 20,
                            borderWidth: 2,
                            borderColor: selectedUsers.includes(item.UserId)
                              ? colors.AppmainColor
                              : colors.textinputbordercolor,
                            backgroundColor: selectedUsers.includes(item.UserId)
                              ? colors.AppmainColor
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
                                color: colors.ButtonTextColor,
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
                    if (!selectedItem) return;
                    for (const userId of selectedUsers) {
                      await sendMessage(userId, selectedItem);
                      console.log("Sending item:", selectedItem);
                    }
                    setSelectedUsers([]); // Clear selected users after sending messages
                    setModalVisible(false); // Close modal
                  }}
                  style={{
                    backgroundColor: colors.AppmainColor,
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.ButtonTextColor,
                      fontWeight: "bold",
                    }}
                  >
                    Share
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProfileDetails", {
                Item: Item.UserDetail,
              })
            }
            style={{
              ...globalStyles.ViewUserDetils,
              borderColor: colors.textinputbordercolor,
            }}
          >
            <Image
              style={globalStyles.ViewUserDetilsIMG}
              source={
                Item?.UserDetail?.ProfilePhoto
                  ? {
                      uri: Item?.UserDetail?.ProfilePhoto,
                    }
                  : require("../../assets/placeholderprofileimage.png")
              }
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 15, color: colors.textColor }}>
                {Item?.UserDetail?.UserName}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.placeholderTextColor,
                  flexWrap: "wrap",
                  width: "80%",
                }}
              >
                {Item?.UserDetail?.JobTitle} at {Item?.UserDetail?.CompanyName}
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              paddingVertical: 20,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: colors.placeholderTextColor,
                marginHorizontal: 10,
              }}
            >
              Published:{Item?.dateAdded}
            </Text>
            <Text
              style={{
                fontSize: 15,
                margin: 10,
                color: colors.placeholderTextColor,
              }}
            >
              Category: {Item?.categoryNames}
            </Text>
            <Text
              style={{
                fontSize: 17,
                margin: 10,
                color: colors.textColor,
              }}
            >
              {Item?.longDescription}
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default KnowledgeDetails;
