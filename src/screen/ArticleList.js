import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import {
  fetchAddLike,
  fetchArticles,
  fetchContactList,
  ViewCountApi,
} from "./baseURL/ExperienceList";
import globalStyles from "./GlobalCSS";
import Header from "./Header/Header";
import Colors from "./color";
import RenderHTML from "react-native-render-html";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import LikeIcon from "react-native-vector-icons/AntDesign";
import CommIcon from "react-native-vector-icons/FontAwesome";
import ShareIcon from "react-native-vector-icons/FontAwesome";
import PlaneIcon from "react-native-vector-icons/Entypo";
import DeleteIcon from "react-native-vector-icons/MaterialCommunityIcons";
import DownIcon from "react-native-vector-icons/AntDesign";
import Icon from "./Icons/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHtml from "react-native-render-html";
import ImageViewer from "react-native-image-zoom-viewer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  AddComment,
  baseUrl,
  contactList,
  DeleteComment,
  listcomment,
  SendMessage,
  sharewithcontact,
  sharewithpublic,
  ViewCountArticles,
} from "./baseURL/api";
import RNFS from "react-native-fs";
import CommonBottomSheet from "./components/CommonBottomSheet";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { showError, showSuccess } from "./components/Toast";
import CommonLoader from "./components/CommonLoader";
import { useTheme } from "../theme/ThemeContext";
import { universityName } from "./constants";

