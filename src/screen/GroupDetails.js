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
  Alert,
  ActivityIndicator,
  Switch,
} from "react-native";
import Colors from "./color";
import GroupIcon from "react-native-vector-icons/FontAwesome";
import Header from "./Header/Header";
import globalStyles from "./GlobalCSS";
import LikeIcon from "react-native-vector-icons/AntDesign";
import CommIcon from "react-native-vector-icons/FontAwesome";
import DeleteIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  AcceptJoinGroup,
  baseUrl,
  DeclineRequest,
  PendingGroupRequest,
  SentJoinGroup,
  UpdateGroup,
  GroupPostList,
  LeaveGroup,
  listcomment,
  AddComment,
  UpdateComment,
  DeleteComment,
} from "./baseURL/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagePicker from "react-native-image-crop-picker";
import Icon from "./Icons/Icons";
import { showError, showSuccess } from "./components/Toast";
import { useTheme } from "../theme/ThemeContext";

const GroupDetails = ({ navigation, route }) => {
  const { Item = {}, AdditionalData = [] } = route.params || {};
  console.log("Item ----------->", Item);
  const { isDark, colors, toggleTheme } = useTheme();
  const [number, onChangeNumber] = useState("");
  const [userData, setUserData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Posts");
  const [joiningRequests, setJoiningRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [GName, setGName] = useState("");
  const [shortGDesciption, setShortGDesciption] = useState("");
  const [longDesciption, setLongDesciption] = useState("");
  const [errors, setErrors] = useState({});
  const [userProfileData, setUserProfileData] = useState([]);
  const [groupsPostLists, setGroupsPostLists] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesName, setImagesName] = useState([]);
  const [base64, setBase64] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [deleteComment, setDeleteComment] = useState(false);
  const [deleteValue, setDeleteValue] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [itemOfPost, setItemOfPost] = useState([]);
  const [commentAdd, setCommentAdd] = useState([]);
  const [deletePost, setDeletePost] = useState(false);
  const [likedPosts, setLikedPosts] = useState("");
  const [commentCounts, setCommentCounts] = useState({});
  const [replyUserName, setReplyUserName] = useState("");
  const [joinRequestSent, setJoinRequestSent] = useState(
    Item?.JoinRequest?.toLowerCase() === "yes"
  );

  const [commitID, setCommitID] = useState([]);
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
    setGName(Item?.groupName);
    setShortGDesciption(Item?.groupDetails);
    // setLongDesciption(Item?.groupDetails);
  }, []);

  const sections = [
    "Posts",
    "Joining requests",
    "About this group",
    "Group setting",
    "Invite contacts",
  ];

  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };

  useEffect(() => {
    UserValue();
  }, []);

  const handleJoinGroup = async () => {
    const requestBody = {
      senderUserId: userData?.User?.userId,
      receiverUserId: Item?.groupModerator?.UserId,
      groupId: Item?.id,
    };
    try {
      const response = await fetch(`${baseUrl}${SentJoinGroup}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      // const text = await response.text();
      // console.log(text, 'texttexttexttexttexttexttexttexttexttext');
      const data = await response.json();
      if (response.ok) {
        showSuccess(data?.Message);
        setJoinRequestSent(true);
      } else {
        console.error("Error joining:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const handleLeaveGroup = async () => {
    const requestBody = {
      userId: userData?.User?.userId,
      groupId: Item?.id,
    };

    try {
      const response = await fetch(`${baseUrl}${LeaveGroup}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Joined successfully:", data);
        showError("Leave Successfully!");
      } else {
        console.error("Error joining:", data);
        showError("Failed to join group");
      }
    } catch (error) {
      console.error("Network error:", error);
      showError("Something went wrong");
    }
  };
  // Function to fetch Joining Requests
  const fetchJoiningRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}${PendingGroupRequest}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          groupId: Item?.id,
        }),
      });

      const data = await response.json();
      setJoiningRequests(data || []);
    } catch (error) {
      console.error("Error fetching joining requests:", error);
    } finally {
      setLoading(false);
    }
  };
  // Trigger API call when "Joining requests" is selected
  useEffect(() => {
    if (selectedTab === "Joining requests") {
      fetchJoiningRequests();
    }
  }, [selectedTab]);
  // API call function for confirming a request
  const handleConfirm = async ({ item }) => {
    const payload = JSON.stringify({
      senderUserId: item?.SenderUserDetail?.UserId,
      receiverUserId: userData?.User?.userId,
      groupId: item?.GroupId,
    });
    try {
      const response = await fetch(`${baseUrl}${AcceptJoinGroup}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });
      const text = await response.text(); // Read the raw response
      console.log("Raw response text:", text);
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        return;
      }
      if (data.Status === 1) {
        showSuccess(data.Message);
        fetchJoiningRequests();
      } else {
        showError("Failed to accept the request.");
      }
    } catch (error) {
      console.error("Error confirming request:", error);
    }
  };
  // API call function for declining a request
  const handleDecline = async ({ item }) => {
    try {
      const response = await fetch(`${baseUrl}${DeclineRequest}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          groupId: item?.GroupId,
          userId: userData?.User?.userId,
        }),
      });

      const data = await response.json();
      console.log("data ----> ", data);
      if (data.Status === 1) {
        showError("Request has been declined.");
        fetchJoiningRequests();
      }
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };
  const handleUpdateValue = async (item) => {
    if (item !== "Status") {
      let validationErrors = {};

      if (!GName.trim()) {
        validationErrors.GName = "Group Name is required";
      }
      if (!shortGDesciption.trim()) {
        validationErrors.shortGDesciption = "Short Description is required";
      }
      if (!longDesciption.trim()) {
        validationErrors.longDesciption = "Long Description is required";
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    try {
      let requestBody = {};
      if (item === "Status") {
        requestBody = {
          groupId: Item?.id,
          userGroupStatus: isActive ? 1 : 0,
          groupThumb: base64?.toString(),
        };
      } else {
        requestBody = {
          groupId: Item?.id,
          groupName: GName,
          groupDetails: shortGDesciption,
          groupLongDetails: longDesciption || "",
        };
      }

      const response = await fetch(`${baseUrl}${UpdateGroup}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();

      if (response.ok) {
        navigation.goBack();
      } else {
        showError(data.message || "Failed to update group.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (selectedTab === "Posts") {
      groupsPostList();
    }
  }, [selectedTab]);
  const groupsPostList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}${GroupPostList}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          groupId: 1,
          per_page: 10,
          page: 1,
        }),
      });

      const data = await response.json();
      // setGroupsPostLists(JSON?.stringify(data));
      setGroupsPostLists(data);
    } catch (error) {
      console.error("Error fetching joining requests:", error);
    } finally {
      setLoading(false);
    }
  };
  const renderItemPostLists = ({ item }) => {
    const isLiked = likedPosts[item.id] || false;

    return (
      <View style={globalStyles?.PV_10}>
        <View
          style={{
            ...globalStyles?.FD_Row_AT_C,
            borderBottomWidth: 1,
            paddingBottom: 10,
            borderColor: colors.textinputbordercolor,
          }}
        >
          <Image
            source={
              item?.UserDetail?.ProfilePhoto
                ? { uri: item?.UserDetail?.ProfilePhoto }
                : require("../assets/placeholderprofileimage.png")
            }
            style={{ ...globalStyles.GroupModeratorImg, marginRight: 10 }}
          />
          <View>
            <Text
              style={{
                ...globalStyles?.FS_15_CB_FW_600,
                color: colors.textColor,
              }}
            >
              {item?.UserDetail?.UserName}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...globalStyles?.P_10,
            borderBottomWidth: 1,
            paddingBottom: 10,
            borderColor: colors.textinputbordercolor,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              paddingVertical: 10,
              color: colors.textColor,
            }}
          >
            {item?.PostTitle || "No Title"}
          </Text>
          <Text style={{ color: colors.textColor }}>{item?.PostText}</Text>
        </View>
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
                {isLiked
                  ? item?.TotalLike
                  : item?.TotalLike == 0
                  ? item?.TotalLike
                  : item?.TotalLike - 1}{" "}
                Likes
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
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 10,
            borderBottomWidth: 2,
            borderColor: colors.textinputbordercolor,
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
        </View>
      </View>
    );
  };
  const selectImage = () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: "photo",
      compressImageQuality: 0.8,
      includeBase64: true,
    })
      .then((image) => {
        // Extract details of the selected image
        const imagePath = image.path;
        const imageName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
        const base64Image = image.data;

        setImages([imagePath]);
        setImagesName([imageName]);
        setBase64([base64Image]);
      })
      .catch((error) => {
        console.error("Image selection cancelled:", error);
      });
  };
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
                      source={{
                        uri: item?.UserDetail?.ProfilePhoto
                          ? item?.UserDetail?.ProfilePhoto
                          : require("../assets/placeholderprofileimage.png"),
                      }}
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
  // this section for comment start
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
        setCommentList(data.DataList);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      // setLoading(false);
    }
  };
  const fetchAddComment = async () => {
    let parentId = commitID?.Id || 0;
    console.log("fetchAddComment", deleteValue);
    console.log("itemOfPost", itemOfPost);

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
        console.error("Fetch Error fetchAddComment:", error);
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
                setDeletePost(true);
                handleDeltComment(item.id, item.TotalComment);
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
  const handleAddComment = (postId) => {
    setCommentCounts((prevCounts) => ({
      ...prevCounts,
      [postId]: (prevCounts[postId] || 0) + 1, // Default to 0 if not available
    }));
  };
  const handleDeltComment = (postId) => {
    setCommentCounts((prevCounts) => ({
      ...prevCounts,
      [postId]: Math.max((prevCounts[postId] || 0) - 1, 0), // Avoid negative values
    }));
  };
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

  const isUserMember = Item?.memberList?.some(
    (member) => member?.UserId === userData?.User?.userId
  );

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header title={"Group Details"} navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={globalStyles.MainView}
      >
        <View
          style={{
            paddingVertical: 10,
            flexDirection: "row",
            borderBottomWidth: 1,
            borderColor: colors.textinputbordercolor,
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: Colors.lite_gray,
              padding: 10,
              borderRadius: 80,
            }}
          >
            <View
              style={{
                backgroundColor: colors.placeholderTextColor,
                padding: 15,
                borderRadius: 80,
              }}
            >
              {Item?.groupImage ? (
                <Image
                  source={
                    Item?.groupImage
                      ? { uri: Item?.groupImage }
                      : require("../assets/noimageplaceholder.png")
                  }
                  style={{ width: 50, height: 50, borderRadius: 30 }}
                />
              ) : (
                <GroupIcon
                  name="group"
                  size={25}
                  color={colors.lightbackground}
                />
              )}
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                color: colors.AppmainColor,
                fontSize: 18,
                paddingBottom: 5,
              }}
            >
              {Item?.groupName}
            </Text>
            <Text style={{ color: colors.textColor }}>
              {Item?.groupDetails}
            </Text>
          </View>
          <TouchableOpacity
            // onPress={() => {
            //   if (Item?.isEdit) {
            //     setSelectedTab('About this group');
            //   } else {
            //     if (Item?.JoinRequest?.toLowerCase() === 'yes') {
            //       showSuccess('Request already send to join');
            //     } else {
            //       handleJoinGroup();
            //     }
            //   }
            // }}
            onPress={() => {
              if (Item?.isEdit) {
                setSelectedTab("About this group");
              } else {
                if (joinRequestSent) {
                  showSuccess("Request already sent to join");
                } else {
                  handleJoinGroup();
                }
              }
            }}
            disabled={joinRequestSent}
            style={{
              backgroundColor: colors.AppmainColor,
              padding: 12,
              alignSelf: "flex-start",
              flexDirection: "row",
              borderRadius: 10,
              alignItems: "center",
              opacity: joinRequestSent ? 0.8 : 1,
            }}
          >
            <GroupIcon
              name={Item?.isEdit == true ? "pencil" : "plus"}
              size={15}
              color={colors.ButtonTextColor}
              style={{ paddingRight: 5 }}
            />
            <Text style={{ fontSize: 15, fontWeight: "600", color: "white" }}>
              {Item?.isEdit
                ? "Edit"
                : joinRequestSent
                ? "Request sent"
                : "Join"}
              {/* {Item?.isEdit == true ? 'Edit' : 'Join'} */}
            </Text>
          </TouchableOpacity>
        </View>

        {/* This section then Showing if this Group's not User Login  */}
        {!Item?.isEdit && (
          <>
            <View style={{ paddingVertical: 20 }}>
              <Text style={{ fontSize: 19, color: colors.textColor }}>
                About this group
              </Text>
            </View>

            <View style={{ paddingHorizontal: 12, paddingBottom: 20 }}>
              <Text style={{ fontSize: 15, color: colors.textColor }}>
                {Item?.groupDetails}
              </Text>
            </View>

            <View style={{ paddingVertical: 4 }}>
              <Text style={{ fontSize: 19, color: colors.textColor }}>
                Your Contacts
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProfileDetails", {
                  Item: Item?.groupModerator,
                  groupId: Item?.id,
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderColor: colors.textinputbordercolor,
                paddingVertical: 20,
              }}
            >
              <Image
                style={globalStyles.GroupModeratorImg}
                source={
                  Item?.groupModerator?.ProfilePhoto
                    ? {
                        uri: Item?.groupModerator?.ProfilePhoto,
                      }
                    : require("../assets/placeholderprofileimage.png")
                }
              />
              <View style={{ paddingLeft: 10 }}>
                <Text style={{ fontSize: 17, color: colors.AppmainColor }}>
                  {Item?.groupModerator?.UserName}
                </Text>
                <Text style={{ color: colors.textColor }}>
                  at {Item?.groupModerator?.CompanyName}{" "}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={globalStyles?.PV_AI}>
              <Text
                style={{
                  ...globalStyles?.FS_19_FW_500,
                  color: colors.textColor,
                }}
              >
                Moderators
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProfileDetails", {
                  Item: Item?.groupModerator,
                  groupId: Item?.id,
                })
              }
              style={globalStyles?.FD_Row_AT_C}
            >
              <Image
                style={globalStyles.GroupModeratorImg}
                source={
                  Item?.groupModerator?.ProfilePhoto
                    ? {
                        uri: Item?.groupModerator?.ProfilePhoto,
                      }
                    : require("../assets/placeholderprofileimage.png")
                }
              />
              <View style={{ paddingLeft: 10 }}>
                <Text style={{ fontSize: 17, color: colors.AppmainColor }}>
                  {Item?.groupModerator?.UserName}
                </Text>
                <Text style={{ color: colors.textColor }}>
                  at {Item?.groupModerator?.CompanyName}{" "}
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={{
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderColor: colors.textinputbordercolor,
                paddingBottom: 10,
              }}
            >
              <View style={globalStyles.PT}>
                <Text
                  style={{
                    ...globalStyles?.FS_15_CB_FW_600,
                    color: colors.textColor,
                  }}
                >
                  Members
                </Text>
              </View>
              <View style={{ ...globalStyles.flexRow, ...globalStyles?.MT_20 }}>
                {Item?.memberList.slice(0, 5).map((member, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate("ProfileDetails", {
                        Item: member,
                      })
                    }
                  >
                    <Image
                      source={
                        member.ProfilePhoto
                          ? { uri: member.ProfilePhoto }
                          : require("../assets/placeholderprofileimage.png")
                      }
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 30,
                        // backgroundColor: Colors.lite_gray,
                        marginRight: 5,
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <View style={globalStyles.PT}>
                <Text
                  style={{
                    ...globalStyles.FS_15_CB_FW_600,
                    color: colors.textColor,
                  }}
                >
                  About this Group
                </Text>
              </View>

              <View>
                <View style={globalStyles?.FD_Row_JC_SB}>
                  <Text style={{ color: colors.textColor }}>Founded:</Text>
                  <Text
                    style={{ ...globalStyles?.FW_600, color: colors.textColor }}
                  >
                    {Item?.founded}
                  </Text>
                </View>
                <View style={globalStyles?.FD_Row_JC_SB}>
                  <Text style={{ color: colors.textColor }}>Members:</Text>
                  <Text
                    style={{ ...globalStyles?.FW_600, color: colors.textColor }}
                  >
                    {Item?.totalMembers}
                  </Text>
                </View>
                <View style={globalStyles?.FD_Row_JC_SB}>
                  <Text style={{ color: colors.textColor }}>Posts:</Text>
                  <Text
                    style={{ ...globalStyles?.FW_600, color: colors.textColor }}
                  >
                    {Item?.totalPost}
                  </Text>
                </View>
                <View style={globalStyles?.FD_Row_JC_SB}>
                  <Text style={{ color: colors.textColor }}>Comments:</Text>
                  <Text
                    style={{ ...globalStyles?.FW_600, color: colors.textColor }}
                  >
                    {Item?.totalComment}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {Item?.isEdit && (
          <>
            <View>
              {sections.map((section, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedTab(section)}
                  style={{
                    backgroundColor:
                      selectedTab === section
                        ? colors.AppmainColor
                        : "transparent",
                    padding: 10,
                    borderRadius: 5,
                    borderBottomWidth: 1,
                    borderColor: colors.textinputbordercolor,
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedTab === section
                          ? colors.ButtonTextColor
                          : colors.textColor,
                      fontWeight: "bold",
                    }}
                  >
                    {section}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View
              style={{
                marginTop: 20,
                padding: 10,
                borderWidth: 1,
                borderColor: colors.textinputbordercolor,
                borderRadius: 4,
                minHeight: 100,
              }}
            >
              {selectedTab === "Posts" && (
                <View>
                  <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <View>
                      <Image
                        source={{ uri: userProfileData?.Data?.profilePhoto }}
                        style={globalStyles.GroupModeratorImg}
                      />
                    </View>
                    <View style={{ paddingLeft: 10, flex: 1 }}>
                      <Text
                        style={{
                          ...globalStyles?.FS_17_C_m_p,
                          color: colors.AppmainColor,
                        }}
                      >
                        {userProfileData?.Data?.firstName}{" "}
                        {userProfileData?.Data?.lastName}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("ArticleAdd", {
                            GroupDetails: Item,
                          })
                        }
                        style={{
                          borderWidth: 1,
                          borderColor: colors.textinputbordercolor,
                          padding: 10,
                          borderRadius: 4,
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ color: colors.textColor }}>
                          Type your post
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <FlatList
                    data={groupsPostLists?.Data}
                    renderItem={renderItemPostLists}
                    keyExtractor={(item) => item?.id?.toString()}
                  />
                  <View style={globalStyles?.PV_AI}>
                    <Text
                      style={{
                        ...globalStyles?.FS_19_FW_500,
                        color: colors.textColor,
                      }}
                    >
                      Moderators
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ProfileDetails", {
                        Item: Item?.groupModerator,
                      })
                    }
                    style={globalStyles?.FD_Row_AT_C}
                  >
                    <Image
                      style={globalStyles.GroupModeratorImg}
                      source={{
                        uri: Item?.groupModerator?.ProfilePhoto
                          ? Item?.groupModerator?.ProfilePhoto
                          : require("../assets/placeholderprofileimage.png"),
                      }}
                    />
                    <View style={{ paddingLeft: 10 }}>
                      <Text
                        style={{
                          ...globalStyles?.FS_17_C_m_p,
                          color: colors.textColor,
                        }}
                      >
                        {Item?.groupModerator?.UserName}
                      </Text>
                      <Text style={{ color: colors.textColor }}>
                        at {Item?.groupModerator?.CompanyName}{" "}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View
                    style={{
                      paddingHorizontal: 10,
                      borderBottomWidth: 1,
                      borderColor: colors.textinputbordercolor,
                      paddingBottom: 10,
                    }}
                  >
                    <View style={globalStyles.PT}>
                      <Text
                        style={{
                          ...globalStyles?.FS_15_CB_FW_600,
                          color: colors.textColor,
                        }}
                      >
                        Members
                      </Text>
                    </View>
                    <View
                      style={{
                        ...globalStyles.flexRow,
                        ...globalStyles?.MT_20,
                      }}
                    >
                      {Item?.memberList.slice(0, 5).map((member, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() =>
                            navigation.navigate("ProfileDetails", {
                              Item: member,
                            })
                          }
                        >
                          <Image
                            source={{
                              uri: member.ProfilePhoto
                                ? member.ProfilePhoto
                                : require("../assets/placeholderprofileimage.png"),
                            }}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 30,
                              // backgroundColor: Colors.lite_gray,
                              marginRight: 5,
                            }}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View>
                    <View style={globalStyles.PT}>
                      <Text
                        style={{
                          ...globalStyles.FS_15_CB_FW_600,
                          color: colors.textColor,
                        }}
                      >
                        About this Group
                      </Text>
                    </View>

                    <View>
                      <View style={globalStyles?.FD_Row_JC_SB}>
                        <Text style={{ color: colors.textColor }}>
                          Founded:
                        </Text>
                        <Text
                          style={{
                            ...globalStyles?.FW_600,
                            color: colors.textColor,
                          }}
                        >
                          {Item?.founded}
                        </Text>
                      </View>
                      <View style={globalStyles?.FD_Row_JC_SB}>
                        <Text style={{ color: colors.textColor }}>
                          Members:
                        </Text>
                        <Text
                          style={{
                            ...globalStyles?.FW_600,
                            color: colors.textColor,
                          }}
                        >
                          {Item?.totalMembers}
                        </Text>
                      </View>
                      <View style={globalStyles?.FD_Row_JC_SB}>
                        <Text style={{ color: colors.textColor }}>Posts:</Text>
                        <Text
                          style={{
                            ...globalStyles?.FW_600,
                            color: colors.textColor,
                          }}
                        >
                          {Item?.totalPost}
                        </Text>
                      </View>
                      <View style={globalStyles?.FD_Row_JC_SB}>
                        <Text style={{ color: colors.textColor }}>
                          Comments:
                        </Text>
                        <Text
                          style={{
                            ...globalStyles?.FW_600,
                            color: colors.textColor,
                          }}
                        >
                          {Item?.totalComment}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {selectedTab === "Joining requests" && (
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: colors.textColor,
                    }}
                  >
                    Pending Requests
                  </Text>
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.AppmainColor}
                    />
                  ) : joiningRequests?.TotalRecord > 0 ? (
                    joiningRequests?.DataList?.map((request, index) => (
                      <View
                        key={index}
                        style={{
                          marginTop: 10,
                          paddingBottom: 10,
                          flexDirection: "row",
                          alignItems: "center",
                          borderBottomWidth: 1,
                          borderColor: colors.textinputbordercolor,
                        }}
                      >
                        <Image
                          source={{
                            uri: request.SenderUserDetail.ProfilePhoto
                              ? request.SenderUserDetail.ProfilePhoto
                              : require("../assets/placeholderprofileimage.png"),
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: Colors.lite_gray,
                          }}
                        />
                        <View style={{ marginLeft: 10 }}>
                          <Text
                            style={{
                              fontSize: 17,
                              padding: 2,
                              fontWeight: "bold",
                              color: colors.AppmainColor,
                            }}
                          >
                            {request.SenderUserDetail.UserName}
                          </Text>
                          <Text style={{ padding: 5, color: colors.textColor }}>
                            wants to join your group
                          </Text>
                          <View
                            style={{
                              ...globalStyles?.FD_Row_JC_SB,
                              alignItems: "flex-end",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => handleConfirm({ item: request })}
                              style={{
                                marginTop: 5,
                                backgroundColor: colors.AppmainColor,
                                padding: 8,
                                borderRadius: 4,
                              }}
                            >
                              <Text
                                style={{
                                  color: colors.ButtonTextColor,
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                Confirm
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDecline({ item: request })}
                              // onPress={handleDecline}
                              style={{
                                marginTop: 5,
                                backgroundColor:
                                  colors.textinputBackgroundcolor,
                                borderColor: colors.textinputbordercolor,
                                borderWidth: 0.5,
                                padding: 8,
                                borderRadius: 4,
                              }}
                            >
                              <Text
                                style={{
                                  color: colors.textColor,
                                  textAlign: "center",
                                }}
                              >
                                Decline
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={{ color: colors.textColor }}>
                      No pending requests
                    </Text>
                  )}
                </View>
              )}

              {selectedTab === "About this group" && (
                <View>
                  <Text
                    style={{
                      fontSize: 19,
                      fontWeight: "bold",
                      color: colors.textColor,
                    }}
                  >
                    About Group
                  </Text>

                  {/* <View style={globalStyles.MT_20}>
                    <Text
                      style={{
                        ...globalStyles.FS_16_FW_400,
                        paddingVertical: 5,
                      }}>
                      Short Description *
                    </Text>
                    <TextInput
                      style={{
                        ...globalStyles.textInput,
                        flex: 0,
                        height: 40,
                        paddingTop: 0,
                        marginTop: 0,
                        borderColor: errors.shortGDesciption ? 'red' : '#ccc',
                        borderWidth: errors.shortGDesciption ? 1 : 1,
                      }}
                      value={shortGDesciption}
                      onChangeText={value => {
                        setShortGDesciption(value);
                        setErrors(prev => ({...prev, shortGDesciption: ''}));
                      }}
                    />
                    {errors.shortGDesciption && (
                      <Text style={{color: 'red', fontSize: 12}}>
                        {errors.shortGDesciption}
                      </Text>
                    )}
                  </View> */}

                  <View style={globalStyles.MT_20}>
                    <Text
                      style={{
                        ...globalStyles.FS_16_FW_400,
                        paddingVertical: 5,
                        color: colors.textColor,
                      }}
                    >
                      Group Name<Text style={{ color: "red" }}>*</Text>
                    </Text>
                    <TextInput
                      style={{
                        ...globalStyles.textInput,
                        borderColor: colors.textinputbordercolor,
                        color: colors.textColor,
                        backgroundColor: colors.textinputBackgroundcolor,
                        flex: 0,
                        height: 40,
                      }}
                      value={GName}
                      onChangeText={(value) => {
                        setGName(value);
                        // setErrorJov(value.trim().length === 0);
                      }}
                    />
                  </View>
                  <View style={globalStyles.MT_20}>
                    <Text
                      style={{
                        ...globalStyles.FS_16_FW_400,
                        paddingVertical: 5,
                        color: colors.textColor,
                      }}
                    >
                      Short Description<Text style={{ color: "red" }}>*</Text>
                    </Text>
                    <TextInput
                      style={{
                        ...globalStyles.textInput,

                        height: 40,
                        // paddingTop: 0,
                        //marginTop: 0,
                        borderColor: errors.shortGDesciption
                          ? "red"
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                        backgroundColor: colors.textinputBackgroundcolor,
                        //flex: 1,
                        borderWidth: errors.shortGDesciption ? 1 : 1,
                      }}
                      value={shortGDesciption}
                      onChangeText={(value) => {
                        setShortGDesciption(value);
                        setErrors((prev) => ({
                          ...prev,
                          shortGDesciption: "",
                        }));
                      }}
                    />
                  </View>
                  {errors.shortGDesciption && (
                    <Text style={{ color: "red", fontSize: 12 }}>
                      {errors.shortGDesciption}
                    </Text>
                  )}
                  <View
                    style={{
                      // flex: 1,
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        ...globalStyles.FS_16_FW_400,
                        paddingVertical: 5,
                        color: colors.textColor,
                      }}
                    >
                      Long Description
                    </Text>
                    <TextInput
                      style={{
                        ...globalStyles.textInput,
                        height: 120,
                        marginBottom: 10,
                        borderColor: errors.longDesciption
                          ? "red"
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                        backgroundColor: colors.textinputBackgroundcolor,
                        //flex: 1,
                        borderWidth: errors.longDesciption ? 1 : 1,
                      }}
                      value={longDesciption}
                      onChangeText={(value) => {
                        setLongDesciption(value);
                        setErrors((prev) => ({ ...prev, longDesciption: "" }));
                      }}
                      multiline={true}
                    />
                    <Text
                      style={{ ...globalStyles.FS_15, color: colors.textColor }}
                    >
                      Max 150 Characters
                    </Text>
                  </View>
                  {errors.longDesciption && (
                    <Text style={{ color: "red", fontSize: 12 }}>
                      {errors.longDesciption}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={{
                      ...globalStyles.saveButton,
                      backgroundColor: colors.AppmainColor,
                    }}
                    onPress={() => handleUpdateValue()}
                  >
                    <Text
                      style={{
                        ...globalStyles.saveButtonText,
                        color: colors.ButtonTextColor,
                      }}
                    >
                      Update
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {selectedTab === "Group setting" && (
                <>
                  <Text
                    style={{
                      ...globalStyles?.FS_16_FW_B,
                      color: colors.textColor,
                    }}
                  >
                    Group Setting
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingTop: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          ...styles.statusText,
                          color: colors.textColor,
                        }}
                      >
                        Change Group Photo
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={selectImage}
                      style={{
                        backgroundColor: colors.AppmainColor,
                        padding: 5,
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        style={{
                          ...globalStyles?.FS_14_FW_B,
                          color: colors.ButtonTextColor,
                        }}
                      >
                        Select Photo
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {images?.length > 0 ? (
                    <>
                      <TouchableOpacity
                        onPress={() => setImages(null)}
                        style={globalStyles.AS_End_PV_5}
                      >
                        <Icon
                          name="cross"
                          size={20}
                          color={colors.backIconColor}
                          type="Entypo"
                        />
                      </TouchableOpacity>

                      <View style={globalStyles.containerArticle}>
                        <View style={globalStyles.rowArticle}>
                          <Image
                            style={globalStyles.firstImage}
                            source={
                              images && images.length > 0
                                ? images[0]?.startsWith("http") // Check if the path is a URL
                                  ? { uri: images.toString() } // Use the URL if it's a remote image
                                  : { uri: images.toString() } // Use the local path directly for local images
                                : null // Fallback to a placeholder if no image is selected
                            }
                          />
                        </View>
                      </View>
                    </>
                  ) : null}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 20,
                    }}
                  >
                    <Text
                      style={{ ...styles.statusText, color: colors.textColor }}
                    >
                      Group status:{" "}
                    </Text>
                    <Switch
                      trackColor={{
                        false: "#767577",
                        true: Colors?.secondGreen,
                      }}
                      thumbColor={isActive ? colors.AppmainColor : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={setIsActive}
                      value={isActive}
                    />
                  </View>
                  <TouchableOpacity
                    style={{
                      ...globalStyles.saveButton,
                      backgroundColor: colors.AppmainColor,
                    }}
                    onPress={() => handleUpdateValue("Status")}
                  >
                    <Text
                      style={{
                        ...globalStyles.saveButtonText,
                        color: colors.ButtonTextColor,
                      }}
                    >
                      Update
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {selectedTab === "Invite contacts" && (
                <View>
                  <Text
                    style={{
                      ...globalStyles?.FS_16_FW_B,
                      color: colors.textColor,
                    }}
                  >
                    Invite Friends
                  </Text>
                  <Text style={{ color: colors.textColor }}>
                    Click below to invite your friends:
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ContactList", {
                        Item: Item,
                        InviteFriends: true,
                      })
                    }
                    style={{
                      marginTop: 10,
                      backgroundColor: colors.AppmainColor,
                      padding: 8,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.ButtonTextColor,
                        textAlign: "center",
                      }}
                    >
                      Invite
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        )}

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
                onPress={() => setModalVisible1(!!modalVisible1)}
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

                <View
                  style={{
                    flex: 1,
                  }}
                >
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
                  <Icon
                    name="paper-plane"
                    size={20}
                    color={colors.placeholderTextColor}
                    type="Entypo"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default GroupDetails;
