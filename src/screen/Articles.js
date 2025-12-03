import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  InteractionManager,
} from "react-native";
import RenderHTML from "react-native-render-html";
import Colors from "./color";
import Header from "./Header/Header";
import { baseUrl, deletearticle, Listarticle } from "./baseURL/api";
import globalStyles from "./GlobalCSS";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import Icon1 from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "./Icons/Icons";
import CommonLoader from "./components/CommonLoader";
import { showError } from "./components/Toast";
import { useTheme } from "../theme/ThemeContext";

const Articles = ({ navigation, route }) => {
  const { Item = {}, GlobalSearch = [] } = route.params || {};
  console.log("GlobalSearch --->", GlobalSearch?.postId);
  const windowWidth = Dimensions.get("window").width;
  const { isDark, colors, toggleTheme } = useTheme();
  // const flatListRef = useRef(null);
  // const scrollOffset = useRef(0);
  const [articlesList, setArticlesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const handleScrollToEnd = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticles(nextPage);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchArticles(1, true);
    setRefreshing(false);
  };
  // useFocusEffect(
  //   useCallback(() => {
  //     if (flatListRef.current && scrollOffset.current > 0) {
  //       flatListRef.current.scrollToOffset({
  //         offset: scrollOffset.current,
  //         animated: false,
  //       });
  //     }
  //   }, []),
  // );

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
      setArticlesList([]);
      setHasMore(true);
      fetchArticles(1);
    }, [])
  );
  const fetchArticles = async (pageNum = 1, force = false) => {
    if (!force && (loading || !hasMore)) return;

    if (pageNum === 1) {
      setInitialLoading(true);
    }
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}${Listarticle}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id:
            Item?.optionalId ||
            GlobalSearch?.postId?.toString() ||
            GlobalSearch?.id ||
            "",
          userId: userData?.User?.userId,
          search: "",
          per_page: 20,
          page: pageNum,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (pageNum === 1) {
          setArticlesList(data?.Data || []);
        } else {
          setArticlesList((prevList) => [...prevList, ...(data?.Data || [])]);
        }
        setHasMore((data?.Data?.length || 0) === 20);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
      if (pageNum === 1) {
        setInitialLoading(false);
      }
    }
  };

  const handleDeleteComment = (item) => {
    console.log("item", item);
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this Article?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await fetch(`${baseUrl}${deletearticle}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: item,
                }),
              });

              const data = await response.json();

              if (response.ok) {
                setArticlesList((prevList) =>
                  prevList.filter((item) => item.ArticleId !== item.ArticleId)
                );

                fetchArticles(1);
              } else {
                showError(
                  "Failed to delete the Article. Please try again later."
                );
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
  const truncateText = (html, percentage) => {
    const plainText = html.replace(/<\/?[^>]+(>|$)/g, "");
    const truncatedLength = Math.floor(plainText.length * percentage);
    const truncatedText = plainText.substring(0, truncatedLength);
    return `<p>${truncatedText}...</p>`;
  };
  const renderItem = ({ item, index }) => {
    const shortText = truncateText(
      item?.PostText || "<p>No content available.</p>",
      0.25
    );
    return (
      <TouchableOpacity
        onPress={() => {
          const additionalData = articlesList.slice(index + 1, index + 6);
          navigation.navigate("ArticlesList", {
            Item: item,
            AdditionalData: additionalData,
          });
        }}
        style={{
          backgroundColor: colors.textinputBackgroundcolor,
          borderRadius: 10,
          marginVertical: 10,
          padding: 10,
          width: screenWidth - 20,
          alignSelf: "center",
        }}
      >
        {userData?.User?.userId === item.UserDetail?.UserId && (
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
                navigation.navigate("ArticleAdd", {
                  Item: item,
                  onGoBack: () => fetchArticles(1, true),
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

            <TouchableOpacity
              onPress={() => handleDeleteComment(item.ArticleId)}
            >
              <Icon
                name="delete"
                size={17}
                color={colors.placeholderTextColor}
                type="MaterialCommunityIcons"
              />
            </TouchableOpacity>
          </View>
        )}

        {item.Images?.[0] && (
          <Image
            source={{ uri: item.Images?.[0]?.PostImage }}
            style={{
              width: screenWidth - 40,
              height: 200,
              resizeMode: "cover",
              borderRadius: 10,
              alignSelf: "center",
            }}
          />
        )}

        <View
          style={{
            flexDirection: "row",
            padding: 5,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: colors.textColor }}>
            {item.PostTitle}
          </Text>
        </View>

        <View style={{ padding: 5 }}>
          <Text style={{ fontSize: 13, color: colors.placeholderTextColor }}>
            by {item.UserDetail?.UserName} - {item.PublishedTime}
          </Text>

          {!item.Images?.[0] && (
            <RenderHTML
              contentWidth={screenWidth - 40}
              source={{ html: shortText }}
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

  if (initialLoading) {
    return <CommonLoader visible={true} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Travel Blogs" navigation={navigation} />
      <View
        style={{
          flex: 1,
          // backgroundColor: Colors.lite_gray
        }}
      >
        <FlatList
          // ref={flatListRef}
          data={articlesList}
          keyExtractor={(item, index) =>
            item.ArticleId?.toString() ?? index.toString()
          }
          // onScroll={event => {
          //   scrollOffset.current = event.nativeEvent.contentOffset.y;
          // }}
          // scrollEventThrottle={16}
          renderItem={renderItem}
          onEndReached={handleScrollToEnd}
          onEndReachedThreshold={0.2}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListHeaderComponent={
            <View
              style={{
                ...globalStyles.ArticlesListView,
                backgroundColor: colors.textinputBackgroundcolor,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: colors.textColor,
                  }}
                >
                  Travel Blogs
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("ArticleAdd")}
                style={{
                  ...globalStyles.JoinArticle,
                  backgroundColor: colors.AppmainColor,
                }}
              >
                <Icon1
                  name="plus"
                  size={20}
                  color={colors.ButtonTextColor}
                  style={{ paddingHorizontal: 5 }}
                />
                <Text
                  style={{
                    ...globalStyles.JoinText,
                    color: colors.ButtonTextColor,
                  }}
                >
                  Travel Blogs
                </Text>
              </TouchableOpacity>
            </View>
          }
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                size="large"
                color={colors.AppmainColor}
                style={{ marginVertical: 20 }}
              />
            ) : !hasMore ? (
              <Text
                style={{
                  textAlign: "center",
                  color: colors.placeholderTextColor,
                  marginVertical: 20,
                }}
              >
                No more Travel Blogs
              </Text>
            ) : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
});

export default Articles;
