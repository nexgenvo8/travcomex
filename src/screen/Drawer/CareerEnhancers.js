import React, { useEffect, useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  StyleSheet,
  ImageBackground,
} from "react-native";
import Colors from "../color";
import Header from "../Header/Header";
import globalStyles from "../GlobalCSS";
import Icon from "../Icons/Icons";
import {
  baseUrl,
  contactList,
  ListCareereBusiness,
  ListKnowledgeHub,
  SendMessage,
} from "../baseURL/api";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";
import CommonLoader from "../components/CommonLoader";
import { useTheme } from "../../theme/ThemeContext";
import {
  careerEnhancersImage,
  universityFullName,
  universityName,
} from "../constants";

const CareerEnhancers = ({ navigation, route }) => {
  const { Item = {}, Type = "", ShareVal = {} } = route.params || {};
  console.log("Item --->", Item);
  const { isDark, colors, toggleTheme } = useTheme();
  const isFocused = useIsFocused();
  const [selected, setSelected] = useState("all");
  const [knowlwdgeList, setKnowlwdgeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };

  useEffect(() => {
    UserValue();
  }, []);

  useEffect(() => {
    setPage(1);
    setKnowlwdgeList([]);
    knowlwdgeHubList(1);
  }, [isFocused, selected]);

  const knowlwdgeHubList = async (pageNum) => {
    if (loading || !hasMoreData) return;
    setLoading(true);
    setInitialLoading(true);
    try {
      const response = await fetch(`${baseUrl}${ListCareereBusiness}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selected === "my" ? userData?.User?.userId : "",
          CompanyTypeId: "",
          per_page: 20,
          page: 1,
        }),
      });

      const data = await response.json();
      if (data?.Data?.length > 0) {
        setKnowlwdgeList((prev) => [...prev, ...data.Data]);
        setPage(pageNum);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };
  const handleLoadMore = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50) {
      knowlwdgeHubList(page + 1);
    }
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EventDetails", {
            Career: item,
          })
        }
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderColor: colors.textinputbordercolor,
          flexDirection: "row",
        }}
      >
        <View>
          <Image
            source={
              item.FileUploaded[item.FileUploaded.length - 1]?.Image
                ? {
                    uri: item.FileUploaded[item.FileUploaded.length - 1]?.Image,
                  }
                : require("../../assets/noimageplaceholder.png")
            }
            style={{
              backgroundColor: Colors?.lite_gray,
              width: 90,
              height: 90,
              marginRight: 10,
            }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: colors.AppmainColor,
            }}
          >
            {item.CompanyBusinessName}
          </Text>
          <Text style={{ color: colors.textColor }}>
            {item.ShortDescription}
          </Text>
          <Text style={{ color: colors.textColor }}>
            {item.CompleteAddress}
          </Text>
        </View>
      </TouchableOpacity>
    );
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
      <Header title="Industry Service Providers" navigation={navigation} />
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleLoadMore}
          scrollEventThrottle={400}
        >
          <ImageBackground
            source={careerEnhancersImage}
            resizeMode="contain"
            style={{
              width: "auto",
              height: 155,
            }}
          ></ImageBackground>

          {/* Clickable Sections */}
          <View style={globalStyles.flexRow}>
            <TouchableOpacity
              style={[
                globalStyles.optionBox,
                { backgroundColor: colors.textinputBackgroundcolor },
                selected === "all" && { backgroundColor: colors.AppmainColor },
              ]}
              onPress={() => setSelected("all")}
            >
              <Text
                style={{
                  ...globalStyles.optionText,
                  color:
                    selected === "all"
                      ? colors.ButtonTextColor
                      : colors.textColor,
                }}
              >
                All Business Pages
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                globalStyles.optionBox,
                { backgroundColor: colors.textinputBackgroundcolor },
                selected === "my" && { backgroundColor: colors.AppmainColor },
              ]}
              onPress={() => setSelected("my")}
            >
              <Text
                style={{
                  ...globalStyles.optionText,
                  color:
                    selected === "my"
                      ? colors.ButtonTextColor
                      : colors.textColor,
                }}
              >
                My Business Page
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              ...globalStyles.saveButton,
              margin: 10,
              paddingVertical: 10,
              backgroundColor: colors.AppmainColor,
            }}
            onPress={() => navigation.navigate("AddCareer")}
          >
            <Text
              style={{
                ...globalStyles.saveButtonText,
                color: colors.ButtonTextColor,
              }}
            >
              Create Business Page
            </Text>
          </TouchableOpacity>

          <View
            style={{
              ...styles?.VecoTitle,
              borderColor: colors.textinputbordercolor,
              backgroundColor: colors.textinputBackgroundcolor,
            }}
          >
            <Text
              style={{
                ...globalStyles.headlineText,
                color: colors.AppmainColor,
                flexShrink: 1,
              }}
            >
              Establish your business presence on {universityFullName}, today.
            </Text>
          </View>

          <View
            style={{
              ...globalStyles.ViewINter1,
              borderWidth: 1,
              borderColor: colors.textinputbordercolor,
            }}
          >
            <Text
              style={{ fontSize: 17, flexShrink: 1, color: colors.textColor }}
            >
              The benefits for creating a Business Page on {universityFullName}
            </Text>
          </View>

          {/* Bullet Points */}
          <View style={styles.bulletRow}>
            <Icon
              name="check"
              size={20}
              color={colors.AppmainColor}
              style={{ margin: 10 }}
            />
            <Text style={{ ...styles.bulletText, color: colors.textColor }}>
              {universityName} will provide interactive sessions with Career
              Enhancing experts.
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Icon
              name="check"
              size={20}
              color={colors.AppmainColor}
              style={{ margin: 10 }}
            />
            <View>
              <Text style={{ ...styles.bulletTitle, color: colors.textColor }}>
                Skills Enhancement Courses will help:
              </Text>
              <Text style={{ ...styles.bulletText, color: colors.textColor }}>
                Change or grow your position and need to refresh your skills.
              </Text>
            </View>
          </View>

          <View style={styles.bulletRow}>
            <Icon
              name="check"
              size={20}
              color={colors.AppmainColor}
              style={{ margin: 10 }}
            />
            <View>
              <Text style={{ ...styles.bulletTitle, color: colors.textColor }}>
                Professional Development Courses will help:
              </Text>
              <Text style={{ ...styles.bulletText, color: colors.textColor }}>
                Plan for and get the career you want.
              </Text>
            </View>
          </View>

          <View
            style={{
              ...styles.bulletRow,
              justifyContent: "space-between",
            }}
          >
            <View style={{ padding: 10 }}>
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: "700",
                  color: colors.textColor,
                }}
              >
                {selected == "my"
                  ? "My Industry pages"
                  : "Featured Industry pages"}
              </Text>
            </View>
          </View>
          {knowlwdgeList?.map((item, index) => renderItem({ item, index }))}
          {loading && (
            <ActivityIndicator size="large" color={colors.AppmainColor} />
          )}
          {!hasMoreData && (
            <Text
              style={{
                textAlign: "center",
                marginVertical: 10,
                color: colors.placeholderTextColor,
              }}
            >
              No more posts to show
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  optionBox: {
    flex: 1,
    padding: 10,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  optionText: {
    fontSize: 17,
    fontWeight: "700",
  },
  bulletRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    padding: 10,
  },
  bulletTitle: {
    fontWeight: "700",
    fontSize: 15,
  },
  bulletText: {
    width: "80%",
    flexShrink: 1,
    fontSize: 15,
  },
  VecoTitle: {
    // backgroundColor: 'white',
    borderWidth: 1,
    // borderColor: Colors.borderColor,
    padding: 10,
    justifyContent: "center",
  },
});

export default CareerEnhancers;
