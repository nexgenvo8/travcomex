import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
  Linking,
  Share,
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
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
  postlist,
  PostTag,
  SendMessage,
  sharewithcontact,
  sharewithpublic,
  TweetShare,
  UpdateComment,
  WhatsAppShare,
  Profile_Detail,
  ShareSocialMedia,
} from "./baseURL/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { fetchContactList } from "./baseURL/ExperienceList";
import Colors from "./color";
import LikeIcon from "react-native-vector-icons/AntDesign";
import CommIcon from "react-native-vector-icons/FontAwesome";
import ImagePicker from "react-native-image-crop-picker";
import Icon from "../screen/Icons/Icons";
import globalStyles from "./GlobalCSS";
import RenderHTML from "react-native-render-html";
import ImageViewer from "react-native-image-zoom-viewer";
import moment from "moment";
import RNFS from "react-native-fs";
import Header from "./Header/Header";
import GlobalSearch from "./GlobalSearch";
import Toast, { showError, showSuccess } from "./components/Toast";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
} from "react-native-reanimated";
import CommonBottomSheet from "./components/CommonBottomSheet";
import { DrawerActions } from "@react-navigation/native";
import { fetchAndStoreUserProfile } from "../utils/profile";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import KeyboardAvoidingWrapper from "./components/KeyboardAvoidingWrapper";
import CommonLoader from "./components/CommonLoader";
import RenderHtml from "react-native-render-html";
import Pusher from "pusher-js";
import { useTheme } from "../theme/ThemeContext";
import { appIcon } from "./constants";

