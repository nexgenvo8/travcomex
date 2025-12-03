import {
  baseUrl,
  HighLight,
  Listarticle,
  listcomment,
  ListEducation,
  ListExploring,
  Listinterest,
  listoption,
  ListProfessionalExp,
  ListSkills,
  SendMessage,
} from "./api";
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  Pressable,
  ActivityIndicator,
  Button,
  Alert,
  RefreshControl,
} from "react-native";

import PencilIcon from "react-native-vector-icons/Octicons";
import DeleteIcon from "react-native-vector-icons/MaterialCommunityIcons";
import RNFS from "react-native-fs";
import Icon from "../Icons/Icons";
import Colors from "../color";
import { showError, showSuccess } from "../components/Toast";

export const getExperienceList = async (userId, setListExperience) => {
  try {
    const response = await fetch(`${baseUrl}${ListProfessionalExp}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setListExperience(data.Data);
    } else {
      showError(data.message);
    }
  } catch (error) {
    console.error("Fetch Error Education List:", error);
  }
};
// Education Api's List
export const getEducationList = async (userId, setListEducation) => {
  try {
    const response = await fetch(`${baseUrl}${ListEducation}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // userId: userData?.User?.userId,
        userId: userId,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Education List ---", data);
      // setListEducation(data);
      setListEducation(data?.Data);
    } else {
      showError("Error", data.message);
    }
  } catch (error) {
    console.error("getEducationList Error:", error);
  }
};
// SkillsList Api's List
export const SkillsList = async (userId, setKeyValue) => {
  try {
    const response = await fetch(`${baseUrl}${ListSkills}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    });

    const data = await response.json();
    console.log("Listing Skills data ----", data);

    if (response.ok) {
      const InterestsData = data.Data;
      setKeyValue(InterestsData);
    }
  } catch (error) {
    console.error("Fetch Error SkillsList:", error);
  } finally {
    setLoading(false);
  }
};
// Exploring List Api's List
export const fetchExploringListUpdate = async (userId, setJmiValue) => {
  try {
    const response = await fetch(`${baseUrl}${ListExploring}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId, // Ensure userId exists
      }),
    });

    const data = await response.json();
    console.log("Listing exploring data ----", data);

    if (response.ok) {
      const exploringData = data.Data;
      // const exploringTexts = data.Data.map(item => item.exploringText);
      setJmiValue(exploringData);
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  } finally {
    setLoading(false);
  }
};
// Interests List Api's List
export const InterestsList = async (userId, setInterestsValue) => {
  try {
    const response = await fetch(`${baseUrl}${Listinterest}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    });

    const data = await response.json();
    console.log("Listing Interests data ----", data);

    if (response.ok) {
      const InterestsData = data.Data;
      setInterestsValue(InterestsData);
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  } finally {
    setLoading(false);
  }
};
// Add Like Api's
// export const fetchAddLike = async (postId, postType, userId, setAddLike) => {
//   // setLoading(true);
//   try {
//     const response = await fetch(
//       'https://travcomexapi.vecospace.com/api/addlike',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           postId: postId,
//           postType: postType,
//           userId: userId,
//         }),
//       },
//     );

//     const data = await response.json();
//     console.log('ADd Like Data ----', data);

//     if (response.ok) {
//       setAddLike(data);
//       //setRefresh(!refresh);
//     }
//   } catch (error) {
//     console.error('Fetch Error fetchAddLike:', error);
//   } finally {
//     setLoading(false);
//   }
// };
export const fetchAddLike = async (postId, postType, userId) => {
  try {
    const response = await fetch(
      "https://travcomexapi.vecospace.com/api/addlike",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          postType,
          userId,
        }),
      }
    );

    const data = await response.json();
    console.log("Add Like Response:", data);

    if (response.ok) {
      return data; // ✅ return data
    } else {
      throw new Error("API Error");
    }
  } catch (error) {
    console.error("Fetch Error fetchAddLike:", error);
    return null;
  }
};

// Articles List Api's List
export const fetchArticles = async (
  userId,
  per_page,
  page,
  entityName,
  setArticleList,
  setInitialLoading
) => {
  // if (loading || !hasMore) return; // Prevent multiple simultaneous requests
  // setLoading(true);
  if (setInitialLoading) setInitialLoading(true);

  try {
    const response = await fetch(`${baseUrl}${Listarticle}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "",
        userId: userId,
        search: "",
        per_page: per_page,
        page: page,
        entityName: entityName,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Fetched Articles:", data?.Data);
      setArticleList(data);
    }
    if (setInitialLoading) setInitialLoading(false);
  } catch (error) {
    console.error("Fetch Error fetchArticles:", error);
  } finally {
    setLoading(false);
    if (setInitialLoading) setInitialLoading(false);
  }
};
export const handleDeleteComment = (item, apiName) => {
  // console.log("item",item)
  Alert.alert(
    "Confirmation",
    "Are you sure you want to delete this Comment?",
    [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const response = await fetch(`${baseUrl}${apiName}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: item?.Id || item?.item?.Id,
              }),
            });

            const data = await response.json();

            CommentList();
            if (response.ok) {
              // setDeletePost(true);
              showSuccess("Item deleted successfully.");
            } else {
              showError("Failed to delete the item.");
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
// this CommentList View UI
export const renderItem1 = (item) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        marginVertical: 10,
      }}
    >
      <Image
        source={{
          uri: item.ProfilePhoto
            ? item.ProfilePhoto
            : require("../../assets/placeholderprofileimage.png"),
        }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 30,
        }}
      />
      <View
        style={{
          marginLeft: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View>
          <Text style={{ fontWeight: "700", fontSize: 15 }}>
            {item.UserName}
          </Text>
          <Text style={{ fontSize: 13 }}>{item.Comment}</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              setDeleteValue(item);
              onChangeNumber(item.Comment);
            }}
          >
            <PencilIcon
              name="pencil"
              size={20}
              color="#888"
              style={{ paddingRight: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleDeleteComment({ item: item });
            }}
          >
            <DeleteIcon name="delete" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
// this CommentList API's
export const CommentList = async (postId, postType, setCommentList) => {
  try {
    const response = await fetch(`${baseUrl}${listcomment}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
        postType: postType,
      }),
    });

    const data = await response.json();
    console.log("Comment Data ----", data);

    if (response.ok) {
      setCommentList(data.DataList); // Append new posts to the existing list
    }
  } catch (error) {
    console.error("Fetch Error CommentList:", error);
  } finally {
    // setLoading(false);
  }
};
export const getIndustryList = async (industry, setIndustryData) => {
  try {
    const response = await fetch(`${baseUrl}${listoption}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        optionType: industry,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setIndustryData(data?.DataList);
    } else {
      showError(data.message);
    }
  } catch (error) {
    console.error("Fetch Error Industry List:", error);
  }
};
export const sendMessage = async (
  receiverId,
  selectedUsers,
  userData,
  baseUrl,
  SendMessage,
  setFileShareBase64
) => {
  const convertUrlToBase64 = async (url) => {
    try {
      const downloadDest = `${RNFS.CachesDirectoryPath}/temp.pdf`;
      const response = await RNFS.downloadFile({
        fromUrl: url,
        toFile: downloadDest,
      }).promise;

      if (response.statusCode === 200) {
        // Convert the file to Base64
        const base64Data = await RNFS.readFile(downloadDest, "base64");
        console.log("Base64 String:", base64Data);
        setFileShareBase64(base64Data);
        return base64Data;
      } else {
        console.error("File download failed:", response);
      }
    } catch (error) {
      console.error("Error converting to Base64:", error);
    }
  };

  const fileShareBase64 = await convertUrlToBase64(selectedUsers?.documentFile);

  if (fileShareBase64) {
    try {
      const response = await fetch(`${baseUrl}${SendMessage}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: userData?.User?.userId,
          receiverId: receiverId,
          chatText: selectedUsers?.name,
          attachmentName: fileShareBase64 ? "send.png" : null,
          attachment: fileShareBase64,
        }),
      });

      if (response.ok) {
        showSuccess("Message Sent!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
};
export const fetchContactList = async (
  userData,
  baseUrl,
  contactList,
  setContacts,
  setLoadingContacts
) => {
  setLoadingContacts(true);

  if (userData?.User?.userId || userData?.Data?.userId) {
    try {
      const response = await fetch(`${baseUrl}${contactList}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData?.User?.userId || userData?.Data?.userId,
        }),
      });
      // const data = await response.text();
      const data = await response.json();

      if (response.ok) {
        if (userData?.Data?.userId) {
          setContacts(data?.TotalItems);
        } else {
          setContacts(data?.DataList || []);
        }
      } else {
        console.log(
          "Error",
          "Failed to fetch contacts in Experience List screen"
        );
      }
    } catch (error) {
      console.error(
        "Fetch Error  fetchContactList Experience List screen:",
        error
      );
    } finally {
      setLoadingContacts(false);
    }
  }
};
export const fetchHiglight = async (
  userData,
  baseUrl,
  HighLight,
  setHighlight,
  setLoadingContacts
) => {
  setLoadingContacts(true);

  if (userData?.Data?.userId) {
    try {
      const response = await fetch(`${baseUrl}${HighLight}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: 1,
          userId: userData?.Data?.userId,
          postId: "",
          postType: "",
          activitPostType: 1,
          per_page: 20,
          page: 1,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (userData?.Data?.userId) {
          setHighlight(data?.TotalItems);
        }
      } else {
        showError("Failed to fetch contacts.");
      }
    } catch (error) {
      console.error(
        "Fetch Error fetchHiglight in Experience List screen:",
        error
      );
    } finally {
      setLoadingContacts(false);
    }
  }
};
export const UserSearchModal = ({
  modalVisibleShare,
  setModalVisibleShare,
  loadingContacts,
  filteredContacts,
  handleContactSearch,
  toggleSelection,
  selectedUsers,
  // sendMessage,
  ShareValue,
  userData,
}) => {
  const sendMessage = async (receiverId, selectedUsers) => {
    // console.log('selectedUsers', selectedUsers);
    const convertUrlToBase64 = async (url) => {
      try {
        const downloadDest = `${RNFS.CachesDirectoryPath}/temp.pdf`;

        // Download the file
        const response = await RNFS.downloadFile({
          fromUrl: url,
          toFile: downloadDest,
        }).promise;

        if (response.statusCode === 200) {
          // Convert the file to Base64
          var base64Data = await RNFS.readFile(downloadDest, "base64");
          console.log("Base64 String:", base64Data);
          setFileShareBase64(base64Data);

          try {
            const response = await fetch(`${baseUrl}${SendMessage}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                senderId: userData?.User?.userId,
                receiverId: receiverId,
                chatText: selectedUsers?.PostText,
                attachmentName: "send.png",
                attachment: base64Data,
              }),
            });

            if (response.ok) {
              showError("Share");
            }
          } catch (error) {
            console.error("Error sending message:", error);
          }
          return base64Data;
        } else {
          console.error("File download failed:", response);
        }
      } catch (error) {
        console.error("Error converting to Base64:", error);
      }
    };

    convertUrlToBase64(selectedUsers?.Images[0]?.PostImage);

    // }
  };
  return (
    <Modal visible={modalVisibleShare} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            marginHorizontal: 20,
            marginTop: 20,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Search User
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisibleShare(false);
              }}
            >
              <Icon name="cross" size={15} color="black" type="Entypo" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <TextInput
            placeholder="Enter user name"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
            onChangeText={handleContactSearch}
          />

          {/* Contact List */}
          {loadingContacts ? (
            <ActivityIndicator size="large" color={Colors.main_primary} />
          ) : (
            <FlatList
              data={filteredContacts}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 5,
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
                        ? "blue"
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
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        ✓
                      </Text>
                    )}
                  </TouchableOpacity>

                  <Image
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                    source={{
                      uri: item?.ProfilePhoto
                        ? item?.ProfilePhoto
                        : require("../../assets/placeholderprofileimage.png"),
                    }}
                  />

                  <View style={{ padding: 10, flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>
                      {item?.UserName}
                    </Text>
                    <Text style={{ color: Colors.gray, marginBottom: 5 }}>
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
              if (selectedUsers.length === 0) {
                showError("Please select a user to share.");
                return;
              }

              for (const userId of selectedUsers) {
                await sendMessage(userId, ShareValue);
              }
              setModalVisibleShare(false);
            }}
            style={{
              backgroundColor: Colors.main_primary,
              padding: 10,
              borderRadius: 5,
              marginTop: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
export const ViewCountApi = async (
  endpoint,
  id,
  userData,
  setLoadingContacts
) => {
  const Dta = { id: id, userId: userData?.User?.userId };
  console.log("endpoint", endpoint, Dta);
  try {
    setLoadingContacts(true);
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Dta),
    });

    const data = await response.json();
    console.log("ViewCountApi ------> ", endpoint, data);
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
  } finally {
    setLoadingContacts(false);
  }
};
