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
} from "react-native";
import Colors from "../color";
import Header from "../Header/Header";
import globalStyles from "../GlobalCSS";
import Icon from "../Icons/Icons";
import { fetchContactList } from "../baseURL/ExperienceList";
import {
  baseUrl,
  contactList,
  ListKnowledgeHub,
  listoption,
  SendMessage,
} from "../baseURL/api";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";
import { showError, showSuccess } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";
import { knowledgeHubImage, universityFullName } from "../constants";

const KnowledgeHub = ({ navigation, route }) => {
  const { Item = {}, Type = "", GlobalSearch = {} } = route.params || {};
  console.log("GlobalSearch", GlobalSearch);
  const { isDark, colors, toggleTheme } = useTheme();
  const isFocused = useIsFocused();
  const abortControllerRef = useRef(null);
  const debounceTimer = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState("all");
  const [knowlwdgeList, setKnowlwdgeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState([]);
  const [selectedValue5, setSelectedValue5] = useState(
    "Select Category Search"
  );
  const [perPage] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [industryData, setIndustryData] = useState([]);
  const [perfID1, setPerfID1] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [fileShareBase64, setFileShareBase64] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };

  useEffect(() => {
    UserValue();
  }, []);

  const knowlwdgeHubList = async (pageNum) => {
    if (loading || !hasMoreData) return;
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}${ListKnowledgeHub}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Item?.optionalId || GlobalSearch?.id || "",
          CategoryId: perfID1 || "",
          keyword: searchQuery,
          entityName: selected === "my" ? "self" : "",
          userId: userData?.User?.userId,
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
    }

    setLoading(false);
  };
  const handleLoadMore = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50) {
      knowlwdgeHubList(page + 1);
    }
  };
  useEffect(() => {
    setPage(1);
    setKnowlwdgeList([]);
    knowlwdgeHubList(1);
    if (userData) {
    }
  }, [isFocused, selected, selectedValue5]);

  useEffect(() => {
    if (modalVisible && userData) {
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
  }, [modalVisible]);
  const openModal = (item) => {
    fetchContactList(userData);
    setSelectedItem(item);
    setModalVisible(true);
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
  const renderItem = ({ item }) => {
    // const ShareValue = item;
    const isValidUrl =
      typeof item?.documentFile === "string" &&
      item.documentFile.startsWith("http");

    const imageUrl = isValidUrl
      ? { uri: item.documentFile }
      : require("../../assets/khub.png");
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("KnowledgeDetails", { Item: item })}
        style={{
          borderWidth: 1,
          borderColor: colors.textinputbordercolor,
          padding: 5,
          margin: 5,
        }}
      >
        <Image
          source={imageUrl}
          style={{ width: "100%", height: 100, resizeMode: "cover" }}
        />
        <Text style={{ color: colors.AppmainColor, fontSize: 15, margin: 5 }}>
          {item?.name}
        </Text>
        <Text style={{ fontSize: 15, margin: 5, color: colors.textColor }}>
          {item?.longDescription}
        </Text>

        <View
          style={{
            flexDirection: "row",
            borderWidth: 1,
            borderColor: colors.textinputbordercolor,
            justifyContent: "space-between",
            padding: 5,
            margin: 10,
          }}
        >
          <Text style={{ color: colors.textColor }}>View: {item.views}</Text>

          <TouchableOpacity onPress={() => openModal(item)}>
            <Icon
              name="share"
              size={20}
              color={colors.placeholderTextColor}
              type="FontAwesome"
              style={{ paddingRight: 5 }}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  const handleSearch = (value) => {
    setSearchQuery(value);

    clearTimeout(debounceTimer.current);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    debounceTimer.current = setTimeout(() => {
      setKnowlwdgeList([]);
      setPage(1);
      setHasMoreData(true); // Reset pagination
      knowlwdgeHubList(1); // Explicitly reload the list when search is cleared
    }, 300); // Proper debounce delay
  };
  useEffect(() => {
    if (showIndustryModal) {
      setPage(1);
      setHasMore(true);
      getIndustryList(1);
    }
  }, [showIndustryModal]);
  const getIndustryList = async (pageNumber = 1) => {
    if (loading || (!hasMore && pageNumber !== 1)) return;

    if (pageNumber === 1) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch(`${baseUrl}${listoption}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionType: "industry",
          per_page: perPage,
          page: pageNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newData = data?.DataList || [];

        setIndustryData((prev) =>
          pageNumber === 1 ? newData : [...prev, ...newData]
        );

        setHasMore(newData.length === perPage);
        setPage(pageNumber + 1);
      } else {
        console.error("API Error:", data.message);
      }
    } catch (error) {
      console.error("Industry List Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  // const getIndustryList = async Val => {
  //   console.log(' value --- > ', Val);
  //   try {
  //     const response = await fetch(`${baseUrl}${listoption}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         optionType: Val,
  //       }),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       setIndustryData(data?.DataList);
  //     } else {
  //       showError(data.message || 'Failed to Industry List');
  //     }
  //   } catch (error) {
  //     console.error('Fetch Error:', error);
  //   }
  // };
  const selectOption5 = (option) => {
    setPerfID1(option?.Id);
    setSelectedValue5(option?.Name);
    setIsOpen5(false);
  };
  const toggleDropdown5 = () => {
    getIndustryList("industry");
    setIsOpen5(!isOpen5);
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

    const downloadFileAsAttachment = async (url) => {
      const fileName = `file_${Date.now()}.pdf`;
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
            type: "application/pdf",
          };
        } else {
          console.warn("⚠️ File download failed:", result.statusCode);
          return null;
        }
      } catch (error) {
        console.error("Download error:", error);
        return null;
      }
    };

    let fileData = null;
    if (selectedUsers?.documentFile) {
      fileData = await downloadFileAsAttachment(selectedUsers.documentFile);
    }

    const formData = new FormData();
    formData.append("senderId", userData?.User?.userId?.toString());
    formData.append("receiverId", receiverId?.toString());
    formData.append(
      "chatText",
      cleanHtmlWithSpacing(selectedUsers?.name || selectedUsers?.title || "")
    );
    formData.append("optionalType", "types");
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
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <View style={globalStyles.SafeAreaView}>
        <Header title="Knowledge Hub" navigation={navigation} />

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          onScroll={handleLoadMore}
          scrollEventThrottle={400}
        >
          <Image
            source={knowledgeHubImage}
            style={{ width: "100%", height: 180, resizeMode: "contain" }}
          />

          <View style={globalStyles.flexRow}>
            <TouchableOpacity
              style={[
                globalStyles.optionBox,
                selected === "all" && {
                  backgroundColor: colors.AppmainColor || colors.background,
                },
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
                All Documents
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                globalStyles.optionBox,
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
                My Documents
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              padding: 10,
            }}
          >
            <TextInput
              placeholder="Search"
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
          </View>

          {/* <View
            style={{
              backgroundColor: colors.textinputBackgroundcolor,
              marginHorizontal: 10,
            }}
          >
            {selectedValue5 == "Select Category Search" ? null : (
              <TouchableOpacity
                onPress={() => {
                  setPage(1);
                  setKnowlwdgeList([]);
                  setHasMoreData(true); // Reset pagination state
                  setSelectedValue5("Select Category Search");
                  setPerfID1("");
                  setTimeout(() => knowlwdgeHubList(1), 100); // Ensure re-render before calling API
                }}
                style={{
                  alignSelf: "flex-end",
                  padding: 10,
                }}
              >
                <Icon
                  type="Entypo"
                  color={colors.textColor}
                  name="cross"
                  size={20}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={toggleDropdown5}
              style={{
                ...globalStyles.seclectIndiaView,
                borderColor: colors.textinputbordercolor,
              }}
            >
              <Text
                style={{
                  ...globalStyles.JobfiledSectionText,
                  paddingBottom: 0,
                  color: colors.textColor,
                }}
              >
                {selectedValue5}
              </Text>
            </TouchableOpacity>
            {isOpen5 && (
              <View
                style={{
                  ...globalStyles.dropdownList,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.modelBackground,
                }}
              >
                {industryData.map((item) => (
                  <TouchableOpacity
                    key={item.Id}
                    style={{
                      ...globalStyles.dropdownItem,
                      borderBottomColor: colors.textinputbordercolor,
                    }}
                    onPress={() => {
                      selectOption5(item);
                    }}
                  >
                    <Text style={{ fontSize: 14, color: colors.textColor }}>
                      {item?.Name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          
          </View> */}
          <View style={{ marginHorizontal: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.textinputbordercolor,
                backgroundColor: colors.textinputBackgroundcolor,
                borderRadius: 6,
                paddingHorizontal: 12,
                height: 48,
                marginVertical: 10,
              }}
            >
              {/* Selected Value */}
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setShowIndustryModal(true)}
                activeOpacity={0.7}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.textColor,
                    fontSize: 14,
                  }}
                >
                  {selectedValue5}
                </Text>
              </TouchableOpacity>

              {/* Cross Button */}
              {selectedValue5 !== "Select Category Search" && (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedValue5("Select Category Search");
                    setSelected("all");
                    setPerfID1("");
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon
                    type="Entypo"
                    name="cross"
                    size={18}
                    color={colors.backIconColor}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={{ padding: 0, paddingVertical: 10 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                //  margin: 10,
                marginHorizontal: 10,
                color: colors.AppmainColor,
              }}
            >
              Knowledge Hub
            </Text>
          </View>

          <View style={{ padding: 0 }}>
            <Text style={{ fontSize: 18, margin: 10, color: colors.textColor }}>
              Welcome to Vault, on {universityFullName}. Here members can upload
              and share presentations, case studies, reports etc.
            </Text>
            <Text style={{ fontSize: 18, margin: 10, color: colors.textColor }}>
              Upload files privately or publicly in PowerPoint, PDF, Word, and
              Excel formats.
            </Text>
          </View>

          <TouchableOpacity
            style={{
              ...globalStyles.saveButton,
              margin: 10,
              paddingVertical: 10,
              backgroundColor: colors.AppmainColor,
            }}
            onPress={() => navigation.navigate("AddKnowledgeHub")}
          >
            <Text
              style={{
                ...globalStyles.saveButtonText,
                color: colors.ButtonTextColor,
              }}
            >
              + Upload
            </Text>
          </TouchableOpacity>

          <View style={{ padding: 0 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                margin: 10,
                color: colors.textColor,
              }}
            >
              Recently Uploaded
            </Text>
          </View>

          {knowlwdgeList?.map((item, index) => renderItem({ item, index }))}
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {!hasMoreData && (
            <Text
              style={{
                textAlign: "center",
                marginVertical: 10,
                color: colors.textColor,
              }}
            >
              No more posts to show
            </Text>
          )}
        </ScrollView>
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
                marginTop: 20,
                height: "70%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
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
                <TouchableOpacity
                  style={{ right: 12 }}
                  onPress={() => {
                    setModalVisible(false), setSelectedUsers([]);
                  }}
                >
                  <Icon
                    name="cross"
                    size={22}
                    color={colors.textColor}
                    type="Entypo"
                  />
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              <TextInput
                placeholder=" Search"
                placeholderTextColor={colors.placeholderTextColor}
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
                onChangeText={handleContactSearch}
              />

              {/* Contact List */}
              {loadingContacts ? (
                <ActivityIndicator size="large" color={colors.AppmainColor} />
              ) : (
                <FlatList
                  data={filteredContacts} // Use filtered contacts
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        ...globalStyles.contantlistMainView,
                        padding: 5,
                      }}
                    >
                      {/* Custom Checkbox */}
                      <TouchableOpacity
                        onPress={() => toggleSelection(item.UserId)}
                        style={{
                          width: 20,
                          height: 20,
                          borderWidth: 2,
                          borderColor: selectedUsers.includes(item.UserId)
                            ? colors.AppmainColor
                            : colors.placeholderTextColor,
                          backgroundColor: selectedUsers.includes(item.UserId)
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
                              ? {
                                  uri: item?.ProfilePhoto,
                                }
                              : require("../../assets/placeholderprofileimage.png")
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

              <TouchableOpacity
                onPress={async () => {
                  if (!selectedItem) return;
                  for (const userId of selectedUsers) {
                    await sendMessage(userId, selectedItem);
                    console.log("Sending item:", selectedItem);
                  }
                  setSelectedUsers([]);
                  setModalVisible(false); // Close modal
                }}
                style={{
                  backgroundColor: colors.AppmainColor,
                  padding: 10,
                  borderRadius: 4,
                  marginTop: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: colors.ButtonTextColor,
                  }}
                >
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          visible={showIndustryModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowIndustryModal(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                backgroundColor: colors.textinputBackgroundcolor,
                borderRadius: 8,
                height: "70%",
                position: "relative",
                overflow: "visible",
              }}
            >
              <TouchableOpacity
                onPress={() => setShowIndustryModal(false)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1000,
                  elevation: 10,
                  padding: 8,
                }}
              >
                <Icon
                  type="Entypo"
                  name="cross"
                  size={26}
                  color={colors.backIconColor}
                />
              </TouchableOpacity>
              <FlatList
                data={industryData}
                keyExtractor={(item) => item.Id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={globalStyles.dropdownItem}
                    onPress={() => {
                      selectOption5(item);
                      setShowIndustryModal(false);
                    }}
                  >
                    <Text style={{ color: colors.textColor }}>{item.Name}</Text>
                  </TouchableOpacity>
                )}
                onEndReached={() => getIndustryList(page)}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{ flexGrow: 1 }}
                ListFooterComponent={
                  loading && page > 1 ? (
                    <ActivityIndicator size="small" style={{ margin: 10 }} />
                  ) : !hasMore && industryData.length > 0 ? (
                    <Text
                      style={{
                        textAlign: "center",
                        padding: 10,
                        color: colors.textColor,
                      }}
                    >
                      No more data
                    </Text>
                  ) : null
                }
                ListEmptyComponent={
                  !loading ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          padding: 10,
                          color: colors.textColor,
                        }}
                      >
                        No data available
                      </Text>
                    </View>
                  ) : null
                }
                refreshing={refreshing}
                onRefresh={() => {
                  setPage(1);
                  setHasMore(true);
                  getIndustryList(1);
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default KnowledgeHub;
