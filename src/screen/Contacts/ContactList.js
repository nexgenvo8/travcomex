import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
} from "react-native";
import {
  baseUrl,
  contactList,
  removecontact,
  SentJoinGroup,
} from "../baseURL/api";
import Colors from "../color";
import globalStyles from "../GlobalCSS";
import Header from "../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "../Icons/Icons";
import { showSuccess } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";

const ContactList = ({ navigation, route }) => {
  const { Item = {}, InviteFriends = false } = route.params || {};
  const { isDark, colors, toggleTheme } = useTheme();
  const [userData, setUserData] = useState(null);
  const [knownPeopleData, setKnownPeopleData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isFetching = useRef(false);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchUserData = async () => {
      const userDta = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    };
    fetchUserData();
  }, []);
  // useEffect(() => {
  //   if (Item && userData?.User?.userId) {
  //     fetchContactList(1, true);
  //   }
  // }, [Item, userData?.User?.userId]);
  const hasFetchedOnce = useRef(false);
  useEffect(() => {
    if (Item && userData?.User?.userId && !hasFetchedOnce.current) {
      hasFetchedOnce.current = true;
      fetchContactList(1, true);
    }
  }, [Item, userData?.User?.userId]);

  const handleLoadMore = () => {
    if (!loading && hasMoreData && !isFetching.current) {
      fetchContactList(page);
    }
  };

  const handleRefresh = () => {
    if (!refreshing) {
      setRefreshing(true);
      setPage(1);
      setHasMoreData(true);
      fetchContactList(1, true);
    }
  };

  const renderFooter = () => {
    if (!loading && !refreshing) return null;
    return (
      <ActivityIndicator
        size="large"
        color={colors.AppmainColor}
        style={{ marginVertical: 10 }}
      />
    );
  };

  const fetchContactList = async (pageNumber = 1, isRefresh = false) => {
    if (loading || !hasMoreData || isFetching.current) return;

    setLoading(true);
    isFetching.current = true;

    const payload = JSON.stringify({
      userId: Item?.UserId ?? userData?.User?.userId,
      groupId: Item?.id || "",
      page: pageNumber,
      per_page: PAGE_SIZE,
    });

    try {
      const response = await fetch(`${baseUrl}${contactList}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server returned error:", response.status, errorText);

        if (response.status === 429) {
          // Retry after a short delay (basic backoff strategy)
          setTimeout(() => {
            fetchContactList(pageNumber, isRefresh);
          }, 2000); // 2-second delay
        }

        return;
      }

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("JSON parse error:", e, text);
        return;
      }

      const newData = data?.DataList || [];

      if (pageNumber === 1) {
        setKnownPeopleData(newData);
      } else {
        setKnownPeopleData((prevData) => [...prevData, ...newData]);
      }

      setHasMoreData(newData.length === PAGE_SIZE);
      setPage(pageNumber + 1);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFetching.current = false;
    }
  };

  // const fetchContactList = async (pageNumber = 1, isRefresh = false) => {
  //   if (loading || !hasMoreData) return;

  //   setLoading(true);
  //   isFetching.current = true;

  //   const payload = JSON.stringify({
  //     userId: Item?.UserId ? Item?.UserId : userData?.User?.userId,
  //     groupId: Item?.id || '',
  //     page: pageNumber,
  //     per_page: PAGE_SIZE,
  //   });
  //   //console.log(payload, 'payloadpayloadpayloadpayloadpayload');

  //   try {
  //     const response = await fetch(`${baseUrl}${contactList}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: payload,
  //     });

  //     const text = await response.text();
  //     console.log('Raw response:', text);

  //     if (!response.ok) {
  //       console.error('Server returned error:', response.status, text);
  //       return;
  //     }

  //     let data;
  //     try {
  //       data = JSON.parse(text);
  //     } catch (e) {
  //       console.error('JSON parse error:', e, text);
  //       return;
  //     }

  //     const newData = data?.DataList || [];

  //     if (pageNumber === 1) {
  //       setKnownPeopleData(newData);
  //     } else {
  //       setKnownPeopleData(prevData => [...prevData, ...newData]);
  //     }

  //     setHasMoreData(newData.length === PAGE_SIZE);
  //     setPage(pageNumber + 1);
  //   } catch (error) {
  //     console.error('Fetch Error:', error);
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //     isFetching.current = false;
  //   }
  // };

  const removeContact = async ({ item }) => {
    console.log("item?.UserId", item?.UserId);
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this Contact?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await fetch(`${baseUrl}${removecontact}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  removeBy: userData?.User?.userId,
                  removeTo: item?.UserId,
                }),
              });
              const data = await response.json();
              if (response.ok) {
                console.log("Deleted contact successfully:", data);
                setKnownPeopleData((prevData) =>
                  prevData.filter((contact) => contact.id !== item.id)
                );
              } else {
                console.error(
                  "Failed to delete contact:",
                  response.status,
                  data
                );
              }
            } catch (error) {
              console.error("Fetch Error delete contact:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const renderContacts = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          item.IsBlocked === false
            ? navigation.navigate("ProfileDetails", { Item: item })
            : null
        }
        style={{
          flexDirection: "row",
          padding: 10,
          marginHorizontal: 10,
          borderBottomWidth: 0.5,
          alignItems: "center",
          position: "relative",
          borderColor: colors.textinputbordercolor,
        }}
      >
        <Image
          source={
            item?.ProfilePhoto
              ? { uri: item?.ProfilePhoto }
              : require("../../assets/placeholderprofileimage.png")
          }
          style={{
            width: 61,
            height: 61,
            borderRadius: 40,
            marginRight: 5,
            borderWidth: 3,
            borderColor: "yellow",
            backgroundColor: Colors.lite_gray,
          }}
        />
        {item?.IsOnline === "Online" && (
          <View style={{ position: "absolute", left: -10 }}>
            <Icon
              type="Entypo"
              name="dot-single"
              size={40}
              color={colors.AppmainColor}
            />
          </View>
        )}
        <View style={{ flex: 1, padding: 10 }}>
          <Text
            style={{ ...globalStyles?.FS_16_FW_400, color: colors.textColor }}
          >
            {item?.UserName}
          </Text>
          <Text style={{ color: colors.placeholderTextColor, marginBottom: 5 }}>
            at {item?.CompanyName}
          </Text>
        </View>
        {InviteFriends ? (
          <TouchableOpacity
            onPress={() => handleJoinGroup(item)}
            style={{
              backgroundColor: colors.AppmainColor,
              alignSelf: "flex-start",
              padding: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: colors.textColor, fontWeight: "600" }}>
              {item?.IsGroupMember}
            </Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() => removeContact({ item })}
          style={{ padding: 10 }}
        >
          <Icon
            name="user-times"
            size={18}
            color={colors.backIconColor}
            type="FontAwesome"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const handleJoinGroup = async (item) => {
    const requestBody = {
      senderUserId: userData?.User?.userId,
      receiverUserId: item?.UserId,
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
      console.log("requestBody ", requestBody);
      const text = await response.text();

      const data = await response.json();
      if (response.ok) {
        // navigation.goBack();
        showSuccess(data.Message);
      } else {
        console.error("Error joining:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header
        title={Item?.UserId ? "Contact List" : "My Contact List"}
        navigation={navigation}
      />

      <View style={{ flex: 1 }}>
        {knownPeopleData.length === 0 && !loading && !refreshing ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: colors.placeholderTextColor,
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              No contacts available.
            </Text>
          </View>
        ) : (
          <FlatList
            data={knownPeopleData}
            renderItem={renderContacts}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
export default ContactList;