const ArticlesList = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { Item = {}, AdditionalData = [] } = route.params || {};
  const scrollRef = useRef(null);
  const { isDark, colors, toggleTheme } = useTheme();
  const [itemValue, setItemValue] = useState([]);
  const windowWidth = Dimensions.get("window").width;
  const [addLike, setAddLike] = useState([]);
  const [totalLike, setTotalLike] = useState(Item?.IsLiked);
  const [modalVisible, setModalVisible] = useState(false);
  const [number1, onChangeNumber1] = useState("");
  const [modalVisible1, setModalVisible1] = useState(false);
  const [userProfileData, setUserProfileData] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [itemOfPost, setItemOfPost] = useState([]);
  const [commentAdd, setCommentAdd] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyUserName, setReplyUserName] = useState("");
  const [commitID, setCommitID] = useState([]);
  const [articleList, setArticleList] = useState([]);
  const [commentAddValue, setCommentAddValue] = useState([]);
  const [selectedValue1, setSelectedValue1] = useState("Share with Public");
  const [isOpen2, setIsOpen2] = useState(false);
  const toggleDropdown2 = () => setIsOpen2(!isOpen2);
  const [modalVisibleShare, setModalVisibleShare] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isCommentSending, setIsCommentSending] = useState(false);
  const isCommentEmpty = !commentText.trim();
  const [commentCount, setCommentCount] = useState(Item?.TotalComment ?? 0);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const formatText = (text) => {
    if (!text) return "<p>No content available.</p>";
    return text.trim().startsWith("<")
      ? text
      : `<p>${text.replace(/\n/g, "<br/>")}</p>`;
  };
  const stripHtml = (html) => html.replace(/<[^>]*>/g, "").trim();
  useEffect(() => {
    if (isOpen2 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [isOpen2]);
  const bottomSheetRef = useRef(null);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const [commentListss, setCommentListss] = useState(
    Array.from({ length: 50 }, (_, i) => ({
      id: `comment-${i}`,
      text: `This is comment ${i}`,
    }))
  );

  const openBottomSheet = () => bottomSheetRef.current?.snapToIndex(0);
  // bottomSheetRef.current?.expand();
  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };
  const closeBottomSheetMinimizes = () => {
    bottomSheetRef.current?.collapse();
  };

  const handleBottomSheetChange = useCallback((index) => {
    console.log("BottomSheet index changed:", index);
    setBottomSheetIndex(index);
    if (index === -1) {
      console.log("BottomSheet fully closed");
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDta = await AsyncStorage.getItem("userData");
      if (userDta) {
        const parsedData = JSON.parse(userDta);
        setUserData(parsedData);

        if (userData) {
          fetchContactList(
            userData,
            baseUrl,
            contactList,
            setContacts,
            setLoadingContacts
          );
        }
      }
    };

    fetchUserData();
  }, []);

  // useEffect(() => {
  //   if (userData) {
  //     fetchContactList(
  //       userData,
  //       baseUrl,
  //       contactList,
  //       setContacts,
  //       setLoadingContacts,
  //     );
  //   }
  // }, [userData]);
  useEffect(() => {
    if (modalVisibleShare && userData) {
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
  }, [modalVisibleShare]);

  useEffect(() => {
    if (userData) {
      ViewCountApi(
        ViewCountArticles,
        Item?.ArticleId,
        userData,
        setLoadingContacts
      );
    }
  }, [userData]);

  const selectOption2 = (option) => {
    if (option == "Share with Message") {
      openModal();
    }
    setSelectedValue1(option);
    setIsOpen2(false);
  };

  const openModal = () => {
    if (contacts) {
      fetchContactList(userData);
    }
    setModalVisibleShare(true);
  };

  const options2 = [
    "Share with Public",
    "Share with My Contacts",
    "Share with Message",
  ];
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
    fetchArticles(
      Item?.UserDetail?.UserId,
      3,
      1,
      "self",
      setArticleList,
      setInitialLoading
    );

    getProfileData();
  }, [isFocused]);

  useEffect(() => {
    if (itemOfPost) {
      fetchCommentList(itemOfPost);
    }
  }, [itemOfPost, commentAdd, refresh]);

  const fetchCommentList = async (item, pageNumber = 1) => {
    if (!item?.ArticleId || !item?.PostType) {
      console.warn("Invalid item provided to fetchCommentList:", item);
      return;
    }

    // Prevent duplicate loads (optional guard)
    if (isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const response = await fetch(`${baseUrl}${listcomment}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: item.ArticleId,
          postType: item.PostType,
          page: pageNumber,
          per_page: 10,
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Fetch failed:", response.status, responseText);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = JSON.parse(responseText);
      const newData = data?.DataList || [];
      setCommentList((prev) =>
        pageNumber === 1 ? newData : [...prev, ...newData]
      );

      setPage(pageNumber);
      setHasMoreData(newData.length === 10); // If less than 10, no more to load
    } catch (error) {
      console.error("Fetch Comment Error:", error.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const fetchAddComment = async (item) => {
    let parentId = commitID?.Id || 0;
    try {
      const response = await fetch(`${baseUrl}${AddComment}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: itemOfPost.ArticleId,
          parentId: parentId,
          postType: itemOfPost.PostType,
          userId: userProfileData?.Data?.userId,
          commentText: commentText,
        }),
      });

      const data = await response.json();
      console.log("ADd Comment Data ----", data);

      if (response.ok) {
        setCommentAdd(data.Message);
        setRefresh(!refresh);

        setCommentText("");
        setCommentCount(data.commentCount);
        setItemOfPost((prev) => ({
          ...prev,
          TotalComment: data.commentCount,
        }));
        fetchCommentList(itemOfPost);
      }
    } catch (error) {
      console.error("Fetch Comment Error:", error);
    }
    // }
  };
  const handleDeleteComment = ({ item }) => {
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
              const requestBody = JSON.stringify({
                id: item?.Id,
              });
              const response = await fetch(`${baseUrl}${DeleteComment}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },

                body: requestBody,
              });

              const data = await response.json();
              if (response.ok) {
                fetchCommentList(itemOfPost);
                setCommentCount(data.commentCount);
                showSuccess("Comment deleted successfully.");
              } else {
                showError("Failed to delete the item. Please try again later.");
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
  const renderItem = () => {
    return AdditionalData.map((item, index) => (
      <TouchableOpacity
        onPress={() => {
          setItemValue(item);
          setCommentList();
          setItemOfPost();
          setTotalLike("");
          // setAddLike();
          scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
          });
        }}
        key={index}
        style={{
          backgroundColor: colors.textinputBackgroundcolor,
          borderRadius: 10,
          margin: 10,
        }}
      >
        {item.Images?.[0] ? (
          <Image
            source={{
              uri:
                item.Images?.[0]?.PostImage ||
                "https://via.placeholder.com/150",
            }}
            style={{
              width: windowWidth - 20,
              height: 200,
              resizeMode: "cover",
              borderRadius: 10,
              alignSelf: "center",
            }}
          />
        ) : null}

        <View style={{ flexDirection: "row", padding: 10 }}>
          <Text style={{ fontSize: 18, color: colors.textColor }}>
            {item.PostTitle}
          </Text>
        </View>
        <View
          style={{
            padding: 5,
          }}
        >
          <Text style={{ fontSize: 13, color: colors.placeholderTextColor }}>
            {" "}
            by {item.UserDetail?.UserName} - {item.PublishedTime}
          </Text>
        </View>
        {item.Images?.[0] ? null : (
          <RenderHTML
            contentWidth={windowWidth}
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
        )}
      </TouchableOpacity>
    ));
  };
  const renderItemUser = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setItemValue(item);
          setCommentList();
          setTotalLike("");
          // setAddLike();
          scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
          });
        }}
        style={{
          backgroundColor: colors.textinputBackgroundcolor,
          borderRadius: 10,
          margin: 10,
        }}
      >
        {item.Images?.[0] ? (
          <Image
            source={{
              uri:
                item.Images?.[0]?.PostImage ||
                "https://via.placeholder.com/150",
            }}
            style={{
              width: windowWidth - 20,
              height: 200,
              resizeMode: "cover",
              borderRadius: 10,
              alignSelf: "center",
            }}
          />
        ) : null}

        <View style={{ flexDirection: "row", padding: 10 }}>
          <Text style={{ fontSize: 18, color: colors.textColor }}>
            {item.PostTitle}
          </Text>
        </View>
        <View
          style={{
            padding: 5,
          }}
        >
          <Text style={{ fontSize: 13, color: colors.placeholderTextColor }}>
            {" "}
            by {item.UserDetail?.UserName} - {item.PublishedTime}
          </Text>
          {item.Images?.[0] ? null : (
            <RenderHTML
              contentWidth={windowWidth}
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
          )}
        </View>
      </TouchableOpacity>
    );
  };
  const renderItem1 = (item) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginVertical: 10,
        }}
      >
        <Image
          source={
            item?.UserDetail?.ProfilePhoto
              ? { uri: item?.UserDetail?.ProfilePhoto }
              : require("../assets/placeholderprofileimage.png")
          }
          style={{ width: 50, height: 50, borderRadius: 30 }}
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
          <View style={{}}>
            <Text
              style={{
                fontWeight: "700",
                fontSize: 15,
                color: colors.textColor,
              }}
            >
              {item?.UserDetail?.UserName}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <Text
                style={{ fontSize: 13, flexShrink: 1, color: colors.textColor }}
              >
                {item.Comment}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setReplyUserName(item?.UserDetail?.UserName);
                  setCommentText(`@${item?.UserDetail?.UserName} `);
                  setCommitID(item);
                }}
              >
                <Text style={{ paddingLeft: 20, color: colors.AppmainColor }}>
                  *Reply
                </Text>
              </TouchableOpacity>
            </View>

            {/* Render Replies */}
            {item.Replies && item.Replies.length > 0 && (
              <View style={{ marginLeft: 2, marginTop: 10 }}>
                {item.Replies.map((reply, index) => (
                  <View
                    key={index}
                    style={{ marginBottom: 5, flexDirection: "row" }}
                  >
                    <Image
                      source={
                        item?.UserDetail?.ProfilePhoto
                          ? { uri: item?.UserDetail?.ProfilePhoto }
                          : require("../assets/placeholderprofileimage.png")
                      }
                      style={{ width: 50, height: 50, borderRadius: 30 }}
                    />
                    <View style={{ margin: 10 }}>
                      <Text
                        style={{
                          fontWeight: "700",
                          fontSize: 15,
                          color: colors.textColor,
                        }}
                      >
                        {item?.UserDetail?.UserName}
                      </Text>
                      <Text style={{ fontSize: 13, color: colors.textColor }}>
                        {reply.Comment}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setReplyUserName(reply?.UserDetail?.UserName);
                          setCommentText(`@${reply?.UserDetail?.UserName} `);
                          setCommitID(item);
                        }}
                      >
                        <Text
                          style={{
                            paddingLeft: 20,
                            color: colors.AppmainColor,
                          }}
                        >
                          *Reply
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                handleDeleteComment({ item });
              }}
            >
              <DeleteIcon
                name="delete"
                size={20}
                color={colors.placeholderTextColor}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const truncateText = (html, percentage) => {
    const plainText = html.replace(/<\/?[^>]+(>|$)/g, "");
    const truncatedLength = Math.floor(plainText.length * percentage);
    const truncatedText = plainText.substring(0, truncatedLength);
    return `<p>${truncatedText}...</p>`;
  };
  const shortText = truncateText(
    itemValue.length == 0
      ? Item?.PostText || "<p>No content available.</p>"
      : itemValue?.PostText || "<p>No content available.</p>",
    0.25
  );

  const handleSharePost = async () => {
    console.log(
      "oldPostId",
      itemValue.length == 0 ? Item?.ArticleId : itemValue?.ArticleId
    );
    console.log(
      "postType",
      itemValue.length == 0 ? Item?.PostType : itemValue?.PostType
    );
    console.log("postShareType", 1);
    console.log("postText", number1 ? number1 : "SHARE ");
    console.log(
      "oldPostText",
      itemValue.length == 0 ? Item?.PostText : itemValue?.PostText
    );
    console.log("userId", userProfileData?.Data?.userId);

    try {
      const response = await fetch(
        `${baseUrl}${
          selectedValue1 == "Share with My Contacts"
            ? sharewithcontact
            : sharewithpublic
        }`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPostId:
              itemValue.length == 0 ? Item?.ArticleId : itemValue?.ArticleId,
            postType:
              itemValue.length == 0 ? Item?.PostType : itemValue?.PostType,
            postShareType: 1,
            postText: number1 ? number1 : "SHARE ",
            oldPostText:
              itemValue.length == 0 ? Item?.PostText : itemValue?.PostText,
            userId: userProfileData?.Data?.userId,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        // setModalVisible(!!modalVisible);
        setModalVisible(false);
        navigation.goBack();
        console.log(
          "handleSharePost",
          selectedValue1 == "Share with My Contacts"
            ? "sharewithcontact"
            : "sharewithpublic"
        );
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
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
  const toggleSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };
  const sendMessage = async (receiverId, selectedUsers) => {
    console.log("receiverId:", receiverId, "selectedUsers:", selectedUsers);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const convertUrlToFile = async (url) => {
      if (!url) return null;

      const fileName = `temp_${Date.now()}.jpg`;
      const downloadDest = `${RNFS.CachesDirectoryPath}/${fileName}`;

      try {
        const result = await RNFS.downloadFile({
          fromUrl: url,
          toFile: downloadDest,
        }).promise;

        if (result.statusCode === 200) {
          return {
            uri: `file://${downloadDest}`,
            name: "send.jpg",
            type: "image/jpeg",
          };
        } else {
          console.warn("Download failed with status:", result.statusCode);
          return null;
        }
      } catch (err) {
        console.error("Download error:", err);
        return null;
      }
    };

    let fileData = null;

    if (selectedUsers?.Images?.length > 0) {
      const imageUrl = selectedUsers.Images[0]?.PostImage;
      fileData = await convertUrlToFile(imageUrl);
    }
    const formData = new FormData();
    formData.append("senderId", userData?.User?.userId?.toString());
    formData.append("receiverId", receiverId?.toString());
    formData.append("optionalId", selectedUsers?.ArticleId || "");
    formData.append("optionalType", "ArticleShare");
    formData.append(
      "chatText",
      stripHtml(selectedUsers?.PostTitle || selectedUsers?.PostText || "")
    );
    formData.append("attachmentName", fileData ? fileData.name : "");
    if (fileData) {
      formData.append("attachment", fileData);
    }

    try {
      const response = await fetch(`${baseUrl}${SendMessage}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (response.ok) {
        const result = JSON.parse(responseText);
        console.log("Message Sent Successfully:", result);
        showSuccess(result.message);
        setModalVisible(false);
      } else {
        console.error("Message Sending Failed. Status:", response.status);
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
      setModalVisible(false);
    }
  };
  if (initialLoading) {
    return <CommonLoader visible={true} />;
  }
  const profilePhotoUri =
    itemValue?.length === 0
      ? Item?.UserDetail?.ProfilePhoto
      : itemValue?.UserDetail?.ProfilePhoto;

  const isValidUri =
    typeof profilePhotoUri === "string" && profilePhotoUri.trim().length > 0;

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header title="Travel Blogs Details" navigation={navigation} />
      <View
        style={{
          ...globalStyles.FX_1_BG_LiteGray,
        }}
      >
        <ScrollView style={{}} ref={scrollRef}>
          <View
            style={{
              marginHorizontal: 12,
              padding: 10,
              backgroundColor: colors.textinputBackgroundcolor,
            }}
          >
            <View style={globalStyles.FD_Row_JC_SB}>
              <Text style={{ fontSize: 18, color: colors.textColor }}>
                {itemValue.length == 0 ? Item?.PostTitle : itemValue?.PostTitle}{" "}
              </Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
              <Text style={{ color: colors.placeholderTextColor }}>
                Published{" "}
                {itemValue.length == 0
                  ? Item?.PublishedTime
                  : itemValue?.PublishedTime}{" "}
                | Views:{" "}
                {itemValue.length == 0 ? Item?.TotalView : itemValue?.TotalView}
              </Text>
            </View>
            <View style={{ paddingVertical: 10 }}>
              {Item.Images?.[0]?.PostImage ||
              itemValue?.Images?.[0]?.PostImage ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    const imageUrl =
                      itemValue.length === 0
                        ? Item.Images?.[0]?.PostImage
                        : itemValue?.Images?.[0]?.PostImage;

                    setModalImages([{ url: imageUrl }]);
                    setModalIndex(0);
                    setModalImageVisible(true);
                  }}
                >
                  <Image
                    source={{
                      uri:
                        itemValue.length == 0
                          ? Item.Images?.[0]?.PostImage
                          : itemValue?.Images?.[0]?.PostImage,
                    }}
                    style={{
                      width: windowWidth - 25,
                      height: 400,
                      resizeMode: "cover",
                      borderRadius: 4,
                      alignSelf: "center",
                    }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={{ paddingVertical: 20 }}>
              <RenderHTML
                contentWidth={windowWidth}
                source={{
                  html: formatText(
                    itemValue?.PostText?.trim() || Item?.PostText?.trim() || ""
                  ),
                }}
                baseStyle={{
                  color: colors.textColor,
                  fontSize: 14,
                  lineHeight: 22,
                  fontFamily: "System",
                  textAlign: "justify",
                }}
                tagsStyles={{
                  p: {
                    marginBottom: 10,
                  },
                  div: {
                    marginBottom: 10,
                  },
                  ul: {
                    marginVertical: 10,
                    paddingLeft: 20,
                  },
                  li: {
                    marginBottom: 5,
                  },
                  strong: {
                    fontWeight: "bold",
                  },
                  em: {
                    fontStyle: "italic",
                  },
                  h1: {
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 10,
                  },
                  h2: {
                    fontSize: 20,
                    fontWeight: "600",
                    marginBottom: 10,
                  },
                  h3: {
                    fontSize: 18,
                    fontWeight: "500",
                    marginBottom: 8,
                  },
                  h4: {
                    fontSize: 16,
                    fontWeight: "500",
                    marginBottom: 8,
                    textAlign: "center",
                    color: colors.AppmainColor,
                  },
                }}
              />
            </View>

            {/* <View style={{paddingVertical: 20}}>
              <RenderHTML
                contentWidth={windowWidth}
                source={{
                  html:
                    itemValue?.PostText?.trim() ||
                    Item?.PostText?.trim() ||
                    '<p>No content available.</p>',
                }}
                baseStyle={{
                  color: Colors.black,
                  fontSize: 14,
                  lineHeight: 22,
                  fontFamily: 'System',
                  textAlign: 'justify',
                }}
                tagsStyles={{
                  p: {
                    marginBottom: 10,
                  },
                  div: {
                    marginBottom: 10,
                  },
                  ul: {
                    marginVertical: 10,
                    paddingLeft: 20,
                  },
                  li: {
                    marginBottom: 5,
                  },
                  strong: {
                    fontWeight: 'bold',
                  },
                  em: {
                    fontStyle: 'italic',
                  },
                }}
              />
            </View> */}

            <View style={{ paddingVertical: 20 }}>
              <Text style={{ color: colors.placeholderTextColor }}>
                Published{" "}
                {itemValue.length == 0
                  ? Item?.PublishedTime
                  : itemValue?.PublishedTime}{" "}
                | Views:{" "}
                {itemValue.length == 0 ? Item?.TotalView : itemValue?.TotalView}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProfileDetails", {
                  Item: Item,
                })
              }
              style={{
                ...globalStyles.ViewUserDetils,
                borderColor: colors.textinputbordercolor,
                backgroundColor: colors.background,
              }}
            >
              <Image
                style={globalStyles.ViewUserDetilsIMG}
                source={
                  isValidUri
                    ? { uri: profilePhotoUri }
                    : require("../assets/placeholderprofileimage.png")
                }
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 15, color: colors.textColor }}>
                  {itemValue?.length == 0
                    ? Item?.UserDetail?.UserName
                    : itemValue?.UserDetail?.UserName}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.placeholderTextColor,
                    flexWrap: "wrap",
                    width: "70%",
                  }}
                >
                  {itemValue?.length == 0
                    ? Item?.UserDetail?.JobTitle
                    : itemValue?.UserDetail?.JobTitle}{" "}
                  at{" "}
                  {itemValue?.length == 0
                    ? Item?.UserDetail?.CompanyName
                    : itemValue?.UserDetail?.CompanyName}{" "}
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 0.5,
                borderColor: colors.textinputbordercolor,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ padding: 10 }}>
                  <Text style={{ color: colors.textColor }}>
                    {itemValue?.length == 0
                      ? addLike?.length == undefined
                        ? addLike?.TotalRecord
                        : Item?.TotalLike
                      : addLike?.IsLiked
                      ? addLike?.TotalRecord
                      : itemValue?.TotalLike}{" "}
                    Likes
                  </Text>
                </View>

                <View style={{ padding: 10 }}>
                  {/* {itemOfPost?.length > 0 ? (
                    <Text>{itemOfPost?.TotalComment} Comments</Text>
                  ) : ( */}
                  <Text style={{ color: colors.textColor }}>
                    {commentCount} Comments
                    {/* {itemValue?.length === 0
                        ? commentAddValue.length == 0
                          ? Item?.TotalComment
                          : commentAddValue
                        : itemValue?.TotalComment}{' '}
                      Comments */}
                  </Text>
                  {/* )} */}
                </View>
              </View>
              <View>
                <Text style={{ color: colors.textColor }}>
                  {itemValue?.length == 0
                    ? Item?.TotalShare
                    : itemValue?.TotalShare}{" "}
                  Shares
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 10,
                borderBottomWidth: 2,
                borderColor: colors.AppmainColor,
              }}
            >
              <TouchableOpacity
                // onPress={() => {
                //   fetchAddLike(
                //     itemValue?.length == 0
                //       ? Item?.ArticleId
                //       : itemValue?.ArticleId,
                //     itemValue?.length == 0
                //       ? Item?.PostType
                //       : itemValue?.PostType,
                //     userProfileData?.Data?.userId,
                //     setAddLike,
                //   );

                //   setTotalLike(!totalLike);
                // }}
                onPress={async () => {
                  const postId =
                    itemValue?.length === 0
                      ? Item?.ArticleId
                      : itemValue?.ArticleId;
                  const postType =
                    itemValue?.length === 0
                      ? Item?.PostType
                      : itemValue?.PostType;
                  const userId = userProfileData?.Data?.userId;

                  // Optimistically update the UI
                  setIsLiked((prev) => !prev);

                  const result = await fetchAddLike(postId, postType, userId);

                  if (result?.IsLiked !== undefined) {
                    // Use actual response to update UI
                    setIsLiked(result.IsLiked);
                  } else {
                    // Revert like state if API failed
                    setIsLiked((prev) => !prev);
                  }
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 5,
                }}
              >
                <LikeIcon
                  name="like1"
                  size={20}
                  color={
                    addLike?.IsLiked || totalLike
                      ? colors.AppmainColor
                      : colors.placeholderTextColor
                  }
                  // color={totalLike == true ? Colors.main_primary : '#888'}
                  style={{ paddingRight: 5 }}
                />
                <Text style={{ color: colors.textColor }}>Like</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setItemOfPost(itemValue?.length == 0 ? Item : itemValue);
                  setModalVisible1();
                  //openBottomSheet();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CommIcon
                  name="commenting-o"
                  size={20}
                  color={colors.placeholderTextColor}
                  style={{ paddingRight: 5 }}
                />
                <Text style={{ color: colors.textColor }}>Comment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ShareIcon
                  name="share"
                  size={20}
                  color={colors.placeholderTextColor}
                  style={{ paddingRight: 5 }}
                />
                <Text style={{ color: colors.textColor }}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* More Article By User  */}
          {articleList?.Data?.length > 0 ? (
            <View
              style={{
                ...globalStyles.MoreArticleView,
                backgroundColor: colors.textinputBackgroundcolor,
              }}
            >
              <Text
                style={{
                  ...globalStyles.MoreArticleText,
                  color: colors.textColor,
                }}
              >
                Latest Travel Blogs
              </Text>
            </View>
          ) : null}

          <FlatList
            data={AdditionalData}
            renderItem={renderItem}
            keyExtractor={(item) => item?.ArticleId}
          />

          {/* More Article By User  */}
          {articleList?.Data?.length > 0 ? (
            <View
              style={{
                ...globalStyles.MoreArticleView,
                backgroundColor: colors.textinputBackgroundcolor,
              }}
            >
              <Text
                style={{
                  ...globalStyles.MoreArticleText,
                  color: colors.textColor,
                }}
              >
                More Travel Blogs's by {Item?.UserDetail?.UserName}
              </Text>
            </View>
          ) : null}

          <FlatList
            data={articleList.Data}
            renderItem={renderItemUser}
            keyExtractor={(item) => item?.ArticleId}
          />

          {/* Discover More Article By User  */}
          <View
            style={{
              ...globalStyles.MoreArticleView,
              backgroundColor: colors.textinputBackgroundcolor,
            }}
          >
            <Text
              style={{
                ...globalStyles.MoreArticleText,
                color: colors.textColor,
              }}
            >
              Discover More Travel Blogs and Interesting Trivia On{" "}
              {universityName}
            </Text>
          </View>

          <FlatList
            data={AdditionalData}
            renderItem={renderItem}
            keyExtractor={(item) => item?.ArticleId}
          />
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            setModalVisible1(false);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            style={{ flex: 1 }}
          >
            <View style={styles.centeredView}>
              <View
                style={{
                  ...styles.modalView,
                  flex: 0.8,
                  padding: 20,
                  backgroundColor: colors.modelBackground,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible1(false), setItemOfPost();
                  }}
                  style={{
                    alignSelf: "flex-end",
                  }}
                >
                  <Icon
                    name="cross"
                    size={25}
                    color={colors.backIconColor}
                    type="Entypo"
                  />
                </TouchableOpacity>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 15,
                      padding: 15,
                      fontWeight: "700",
                      color: colors.textColor,
                    }}
                  >
                    Comments
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <View style={{ paddingLeft: 10 }}>
                    <FlatList
                      inverted={true}
                      showsVerticalScrollIndicator={false}
                      data={commentList}
                      renderItem={({ item }) => renderItem1(item)}
                      keyExtractor={(item) => item.id}
                    />
                  </View>
                </View>

                <View
                  style={{
                    ...globalStyles.ViewCommentImg,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                >
                  <Image
                    source={
                      userProfileData?.Data?.profilePhoto
                        ? { uri: userProfileData?.Data?.profilePhoto }
                        : require("../assets/placeholderprofileimage.png")
                    }
                    style={globalStyles.ImgComment}
                  />
                  <TextInput
                    style={[
                      globalStyles.textInputComment,
                      {
                        flex: 1,
                        color: colors.textColor,
                      },
                    ]}
                    onChangeText={(text) => setCommentText(text)}
                    value={commentText}
                    placeholder="Write your Comments"
                    keyboardType="default"
                    multiline
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                  <TouchableOpacity
                    disabled={isCommentEmpty || isCommentSending}
                    style={{
                      padding: 10,
                      opacity: isCommentEmpty || isCommentSending ? 0.4 : 1,
                    }}
                    onPress={async () => {
                      if (isCommentEmpty || isCommentSending) return;
                      const trimmedComment = commentText.trim();
                      if (!trimmedComment) {
                        showError("Comment cannot be empty.");
                        return;
                      }

                      setIsCommentSending(true);

                      try {
                        await fetchAddComment();
                      } catch (error) {
                        console.error("Send error:", error);
                      } finally {
                        setIsCommentSending(false);
                      }
                    }}
                  >
                    <PlaneIcon
                      name="paper-plane"
                      size={25}
                      color={colors.placeholderTextColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={styles.centeredView}>
              <View
                style={{
                  ...styles.modalView,
                  flex: 0.6,
                  paddingBottom: 30,
                  backgroundColor: colors.modelBackground,
                }}
              >
                <TouchableOpacity
                  style={{ alignItems: "flex-end" }}
                  onPress={() => setModalVisible(false)}
                >
                  <Icon
                    name="cross"
                    size={20}
                    color={colors.backIconColor}
                    type="Entypo"
                  />
                </TouchableOpacity>

                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{ ...styles.modalText, color: colors.textColor }}
                  >
                    Share Post
                  </Text>
                </View>

                <ScrollView ref={scrollViewRef}>
                  <TextInput
                    style={{
                      ...globalStyles.input,
                      borderWidth: 1,
                      borderColor: colors.textinputbordercolor,
                      color: colors.textColor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                    onChangeText={onChangeNumber1}
                    value={number1}
                    placeholder="Say something about this..."
                    keyboardType="default"
                    placeholderTextColor={colors.placeholderTextColor}
                  />

                  <View style={globalStyles.flexRow}>
                    <Image
                      source={{
                        uri:
                          itemValue?.Images?.[0]?.PostImage ||
                          Item?.Images[0]?.PostImage,
                      }}
                      style={{
                        width: 100,
                        height: 160,
                        resizeMode: "contain",
                        borderRadius: 10,
                      }}
                    />
                    <View style={{ paddingLeft: 10, flex: 1, paddingTop: 20 }}>
                      <RenderHtml
                        contentWidth={windowWidth}
                        source={{
                          // html: itemValue?.PostText?.trim() || Item?.PostText,
                          html: formatText(
                            itemValue?.PostText || Item?.PostText
                          ),
                        }}
                        tagsStyles={{
                          p: {
                            color: colors.textColor,
                            fontSize: 14,
                            lineHeight: 20,
                            textAlign: "justify",
                            marginTop: 0,
                            marginBottom: 0,
                            padding: 0,
                          },
                          body: {
                            margin: 0,
                            padding: 0,
                            color: colors.textColor,
                          },
                          h4: {
                            color: colors.AppmainColor,
                            fontWeight: "700",
                            marginTop: 0,
                            marginBottom: 0,
                          },
                        }}
                      />
                    </View>
                  </View>

                  <View>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        borderWidth: 1,
                        borderRadius: 5,
                        marginTop: 10,
                        padding: 10,
                        alignItems: "center",
                        paddingHorizontal: 12,
                        justifyContent: "space-between",
                        borderColor: colors.textinputbordercolor,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}
                      onPress={toggleDropdown2}
                    >
                      <Text style={{ ...styles.text, color: colors.textColor }}>
                        {selectedValue1 || "Public"}
                      </Text>
                      <DownIcon
                        name="down"
                        size={15}
                        color={colors.backIconColor}
                      />
                    </TouchableOpacity>

                    {isOpen2 && (
                      <View
                        style={{
                          ...styles.dropdownList,
                          borderColor: colors.textinputbordercolor,
                          backgroundColor: colors.textinputBackgroundcolor,
                        }}
                      >
                        {options2.map((option, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => selectOption2(option)}
                          >
                            <Text
                              style={{
                                ...styles.text,
                                color: colors.textColor,
                              }}
                            >
                              {option}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={{
                    ...globalStyles.saveButton,
                    backgroundColor: colors.AppmainColor,
                  }}
                  onPress={() => handleSharePost()}
                >
                  <Text
                    style={{
                      ...globalStyles.saveButtonText,
                      color: colors.ButtonTextColor,
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal visible={modalVisibleShare} transparent animationType="slide">
            <View style={[globalStyles.shareModalMain]}>
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
                    hitSlop={20}
                    onPress={() => {
                      setModalVisibleShare(false);
                      setSelectedUsers([]);
                    }}
                  >
                    <Icon
                      name="cross"
                      size={20}
                      color={colors.ButtonTextColor}
                      type="Entypo"
                    />
                  </TouchableOpacity>
                </View>

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

                <View style={{ flex: 1 }}>
                  {loadingContacts ? (
                    <ActivityIndicator
                      size="large"
                      color={colors.AppmainColor}
                    />
                  ) : (
                    <FlatList
                      data={filteredContacts}
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
                              backgroundColor: selectedUsers.includes(
                                item.UserId
                              )
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
                          <Image
                            style={globalStyles.contantlistImage}
                            source={
                              item?.ProfilePhoto
                                ? { uri: item?.ProfilePhoto }
                                : require("../assets/placeholderprofileimage.png")
                            }
                          />
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
                                color: colors.textColor,
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
                </View>

                <TouchableOpacity
                  onPress={async () => {
                    for (const userId of selectedUsers) {
                      await sendMessage(userId, Item);
                    }
                    setSelectedUsers([]);
                    setModalVisibleShare(false);
                    setModalVisible(false);
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
        </>

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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    backgroundColor: "#f9f9f9",
  },
  dropdownList: {
    marginTop: 5,
    borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 5,
    //backgroundColor: '#fff',
    // alignSelf:"flex-end"
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  text: {
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    flex: 0.44,
    // backgroundColor: 'white',
    // borderRadius: 30,
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

  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  placeholder: {
    fontSize: 16,
    color: "#999",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    // backgroundColor: '#f5f5f5',
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
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

export default ArticlesList;
