import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import {
  AddComment,
  Addlike,
  AddPost,
  baseUrl,
  contactList,
  DeleteComment,
  DeletePost,
  listcomment,
  Getpostsbyidortype,
  postlist,
  PostTag,
  SendMessage,
  sharewithcontact,
  sharewithpublic,
  TweetShare,
  UpdateComment,
  WhatsAppShare,
  Profile_Detail,
} from "./baseURL/api";
import Header from "./Header/Header";
import RenderHTML from "react-native-render-html";
import globalStyles from "./GlobalCSS";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import Colors from "./color";
import { fetchContactList } from "./baseURL/ExperienceList";
import KeyboardAvoidingWrapper from "./components/KeyboardAvoidingWrapper";
import LikeIcon from "react-native-vector-icons/AntDesign";
import CommIcon from "react-native-vector-icons/FontAwesome";
import Icon from "../screen/Icons/Icons";
import Iconback from "react-native-vector-icons/AntDesign";
import RenderHtml from "react-native-render-html";
import ImageViewer from "react-native-image-zoom-viewer";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";
import { showSuccess } from "./components/Toast";
import { useTheme } from "../theme/ThemeContext";

const SharedPostScreen = ({ route, navigation }) => {
  const { postId, postType } = route.params || {};
  const [expandedPosts, setExpandedPosts] = useState({});
  const [likedPosts, setLikedPosts] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [username, setUsername] = useState("");
  const [number1, onChangeNumber1] = useState("");
  const [passImageInModal, setPassImageInModal] = useState();
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [modalVisibleShare, setModalVisibleShare] = useState(false);
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const [selectedValue, setSelectedValue] = useState("Public");
  const [selectedValue1, setSelectedValue1] = useState("Share with Public");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [isCommentSending, setIsCommentSending] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [deleteValue, setDeleteValue] = useState([]);
  const [itemOfPostForLike, setItemOfPostForLike] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [commentAdd, setCommentAdd] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [commentCounts, setCommentCounts] = useState({});
  const [commentList, setCommentList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [commitID, setCommitID] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [userProfileData, setUserProfileData] = useState([]);
  const [deletePost, setDeletePost] = useState(false);
  const [userData, setUserData] = useState([]);
  const [itemOfPost, setItemOfPost] = useState([]);
  const [number, onChangeNumber] = useState("");
  const isCommentEmpty = !number.trim();
  const containerWidth = screenWidth - 40;
  const largeImageWidth = containerWidth * 0.65;
  const smallImageWidth = containerWidth * 0.35;
  const imageHeight = 250;
  const smallImageHeight = (imageHeight - 8) / 3;
  const { isDark, colors, toggleTheme } = useTheme();
  const styles = createStyles(colors);
  const scrollViewRef = useRef(null);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleDropdown2 = () => setIsOpen2(!isOpen2);
  const toggleExpand = (index) => {
    setExpandedPosts((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const selectOption2 = (option) => {
    if (option == "Share with Message") {
      openModal();
    }
    setSelectedValue1(option);
    setIsOpen2(false);
  };
  const toggleSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };
  const handleUserSelect = (user) => {
    if (!selectedUsers.some((u) => u.UserId === user.UserId)) {
      const newSelectedUsers = [...selectedUsers, user];
      setSelectedUsers(newSelectedUsers);
      setPostText("");
    }
    setShowList(false);
  };
  const handleRemoveUser = (user) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((u) => u.UserId !== user.UserId)
    );
  };
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
  const openModal = () => {
    fetchContactList(userData);
    setModalVisibleShare(true);
  };
  const options = ["Public", "My Contacts"];
  const options2 = [
    "Share with Public",
    "Share with My Contacts",
    "Share with Message",
    "Share To  Extenal Social Media",
  ];

  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };
  useEffect(() => {
    UserValue();
  }, []);
  useFocusEffect(
    useCallback(() => {
      const fetchLatestProfile = async () => {
        const userData = await AsyncStorage.getItem("userData");
        const parsedUserData = JSON.parse(userData);

        try {
          const response = await fetch(`${baseUrl}${Profile_Detail}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: parsedUserData?.User?.userId }),
          });

          const profile = await response.json();

          if (response.ok) {
            await AsyncStorage.setItem(
              "userProfileData",
              JSON.stringify(profile)
            );
            setUserProfileData(profile);
          } else {
            console.log("Profile fetch error", profile);
          }
        } catch (err) {
          console.log("Error fetching updated profile", err);
        }
      };

      fetchLatestProfile();
    }, [])
  );
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

    const downloadImageAsFile = async (url) => {
      const fileName = `image_${Date.now()}.jpg`;
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
            type: "image/jpeg",
          };
        } else {
          console.warn("⚠️ Image download failed:", result.statusCode);
          return null;
        }
      } catch (error) {
        console.error("Download error:", error);
        return null;
      }
    };

    let fileData = null;
    if (selectedUsers?.Images?.length > 0) {
      const imageUrl = selectedUsers.Images[0]?.PostImage;
      fileData = await downloadImageAsFile(imageUrl);
    }

    const formData = new FormData();
    formData.append("senderId", userData?.User?.userId?.toString());
    formData.append("receiverId", receiverId?.toString());
    formData.append(
      "chatText",
      cleanHtmlWithSpacing(
        selectedUsers?.PostText || selectedUsers?.PostTitle || "No message"
      )
    );

    formData.append("optionalType", "PostShare");

    formData.append("optionalId", selectedUsers?.id?.toString() || "");

    if (fileData) {
      formData.append("attachmentName", fileData.name);
      formData.append("attachment", fileData);
    } else {
      formData.append("attachmentName", "");
    }
    console.log(formData, "formDataformDataformData");

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
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setModalVisible(false);
    }
  };
  const handleContactSearch = (query) => {
    setUsername(query);
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter((user) =>
      user?.UserName?.toLowerCase().includes(trimmed)
    );
    setFilteredContacts(filtered);
  };
  const handleAddComment = (postId, newCountFromServer = null) => {
    setCommentCounts((prevCounts) => ({
      ...prevCounts,
      [postId]:
        newCountFromServer !== null
          ? newCountFromServer
          : (prevCounts[postId] || 0) + 1,
    }));
  };
  const handleDeltComment = (postId, newCountFromServer = null) => {
    setCommentCounts((prevCounts) => ({
      ...prevCounts,
      [postId]:
        newCountFromServer !== null
          ? newCountFromServer
          : Math.max((prevCounts[postId] ?? 0) - 1, 0),
    }));
  };
  const toggleLike = async (post) => {
    const postId = post.id;
    const isLiked = likedPosts[postId] || false;
    const updatedLikeStatus = !isLiked;
    const updatedLikeCount = updatedLikeStatus
      ? post.TotalLike + 1
      : Math.max(post.TotalLike - 1, 0);
    setLikedPosts((prev) => ({ ...prev, [postId]: updatedLikeStatus }));
    setPostData((prevData) =>
      prevData.map((item) =>
        item.id === postId ? { ...item, TotalLike: updatedLikeCount } : item
      )
    );
    try {
      const response = await fetch(
        "https://travcomexapi.vecospace.com/api/addlike",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId: post.id,
            postType: post.PostType,
            userId: userData?.User?.userId,
          }),
        }
      );
      const data = await response.json();
      console.log("Add Like Response:", data);
      if (!response.ok || data.Status !== 1) {
        throw new Error(data.Message || "Failed to like the post");
      }
      const finalIsLiked = data.IsLiked;
      const finalLikeCount = finalIsLiked
        ? post.TotalLike + 1
        : Math.max(post.TotalLike - 1, 0);
      setLikedPosts((prev) => ({ ...prev, [postId]: finalIsLiked }));
      setPostData((prevData) =>
        prevData.map((item) =>
          item.id === postId
            ? {
                ...item,
                TotalLike: finalLikeCount,
              }
            : item
        )
      );

      await AsyncStorage.setItem(
        "likedPosts",
        JSON.stringify({ ...likedPosts, [postId]: finalIsLiked })
      );
    } catch (error) {
      console.error("Like API Error:", error);
      setLikedPosts((prev) => ({ ...prev, [postId]: isLiked }));
      setPostData((prevData) =>
        prevData.map((item) =>
          item.id === postId
            ? {
                ...item,
                TotalLike: isLiked
                  ? post.TotalLike
                  : Math.max(post.TotalLike - 1, 0),
              }
            : item
        )
      );
    }
  };

  useEffect(() => {
    if (itemOfPost) {
      fetchCommentList({
        pageNumber: 1,
        item: itemOfPost,
        refreshing: true,
      });
    }
  }, [refresh, itemOfPost, commentAdd]);
  const fetchCommentList = async ({
    pageNumber = 1,
    refreshing = false,
    item,
  }) => {
    if (!item || !item.id || !item.PostType) {
      console.error(
        "Missing postId or postType in item in fetchCommentList:",
        item
      );
      return;
    }
    const playload = JSON.stringify({
      postId: item.id,
      postType: item.PostType,
      page: pageNumber,
      per_page: 10,
    });

    try {
      refreshing ? setIsRefreshing(true) : setIsLoadingMore(true);

      const response = await fetch(`${baseUrl}${listcomment}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: playload,
      });

      const data = await response.json();
      const newData = data?.DataList || [];

      if (response.ok) {
        setCommentList((prev) =>
          pageNumber === 1 ? newData : [...prev, ...newData]
        );
        setPage(pageNumber);
        setHasMoreData(newData.length > 0);
      }
    } catch (error) {
      console.error("Fetch Error fetchCommentList:", error);
    } finally {
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };
  const fetchAddComment = async () => {
    let parentId = commitID?.Id || 0;
    console.log("fetchAddComment", deleteValue);
    console.log("itemOfPost", itemOfPost);
    const Dta = {
      postId: itemOfPost.id,
      parentId: parentId,
      postType: itemOfPost.PostType,
      userId: userData?.User?.userId,
      commentText: number,
    };
    console.log("Dta", Dta);

    if (deleteValue.length == 0) {
      try {
        const response = await fetch(`${baseUrl}${AddComment}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Dta),
        });

        const data = await response.json();
        console.log("ADd Comment Data ----", data);

        if (response.ok) {
          setCommentAdd(data.Message);
          onChangeNumber("");
          setRefresh(!refresh);
          handleAddComment(itemOfPost.id, data.commentCount);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
      }
    }
  };
  const handleDeleteComment = ({ item, id }) => {
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
            const payload = JSON.stringify({
              id: item?.Id,
              // postId: item.PostId,
            });
            //console.log(payload, 'payloadpayloadpayloadpayload');

            try {
              const response = await fetch(`${baseUrl}${DeleteComment}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: payload,
              });
              const text = await response.text();
              console.log("🔍 Raw Response:", text);
              if (response.ok) {
                const data = JSON.parse(text);
                console.log(data, "datadatadatadatadatadatadatadata");

                setDeletePost(true);
                // handleDeltComment(item.id, item.TotalComment);
                handleDeltComment(item.PostId, data.commentCount);
                fetchCommentList({
                  pageNumber: 1,
                  item: itemOfPost,
                  refreshing: true,
                });
              }
            } catch (error) {
              console.error("❌ Delete Error:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const handleUpdateComment = async () => {
    setDeleteComment(true);
    if (deleteComment) {
      try {
        const response = await fetch(`${baseUrl}${UpdateComment}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: deleteValue?.Id,
            postId: deleteValue?.PostId,
            parentId: deleteValue?.ParentId,
            postType: deleteValue?.PostType,
            userId: deleteValue?.UserId,
            commentText: number,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setRefresh(!refresh);
          setDeleteComment(false);
          setDeleteValue([]);
          onChangeNumber("");
        }
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
  };
  useEffect(() => {
    const fetchPost = async () => {
      const playload = JSON.stringify({
        postId,
        postType,
      });
      try {
        const response = await fetch(`${baseUrl}${Getpostsbyidortype}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: playload,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (data?.Data?.length > 0) {
          setPost([data.Data[0]]);
        } else {
          setPost([]);
        }
      } catch (error) {
        console.error("Error fetching shared post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (postId && postType) {
      fetchPost();
    }
  }, [postId, postType]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // if (!post) {
  //   return (
  //     <View style={styles.center}>
  //       <Text>Post not found.</Text>
  //     </View>
  //   );
  // }
  const renderItem1 = ({ item }) => {
    return (
      <View style={{ flex: 1, flexDirection: "row", marginVertical: 10 }}>
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
          <View style={{ flexShrink: 1, flex: 1 }}>
            <Text style={{ fontWeight: "700", fontSize: 15 }}>
              {item?.UserDetail?.UserName}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <Text style={{ fontSize: 13 }}>{item.Comment}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setReplyUserName(item?.UserDetail?.UserName);
                onChangeNumber(`@${item?.UserDetail?.UserName} `);
                setCommitID(item);
              }}
            >
              <Text style={{ paddingLeft: 20, color: Colors.main_primary }}>
                *Reply
              </Text>
            </TouchableOpacity>

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
                      <Text style={{ fontWeight: "700", fontSize: 15 }}>
                        {item?.UserDetail?.UserName}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={{ fontSize: 13, width: 200 }}
                      >
                        {reply.Comment}
                      </Text>
                      {/* <TouchableOpacity
                        onPress={() => {
                          setReplyUserName(reply.UserName);
                          setCommentText(`@${reply.UserName} `);
                          setCommitID(item);
                        }}>
                        <Text style={{ paddingLeft: 20, color: Colors.main_primary }}>*Reply</Text>
                      </TouchableOpacity> */}
                      <TouchableOpacity
                        onPress={() => {
                          setReplyUserName(reply?.UserDetail?.UserName);
                          onChangeNumber(`@${reply?.UserDetail?.UserName} `);
                          setCommitID(item);
                        }}
                      >
                        <Text
                          style={{
                            paddingLeft: 20,
                            color: Colors.main_primary,
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
              {/* <DeleteIcon name="delete" size={20} color="#888" />
               */}

              <Icon
                name="delete"
                size={20}
                color="#888"
                type="MaterialCommunityIcons"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  const renderItem = ({ item, index }) => {
    // console.log(item, 'itemitemitemitemrenderItemcontentindex');

    const getTimeAgo = (dateString) => {
      return moment(dateString, "DD-MMM-YYYY, hh:mm:ssa").fromNow();
    };
    const isExpanded = expandedPosts[index] || false;
    // const isUserPost = item.UserId === userData?.User?.userId;
    const formatText = (text) => {
      if (!text) return "<p>No content available.</p>";
      return text.startsWith("<")
        ? text
        : `<p>${text.replace(/\n/g, "<br/>")}</p>`;
    };

    const truncateText = (text, wordLimit = 30) => {
      const words = text.split(" ");
      if (words.length <= wordLimit) return text;
      return words.slice(0, wordLimit).join(" ") + "...";
    };

    const fullFormattedText = formatText(item?.PostText);
    const rawShortText = truncateText(
      item?.PostText || "No content available."
    );
    const shortFormattedText = formatText(rawShortText);
    return (
      <View
        style={{
          marginTop: 20,
          marginHorizontal: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileDetails", { Item: item })}
          style={{ flexDirection: "row", paddingBottom: 5 }}
        >
          <Image
            style={globalStyles.PostImg}
            source={
              item.ProfilePhoto
                ? { uri: item.ProfilePhoto }
                : require("../assets/placeholderprofileimage.png")
            }
          />

          <View>
            <View style={[globalStyles?.flexRow, { alignItems: "center" }]}>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 17,
                  paddingRight: 10,
                  color: colors.textColor,
                }}
              >
                {item.UserName}
              </Text>
              <Text style={{ color: colors.textColor }}>
                {getTimeAgo(item.DateAdded)}
              </Text>
            </View>

            <View style={{ flexShrink: 1, flexWrap: "wrap" }}>
              <Text
                style={{ fontSize: 12, width: "90%", color: colors.textColor }}
              >
                {item.JobTitle} at {item.CompanyName}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={{
            borderTopWidth: 0.5,
            borderColor: "gray",
            paddingVertical: 10,
          }}
        >
          {item?.PostTitle ? (
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: colors.AppmainColor,
                marginBottom: 5,
              }}
            >
              {item.PostTitle}
            </Text>
          ) : null}
          <RenderHTML
            contentWidth={screenWidth}
            source={{
              html: isExpanded ? fullFormattedText : shortFormattedText,
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

          {item.tagpeople?.map((user, index) => (
            <Text key={index} style={{ color: colors.AppmainColor }}>
              @{user?.UserName}
            </Text>
          ))}

          {item.PostText.split(" ").length > 40 && (
            <TouchableOpacity
              style={{ alignItems: "flex-end" }}
              onPress={() => toggleExpand(index)}
            >
              <Text style={{ color: colors.AppmainColor }}>
                {isExpanded ? "Show Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{ marginHorizontal: 20, marginTop: 10, alignItems: "center" }}
        >
          {item?.Images?.length > 0 && (
            <>
              {item.Images.length === 1 && (
                <TouchableOpacity
                  onPress={() => {
                    setModalImages([{ url: item.Images[0].PostImage }]);
                    setModalIndex(0);
                    setModalImageVisible(true);
                  }}
                >
                  <Image
                    source={{ uri: item.Images[0].PostImage }}
                    style={{
                      width: containerWidth,
                      height: 250,
                      borderRadius: 10,
                    }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}

              {item.Images.length > 1 && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    const formattedImages = item.Images.map((img) => ({
                      url: img.PostImage,
                    }));
                    setModalImages(formattedImages);
                    setModalIndex(0);
                    setModalImageVisible(true);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      width: containerWidth,
                      height: imageHeight,
                    }}
                  >
                    <Image
                      source={{ uri: item.Images[0].PostImage }}
                      style={{
                        width: largeImageWidth,
                        height: "100%",
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                      }}
                      resizeMode="cover"
                    />

                    <View
                      style={{
                        width: smallImageWidth,
                        marginLeft: 4,
                        justifyContent: "space-between",
                      }}
                    >
                      {item.Images.slice(1, 4).map((image, index) => {
                        const isLast = index === 2 && item.Images.length > 4;
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              setModalImages(
                                item.Images.map((img) => ({
                                  url: img.PostImage,
                                }))
                              );
                              setModalIndex(index + 1);
                              setModalImageVisible(true);
                            }}
                          >
                            <View style={{ height: smallImageHeight }}>
                              <Image
                                source={{ uri: image.PostImage }}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: 6,
                                }}
                                resizeMode="cover"
                              />
                              {isLast && (
                                <View style={styles.overlay}>
                                  <Text style={styles.overlayText}>
                                    +{item.Images.length - 4}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 0.5,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() =>
                navigation.navigate("ListLike", {
                  postId: item.id,
                  postType: item.PostType,
                })
              }
            >
              <Text style={{ color: colors.textColor }}>
                {item.TotalLike} Like
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setItemOfPost(item);
                setModalVisible1();
              }}
              style={{ padding: 10 }}
            >
              <Text style={{ color: colors.textColor }}>
                {(commentCounts[item.id] !== undefined
                  ? commentCounts[item.id]
                  : item.TotalComment) || 0}{" "}
                Comments
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{ color: colors.textColor }}>
              {item?.TotalShare} Share
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 10,
            borderBottomWidth: 2,
          }}
        >
          <TouchableOpacity
            style={globalStyles.shareButtonView}
            onPress={() => toggleLike(item)}
          >
            <LikeIcon
              name="like1"
              size={20}
              //  color={isLiked ? Colors.main_primary : '#888'}
              // color={'#888'}
              color={
                item?.IsLiked || likedPosts[item?.id]
                  ? colors.AppmainColor
                  : "#888"
              }
              style={{ paddingRight: 5 }}
            />
            <Text style={{ color: colors.textColor }}>Like</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.shareButtonView}
            onPress={() => {
              setItemOfPost(item);
              //  fetchCommentList(1, true, item.id, item.type);
              setModalVisible1();
              //  openBottomSheet();
              // handleAddComment(item.id, item.TotalComment);
            }}
          >
            <CommIcon
              name="commenting-o"
              size={20}
              color="#888"
              style={{ paddingRight: 5 }}
            />
            <Text style={{ color: colors.textColor }}>Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.shareButtonView}
            onPress={() => {
              setModalVisible(true);
              setPassImageInModal(item);
            }}
          >
            <Icon
              name="share"
              size={20}
              color="#888"
              type="FontAwesome"
              style={{ paddingRight: 5 }}
            />

            <Text style={{ color: colors.textColor }}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.headerView}>
        <TouchableOpacity
          // onPress={
          //   () => navigation.navigate('Home')
          //   // navigation.goBack()
          // }
          onPress={() => BackHandler.exitApp()}
        >
          <Iconback
            name="left"
            size={25}
            color={colors.textColor}
            style={{ paddingLeft: 10 }}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{""}</Text>
        <View style={{ flex: 0.1 }}></View>
      </View>
      <FlatList
        data={post}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={globalStyles.centeredView}>
          <View
            style={{
              ...globalStyles.modalView,
              backgroundColor: colors.modelBackground,
              flex: 0.6,
              // paddingBottom: 30,
            }}
          >
            <TouchableOpacity
              style={{ alignItems: "flex-end" }}
              onPress={() =>
                //  setModalVisible(!!modalVisible)
                setModalVisible(false)
              }
            >
              <Icon
                name="cross"
                size={20}
                color={colors.textColor}
                type="Entypo"
              />
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ ...globalStyles.modalText, color: colors.textColor }}
              >
                Share Post
              </Text>
            </View>
            <ScrollView ref={scrollViewRef}>
              <TextInput
                style={{
                  ...styles.input,
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
                    uri: passImageInModal?.Images[0]?.PostImage,
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
                    contentWidth={screenWidth}
                    source={{ html: passImageInModal?.PostText }}
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
                  {/* <Text style={{maxWidth: '80%'}}>
                    {passImageInModal?.PostText}
                  </Text> */}
                </View>
              </View>
              {selectedValue1 == "Share To  Extenal Social Media" ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <TouchableOpacity onPress={() => sharePost(WhatsAppShare)}>
                    <Icon
                      type="FontAwesome"
                      name={"whatsapp"}
                      size={40}
                      color={Colors?.main_primary}
                    />
                  </TouchableOpacity>
                  <Icon
                    type="AntDesign"
                    name={"facebook-square"}
                    size={40}
                    color="blue"
                  />
                  <Icon
                    type="AntDesign"
                    name={"instagram"}
                    size={40}
                    color={"#E1306C"}
                  />
                  <Icon
                    type="AntDesign"
                    name={"linkedin-square"}
                    size={40}
                    color="#2284ec"
                  />
                  <TouchableOpacity onPress={() => sharePost(TweetShare)}>
                    <Icon
                      type="AntDesign"
                      name={"twitter"}
                      size={40}
                      color="#61adff"
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
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
                  }}
                  onPress={toggleDropdown2}
                >
                  <Text style={{ ...styles.text, color: colors.textColor }}>
                    {selectedValue1 || "Public"}
                  </Text>
                  <Icon name="down" size={15} color="#000" type="AntDesign" />
                </TouchableOpacity>

                {isOpen2 && (
                  <View style={globalStyles.dropdownListShare}>
                    {options2.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={globalStyles.dropdownItemShare}
                        onPress={() => selectOption2(option)}
                      >
                        <Text style={styles.text}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={globalStyles.saveButton}
              onPress={() => handleSharePost()}
            >
              <Text style={globalStyles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <Modal
              visible={modalVisibleShare}
              transparent
              animationType="slide"
            >
              <View style={globalStyles.shareModalMain}>
                <View style={globalStyles.shareModalMain2}>
                  <View style={globalStyles.FD_Row_JC_SB}>
                    <Text style={globalStyles.shareText1}>Search User</Text>
                    <TouchableOpacity
                      hitSlop={20}
                      onPress={() => {
                        setModalVisibleShare(false), setSelectedUsers([]);
                      }}
                    >
                      <Icon
                        name="cross"
                        size={15}
                        color="black"
                        type="Entypo"
                      />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    value={username}
                    placeholder="Enter user name"
                    style={globalStyles.shareInput}
                    onChangeText={handleContactSearch}
                    placeholderTextColor={"black"}
                  />
                  <View style={{ flex: 1 }}>
                    {loadingContacts ? (
                      <ActivityIndicator
                        size="large"
                        color={Colors.main_primary}
                        style={{ marginTop: 30 }}
                      />
                    ) : filteredContacts.length === 0 ? (
                      <Text
                        style={{
                          textAlign: "center",
                          padding: 20,
                          color: Colors.gray,
                          fontSize: 16,
                        }}
                      >
                        No contacts found
                      </Text>
                    ) : (
                      <FlatList
                        data={filteredContacts}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={{
                              ...globalStyles.contantlistMainView,
                              padding: 5,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => toggleSelection(item.UserId)}
                              style={{
                                width: 20,
                                height: 20,
                                borderWidth: 2,
                                borderColor: selectedUsers.includes(item.UserId)
                                  ? "blue"
                                  : "#aaa",
                                backgroundColor: selectedUsers.includes(
                                  item.UserId
                                )
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
                                    ? { uri: item?.ProfilePhoto }
                                    : require("../assets/placeholderprofileimage.png")
                                }
                              />
                            </View>
                            <View style={{ padding: 10, flex: 1 }}>
                              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                                {item?.UserName}
                              </Text>
                              <Text
                                style={{
                                  color: Colors.gray,
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
                      try {
                        for (const userId of selectedUsers) {
                          await sendMessage(userId, passImageInModal);
                        }
                        setSelectedUsers([]);
                        setModalVisibleShare(false);
                        setModalVisible(false);
                      } catch (err) {
                        console.error("Sharing error:", err);
                      }
                    }}
                    style={globalStyles.shareModal}
                  >
                    <Text style={globalStyles.shareText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </Modal>

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
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => {
          setModalVisible1(false);
        }}
      >
        <KeyboardAvoidingWrapper offset={40}>
          <View style={globalStyles.centeredView}>
            <View style={{ ...globalStyles.modalView, flex: 0.8, padding: 20 }}>
              <TouchableOpacity
                onPress={() => setModalVisible1(false)}
                style={{
                  alignSelf: "flex-end",
                }}
              >
                <Icon name="cross" size={25} color="000" type="Entypo" />
              </TouchableOpacity>
              <View style={{ alignItems: "center", backgroundColor: "" }}>
                <Text style={globalStyles.commentTitle}>Comments</Text>
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <View style={{ paddingLeft: 10 }}>
                  <FlatList
                    data={[...commentList].reverse()}
                    renderItem={renderItem1}
                    keyExtractor={(item) => item.id?.toString()}
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={0.2}
                    onEndReached={() => {
                      if (hasMoreData && !isLoadingMore) {
                        fetchCommentList(page + 1);
                      }
                    }}
                    refreshing={isRefreshing}
                    onRefresh={() => fetchCommentList(1, true)}
                    ListFooterComponent={
                      isLoadingMore ? (
                        <ActivityIndicator
                          style={{ marginVertical: 20 }}
                          size="small"
                          color="#888"
                        />
                      ) : null
                    }
                    contentContainerStyle={{ paddingBottom: 30 }}
                  />
                </View>
              </View>
              {/* </ScrollView> */}

              <View style={globalStyles.ViewCommentImg}>
                <Image
                  source={
                    userProfileData?.Data?.profilePhoto
                      ? { uri: userProfileData?.Data?.profilePhoto }
                      : require("../assets/placeholderprofileimage.png")
                  }
                  style={globalStyles.ImgComment}
                />

                <TextInput
                  style={[globalStyles.textInputComment, { flex: 1 }]}
                  // style={globalStyles.textInputComment}
                  onChangeText={onChangeNumber}
                  value={number}
                  placeholder="Write your Comment"
                  keyboardType="default"
                  multiline
                  placeholderTextColor="#aaa"
                />

                <TouchableOpacity
                  disabled={isCommentEmpty || isCommentSending}
                  style={{
                    padding: 10,
                    opacity: isCommentEmpty || isCommentSending ? 0.4 : 1,
                  }}
                  onPress={async () => {
                    if (isCommentEmpty || isCommentSending) return; // prevent double tap
                    if (!number.trim()) {
                      showError("Comment cannot be empty.");
                      return;
                    }

                    setIsCommentSending(true);

                    try {
                      if (deleteValue.length === 0) {
                        await fetchAddComment();
                      } else {
                        await handleUpdateComment();
                      }
                    } catch (error) {
                      console.error("Send error:", error);
                    } finally {
                      setIsCommentSending(false);
                    }
                  }}
                >
                  <Icon
                    name="paper-plane"
                    size={20}
                    color="#888"
                    type="Entypo"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingWrapper>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    SafeAreaView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    container: { padding: 20 },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      color: colors.textColor,
    },
    content: { fontSize: 16, color: colors.textColor },
    fullHeightContent: {
      flex: 1,
      height: "100%",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
    },
    overlayText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    headerView: {
      // flex: 0.09,
      borderBottomWidth: 0.5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 60,
      paddingHorizontal: 4,
      backgroundColor: colors.background,
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
      color: Colors.black,
    },
  });
export default SharedPostScreen;
