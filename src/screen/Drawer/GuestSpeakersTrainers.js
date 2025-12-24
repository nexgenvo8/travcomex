import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Modal,
} from "react-native";
import globalStyles from "../GlobalCSS";
import Header from "../Header/Header";
import Icon from "../Icons/Icons";
import Colors from "../color";
import { baseUrl, listoption, ListTalent } from "../baseURL/api";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showError } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";
import { emailId, SpeakerGuests, universityFullName } from "../constants";

const GuestSpeakersTrainers = ({ navigation, route }) => {
  const { Item = {}, Type = "", GlobalSearch = {} } = route.params || {};
  const isFocused = useIsFocused();
  const { isDark, colors, toggleTheme } = useTheme();
  const [userData, setUserData] = useState([]);
  const [selected, setSelected] = useState("all");
  const [listTalent, setListTalent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedValue5, setSelectedValue5] = useState(
    "Select Category Search"
  );
  const [perPage] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [isOpen5, setIsOpen5] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [industryData, setIndustryData] = useState([]);
  const [perfID1, setPerfID1] = useState("");
  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };

  useEffect(() => {
    UserValue();
  }, []);
  useEffect(() => {
    fetchTalentList();
  }, [page]);

  const fetchTalentList = async () => {
    if (loading || !hasMoreData) return;

    setLoading(true);

    try {
      let userId = "";
      let categoryId = "";

      if (selected === "my") {
        userId = userData?.User?.userId || "";
      } else if (perfID1 || GlobalSearch?.catIds) {
        categoryId = perfID1?.toString() || GlobalSearch?.catIds?.toString();
      }

      const response = await fetch(`${baseUrl}${ListTalent}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          categoryId,
          per_page: 10,
          page: page,
        }),
      });

      const data = await response.json();

      if (page === 1) {
        setListTalent(data?.Data || []);
      } else if (data?.Data?.length > 0) {
        setListTalent((prev) => [...prev, ...data.Data]);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMoreData(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMoreData) {
      setPage((prev) => prev + 1);
    }
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("GuestDetails", {
            Item: item,
          })
        }
        style={{
          backgroundColor: colors.textinputBackgroundcolor,
          margin: 5,
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View>
          <Image
            source={
              item?.TalentProfilePhoto
                ? { uri: item.TalentProfilePhoto }
                : require("../../assets/noimageplaceholder.png")
            }
            style={{ width: 120, height: 120 }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{ color: colors.textColor, paddingLeft: 10, fontSize: 20 }}
          >
            {item?.TalentName}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              color: colors.AppmainColor,
              paddingLeft: 10,
              fontSize: 15,
            }}
          >
            {item?.CategoryNames}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ color: colors.textColor, paddingLeft: 10, fontSize: 15 }}
          >
            {item?.LongDescription}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const handleSelection = (type) => {
    setSelected(type);
    if (type) {
      setListTalent([]);
      setPage(1);
      setHasMoreData(true);
    }
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

  // const getIndustryList = async (Val) => {
  //   // console.log(' value --- > ', Val);
  //   try {
  //     const response = await fetch(`${baseUrl}${listoption}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         optionType: Val,
  //       }),
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       setIndustryData(data?.DataList);
  //     } else {
  //       showError("Error", data.message || "Failed to Industry List");
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error Industry List.:", error);
  //   }
  // };
  const selectOption5 = (option) => {
    setPerfID1(option?.Id);
    setSelectedValue5(option?.Name);
    setIsOpen5(false);
  };
  // const toggleDropdown5 = () => {
  //   getIndustryList("industry");
  //   setIsOpen5(!isOpen5);
  // };
  const toggleDropdown5 = () => {
    setDropdownOpen(!dropdownOpen);
    setIsOpen5(!isOpen5);

    if (!isOpen5) {
      setPage(1);
      setHasMore(true);
      getIndustryList(1);
    }
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header title="Industry Speakers Trainers" navigation={navigation} />
      <View style={{ flex: 1 }}>
        <FlatList
          data={listTalent}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListHeaderComponent={
            <>
              <ImageBackground
                source={SpeakerGuests}
                resizeMode="contain"
                style={{
                  width: "auto",
                  height: 155,
                }}
              ></ImageBackground>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[
                    styles.optionBox,
                    { backgroundColor: colors.textinputBackgroundcolor },
                    selected === "all" && {
                      backgroundColor: colors.AppmainColor,
                    },
                  ]}
                  onPress={() => handleSelection("all")}
                >
                  <Text
                    style={{
                      ...styles.optionText,

                      color:
                        selected === "all"
                          ? colors.ButtonTextColor
                          : colors.textColor,
                    }}
                  >
                    All Talent Profiles
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionBox,
                    { backgroundColor: colors.textinputBackgroundcolor },
                    selected === "my" && {
                      backgroundColor: colors.AppmainColor,
                    },
                  ]}
                  onPress={() => handleSelection("my")}
                >
                  <Text
                    style={{
                      ...styles.optionText,
                      color:
                        selected === "my"
                          ? colors.ButtonTextColor
                          : colors.textColor,
                    }}
                  >
                    My Talent Profile
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginHorizontal: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    // borderRadius: 6,
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
              {/* <View style={{ marginHorizontal: 10 }}>
                {selectedValue5 == "Select Category Search" ? null : (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedValue5("");
                      setSelectedValue5("Select Category Search");
                      setSelected("all");
                      setPerfID1("");
                    }}
                    style={{ alignSelf: "flex-end", padding: 10 }}
                  >
                    <Icon
                      type="Entypo"
                      color={colors.backIconColor}
                      name="cross"
                      size={20}
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setShowIndustryModal(true)}>
                  <View style={globalStyles.seclectIndiaView}>
                    <Text style={{ color: colors.textColor }}>
                      {selectedValue5}
                    </Text>
                  </View>
                </TouchableOpacity>
                {isOpen5 && (
                  <View
                    style={{
                      ...globalStyles.dropdownList,
                      borderColor: colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                  >
                    {industryData.map((item) => (
                      <TouchableOpacity
                        key={item.Id}
                        style={{
                          ...globalStyles.dropdownItem,
                          borderColor: colors.textinputbordercolor,
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
              <View
                style={{
                  ...globalStyles.ViewINter1,
                  borderWidth: 1,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    flexShrink: 1,
                    color: colors.textColor,
                  }}
                >
                  Various Industry professionals and representatives will be
                  given an invitation for Industry lectures at{" "}
                  {universityFullName}
                </Text>
              </View>

              <View style={{ ...styles.bulletRow }}>
                <Icon
                  name="check"
                  size={20}
                  color={colors.AppmainColor}
                  style={{ margin: 10 }}
                />
                <Text style={{ ...styles.bulletText, color: colors.textColor }}>
                  Students can attend these lectures for additional insight
                  about a specific career field.
                </Text>
              </View>

              <View style={{ ...styles.bulletRow }}>
                <Icon
                  name="check"
                  size={20}
                  color={colors.AppmainColor}
                  style={{ margin: 10 }}
                />
                <Text style={{ ...styles.bulletText, color: colors.textColor }}>
                  It will help students establish a professional contact with
                  industry representatives.
                </Text>
              </View>

              <View style={{ ...styles.bulletRow }}>
                <Icon
                  name="check"
                  size={20}
                  color={colors.AppmainColor}
                  style={{ margin: 10 }}
                />
                <Text style={{ ...styles.bulletText, color: colors.textColor }}>
                  Attending these lectures will help students develop a global
                  approach to understand the changes taking place every day
                  globally.
                </Text>
              </View>

              <View style={{ ...styles.bulletRow }}>
                <View>
                  <Text
                    style={{
                      ...styles.bulletTitle,
                      paddingLeft: 40,
                      color: colors.textColor,
                    }}
                  >
                    {universityFullName} for Business Speakers, Artists and
                    Trainers
                  </Text>
                </View>
              </View>

              <View
                style={{
                  paddingLeft: 50,
                  padding: 10,
                }}
              >
                <Text style={{ ...styles.bulletText, color: colors.textColor }}>
                  If you are a Speaker, Trainer, Master of Ceremonies,
                  Entertainment artist/group etc, register yourself on{" "}
                  {universityFullName}. The benefits to you will be: Please read
                  these{" "}
                  <Text
                    onPress={() => navigation.navigate("TermsScreen")}
                    style={{ color: colors.AppmainColor }}
                  >
                    Terms{" "}
                  </Text>
                  for details.
                </Text>
              </View>
              <View
                style={{
                  paddingLeft: 50,
                  padding: 10,
                }}
              >
                <Text style={{ ...styles.bulletText, color: colors.textColor }}>
                  Contact Us {emailId} to learn how you can bring a top business
                  speaker or entertainment artist to your next company event or
                  offsite.
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: colors.textinputBackgroundcolor,
                  borderWidth: 1,
                  borderColor: colors.textinputbordercolor,
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    ...globalStyles.headlineText,
                    color: colors.AppmainColor,
                    flexShrink: 1,
                  }}
                >
                  Find the finest speakers or entertainment artists, for your
                  next event.{" "}
                </Text>
              </View>

              {/* {listTalent?.some((item) => item.userId === 1053) && ( */}
              <TouchableOpacity
                style={{
                  ...globalStyles.saveButton,
                  marginHorizontal: 10,
                  backgroundColor: colors.AppmainColor,
                }}
                onPress={() => navigation.navigate("AddTelentProfile")}
              >
                <Text
                  style={{
                    ...globalStyles.saveButtonText,
                    color: colors.ButtonTextColor,
                  }}
                >
                  Create Talent Profile
                </Text>
              </TouchableOpacity>
              {/* )} */}
              <View
                style={{
                  ...styles.bulletRow,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ padding: 10 }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: colors.textColor,
                    }}
                  >
                    {selected === "my" ? "My" : "Featured"} Talent Profiles
                  </Text>
                </View>
              </View>
            </>
          }
          ListFooterComponent={
            loading && !refreshing ? (
              <ActivityIndicator
                size="small"
                style={{ margin: 10, color: colors.AppmainColor }}
              />
            ) : null
          }
        />
      </View>
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
              height: "70%",
              backgroundColor: colors.textinputBackgroundcolor,
              borderRadius: 8,
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
              onEndReachedThreshold={0.1}
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
});

export default GuestSpeakersTrainers;