export default function ({ route, tabBarVisible }) {
  const { Item = {}, AdditionalData = [] } = route.params || {};
  const navigation = useNavigation();
  const { isDark, colors, toggleTheme } = useTheme();
  const flatListRef = useRef(null);
  const scrollViewRef = useRef(null);
  const screenWidth = Dimensions.get("window").width;
  const containerWidth = screenWidth - 40;
  const largeImageWidth = containerWidth * 0.65;
  const smallImageWidth = containerWidth * 0.35;
  const imageHeight = 250;
  const smallImageHeight = (imageHeight - 8) / 3;
  // const scrollY = useSharedValue(0);
  // const scrollHandler = useAnimatedScrollHandler({
  //   onScroll: event => {
  //     const currentOffset = event.contentOffset.y;
  //     if (currentOffset > scrollY.value && currentOffset > 50) {
  //       tabBarVisible.value = false;
  //     } else if (currentOffset < scrollY.value) {
  //       tabBarVisible.value = true;
  //     }
  //     scrollY.value = currentOffset;
  //   },
  // });
  // const animatedHeaderStyle = useAnimatedStyle(() => {
  //   return {
  //     height: withTiming(tabBarVisible.value ? 60 : 0, {duration: 300}),
  //     transform: [
  //       {
  //         translateY: withTiming(tabBarVisible.value ? 0 : -100, {
  //           duration: 300,
  //         }),
  //       },
  //     ],
  //     opacity: withTiming(tabBarVisible.value ? 1 : 0, {duration: 300}),
  //     overflow: 'hidden',
  //   };
  // });

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.scrollToTop) {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        navigation.setParams({ scrollToTop: false });
      }
    }, [route.params?.scrollToTop])
  );
  const commentSheetRef = useRef(null);
  const handleSheetChange = (index) => {
    console.log("Sheet changed to:", index);
  };
  const windowWidth = Dimensions.get("window").width;
  const [number, onChangeNumber] = useState("");
  const [number1, onChangeNumber1] = useState("");
  const [postText, setPostText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [passImageInModal, setPassImageInModal] = useState();
  const [selectedValue, setSelectedValue] = useState("Public");
  const [selectedValue1, setSelectedValue1] = useState("Share with Public");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesName, setImagesName] = useState([]);
  const [base64, setBase64] = useState([]);
  const [itemOfPost, setItemOfPost] = useState([]);
  const [itemOfPostForLike, setItemOfPostForLike] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [commentAdd, setCommentAdd] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userProfileData, setUserProfileData] = useState([]);
  const [postData, setPostData] = useState([]);
  const [deletePost, setDeletePost] = useState(false);
  const [likedPosts, setLikedPosts] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [deleteComment, setDeleteComment] = useState(false);
  const [deleteValue, setDeleteValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [commentCounts, setCommentCounts] = useState({});
  const [replyUserName, setReplyUserName] = useState("");
  const [commitID, setCommitID] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [postTextErr, setPostTextErr] = useState(false);
  const [modalVisibleImg, setModalVisibleImg] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [modalVisibleShare, setModalVisibleShare] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [showList, setShowList] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [extraImages, setExtraImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [isCommentSending, setIsCommentSending] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const isCommentEmpty = !number.trim();
  const isPostEmpty = !postText?.trim();
  const openImageModal = (imageUrl, index = 0) => {
    setModalImages([{ url: imageUrl }]);
    setModalIndex(index);
    setModalImageVisible(true);
  };
  const removeImage = (indexToRemove) => {
    const updated = images.filter((_, index) => index !== indexToRemove);
    setImages(updated);
  };
  const [initialLoading, setInitialLoading] = useState(true);
  const onShare = async () => {
    const payload = JSON.stringify({
      postId: passImageInModal?.id?.toString(),
      postType: passImageInModal?.PostType?.toString(),
    });
    console.log("Payload:", payload);
    try {
      const response = await fetch(`${baseUrl}${ShareSocialMedia}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: payload,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server responded with:", response.status, text);
        showError(`Server error: ${response.status}`);
        return;
      }
      const result = await response.json();
      console.log("API result:", result);
      if (result?.Status === 1 && result?.ShareUrl) {
        await Share.share({
          message: `Check this out: ${result.ShareUrl}`,
          url: result.ShareUrl,
          title: "Check this post on Vecospace",
        });
      } else {
        showError("Unable to generate shareable link.");
      }
    } catch (error) {
      showError(error.message || "Something went wrong");
    }
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
  const handleRefresh = () => {
    setPostData([]);
    setHasMoreData(true);
    setCurrentPage(1);
    fetchPosts(1, true);
  };
  const handleLoadMore = () => {
    if (isFirstLoad.current) return;
    if (loading || refreshing || initialLoading) return;
    if (!hasMoreData) return;
    const nextPage = currentPage + 1;
    fetchPosts(nextPage);
  };
  const fetchPosts = async (
    page = 1,
    isRefresh = false,
    isAfterPost = false
  ) => {
    if (loading && !isRefresh && !isAfterPost) return;
    if (!hasMoreData && !isRefresh && !isAfterPost) return;

    if (isRefresh) {
      setRefreshing(true);
    } else if (page === 1 && !isAfterPost) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const body = JSON.stringify({
        id: Item?.optionalId || Item?.id || "",
        status: 1,
        per_page: 20,
        postType: Item?.postType || " ",
        userId: userData?.User?.userId,
        page: page,
      });
      // console.log(body, 'bodybodybodybodybody');

      const response = await fetch(`${baseUrl}${postlist}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      const data = await response.json();
      if (response.ok) {
        if (data.Data && data.Data.length > 0) {
          setPostData((prev) =>
            isRefresh || page === 1 ? data.Data : [...prev, ...data.Data]
          );
          setHasMoreData(true);
          setCurrentPage(page);
        } else {
          setHasMoreData(false);
        }
      } else {
        showError("Error", data.message || "Failed to fetch posts");
      }
    } catch (error) {
      showError("Failed to fetch posts. Please try again later.");
      console.error("Fetch Error:", error);
    } finally {
      setInitialLoading(false);
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    if (isOpen2 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [isOpen2]);
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

  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (userData?.User?.userId) {
      console.log("👋 First load: fetching page 1");
      isFirstLoad.current = true;
      fetchPosts(1).finally(() => {
        setTimeout(() => {
          isFirstLoad.current = false;
        }, 500);
      });
    }
  }, [userData?.User?.userId]);

  useEffect(() => {
    if (Item?.id) {
      setPage(1);
      setPostData([]);
      fetchPosts(1);
    }
  }, [Item?.id]);

  const postAdd = async () => {
    if (!postText?.trim()) {
      setPostTextErr(true);
      return;
    }

    const userId = userData?.User?.userId;
    const userType = userData?.User?.userstype;
    if (userId && userType && postText) {
      try {
        const formData = new FormData();
        formData.append("userId", userId.toString());
        formData.append("groupId", "0");
        formData.append("shareType", selectedValue === "Public" ? "1" : "2");
        formData.append("postType", userType.toString());
        formData.append("postTitle", "");
        formData.append("postText", postText);

        if (images?.length > 0) {
          images.forEach((img, index) => {
            formData.append("images[]", {
              uri: img.uri,
              name: img.name || `image_${index}.jpg`,
              type: img.type || "image/jpeg",
            });
          });
        }

        if (selectedUsers?.length > 0) {
          const tagUserArray = selectedUsers.map((item) => item.UserId);
          formData.append("tagUser", JSON.stringify(tagUserArray));
        }

        const response = await fetch(`${baseUrl}${AddPost}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        const text = await response.text();
        console.log("Raw response text:", text);

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          throw new Error("Failed to parse response JSON");
        }

        if (response.ok) {
          console.log("Post added successfully:", data);
          await tagUsersToPost(data?.postId);
          setPostText("");
          setImages([]);
          setImagesName([]);
          setBase64([]);
          setSelectedValue("Public");
          setPage(1);
          setPostData([]);
          // fetchPosts(1);
          fetchPosts(1, false, true);
          setSelectedUsers([]);
        } else {
          console.log("API Error:", data);
          showError("Error", data.message || "Failed to add post");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    } else {
      console.log("❌ Missing required fields");
    }
  };
  const tagUsersToPost = async (postId) => {
    const tagUserIds = selectedUsers?.map((item) => item?.UserId);
    const Dta = { tagUser: tagUserIds, postId };
    console.log("Dta------->", Dta);
    try {
      const response = await fetch(`${baseUrl}${PostTag}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Dta),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Users tagged successfully:", result);
        showSuccess("Users tagged successfully");
      } else {
        console.log("Failed to tag users:", result);
      }
    } catch (error) {
      console.error("Tagging users failed:", error);
    }
  };
  const fetchAddLike = async ({ item }) => {
    if (
      !itemOfPostForLike ||
      !itemOfPostForLike.id ||
      !itemOfPostForLike.PostType
    ) {
      console.error("Missing postId or postType in item:", item);
      return;
    }
    try {
      const payload = JSON.stringify({
        postId: itemOfPostForLike.id,
        postType: itemOfPostForLike.PostType,
        userId: userData?.User?.userId,
      });
      const response = await fetch(`${baseUrl}${Addlike}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });
      console.log("Missing ");

      const data = await response.json();
      console.log("ADd Like Data ----", data);
      if (response.ok) {
        setItemOfPostForLike([]);
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (itemOfPostForLike) {
      fetchAddLike(itemOfPost);
    }
  }, [itemOfPostForLike]);

  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };
  useEffect(() => {
    UserValue();
  }, []);
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

  const options = ["Public", "My Contacts"];
  const options2 = [
    "Share with Public",
    "Share with My Contacts",
    "Share with Message",
    "Share To External Social Media",
  ];
  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleDropdown2 = () => setIsOpen2(!isOpen2);

  const selectOption = (option) => {
    setSelectedValue(option);
    setIsOpen(false);
  };
  const selectOption2 = (option) => {
    if (option == "Share with Message") {
      openModal();
    }
    setSelectedValue1(option);
    setIsOpen2(false);
  };
  useEffect(() => {
    if (itemOfPost) {
      fetchCommentList({
        pageNumber: 1,
        item: itemOfPost,
        refreshing: true,
      });
    }
  }, [refresh, itemOfPost, commentAdd, deletePost]);
  useEffect(() => {
    if (!itemOfPost) return;

    const pusher = new Pusher("6840a502dc1ebc6a81f5", {
      cluster: "ap2",
      encrypted: true,
    });

    const channel = pusher.subscribe("post-comments");
    channel.bind("comment-added", (data) => {
      // console.log('📥 Received CommentAdded:', data);
      if (data?.comment?.postId === itemOfPost.id) {
        fetchCommentList({
          pageNumber: 1,
          item: itemOfPost,
          refreshing: true,
        });
      }
    });

    pusher.connection.bind("error", (err) => {
      console.error("Pusher connection error:", err);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [itemOfPost]);

  const fetchCommentList = async ({
    pageNumber = 1,
    refreshing = false,
    item,
  }) => {
    if (!item || !item.id || !item.PostType) {
      return;
    }
    try {
      refreshing ? setIsRefreshing(true) : setIsLoadingMore(true);

      const response = await fetch(`${baseUrl}${listcomment}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: item.id,
          postType: item.PostType,
          page: pageNumber,
          per_page: 10,
        }),
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
    const Dta = {
      postId: itemOfPost.id,
      parentId: parentId,
      postType: itemOfPost.PostType,
      userId: userData?.User?.userId,
      commentText: number,
    };

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
            });

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
                setDeletePost(true);
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
  const handleDeletePost = async ({ item }) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this Post?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await fetch(`${baseUrl}${DeletePost}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: item?.id,
                }),
              });

              const data = await response.json();

              if (response.ok) {
                setPage(1);
                setPostData([]);
                fetchPosts(1);
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
  const toggleExpand = (index) => {
    setExpandedPosts((prev) => {
      const isCurrentlyExpanded = prev[index];
      const updated = { ...prev, [index]: !isCurrentlyExpanded };
      if (isCurrentlyExpanded && flatListRef.current) {
        setTimeout(() => {
          flatListRef.current.scrollToIndex({ index, animated: true });
        }, 100);
      }

      return updated;
    });
  };
  const renderItem = ({ item, index }) => {
    // console.log(item, 'itemitemitemitemitemitemitemitem');
    const isLiked = likedPosts[item?.id] ?? item?.IsLiked ?? false;
    const getTimeAgo = (dateString) => {
      const then = moment(dateString, "DD-MMM-YYYY, hh:mm:ssa");
      const now = moment();
      const diffSeconds = now.diff(then, "seconds");
      const diffMinutes = now.diff(then, "minutes");
      const diffHours = now.diff(then, "hours");
      const diffDays = now.diff(then, "days");
      const diffWeeks = now.diff(then, "weeks");
      const diffMonths = now.diff(then, "months");
      const diffYears = now.diff(then, "years");
      if (diffSeconds < 60) return `${diffSeconds}s ago`;
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffWeeks < 4) return `${diffWeeks}w ago`;
      if (diffMonths < 12) return `${diffMonths}mo ago`;
      return `${diffYears}y ago`;
    };

    const isExpanded = expandedPosts[index] || false;
    const isUserPost = item.UserId === userData?.User?.userId;
    const formatText = (text) => {
      if (!text) return "";
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
    const rawShortText = truncateText(item?.PostText || "");
    const shortFormattedText = formatText(rawShortText);
    return (
      <View
        style={{
          marginTop: 20,
          // marginHorizontal: 12,
          backgroundColor: colors.background,
          paddingTop: 8,
          paddingHorizontal: 12,
          borderBottomWidth: 2,
          borderColor: colors.AppmainColor,
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
                <Image
                  style={{ width: 12, height: 12, tintColor: colors.textColor }}
                  source={require("../assets/globelearth.png")}
                />{" "}
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
          {isUserPost && (
            <View
              style={{
                justifyContent: "space-evenly",
                alignItems: "flex-end",
                flex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => handleDeletePost({ item: item })}
              >
                <Icon
                  name="cross"
                  size={20}
                  color={colors.textColor}
                  type="Entypo"
                />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
        <View
          style={{
            borderTopWidth: 0.5,
            borderColor: colors.textinputbordercolor,
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
            contentWidth={windowWidth}
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
                {/* {commentCounts[item.id] ?? item.TotalComment} Comments */}
                {(commentCounts[item.id] !== undefined
                  ? commentCounts[item.id]
                  : item.TotalComment) || 0}{" "}
                Comment
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
                //item?.IsLiked || likedPosts[item?.id]
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
              // commentSheetRef.current?.open();
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
              setModalVisible(true);
              setPassImageInModal(item);
            }}
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
      </View>
    );
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
          <View style={{ flexShrink: 1, flex: 1 }}>
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
            </View>
            <TouchableOpacity
              onPress={() => {
                setReplyUserName(item?.UserDetail?.UserName);
                onChangeNumber(`@${item?.UserDetail?.UserName} `);
                setCommitID(item);
              }}
            >
              <Text style={{ paddingLeft: 20, color: colors.AppmainColor }}>
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
                      <Text
                        style={{
                          fontWeight: "700",
                          fontSize: 15,
                          color: colors.textColor,
                        }}
                      >
                        {item?.UserDetail?.UserName}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={{
                          fontSize: 13,
                          width: 200,
                          color: colors.textColor,
                        }}
                      >
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
              <Icon
                name="delete"
                size={20}
                color={colors.placeholderTextColor}
                type="MaterialCommunityIcons"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  const selectImages = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: "photo",
      compressImageQuality: 0.8,
      includeBase64: false,
    })
      .then((selectedImages) => {
        const imageFiles = selectedImages.map((image, index) => ({
          uri: image.path,
          name:
            image.path.substring(image.path.lastIndexOf("/") + 1) ||
            `image_${index}.jpg`,
          type: image.mime || "image/jpeg",
        }));

        setImages(imageFiles);
      })
      .catch((error) => {
        console.error("Image selection cancelled:", error);
      });
  };
  const handleSharePost = async () => {
    try {
      if (selectedValue1 === "Share To External Social Media") {
        onShare();
      } else {
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
          //   setModalVisible(!!modalVisible);
          setModalVisible(false);
          setPage(1);
          setPostData([]);
          fetchPosts(1);
        }
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };
  const openModal = () => {
    fetchContactList(userData);
    setModalVisibleShare(true);
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

  const toggleSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
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
  const handleTextChange = (value) => {
    setPostText(value);
    setPostTextErr(value.trim().length === 0);

    if (value.includes("@")) {
      setShowList(true);
    } else {
      setShowList(false);
    }
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
  if (initialLoading) {
    return <CommonLoader visible={true} />;
  }
  return (
    <SafeAreaView
      style={[
        globalStyles.SafeAreaView,
        { backgroundColor: colors.lightbackground },
      ]}
    >
      {/* <Animated.View
        style={[
          {
            zIndex: 10,
            backgroundColor: colors.background,
            marginHorizontal: 0,
            paddingTop: 0,
            justifyContent: 'space-evenly',
          },
          animatedHeaderStyle,
        ]}>
        {Item?.id ? (
          Item?.optionalId
        ) : !Item?.optionalId ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity
              hitSlop={20}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <Text
                style={{
                  color: colors.textColor,
                  fontWeight: 'bold',
                  fontSize: 27,
                }}>
                ☰
              </Text>
            </TouchableOpacity>

            <Image
              source={require('../assets/appicon.png')}
              style={{width: 30, height: 30}}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('GlobalSearch')}
              style={{
                ...styles.inputContainer,
                borderColor: colors.textinputbordercolor,
              }}>
              <Text
                style={{
                  ...styles.input,
                  color: colors.placeholderTextColor,
                }}>
                Search
              </Text>
              <TouchableOpacity
              //onPress={handleSearch}
              >
                <Icon
                  name="search"
                  size={20}
                  color={colors.placeholderTextColor}
                  type="MaterialIcons"
                />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
              <Icon
                name="chatbubbles"
                size={20}
                color={colors.textColor}
                type="Ionicons"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('NotificationsScreen')}>
              <Icon
                name="bell"
                size={20}
                color={colors.textColor}
                type="FontAwesome"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('KnowledgeHub')}>
              <Icon
                name="book"
                size={20}
                color={colors.textColor}
                type="FontAwesome"
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </Animated.View> */}
      <FlatList
        //Animated.FlatList
        ref={flatListRef}
        data={postData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        // onScroll={scrollHandler}
        // scrollEventThrottle={16}
        ListHeaderComponent={
          <>
            <View
              style={{
                ...globalStyles.MainView,
                marginHorizontal: 0,
                paddingTop: 10,
                backgroundColor: colors.background,
              }}
            >
              {Item?.optionalId || Item?.id ? (
                <Header title="Home" navigation={navigation} />
              ) : null}
              {Item?.id ? (
                Item?.optionalId
              ) : !Item?.optionalId ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <TouchableOpacity
                    hitSlop={20}
                    onPress={() =>
                      navigation.dispatch(DrawerActions.openDrawer())
                    }
                  >
                    <Text
                      style={{
                        color: colors.textColor,
                        fontWeight: "bold",
                        fontSize: 27,
                      }}
                    >
                      ☰
                    </Text>
                  </TouchableOpacity>
                  <Image source={appIcon} style={{ width: 30, height: 30 }} />

                  <TouchableOpacity
                    onPress={() => navigation.navigate("GlobalSearch")}
                    style={{
                      ...styles.inputContainer,
                      borderColor: colors.textinputbordercolor,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.input,
                        color: colors.placeholderTextColor,
                      }}
                    >
                      Search
                    </Text>
                    <TouchableOpacity
                    //onPress={handleSearch}
                    >
                      <Icon
                        name="search"
                        size={20}
                        color={colors.placeholderTextColor}
                        type="MaterialIcons"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Icon
                      name="chatbubbles"
                      size={20}
                      color={colors.textColor}
                      type="Ionicons"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("NotificationsScreen")}
                  >
                    <Icon
                      name="bell"
                      size={20}
                      color={colors.textColor}
                      type="FontAwesome"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("KnowledgeHub")}
                  >
                    <Icon
                      name="book"
                      size={20}
                      color={colors.textColor}
                      type="FontAwesome"
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
              <View style={{ padding: 12 }}>
                {!Item?.optionalId && !Item?.id ? (
                  <>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Profile")}
                      style={{
                        backgroundColor: colors.background,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={
                          userProfileData?.Data?.profilePhoto
                            ? { uri: userProfileData?.Data?.profilePhoto }
                            : require("../assets/placeholderprofileimage.png")
                        }
                        style={globalStyles.ImgUserProfile}
                      />
                      <View>
                        <Text
                          style={{
                            ...globalStyles?.FS_16_FW_B,
                            color: colors.textColor,
                          }}
                        >
                          {userProfileData?.Data?.firstName}{" "}
                          {userProfileData?.Data?.lastName}
                        </Text>

                        <Text
                          style={{
                            fontSize: 12,
                            color: colors.placeholderTextColor,
                            width: "76%",
                          }}
                        >
                          {userProfileData?.Data?.courseName} -{" "}
                          {userProfileData?.Data?.companyName}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {selectedUsers?.length > 0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          marginVertical: 10,
                        }}
                      >
                        {selectedUsers?.map((item, index) => (
                          <View
                            key={index}
                            style={globalStyles?.SelectTagViewMain}
                          >
                            <Text style={{ fontSize: 16, marginRight: 5 }}>
                              @{item?.UserName}
                            </Text>
                            <TouchableOpacity
                              onPress={() => handleRemoveUser(item)}
                              style={globalStyles?.SelectTagView}
                            >
                              <Text style={globalStyles?.FS_14_CW}>✖</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}

                    <TextInput
                      style={{
                        ...globalStyles.PostTextViewINPut,
                        textAlignVertical: "top",
                        borderColor: postTextErr ? "red" : "gray",
                        color: colors.textColor,
                        borderColor: colors.textinputbordercolor,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}
                      onChangeText={handleTextChange}
                      value={postText}
                      placeholder="What's in your mind?"
                      keyboardType="default"
                      multiline
                      placeholderTextColor={colors.placeholderTextColor}
                    />
                    {showList && contacts.length > 0
                      ? contacts.map((item, index) => {
                          return (
                            <TouchableOpacity
                              key={index}
                              onPress={() => handleUserSelect(item)}
                              style={{
                                ...globalStyles.ContalitTag,
                                backgroundColor: colors.background,
                                borderColor: colors.textinputbordercolor,
                              }}
                            >
                              <Image
                                style={globalStyles.TagImg}
                                source={
                                  item?.ProfilePhoto
                                    ? { uri: item?.ProfilePhoto }
                                    : require("../assets/placeholderprofileimage.png")
                                }
                              />
                              <View style={{ flex: 1, padding: 10 }}>
                                <Text style={globalStyles?.FS_16_FW_400}>
                                  {item?.UserName}
                                </Text>
                                <Text
                                  style={{
                                    color: Colors.placeholdercolor,
                                    marginBottom: 5,
                                  }}
                                >
                                  at {item?.CompanyName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })
                      : null}
                    {images?.length > 0 ? (
                      <>
                        <TouchableOpacity
                          onPress={() => setImages([])}
                          style={{
                            alignSelf: "flex-end",
                            paddingVertical: 5,
                            padding: 10,
                          }}
                        >
                          <Icon
                            name="cross"
                            size={20}
                            color={colors.textColor}
                            type="Entypo"
                          />
                        </TouchableOpacity>
                        <View style={styles.container}>
                          <View style={styles.row}>
                            <Image
                              source={{ uri: images[0].uri }}
                              style={[
                                styles.firstImage,
                                { width: images.length === 1 ? "100%" : "80%" },
                              ]}
                            />
                            <View style={globalStyles.smallImagesColumn}>
                              {images.slice(1, 3).map((image, index) => (
                                <Image
                                  key={index}
                                  source={{ uri: image.uri }}
                                  style={styles.smallImage}
                                />
                              ))}
                              {images.length > 3 && (
                                <TouchableOpacity
                                  onPress={() => {
                                    const formattedImages = images.map(
                                      (img) => ({
                                        url: img.uri,
                                      })
                                    );
                                    setModalImages(formattedImages);
                                    setModalIndex(3);
                                    setModalImageVisible(true);
                                  }}
                                  style={globalStyles.moreContainer}
                                >
                                  <Text style={globalStyles.moreText}>
                                    +{images.length - 3} more
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        </View>
                      </>
                    ) : null}
                    <View
                      style={{
                        marginTop: 15,
                        borderTopWidth: 1,
                        borderBottomWidth: 1.5,
                        borderBottomColor: colors.AppmainColor,
                        borderColor: colors.textinputbordercolor,
                        paddingBottom: 10,
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 10,
                          justifyContent: "space-between",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            flexDirection: "row",
                            borderWidth: 1,
                            padding: 5,
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            borderColor: colors.textinputbordercolor,
                          }}
                          onPress={selectImages}
                        >
                          <Icon
                            name="image"
                            size={15}
                            color={colors.textColor}
                            type="Entypo"
                            style={{ marginRight: 10 }}
                          />

                          <Text style={{ color: colors.textColor }}>
                            Post Picture
                          </Text>
                        </TouchableOpacity>

                        <View
                          style={{
                            flexDirection: "row",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              borderWidth: 1,
                              borderRadius: 8,
                              alignItems: "center",
                              paddingHorizontal: 8,
                              // marginRight: 10,
                              right: 10,
                              borderColor: colors.textinputbordercolor,
                            }}
                            onPress={toggleDropdown}
                          >
                            <Text
                              style={{
                                ...styles.text,
                                color: colors.textColor,
                              }}
                            >
                              {selectedValue}
                            </Text>
                            <Icon
                              name="down"
                              size={15}
                              color={colors.textColor}
                              type="AntDesign"
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            disabled={isPostEmpty || isPosting}
                            onPress={async () => {
                              if (isPostEmpty || isPosting) return;

                              setIsPosting(true);
                              setLoading(true);

                              try {
                                await postAdd();
                              } catch (error) {
                                console.error("Post error:", error);
                              } finally {
                                setIsPosting(false);
                                setLoading(false);
                              }
                            }}
                            style={{
                              backgroundColor: colors.AppmainColor,
                              padding: 5,
                              borderRadius: 8,
                              paddingHorizontal: 8,
                              // right: 10,
                              opacity: isPostEmpty || isPosting ? 0.6 : 1,
                            }}
                          >
                            {isPosting ? (
                              <ActivityIndicator size="small" color="#fff" />
                            ) : (
                              <Text
                                style={{
                                  color: colors.ButtonTextColor,
                                  fontWeight: "500",
                                }}
                              >
                                Post
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                      {isOpen && (
                        <View
                          style={{
                            ...globalStyles.dropdownListShare,
                            borderColor: colors.textinputbordercolor,
                            backgroundColor: colors.background,
                          }}
                        >
                          {options.map((option, index) => (
                            <TouchableOpacity
                              key={index}
                              style={{
                                ...globalStyles.dropdownItemShare,
                                borderBottomColor: colors.textinputbordercolor,
                              }}
                              onPress={() => selectOption(option)}
                            >
                              <Text
                                numberOfLines={1}
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
                  </>
                ) : null}
              </View>
            </View>
          </>
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.AppmainColor} />
          ) : !hasMoreData ? (
            <Text
              style={{
                textAlign: "center",
                marginVertical: 20,
                color: colors.textColor,
              }}
            >
              No more posts to show
            </Text>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
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
            }}
          >
            <TouchableOpacity
              style={{ alignItems: "flex-end" }}
              onPress={() => setModalVisible(false)}
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
            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={scrollViewRef}
            >
              <TextInput
                style={{
                  ...styles.input,
                  borderWidth: 1,
                  borderRadius: 4,
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
              {/* {selectedValue1 == 'Share To  External Social Media' ? (
                <View style={{}}>
                  <TouchableOpacity
                    style={globalStyles.saveButton}
                    onPress={() => onShare()}>
                    <Text style={globalStyles.saveButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              ) : null} */}
              <View>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    borderWidth: 1,
                    borderRadius: 4,
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
                  <Icon
                    name="down"
                    size={15}
                    color={colors.textColor}
                    type="AntDesign"
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

            <Modal
              visible={modalVisibleShare}
              transparent
              animationType="slide"
            >
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
                      hitSlop={20}
                      onPress={() => {
                        setModalVisibleShare(false), setSelectedUsers([]);
                      }}
                    >
                      <Icon
                        name="cross"
                        size={15}
                        color={colors.textColor}
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
                    }}
                    onChangeText={handleContactSearch}
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                  <View style={{ flex: 1 }}>
                    {loadingContacts ? (
                      <ActivityIndicator
                        size="large"
                        color={colors.AppmainColor}
                        style={{ marginTop: 30 }}
                      />
                    ) : filteredContacts.length === 0 ? (
                      <Text
                        style={{
                          textAlign: "center",
                          padding: 20,
                          color: colors.placeholderTextColor,
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
                                  ? colors.AppmainColor
                                  : colors.placeholderTextColor,
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
                  </View>
                  <TouchableOpacity
                    onPress={async () => {
                      for (const userId of selectedUsers) {
                        await sendMessage(userId, passImageInModal);
                      }
                      setSelectedUsers([]);
                      setModalVisibleShare(false);
                      // setModalVisible(!!modalVisible);
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
        {/* <CommonBottomSheet ref={commentSheetRef} onChange={handleSheetChange}> */}

        <KeyboardAvoidingWrapper offset={40}>
          <View style={globalStyles.centeredView}>
            <View
              style={{
                ...globalStyles.modalView,
                flex: 0.8,
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
                  color={colors.textColor}
                  type="Entypo"
                />
              </TouchableOpacity>
              <View style={{ alignItems: "center", backgroundColor: "" }}>
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

              <View
                style={{
                  ...globalStyles.ViewCommentImg,
                  borderColor: colors.textinputbordercolor,
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
                  // style={globalStyles.textInputComment}
                  onChangeText={onChangeNumber}
                  value={number}
                  placeholder="Write your Comment"
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
                    color={colors.placeholderTextColor}
                    type="Entypo"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingWrapper>
        {/* </CommonBottomSheet> */}
      </Modal>

      {/* <CommonBottomSheet ref={commentSheetRef} onChange={handleSheetChange}>
        <View
          style={{
            backgroundColor: colors.modelBackground,
            padding: 20,
          }}>
          <TouchableOpacity
            onPress={() => commentSheetRef.current?.close()}
            style={{alignSelf: 'flex-end'}}>
            <Icon
              name="cross"
              size={25}
              color={colors.textColor}
              type="Entypo"
            />
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                ...globalStyles.commentTitle,
                color: colors.textColor,
              }}>
              Comments
            </Text>
          </View>
          <FlatList
            data={[...commentList].reverse()}
            renderItem={renderItem1}
            keyExtractor={item => item.id?.toString()}
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
                  style={{marginVertical: 20}}
                  size="small"
                  color="#888"
                />
              ) : null
            }
            contentContainerStyle={{
              paddingBottom: 30,
              paddingTop: 10,
              paddingHorizontal: 10,
            }}
          />
          <View
            style={{
              ...globalStyles.ViewCommentImg,
              borderColor: colors.textinputbordercolor,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Image
              source={
                userProfileData?.Data?.profilePhoto
                  ? {uri: userProfileData?.Data?.profilePhoto}
                  : require('../assets/placeholderprofileimage.png')
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
              onChangeText={onChangeNumber}
              value={number}
              placeholder="Write your Comment"
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
                if (!number.trim()) {
                  showError('Comment cannot be empty.');
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
                  console.error('Send error:', error);
                } finally {
                  setIsCommentSending(false);
                }
              }}>
              <Icon
                name="paper-plane"
                size={20}
                color={colors.placeholderTextColor}
                type="Entypo"
              />
            </TouchableOpacity>
          </View>
        </View>
      </CommonBottomSheet> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 30,
    paddingHorizontal: 10,
    fontSize: 14,
  },
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
  text: {
    fontSize: 14,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
    width: "78%",
    height: 495,
    marginRight: 10,
    borderRadius: 8,
  },
  smallImage: {
    width: 93,
    height: 93,
    marginBottom: 10,
    borderRadius: 8,
  },

  modalContainerimg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonimg: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  inputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    width: "50%",
    marginHorizontal: 8,
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
});
