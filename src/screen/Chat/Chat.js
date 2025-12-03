import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import globalStyles from "../GlobalCSS";
import Header from "../Header/Header";
import Colors from "../color";
import Icon from "../Icons/Icons";
import { baseUrl, ChatUsers, contactList } from "../baseURL/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import Pusher from "pusher-js";
import { showError } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";

const EventCalcander = ({ navigation }) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const [userStatus, setUserStatus] = useState("offline");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatUsers, setChatUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDta = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    };
    fetchUserData();
  }, []);
  const sendStatusUpdate = async (userId, status) => {
    try {
      const response = await fetch(
        "https://travcomexapi.vecospace.com/api/online-offline-status", // Your API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            status, // Status will be 'online' or 'offline'
          }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        console.log(`Status for user ${userId} updated to ${status}`);
      } else {
        console.error("Error updating status:", data.message);
      }
    } catch (error) {
      console.error("Failed to send status update:", error);
    }
  };

  useEffect(() => {
    const userId = userData?.User?.userId;
    setUserStatus("online");
    sendStatusUpdate(userId, "online");

    const pusher = new Pusher("6840a502dc1ebc6a81f5", {
      cluster: "ap2",
    });

    const channelName = "chat-online-offline";
    const channel = pusher.subscribe(channelName);
    console.log(`✅ Subscribed to ${channelName}`);
    channel.bind("online-offline-status", (data) => {
      console.log("📥 Status update received:", data);
      setUserStatus(data.status);
    });
    channel.bind("pusher:subscription_error", (error) => {
      console.error("Subscription error:", error);
    });
    channel.bind("pusher:subscription_succeeded", () => {
      console.log("✅ Successfully subscribed to the channel");
      setLoading(false);
    });
    return () => {
      console.log("🔌 Cleaning up Pusher when component unmounts");
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  const fetchChatUsers = async () => {
    try {
      const response = await fetch(`${baseUrl}${ChatUsers}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userData?.User?.userId }),
      });
      const data = await response.json();

      const sortedUsers = [...(data?.users || [])].sort((a, b) => {
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      });

      setChatUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching chat users fetchChatUsers:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let interval;

    if (userData?.User?.userId) {
      fetchChatUsers();
      interval = setInterval(() => {
        fetchChatUsers();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [userData]);
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredUsers(chatUsers);
    } else {
      const filtered = chatUsers.filter((user) =>
        user?.UserName?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // Fetch Contact List
  const fetchContactList = async () => {
    setLoadingContacts(true);
    try {
      const response = await fetch(`${baseUrl}${contactList}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData?.User?.userId,
        }),
      });

      const data = await response.json();
      // console.log('data ---------->>', data);
      if (response.ok) {
        setContacts(data?.DataList || []);
      } else {
        showError("Failed to fetch contacts.");
      }
    } catch (error) {
      console.error("Error fetch contacts:", error);
    } finally {
      setLoadingContacts(false);
    }
  };

  // Open Modal and Fetch Data
  const openModal = () => {
    setModalVisible(true);
    fetchContactList();
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

  // Inside useEffect to set filteredContacts initially
  useEffect(() => {
    setFilteredContacts(contacts);
  }, [contacts]);

  const renderItemChatList = ({ item }) => {
    const formattedDate = moment(
      item?.lastMessageTime,
      "YYYY-MM-DD HH:mm:ws"
    ).fromNow();
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ChatDetails", { Item: item })}
        style={{
          marginHorizontal: 10,
          padding: 15,
          flexDirection: "row",
          borderBottomWidth: 1,
          borderColor: colors.textinputbordercolor,
        }}
      >
        <View style={{ marginRight: 10 }}>
          <Image
            source={
              item?.ProfilePhoto
                ? { uri: item?.ProfilePhoto }
                : require("../../assets/placeholderprofileimage.png")
            }
            style={{
              width: 40,
              height: 40,
              borderRadius: 30,
              backgroundColor: colors.placeholderTextColor,
            }}
          />
          <View style={{ position: "absolute", left: 12, top: 12 }}>
            {/* <Icon
              type="Entypo"
              name={'dot-single'}
              size={45}
              color={
                item?.IsOnline == 'Online' ? Colors?.secondGreen : Colors?.gray
              }
            /> */}
            <Icon
              type="Entypo"
              name={"dot-single"}
              size={45}
              color={colors.AppmainColor}
              style={{
                opacity: item?.IsOnline === "Online" ? 1 : 0,
              }}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.textColor,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {item?.UserName}
          </Text>
          <Text
            numberOfLines={3}
            style={{
              color: colors.textColor,
              fontWeight: item?.unreadCount > 0 ? "bold" : "normal",
            }}
          >
            {item?.lastMessage}
          </Text>
        </View>
        <View>
          <Text style={{ color: colors.textColor, fontSize: 12 }}>
            {formattedDate}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={globalStyles.SafeAreaView}>
      <Header title="Chats" navigation={navigation} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            backgroundColor: colors.background,
          }}
        >
          <TextInput
            placeholder="Search Contacts"
            style={{
              ...globalStyles.SerachInput,
              borderColor: colors.textinputbordercolor,
              color: colors.textColor,
              backgroundColor: colors.textinputBackgroundcolor,
            }}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={colors.placeholderTextColor}
          />
          <TouchableOpacity
            style={{
              backgroundColor: colors.AppmainColor,
              padding: 10,
              marginLeft: 5,
              borderRadius: 5,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Search</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={openModal}
          style={{
            backgroundColor: colors.AppmainColor,
            padding: 15,
            justifyContent: "space-between",
            flexDirection: "row",
            marginHorizontal: 10,
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              color: colors.ButtonTextColor,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Conversations
          </Text>
          <Icon
            type="FontAwesome"
            color={colors.ButtonTextColor}
            size={20}
            name="edit"
          />
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.AppmainColor}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderItemChatList}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: colors.modelBackground,
              padding: 20,
              borderRadius: 10,
              marginHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                color: colors.textColor,
              }}
            >
              Search User
            </Text>

            {/* Search Input */}
            <TextInput
              placeholderTextColor={colors.placeholderTextColor}
              placeholder="Enter user name"
              style={{
                borderWidth: 1,
                borderColor: colors.textinputbordercolor,
                color: colors.textColor,
                backgroundColor: colors.textinputBackgroundcolor,
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}
              value={username}
              onChangeText={handleContactSearch} // Call search function
            />

            {/* Contact List */}
            {loadingContacts ? (
              <ActivityIndicator size="large" color={colors.AppmainColor} />
            ) : (
              <FlatList
                data={filteredContacts} // Use filtered contacts
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate("ChatDetails", { Item: item });
                    }}
                    style={{
                      padding: 10,
                      borderBottomWidth: 1,
                      borderColor: colors.textinputbordercolor,
                    }}
                  >
                    <Text style={{ fontSize: 16, color: colors.textColor }}>
                      {item?.UserName}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            )}

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: colors.AppmainColor,
                padding: 10,
                borderRadius: 4,
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: colors.ButtonTextColor, fontWeight: "bold" }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      ;
    </SafeAreaView>
  );
};

export default EventCalcander;
