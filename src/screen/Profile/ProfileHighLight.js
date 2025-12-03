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
  ActivityIndicator,
  Button,
  Alert,
  RefreshControl,
  Dimensions,
} from "react-native";
import globalStyles from "../GlobalCSS";
import Header from "../Header/Header";
import Colors from "../color";
import LikeIcon from "react-native-vector-icons/AntDesign";
import CommIcon from "react-native-vector-icons/FontAwesome";
import ShareIcon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHTML from "react-native-render-html";
import Icon from "../Icons/Icons";
import PlaneIcon from "react-native-vector-icons/Entypo";
import DeleteIcon from "react-native-vector-icons/MaterialCommunityIcons";
import DownIcon from "react-native-vector-icons/AntDesign";
import ImageViewer from "react-native-image-zoom-viewer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  AddComment,
  baseUrl,
  DeleteComment,
  HighLight,
  listcomment,
  sharewithcontact,
  sharewithpublic,
  UpdateComment,
} from "../baseURL/api";
import { showError } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";

const ProfileHighLight = ({ navigation, route }) => {
  const { Item = {} } = route.params || {};
  const windowWidth = Dimensions.get("window").width;
  const { isDark, colors, toggleTheme } = useTheme();
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(false); // For showing loading indicator
  const [page, setPage] = useState(1); // To track the current page
  const [hasMoreData, setHasMoreData] = useState(true); // To stop loading if no more data
  const [likedPosts, setLikedPosts] = useState({});
  const [activeTab, setActiveTab] = useState("Highlight"); // State to track active tab
  const [expandedIndex, setExpandedIndex] = React.useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [userData, setUserData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [number, onChangeNumber] = useState("");
  const [number1, onChangeNumber1] = useState("");
  const [postText, setPostText] = useState("");
  const [passImageInModal, setPassImageInModal] = useState();
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedValue1, setSelectedValue1] = useState("Share with Public");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesName, setImagesName] = useState([]);
  const [base64, setBase64] = useState([]);
  const [itemOfPost, setItemOfPost] = useState([]);
  const [itemOfPostForLike, setItemOfPostForLike] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [commentAdd, setCommentAdd] = useState([]);
  const [addLike, setAddLike] = useState([]);
  const [userProfileData, setUserProfileData] = useState([]);
  const [deletePost, setDeletePost] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [deleteComment, setDeleteComment] = useState(false);
  const [deleteValue, setDeleteValue] = useState([]);
  const [totalComments, setTotalComments] = useState("");
  const [commentCounts, setCommentCounts] = useState({});
  const [commentText, setCommentText] = useState("");
  const [replyUserName, setReplyUserName] = useState("");
  const [commitID, setCommitID] = useState([]);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const containerWidth = screenWidth - 40;
  const largeImageWidth = containerWidth * 0.65;
  const smallImageWidth = containerWidth * 0.35;
  const imageHeight = 250;
  const smallImageHeight = (imageHeight - 8) / 3;
  const options2 = ["Share with Public", "Share with My Contacts"];
  const toggleDropdown2 = () => setIsOpen2(!isOpen2);
  const selectOption2 = (option) => {
    setSelectedValue1(option);
    setIsOpen2(false);
  };
  const UserValue = async () => {
    const userDta = await AsyncStorage.Item("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };

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
    UserValue();
  }, []);
  const fetchPosts = async (page) => {
    if (loading || !hasMoreData) return;

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}${HighLight}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: 1,
          userId: Item?.UserId,
          postId: "",
          postType: "",
          activitPostType: activeTab === "Highlight" ? 1 : 2,
          per_page: 20,
          page: page,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.Data && data.Data.length > 0) {
          setPostData((prevData) => [...prevData, ...data.Data]); // Append new posts
        } else {
          setHasMoreData(false); // No more data to load
        }
      } else {
        showError(data.message || "Failed to fetch posts");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page, activeTab]);

  const toggleLike = async (post) => {
    const postId = post.id;
    const isLiked = likedPosts[postId] || false;
    const updatedLikeStatus = !isLiked;
    const updatedLikeCount = updatedLikeStatus
      ? post.TotalLike + 1
      : post.TotalLike - 1;

    // Optimistically update UI
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

      if (!response.ok) {
        throw new Error(data.message || "Failed to like the post");
      }

      // Update state based on API response
      setLikedPosts((prev) => ({ ...prev, [postId]: data.IsLiked }));
      setPostData((prevData) =>
        prevData.map((item) =>
          item.id === postId
            ? {
                ...item,
                TotalLike: data.IsLiked ? item.TotalLike : item.TotalLike,
              }
            : item
        )
      );

      // Store liked posts in AsyncStorage
      await AsyncStorage.setItem(
        "likedPosts",
        JSON.stringify({ ...likedPosts, [postId]: data.IsLiked })
      );
    } catch (error) {
      console.error("Like API Error:", error);
      // Revert UI update on API failure
      setLikedPosts((prev) => ({ ...prev, [postId]: isLiked }));
      setPostData((prevData) =>
        prevData.map((item) =>
          item.id === postId
            ? {
                ...item,
                TotalLike: isLiked ? item.TotalLike + 1 : item.TotalLike - 1,
              }
            : item
        )
      );
    }
  };
  const loadLikedPosts = async () => {
    try {
      const storedLikes = await AsyncStorage.getItem("likedPosts");
      if (storedLikes) {
        setLikedPosts(JSON.parse(storedLikes));
      }
    } catch (error) {
      console.error("Error loading liked posts:", error);
    }
  };
  useEffect(() => {
    loadLikedPosts();
  }, []);

  const handleAddComment = (postId) => {
    setCommentCounts((prevCounts) => ({
      ...prevCounts,
      [postId]: (prevCounts[postId] || 0) + 1, // Default to 0 if not available
    }));
  };
  useEffect(() => {
    if (itemOfPost) {
      fetchCommentList(itemOfPost);
    }
  }, [refresh, itemOfPost, commentAdd, deletePost, refresh]);

  const fetchCommentList = async ({ item }) => {
    if (!itemOfPost || !itemOfPost.id || !itemOfPost.PostType) {
      console.error("Missing postId or postType in item:", item);
      return;
    }
    try {
      const response = await fetch(`${baseUrl}${listcomment}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: itemOfPost.id,
          postType: itemOfPost.PostType,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // setLikeList1(data);
        setCommentList(data.DataList); // Append new posts to the existing list
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      // setLoading(false);
    }
  };
  const handleDeltComment = (postId) => {
    setCommentCounts((prevCounts) => ({
      ...prevCounts,
      [postId]: Math.max((prevCounts[postId] || 0) - 1, 0), // Avoid negative values
    }));
  };
  const fetchAddComment = async () => {
    let parentId = commitID?.Id || 0;
    console.log("fetchAddComment", itemOfPost);

    if (deleteValue.length == 0) {
      try {
        const response = await fetch(`${baseUrl}${AddComment}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: itemOfPost.id,
            parentId: parentId,
            postType: itemOfPost.PostType,
            userId: userData?.User?.userId,
            commentText: number,
          }),
        });

        const data = await response.json();
        console.log("ADd Comment Data ----", data);

        if (response.ok) {
          setCommentAdd(data.Message);
          onChangeNumber("");
          setRefresh(!refresh);
          handleAddComment(itemOfPost.id, itemOfPost.TotalComment);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        // setLoading(false);
      }
    }
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
          text: "Yes", // If Yes is pressed, proceed with deletion
          onPress: async () => {
            try {
              const response = await fetch(`${baseUrl}${DeleteComment}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: item?.Id,
                }),
              });

              const data = await response.json();

              if (response.ok) {
                setRefresh(!refresh);
                setDeletePost(true);
                handleDeltComment(item.id, item.TotalComment);
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
  const handleUpdateComment = async () => {
    setDeleteComment(true);
    if (deleteComment) {
      // console.log('222221111111', deleteValue.length == 0 ? 1 : 0);
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
  // this is use for convert the data in fromat
  const getTimeAgo = (dateString) => {
    if (!dateString) return "Invalid date"; // Handle missing date

    // Extract parts from '16-Jan-2025, 07:41:49am'
    const match = dateString.match(
      /(\d{2})-(\w{3})-(\d{4}), (\d{2}):(\d{2}):(\d{2})([ap]m)/i
    );
    if (!match) return "Invalid date";

    let [_, day, monthStr, year, hh, mm, ss, ampm] = match;
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    // Convert 12-hour format to 24-hour format
    let hour = parseInt(hh, 10);
    if (ampm.toLowerCase() === "pm" && hour !== 12) hour += 12;
    if (ampm.toLowerCase() === "am" && hour === 12) hour = 0;

    // Format to 'YYYY-MM-DDTHH:MM:SS'
    const formattedDate = `${year}-${months[monthStr]}-${day}T${hour
      .toString()
      .padStart(2, "0")}:${mm}:${ss}`;

    const postDate = new Date(formattedDate);
    if (isNaN(postDate.getTime())) return "Invalid date"; // Check if valid

    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours `;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days `;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} months `;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} years`;
  };
  const toggleExpand = (index) => {
    setExpandedPosts((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const truncateText = (text, wordLimit = 20) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };
  const renderItem = ({ item, index }) => {
    const isExpanded = expandedPosts[index] || false;
    const shortText = truncateText(
      item?.PostText || "<p>No content available.</p>"
    );

    const isLiked = likedPosts[item.id] || false;
    const totalLikes = isLiked ? item.TotalLike : item.TotalLike;
    const isUserPost = item.UserId === userData?.User?.userId;

    return (
      <View style={{ marginTop: 20 }}>
        <View style={{ flexDirection: "row", paddingBottom: 5 }}>
          <Image
            source={
              item?.UserDetail?.ProfilePhoto
                ? { uri: item?.UserDetail?.ProfilePhoto }
                : require("../../assets/placeholderprofileimage.png")
            }
            style={{
              width: 41,
              height: 41,
              borderRadius: 20,
              marginRight: 5,
              borderWidth: 2,
              borderColor: "yellow",
            }}
          />

          <View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 17,
                  paddingRight: 10,
                  color: colors.textColor,
                }}
              >
                {item?.UserDetail?.UserName}
              </Text>
              <Text style={{ color: colors.textColor }}>
                {getTimeAgo(item.DateAdded)}
              </Text>
            </View>

            <View style={{ flexShrink: 1, flexWrap: "wrap" }}>
              <Text style={{ fontSize: 12, color: colors.textColor }}>
                {item?.UserDetail?.JobTitle} at {item?.UserDetail?.CompanyName}
              </Text>
            </View>
          </View>

          {isUserPost && (
            <View
              style={{
                flex: 1,
                justifyContent: "space-evenly",
                alignItems: "flex-end",
              }}
            >
              <TouchableOpacity
                onPress={() => handleDeletePost({ item: item })}
              >
                <Icon
                  name="cross"
                  size={20}
                  color={colors.backIconColor}
                  type="Entypo"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View
          style={{
            borderTopWidth: 0.5,
            borderColor: colors.textinputbordercolor,
            paddingTop: 10,
          }}
        >
          <RenderHTML
            contentWidth={windowWidth}
            source={{
              html: isExpanded ? item.PostText : shortText,
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
                {item.TotalLike} Likes
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
                {commentCounts[item.id] ?? item.TotalComment} Comments
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{ color: colors.textColor }}>
              {item?.TotalShare} Shares
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
              color={
                isLiked ? colors.AppmainColor : colors.placeholderTextColor
              }
              style={{ paddingRight: 5 }}
            />
            <Text style={{ color: colors.textColor }}>Like</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.shareButtonView}
            onPress={() => {
              setItemOfPost(item);
              setModalVisible1();
              // handleAddComment(item.id, item.TotalComment);
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
            style={globalStyles.shareButtonView}
            onPress={() => {
              setModalVisible();
              setPassImageInModal(item);
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
    );
  };
  const renderItem1 = ({ item }) => {
    console.log("item", item);
    return (
      <View style={{ flex: 1, flexDirection: "row", marginVertical: 10 }}>
        <Image
          source={
            item?.UserDetail?.ProfilePhoto
              ? { uri: item?.UserDetail?.ProfilePhoto }
              : require("../../assets/placeholderprofileimage.png")
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
                color: Colors.textColor,
              }}
            >
              {item?.UserDetail?.UserName}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <Text style={{ fontSize: 13, color: colors.textColor }}>
                {item.Comment}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setReplyUserName(item?.UserDetail?.UserName); // Set username being replied to
                  onChangeNumber(`@${item?.UserDetail?.UserName} `); // Prepend username to TextInput
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
                          : require("../../assets/placeholderprofileimage.png")
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
                          onChangeNumber(`@${reply?.UserDetail?.UserName} `);
                          setCommitID(item); // Store parent comment ID (to nest reply)
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
  const handleSharePost = async () => {
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
            oldPostId: passImageInModal?.id,
            postType: passImageInModal?.PostType,
            postShareType: 1,
            postText: number1 ? number1 : "SHARE",
            oldPostText: passImageInModal?.PostText,
            userId: userData?.User?.userId,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setModalVisible(!!modalVisible);
        setPage(1);
        setPostData([]);
        fetchPosts(1);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header title="Profile HighLight" navigation={navigation} />
      <View style={{ ...globalStyles.SafeAreaView, marginHorizontal: 12 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              paddingVertical: 10,
              borderBottomWidth: 3,
              borderColor: colors.textinputbordercolor,
            }}
          >
            <Text style={{ fontSize: 18, color: colors.textColor }}>
              {Item?.UserName} College Action
            </Text>
          </View>

          <View
            style={{
              ...styles.tabContainer,
              borderColor: colors.textinputbordercolor,
            }}
          >
            <TouchableOpacity
              style={[
                styles.tabItem,
                { backgroundColor: colors.textinputBackgroundcolor },
                activeTab === "Highlight" && {
                  // styles.activeTab,
                  backgroundColor: colors.AppmainColor,
                },
              ]}
              onPress={() => {
                setActiveTab("Highlight");
                setPostData([]);
                setPage(1);
                setHasMoreData(true);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Highlight" && styles.activeTabText,
                  {
                    color:
                      activeTab === "Highlight"
                        ? colors.ButtonTextColor
                        : colors.textColor,
                  },
                ]}
              >
                Highlight
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                { backgroundColor: colors.textinputBackgroundcolor },
                activeTab === "Stories" && {
                  // styles.activeTab,
                  backgroundColor: colors.AppmainColor,
                },
              ]}
              onPress={() => {
                setActiveTab("Stories");
                setPostData([]);
                setPage(1);
                setHasMoreData(true);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Stories" && styles.activeTabText,
                  {
                    color:
                      activeTab === "Stories"
                        ? colors.ButtonTextColor
                        : colors.textColor,
                  },
                ]}
              >
                Stories
              </Text>
            </TouchableOpacity>
          </View>

          {postData.map((item, index) => renderItem({ item, index }))}

          {loading && (
            <ActivityIndicator size="large" color={colors.AppmainColor} />
          )}

          {!hasMoreData && (
            <Text
              style={{
                textAlign: "center",
                marginVertical: 10,
                color: colors.textColor,
              }}
            >
              No posts to show
            </Text>
          )}
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            setModalVisible1(!modalVisible1);
          }}
        >
          <View style={globalStyles.centeredView}>
            <View
              style={{
                ...globalStyles.modalView,
                flex: 0.5,
                padding: 20,
                backgroundColor: colors.modelBackground,
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible1(false)}
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

              <ScrollView>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      ...globalStyles.commentTitle,
                      color: colors.textColor,
                    }}
                  >
                    Comments
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ paddingLeft: 10 }}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={commentList}
                      renderItem={renderItem1}
                      keyExtractor={(item) => item.id}
                    />
                  </View>
                </View>
              </ScrollView>

              <View
                style={{
                  ...globalStyles.ViewCommentImg,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.textinputBackgroundcolor,
                }}
              >
                <Image
                  source={{ uri: userProfileData?.Data?.profilePhoto }}
                  style={globalStyles.ImgComment}
                />
                <TextInput
                  style={{
                    ...globalStyles.textInputComment,
                    color: colors.textColor,
                  }}
                  onChangeText={onChangeNumber}
                  value={number}
                  placeholder="Write your Comments"
                  keyboardType="default"
                  multiline
                  placeholderTextColor={colors.placeholderTextColor}
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 10,
                  }}
                  onPress={
                    deleteValue.length == 0
                      ? fetchAddComment
                      : () => handleUpdateComment()
                  }
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
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!!modalVisible);
          }}
        >
          <View style={globalStyles.centeredView}>
            <View
              style={{
                ...globalStyles.modalView,
                flex: 0.6,
                paddingBottom: 30,
                backgroundColor: colors.modelBackground,
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "flex-end" }}
                onPress={() => setModalVisible(!!modalVisible)}
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
                  style={{ ...globalStyles.modalText, color: colors.textColor }}
                >
                  Share Post
                </Text>
              </View>
              <ScrollView>
                <TextInput
                  style={{
                    ...globalStyles.inputShare,
                    borderWidth: 1,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    color: colors.textColor,
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
                    <RenderHTML
                      contentWidth={windowWidth}
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
                      color={colors.placeholderTextColor}
                    />
                  </TouchableOpacity>

                  {isOpen2 && (
                    <View
                      style={{
                        ...globalStyles.dropdownListShare,
                        borderColor: colors.textinputbordercolor,
                      }}
                    >
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
                            style={{ ...styles.text, color: colors.textColor }}
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
  text: {
    fontSize: 14,
  },

  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  firstImage: {
    width: 295,
    height: 295,
    marginRight: 10,
    borderRadius: 8,
  },
  smallImage: {
    width: 93,
    height: 93,
    marginBottom: 10,
    borderRadius: 8,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    borderBottomWidth: 3,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 10,
    flex: 1,
  },
  activeTab: {
    // backgroundColor: Colors.main_primary, // Active tab background
  },
  tabText: {
    fontSize: 18,
    color: Colors.black, // Default text color
  },
  activeTabText: {
    // color: Colors.white, // Active tab text color
    fontWeight: "bold",
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

export default ProfileHighLight;
