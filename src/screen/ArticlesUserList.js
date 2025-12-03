import React, { useEffect, useState } from "react";
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
} from "react-native";

import Colors from "./color";
import Header from "./Header/Header";
import { baseUrl, deletearticle, Listarticle } from "./baseURL/api";
import globalStyles from "./GlobalCSS";
import { useIsFocused } from "@react-navigation/native";
import Icon1 from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showError } from "./components/Toast";
import { useTheme } from "../theme/ThemeContext";

const ArticlesUserList = ({ navigation, route }) => {
  const { Item = {}, AdditionalData = [] } = route.params || {};
  const { isDark, colors, toggleTheme } = useTheme();
  const isFocused = useIsFocused();
  const [articlesList, setArticlesList] = useState([]);
  console.log("articlesList --------- >>>>>>>>>", Item);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const windowWidth = Dimensions.get("window").width;
  const [userData, setUserData] = useState([]);
  console.log(userData?.User?.userId);

  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };

  useEffect(() => {
    UserValue();
  }, []);
  const fetchArticles = async (pageNum = 1) => {
    if (loading) return; // Prevent multiple simultaneous requests
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}${Listarticle}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "",
          userId: Item.userId,
          search: "",
          per_page: 20,
          page: pageNum, // Pass the page number
          entityName: "self",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setArticlesList((prevList) => [...prevList, ...(data?.Data || [])]);
        setHasMore(data?.Data.length > 0);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch articles when the screen is focused
  useEffect(() => {
    if (isFocused) {
      setHasMore(true); // Reset hasMore to true
      fetchArticles(1); // Reload data from page 1
    }
  }, [isFocused]);

  const handleScrollToEnd = () => {
    if (!loading && hasMore) {
      const nextPage = Math.ceil(articlesList.length / 5) + 1;
      fetchArticles(nextPage); // Fetch the next page
    }
  };
  const handleDeleteComment = (item) => {
    console.log("item", item);
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this Article?",
      [
        {
          text: "No", // If No is pressed, close the alert
          style: "cancel",
        },
        {
          text: "Yes", // If Yes is pressed, proceed with deletion
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
      { cancelable: false } // This prevents closing the alert by tapping outside
    );
  };

  const renderArticles = () => {
    return articlesList.map((item, index) => (
      <TouchableOpacity
        onPress={() => {
          const additionalData = articlesList.slice(index + 1, index + 6);
          navigation.navigate("ArticlesList", {
            Item: item,
            AdditionalData: additionalData, // Pass additional data
          });
        }}
        key={index}
        style={{
          backgroundColor: colors.textinputBackgroundcolor,
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Image
          source={{
            uri:
              item.Images?.[0]?.PostImage || "https://via.placeholder.com/150",
          }}
          style={{
            width: windowWidth - 40,
            height: 200,
            resizeMode: "cover",
            borderRadius: 10,
            alignSelf: "center",
          }}
        />
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
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>
        <Header title="Travel Blogs" navigation={navigation} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={styles.listContainer}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } =
              nativeEvent;

            if (
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - 20
            ) {
              handleScrollToEnd();
            }
          }}
          scrollEventThrottle={400}
        >
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
                size={17}
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

          <View
            style={{
              ...globalStyles.ArticlesListView,
              backgroundColor: colors.textinputBackgroundcolor,
            }}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  ...globalStyles.ViewUserDetils,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Image
                  style={globalStyles.ViewUserDetilsIMG}
                  source={{
                    uri: Item?.profilePhoto,
                  }}
                />
                <View
                  style={{
                    marginLeft: 10,
                    flexShrink: 1,
                  }}
                >
                  <Text style={{ fontSize: 15, color: colors.textColor }}>
                    {Item?.firstName} {Item?.lastName}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: colors.placeholderTextColor }}
                  >
                    {Item?.jobTitle} at {Item?.companyName}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {renderArticles()}

          {loading && (
            <ActivityIndicator
              style={{ marginVertical: 20 }}
              size="large"
              color={colors.AppmainColor}
            />
          )}

          {!hasMore && (
            <Text
              style={{
                textAlign: "center",
                color: colors.placeholderTextColor,
                marginVertical: 20,
              }}
            >
              No more Travel Blogs
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
});

export default ArticlesUserList;
