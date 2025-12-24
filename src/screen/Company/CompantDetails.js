import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import globalStyles from "../GlobalCSS";
import Header from "../Header/Header";
import Colors from "../color";
import Icon from "../Icons/Icons";
import {
  AddCompanyApi,
  AddFollowingCompany,
  baseUrl,
  DeleteCompanyJob,
  DeleteCompanyPost,
  ListCompanyPost,
  ListJob,
  UpdateCompany,
} from "../baseURL/api";
import { useIsFocused } from "@react-navigation/native";
import ImagePicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showError } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";
import { universityFullName } from "../constants";

const CompanyDetails = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const { Item = {}, nextItems = [] } = route.params || {};
  const { isDark, colors, toggleTheme } = useTheme();
  const [selectedSection, setSelectedSection] = useState("Abouts");
  const sections = ["Abouts", "Updates", "Employees", "Jobs"];
  const [aboutItemOther, setAboutItemOther] = useState([]);
  const [isFollowing, setIsFollowing] = useState(Item?.IsFollowing);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    if (isFocused) {
      UserValue();
    }
  }, [isFocused]);

  const UserValue = async () => {
    try {
      const userDta = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    } catch (error) {
      console.log("Error load user data", error);
    }
  };
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => setAboutItemOther(item)}
      style={{
        flexDirection: "row",
        backgroundColor: colors.textinputBackgroundcolor,
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: colors.shadowColor,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
      }}
    >
      <Image
        source={
          item.companyLogo
            ? { uri: item.companyLogo }
            : require("../../assets/noimageplaceholder.png")
        }
        style={{
          width: 50,
          height: 50,
          borderRadius: 8,
          marginRight: 10,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: colors.textColor,
          }}
        >
          {item.companyName}
        </Text>
        <Text
          numberOfLines={2}
          style={{ fontSize: 12, color: colors.placeholderTextColor }}
        >
          {item.aboutCompany}
        </Text>
      </View>
    </TouchableOpacity>
  );
  const handleDeleteComment = (item, Id) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this Job?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await fetch(
                `${baseUrl}${
                  item === "DeleteCompanyPost"
                    ? DeleteCompanyPost
                    : DeleteCompanyJob
                }`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: item === "DeleteCompanyPost" ? Id : Item?.id,
                  }),
                }
              );

              const data = await response.json();

              if (response.ok) {
                console.log("Delete Response:", data);
                navigation.goBack();
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
  const toggleFollow = async () => {
    try {
      const response = await fetch(`${baseUrl}${AddFollowingCompany}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId, // Pass the userId dynamically
          companyId: Item?.id, // Pass companyId dynamically
        }),
      });

      const data = await response.json();
      if (data.Status === 1) {
        setIsFollowing(data.IsFollowing); // Update state based on API response
      } else {
        showError("Something went wrong");
      }
    } catch (error) {
      console.error("Follow API Error:", error);
    }
  };
  // Function to fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}${ListJob}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          jobTitle: "",
          jobLocation: "",
          companyName: "",
          companyId: Item?.id,
          careerLevel: "",
          popularJobs: "",
          per_page: 40,
          page: 1,
        }),
      });

      const result = await response.json();
      setJobs(result);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch jobs when "Jobs" section is selected
  useEffect(() => {
    if (selectedSection === "Jobs") {
      fetchJobs();
    }
  }, [selectedSection]);

  const Employees = Item?.Employees?.map((item) => item);

  const renderItemFeatList = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          style={{
            ...styles.card,
            backgroundColor: colors.textinputBackgroundcolor,
          }}
          onPress={() =>
            navigation.navigate("JobDetails", {
              Item: item,
            })
          }
        >
          <View style={{ flex: 1 }}>
            <Text style={{ ...styles.title, color: colors.AppmainColor }}>
              {item.jobTitle}
            </Text>
            <Text style={{ ...styles.info, color: colors.textColor }}>
              {item.levelName}
            </Text>
            <Text style={{ ...styles.info, color: colors.textColor }}>
              Start Date: {item.dateAdded}
            </Text>
            <Text style={{ ...styles.info, color: colors.textColor }}>
              Company: {item.companyName}
            </Text>
          </View>
          <View style={globalStyles.FlatListIconView}>
            <Icon
              name="location"
              size={18}
              color={colors.backIconColor}
              type="Ionicons"
            />
            <Text
              style={{ ...styles.info, flexShrink: 1, color: colors.textColor }}
            >
              {item.jobLocation}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const selectImage = async () => {
    try {
      const pickedImage = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        includeBase64: true,
      });

      // Wait a moment to ensure state updates
      setTimeout(() => {
        handleEdit(pickedImage.data); // Pass new base64 data
      }, 100);
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };
  const handleEdit = async (base64) => {
    if (!base64) {
      console.warn("No image selected, skipping API call");
      return;
    }

    const apiUrl = `${baseUrl}${Item?.id ? UpdateCompany : AddCompanyApi}`;
    console.log("API URL:", apiUrl);

    setLoading(true);
    try {
      const requestBody = {
        id: Item?.id || null,
        userId: userData?.User?.userId || "",
        companyName: Item?.companyName || "",
        companyTypeId: Item?.companyTypeId || "",
        establishedYear: Item?.establishedYear?.toString() || "",
        countryId: Item?.countryId || "",
        stateId: Item?.stateId || "",
        cityName: Item?.cityName || "",
        postalCode: Item?.postalCode || "",
        phoneNumber: Item?.phoneNumber || "",
        emailAaddress: Item?.emailAddress || "",
        status: 1,
        companyUrl: Item?.companyUrl || "",
        aboutCompany: Item?.aboutCompany || "",
        companyAddress: Item?.companyAddress || "",
        empnoId: Item?.empStrength || "",
        tagId: Item?.companyName || "",
        fileUploaded: base64, // Use passed base64
      };

      console.log("Request Body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Add data:", data);
        navigation.goBack();
      } else {
        showError(data.message || "Failed to update company details");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedSection === "Updates") {
      fetchUpdates();
    }
  }, [selectedSection]);
  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}${ListCompanyPost}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          companyId: Item?.id,
          per_page: 20,
          page: 1,
        }),
      });

      const data = await response.json();
      setUpdates(data);
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
    setLoading(false);
  };
  // Function to calculate time difference
  const timeAgo = (dateString) => {
    // Convert '13-Feb-2025, 12:26:01pm' to '2025-02-13 12:26:01'
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

    const match = dateString.match(
      /(\d+)-(\w+)-(\d+), (\d+):(\d+):(\d+)(am|pm)/i
    );
    if (!match) return "Invalid date";

    let [_, day, month, year, hour, minute, second, period] = match;
    hour = parseInt(hour, 10);
    if (period.toLowerCase() === "pm" && hour !== 12) hour += 12;
    if (period.toLowerCase() === "am" && hour === 12) hour = 0;

    const formattedDate = `${year}-${months[month]}-${day.padStart(
      2,
      "0"
    )} ${hour.toString().padStart(2, "0")}:${minute}:${second}`;

    const postDate = new Date(formattedDate);
    const now = new Date();
    const diff = Math.floor((now - postDate) / 1000); // Difference in seconds

    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header title="Company Details" navigation={navigation} />
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              margin: 10,
              marginTop: 20,
              borderBottomWidth: 3,
              paddingBottom: 20,
              borderColor: colors.textinputbordercolor,
            }}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={{ position: "relative" }}>
                <Image
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 10,
                    borderWidth: 3,
                    borderColor: colors.textinputbordercolor,
                  }}
                  resizeMode="cover"
                  source={
                    aboutItemOther?.companyLogo !== undefined &&
                    aboutItemOther?.companyLogo !== null
                      ? { uri: aboutItemOther.companyLogo }
                      : Item.companyLogo !== undefined &&
                        Item.companyLogo !== null
                      ? { uri: Item.companyLogo }
                      : require("../../assets/noimageplaceholder.png")
                  }
                />
                {Item?.isEdit ? (
                  <TouchableOpacity
                    onPress={selectImage}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: colors.textinputBackgroundcolor,
                      padding: 5,
                      borderRadius: 20,
                      elevation: 3, // Shadow for Android
                      shadowColor: "#000", // Shadow for iOS
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 3,
                    }}
                  >
                    <Icon
                      name="pencil"
                      type="Octicons"
                      color={colors.backIconColor}
                      size={18}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            <View
              style={{ paddingLeft: 10, flexShrink: 1, marginTop: 10, flex: 1 }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "600",
                  color: colors.textColor,
                }}
              >
                {aboutItemOther?.length === 0
                  ? Item?.companyName
                  : aboutItemOther?.companyName}
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  color: colors.placeholderTextColor,
                  paddingTop: 4,
                }}
              >
                {aboutItemOther?.length === 0
                  ? Item?.companyTypeName
                  : aboutItemOther?.companyTypeName}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.placeholderTextColor,
                  paddingTop: 4,
                }}
              >
                {Item?.cityName},{Item?.stateName}
              </Text>

              <TouchableOpacity onPress={toggleFollow}>
                <View
                  style={{
                    borderWidth: 1,
                    alignSelf: "flex-start",
                    marginTop: 5,
                    padding: 4,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: isFollowing
                      ? colors.textinputBackgroundcolor
                      : colors.textinputBackgroundcolor,
                  }}
                >
                  <Text style={{ color: colors.backIconColor }}>
                    {isFollowing ? "Following" : "+ Follow"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {Item?.isEdit && (
              <View
                style={{
                  flex: 0.3,
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <TouchableOpacity
                  style={{}}
                  onPress={() =>
                    navigation.navigate("AddCompany", {
                      Item: Item,
                    })
                  }
                >
                  <Icon
                    name="pencil"
                    color={colors.placeholderTextColor}
                    size={20}
                    type="Octicons"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteComment}>
                  <Icon
                    name="delete"
                    color={colors.placeholderTextColor}
                    size={20}
                    type="MaterialCommunityIcons"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Section Tabs */}
          <View style={{ flexDirection: "row", padding: 10 }}>
            {sections.map((section) => (
              <TouchableOpacity
                key={section}
                style={{
                  flex: 1,
                  alignItems: "center",
                  padding: 10,
                  backgroundColor:
                    selectedSection === section
                      ? colors.AppmainColor
                      : "transparent",
                  borderRadius: 5,
                }}
                onPress={() => setSelectedSection(section)}
              >
                <Text
                  style={{
                    color:
                      selectedSection === section
                        ? colors.ButtonTextColor
                        : colors.textColor,
                    fontWeight: "700",
                  }}
                >
                  {section}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content based on selected section */}
          <View style={{ padding: 20 }}>
            {selectedSection === "Abouts" && (
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 18, color: colors.textColor }}>
                    Tag ID:
                  </Text>
                  <Text
                    style={{ fontSize: 18, color: colors.placeholderTextColor }}
                  >
                    {" "}
                    @
                    {aboutItemOther?.length === 0
                      ? Item.companyName
                      : aboutItemOther?.companyName}
                  </Text>
                </View>

                <View style={{ marginVertical: 10 }}>
                  {Item?.companyBanner ? (
                    <Image
                      source={{ uri: Item.companyBanner }}
                      style={{
                        width: "auto",
                        height: 150,
                        backgroundColor: colors.textinputBackgroundcolor,
                        padding: 3,
                        borderRadius: 10,
                      }}
                      resizeMode="contain"
                    />
                  ) : Item?.isEdit ? (
                    // Clickable "Add Company Banner" when isEdit is true
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("AddCompany", { Item })
                      }
                      style={{ alignItems: "center" }}
                    >
                      <Icon
                        name="image-inverted"
                        size={60}
                        color={colors.AppmainColor}
                        type="Entypo"
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          color: colors.AppmainColor,
                          marginTop: 5,
                        }}
                      >
                        Add Company Profile
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    // Non-clickable View when isEdit is false
                    <View style={{ alignItems: "center" }}>
                      <Icon
                        name="image-inverted"
                        size={60}
                        color={colors.AppmainColor}
                        type="Entypo"
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          color: colors.AppmainColor,
                          marginTop: 5,
                        }}
                      >
                        Company Profile Not Available
                      </Text>
                    </View>
                    // )}
                  )}
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      paddingTop: 10,
                      color: colors.textColor,
                    }}
                  >
                    {aboutItemOther?.length === 0
                      ? Item?.aboutCompany
                      : aboutItemOther?.aboutCompany}
                  </Text>
                </View>
                <View style={{ marginTop: 30 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 10,
                      color: colors.textColor,
                    }}
                  >
                    Other Companies On {universityFullName}
                  </Text>
                </View>

                <FlatList
                  data={nextItems}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItem}
                />
              </View>
            )}

            {selectedSection === "Updates" && (
              <View>
                {Item?.isEdit ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("AddUpdatePost", {
                        ItemCompanyData: Item,
                      })
                    }
                    style={{
                      flex: 0.2,
                      borderWidth: 1,
                      borderColor: colors.textinputbordercolor,
                      padding: 20,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 17,
                          color: colors.placeholderTextColor,
                          fontWeight: "600",
                        }}
                      >
                        Post a new update
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.placeholderTextColor,
                          marginTop: 5,
                        }}
                      >
                        Here you can post updates about your Company.
                      </Text>
                    </View>
                    <View style={{ paddingLeft: 10 }}>
                      <Icon
                        name="plus-circle"
                        size={30}
                        color={colors.placeholderTextColor}
                        type="FontAwesome"
                      />
                    </View>
                  </TouchableOpacity>
                ) : null}

                {loading ? (
                  <ActivityIndicator
                    size="large"
                    color={colors.AppmainColor}
                    style={{ marginTop: 20 }}
                  />
                ) : (
                  <FlatList
                    data={updates?.Data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          padding: 15,
                          borderWidth: 1,
                          borderColor: colors.textinputbordercolor,
                          marginTop: 10,
                          flexDirection: "row",
                        }}
                      >
                        <View style={{}}>
                          <Image
                            source={{ uri: item?.Images?.PostImage }}
                            style={{
                              width: 50,
                              height: 50,
                              backgroundColor: Colors.lite_gray,
                              borderRadius: 30,
                            }}
                          />
                        </View>

                        <View style={{ paddingLeft: 10, flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "bold",
                              color: colors.textColor,
                            }}
                          >
                            {item?.UserDetail?.CompanyName}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: colors.placeholderTextColor,
                              marginTop: 5,
                            }}
                          >
                            {item?.PostText}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: colors.placeholderTextColor,
                              marginTop: 5,
                            }}
                          >
                            {timeAgo(item?.DateAdded)}
                          </Text>
                        </View>
                        {Item?.isEdit ? (
                          <TouchableOpacity
                            onPress={() =>
                              handleDeleteComment("DeleteCompanyPost", item?.id)
                            }
                            style={{ flex: 0.1 }}
                          >
                            <Icon
                              name="cross"
                              size={20}
                              color={colors.placeholderTextColor}
                              type="Entypo"
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    )}
                  />
                )}
              </View>
            )}
            {selectedSection === "Employees" && (
              <View>
                <View style={{ marginVertical: 10 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: colors.textColor,
                    }}
                  >
                    The following employees are {universityFullName}
                    members
                  </Text>
                </View>

                <View>
                  {Employees.map((employee) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ProfileDetails", {
                          Item: employee,
                        })
                      }
                      key={employee.UserId}
                      style={{
                        padding: 10,
                        borderWidth: 1,
                        borderColor: colors.textinputbordercolor,
                        flexDirection: "row",
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            employee.ProfilePhoto ||
                            require("../../assets/placeholderprofileimage.png"),
                        }}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          backgroundColor: Colors.lite_gray,
                          marginRight: 10,
                        }}
                      />
                      <View>
                        <Text
                          style={{
                            color: colors.AppmainColor,
                            fontSize: 16,
                            fontWeight: "500",
                          }}
                        >
                          {employee.UserName}
                        </Text>
                        <Text
                          style={{
                            color: colors.placeholderTextColor,
                            fontSize: 13,
                          }}
                        >
                          {employee.JobTitle}
                        </Text>
                        <Text
                          style={{
                            color: colors.placeholderTextColor,
                            fontSize: 13,
                          }}
                        >
                          {employee.CompanyName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            {selectedSection === "Jobs" && (
              <View style={{ padding: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.textColor,
                      }}
                    >
                      Available Jobs
                    </Text>
                  </View>

                  {Item?.isEdit && (
                    <TouchableOpacity
                      style={{
                        ...globalStyles.saveButton,
                        flex: 1,
                        paddingVertical: 10,
                        backgroundColor: colors.AppmainColor,
                      }}
                      onPress={() =>
                        navigation.navigate("AddJob", {
                          Item: Item,
                        })
                      }
                    >
                      <Text
                        style={{
                          ...globalStyles.saveButtonText,
                          color: colors.ButtonTextColor,
                        }}
                      >
                        Post Job
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {loading ? (
                  <ActivityIndicator size="large" color={colors.AppmainColor} />
                ) : jobs?.Data?.length > 0 ? (
                  <FlatList
                    data={jobs?.Data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItemFeatList}
                  />
                ) : (
                  <View style={{ alignItems: "center", marginTop: 30 }}>
                    <Text style={{ fontSize: 16, color: colors.textColor }}>
                      No jobs available
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 10,
    // margin: 10,
    //  backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
    flexDirection: "row",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    //color: Colors.secondGreen,
  },
  info: {
    // color: '#444',
    fontSize: 12,
    marginTop: 2,
  },

  textInput: {
    paddingTop: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 5,
    height: 40,
  },
  headerView: {
    flex: 0.09,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
  },
  JobfiledSection: { paddingTop: 10 },
  textInput: {
    paddingTop: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 5,
    height: 40,
  },
  dobView: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dobText: { fontSize: 13 },

  seconDOMView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "",
  },
  textInputDOM: {
    width: 60,
    height: 40,
    paddingTop: 5,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 5,
    marginRight: 10,
    textAlign: "center",
    textAlignVertical: "center",
  },
  save: {
    borderRadius: 10,
    paddingVertical: 15,
    backgroundColor: Colors.main_primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  saveText: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: "700",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    flex: 0.44,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 35,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  seclectIndiaView: {
    marginTop: 5,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  inputIcon: {
    position: "absolute",
    right: 10, // Place the icon at the right of the TextInput
  },

  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemText: {
    fontSize: 14,
    color: "black",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    backgroundColor: "#f9f9f9",
  },
  dropdownList: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    margin: 10,
    padding: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  text: {
    fontSize: 14,
  },
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  inputContainer: { flexDirection: "row", marginTop: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  addButton: {
    backgroundColor: Colors.secondGreen,
    padding: 12,
    marginLeft: 10,
    borderRadius: 8,
  },
  addText: { color: "#fff", fontWeight: "bold" },
  skillTag: {
    backgroundColor: Colors.secondGreen,
    padding: 8,
    margin: 5,
    borderRadius: 20,
  },
  skillText: { color: "#fff", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  bullet: {
    fontWeight: "bold",
    fontSize: 20,
    paddingHorizontal: 5,
    color: Colors.main_primary,
  },
  itemText: {
    fontSize: 17,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
    marginBottom: 10,
  },
  closeText: {
    color: "blue",
    fontSize: 16,
  },
  jobItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default CompanyDetails;
