import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import globalStyles from "../GlobalCSS";
import Header from "../Header/Header";
// import PlaneIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  addproject,
  baseUrl,
  bookmarkedprojects,
  deleteproject,
  internseeker,
  internseekerupdate,
  intrestedprojects,
  listoption,
  listproject,
  myinternseekerprofile,
  myproject,
  updateproject,
} from "../baseURL/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "../Icons/Icons";
import Colors from "../color";
import { useIsFocused } from "@react-navigation/native";
import DemoTest, { DemoTest1 } from "../DemoTest";
import CommonLoader from "../components/CommonLoader";
import { showError } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { universityFullName } from "../constants";

const IntershipProject = ({ navigation, route }) => {
  const { Item = {}, Type = "", GlobalSearch = {} } = route.params || {};
  console.log("GlobalSearch", GlobalSearch);
  const { isDark, colors, toggleTheme } = useTheme();
  const isFocused = useIsFocused();
  const [projectList, setProjectList] = useState([]);
  const [userData, setUserData] = useState(null);
  const [number, onChangeNumber] = useState("");
  const [selectedSection, setSelectedSection] = useState("Home");
  const [keyValue, setKeyValue] = useState([]);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const options3 = ["Part Time", "Full Time", "Flexible"];
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [isOpen6, setIsOpen6] = useState(false);
  const [isOpen7, setIsOpen7] = useState(false);
  const [selectedValue1, setSelectedValue1] = useState("1 Day");
  const [selectedValue5, setSelectedValue5] = useState("Select");
  const [selectedValue6, setSelectedValue6] = useState("Entry Level");
  const [selectedValue7, setSelectedValue7] = useState("Active");
  const [isOpen3, setIsOpen3] = useState(false);
  const [selectedValue2, setSelectedValue2] = useState("Part Time");
  const [selectedValue4, setSelectedValue4] = useState("Part Time");
  const [valueMyInter, setValueMyInter] = useState(false);
  const [valueBookmarked, setValueBookmarked] = useState(false);
  const [valueInterested, setValueInterested] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [myProjectData, setMyProjectData] = useState([]);
  const [industryData, setIndustryData] = useState([]);
  // console.log('industryData', industryData);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [skills, setSkills] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [workLoc, setWorkLoc] = useState("");
  const [preferredLoc, setPreferredLoc] = useState("");
  const [description, setDescription] = useState("");
  const [industryValue, setIndustryValue] = useState("");
  const [industryValueId, setIndustryValueID] = useState("");
  // console.log('industryValueId', industryValueId);
  // console.log(`Selected Date: ${year}-${month}-${day}`);
  const [flatlist, setFlatlist] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);
  // console.log('errorTitle', errorTitle);
  const [errorIndustry, setErrorIndustry] = useState(false);
  const [errorCountry, setErrorCountry] = useState(false);
  const [errorCity, SetErrorCity] = useState(false);
  const [errorPerred, setErrorPerred] = useState(false);
  const [errorWork, setErrorWork] = useState(false);
  const [errorPrice, setErrorPrice] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorSkill, setErrorSkill] = useState(false);
  const [errorTotalDays, setErrorTotalDays] = useState(false);
  const [cityTitle, setCityTitle] = useState("");
  const [title, setTitle] = useState("");
  const [internSeeker, setInternSeeker] = useState([]);
  const [internSeekerSelf, setInternSeekerSelf] = useState([]);
  const [seekerValue, setSeekerValue] = useState([]);
  const [editMyInterShip, setEditMyInterShip] = useState([]);
  const [errorDay, setErrorDay] = useState(false);
  const [errorMonth, setErrorMonth] = useState(false);
  const [errorYear, setErrorYear] = useState(false);
  const [proTitleInSeeker, setProTitleInSeeker] = useState("");
  const [overViewSeeker, setOverViewSeeker] = useState("");
  const [seekerSericeId, setSeekerSericeId] = useState("");
  const [mySeekerData, setMySeekerData] = useState({});
  const [checked, setChecked] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const scrollRef = useRef(null);
  const isActive = (section) => selectedSection === section;
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  useEffect(() => {
    if (
      typeof day === "string" &&
      typeof month === "string" &&
      typeof year === "string" &&
      day.length === 2 &&
      month.length === 2 &&
      year.length === 4
    ) {
      const enteredDate = new Date(`${year}-${month}-${day}`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isValidDate =
        enteredDate.getFullYear() === parseInt(year) &&
        enteredDate.getMonth() + 1 === parseInt(month) &&
        enteredDate.getDate() === parseInt(day);

      if (!isValidDate) {
        Alert.alert("Invalid Date", "The entered date does not exist.");
        setErrorDay(true);
        setErrorMonth(true);
        setErrorYear(true);
        return;
      }

      if (enteredDate < today) {
        Alert.alert("Invalid Date", "Please enter a future date.");
        setErrorDay(true);
        setErrorMonth(true);
        setErrorYear(true);
      } else {
        setErrorDay(false);
        setErrorMonth(false);
        setErrorYear(false);
      }
    }
  }, [day, month, year]);

  useEffect(() => {
    if (selectedValue5 !== "Select" && selectedValue5) {
      setErrorsServieSeeker(false);
    }
  }, [selectedValue5]);

  useEffect(() => {
    if (userData?.User?.userId) {
      fetchArticles();
    }
  }, [userData, isFocused]);

  const UserValue = async () => {
    try {
      const userDta = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const fetchArticles = async (item) => {
    setInitialLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listproject}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          projectTitle: title || GlobalSearch?.projectTitle || "",
          proCity: cityTitle || "",
          proNature: selectedValue4 || "",
        }),
      });

      const data = await response.json();
      if (response.ok && data.Status === 1) {
        setProjectList(data.Data);
      }
      setInitialLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };
  useEffect(() => {
    myInternshipProject();
  }, [valueMyInter, valueBookmarked, valueInterested]);
  useEffect(() => {
    if (editMyInterShip) {
      onChangeNumber(editMyInterShip?.projectTitle);
      setIndustryValue(editMyInterShip?.protIndusCategoryName);
      setSelectedCountry(editMyInterShip?.proCountry);
      setCity(editMyInterShip?.proCity);

      const dob = editMyInterShip?.postedDate;
      if (dob && typeof dob === "string" && dob.includes("-")) {
        const [day, month, year] = dob.split("-");
        setDay(day);
        setMonth(month);
        setYear(year);
      } else {
        console.warn("Invalid dob format:", dob);
      }
      setPreferredLoc(editMyInterShip?.proPreferredLocation);
      setWorkLoc(editMyInterShip?.proWorkLocation);
      setSelectedValue1(editMyInterShip?.proDuration);
      setPrice(editMyInterShip?.proEstimatedBudget);

      const currencyObj = currencyOptions.find(
        (item) => item.value === editMyInterShip?.proCurrency
      );
      setSelectedCurrency(currencyObj || null);
      setDescription(editMyInterShip?.projectDetails);
      setSkills(editMyInterShip?.proSkills);
      setSelectedValue2(editMyInterShip?.proNature);
      setIndustryValueID(editMyInterShip?.protIndusCategory);
    }
    if (editMyInterShip === undefined) {
      onChangeNumber();
      onChangeNumber();
      setIndustryValue();
      setSelectedCountry();
      setCity();
      setDay();
      setMonth();
      setYear();
      setPreferredLoc();
      setWorkLoc();
      setSelectedValue1();
      setPrice();

      const currencyObj = currencyOptions.find(
        (item) => item.value === editMyInterShip?.proCurrency
      );
      setSelectedCurrency();
      setDescription();
      setSkills();
      setSelectedValue2();
      setIndustryValueID();
    }
  }, [editMyInterShip]);

  const handlePress = (type) => {
    setMyProjectData([]);

    if (type === "myIntern") {
      setValueMyInter(true);
      setValueBookmarked(false);
      setValueInterested(false);
    } else if (type === "bookmarked") {
      setValueMyInter(false);
      setValueBookmarked(true);
      setValueInterested(false);
    } else if (type === "interested") {
      setValueMyInter(false);
      setValueBookmarked(false);
      setValueInterested(true);
    }
  };
  const myInternshipProject = async () => {
    setMyProjectData([]);
    let endpoint = "";

    if (valueMyInter) {
      endpoint = myproject;
    } else if (valueBookmarked) {
      endpoint = bookmarkedprojects;
    } else if (valueInterested) {
      endpoint = intrestedprojects;
    } else {
      console.warn("No valid project type selected");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
        }),
      });

      const data = await response.json();
      if (response.ok && data.Status === 1) {
        setMyProjectData(data.Data);
      } else {
        setMyProjectData([]); // Ensure no stale data remains
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };
  // const formattedMonth = String(month).padStart(2, '0');
  // const formattedDay = String(day).padStart(2, '0');
  // const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

  useEffect(() => {
    if (selectedSection === "Profile") {
      InternShipSeekersList();
    }
  }, [selectedSection]);

  const InternShipSeekersList = async () => {
    try {
      const response = await fetch(`${baseUrl}${internseeker}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setInternSeeker(data.Data);
        setInternSeekerSelf(data?.SelfProfile);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
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
          //  optionType: Val,
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
  useEffect(() => {
    UserValue();
    // getIndustryList({ Val: "" });
  }, []);
  // const getIndustryList = async ({ Val = "" } = {}) => {
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
  //     console.log(" value data --------->>>>>> > ", data?.DataList);

  //     if (response.ok) {
  //       setIndustryData(data?.DataList);
  //     } else {
  //       showError(data.message || "Failed to Industry List");
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //   }
  // };
  const handleCheckboxToggle = () => {
    const isValid =
      !!number?.trim() &&
      !!industryValue?.trim() &&
      !!selectedCountry &&
      !!city &&
      !!month &&
      !!year &&
      !!day &&
      !!description?.trim();
    //   && skillsArray?.length > 0;

    if (isValid) {
      setChecked(!checked);
    } else {
      if (!number?.trim()) setErrorTitle(true);
      if (!industryValue?.trim()) setErrorIndustry(true);
      if (!selectedCountry) setErrorCountry(true);
      if (!city) SetErrorCity(true);
      if (!month) setErrorMonth(true);
      if (!year) setErrorYear(true);
      if (!day) setErrorDay(true);
      if (!description?.trim()) setErrorDescription(true);
      // if (!skillsArray || skillsArray.length === 0) setErrorSkill(true);
    }
  };

  const AddInternship = async () => {
    let isValid = true;
    if (!checked) {
      showError("Please check the confirmation box before Save.");
      return;
    }
    if (!number) {
      setErrorTitle(true);
      isValid = false;
    } else {
      setErrorTitle(false);
    }
    if (!industryValue) {
      setErrorIndustry(true);
      isValid = false;
    } else {
      setErrorIndustry(false);
    }

    if (!selectedCountry) {
      setErrorCountry(true);
      isValid = false;
    } else {
      setErrorCountry(false);
    }

    if (!city) {
      SetErrorCity(true);
      isValid = false;
    } else {
      SetErrorCity(false);
    }

    if (!month) {
      setErrorMonth(true);
      isValid = false;
    } else {
      setErrorMonth(false);
    }

    if (!year) {
      setErrorYear(true);
      isValid = false;
    } else {
      setErrorYear(false);
    }
    if (!day) {
      setErrorDay(true);
      isValid = false;
    } else {
      setErrorDay(false);
    }

    // if (!preferredLoc) {
    //   setErrorPerred(true);
    //   isValid = false;
    // } else {
    //   setErrorPerred(false);
    // }

    // if (!workLoc) {
    //   setErrorWork(true);
    //   isValid = false;
    // } else {
    //   setErrorWork(false);
    // }

    // if (!price) {
    //   setErrorPrice(true);
    //   isValid = false;
    // } else {
    //   setErrorPrice(false);
    // }

    if (!description) {
      setErrorDescription(true);
      isValid = false;
    } else {
      setErrorDescription(false);
    }

    // if (skillsArray?.length == 0) {
    //   setErrorSkill(true);
    //   isValid = false;
    // } else {
    //   setErrorSkill(false);
    // }

    if (isValid) {
      console.log(
        "All fields are valid",
        `${baseUrl}${editMyInterShip ? updateproject : addproject}`
      );

      try {
        const response = await fetch(
          `${baseUrl}${editMyInterShip ? updateproject : addproject}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: editMyInterShip?.id || "",
              userId: userData?.User?.userId,

              protIndusCategory: industryValueId,
              projectTitle: number,
              proStartDate: `${year}-${month}-${day}`,
              // proStartDate: formattedDate,
              proPreferredLocation: preferredLoc,
              proWorkLocation: workLoc,
              proDuration: selectedValue1,
              proCountry: selectedCountry,
              proCity: city,
              proEstimatedBudget: price,
              proCurrency: selectedCurrency?.label?.toString() || "INR",
              projectDetails: description?.toString(),
              proSkills: skillsList.join(","),
              proNature: selectedValue2,
              projectStatus: 1,
            }),
          }
        );
        const text = await response.text();
        if (!response.ok) {
          console.error("Fetch failed with status", response.status);
          console.error("Raw response:", text);
          return;
        }

        // Try to parse JSON safely
        let data;
        try {
          data = JSON.parse(text);
        } catch (jsonError) {
          console.error("Invalid JSON:", text);
          return;
        }

        //const data = await response.json();
        if (response.ok) {
          console.log("Add Internship  ----", data);
          setSelectedSection("Home");
          fetchArticles();
        } else {
          console.error("Fetch Error:", data);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleDeleteProject = ({ item }) => {
    console.log("item ------- >", item?.id);
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this Internship?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await fetch(`${baseUrl}${deleteproject}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: item?.id,
                }),
              });

              const data = await response.json();
              console.log("data", data);

              myInternshipProject();

              if (response.ok) {
                console.log("data   ---- Delte", data);

                myInternshipProject();
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
  const renderItem = ({ item }) => {
    // Extract main duration (before parentheses)
    const mainDuration = item?.proDuration.split("(")[0].trim(); // "7 Day (1 week)" → "7 Day"

    // Extract number and unit from the main duration
    const extractedDuration = mainDuration.match(/(\d+)\s(\w+)/);
    const durationValue = extractedDuration ? extractedDuration[1] : "1"; // Default to "1"
    const durationUnit = extractedDuration ? extractedDuration[2] : "Day"; // Default to "Day"

    // Extract text inside parentheses (e.g., "1 week" from "7 Day (1 week)")
    const parenthesesTextMatch = item?.proDuration.match(/\(([^)]+)\)/);
    const parenthesesText = parenthesesTextMatch
      ? parenthesesTextMatch[1]
      : "1 Day";

    return (
      <TouchableOpacity
        style={{
          ...styles.card,
          backgroundColor: colors.textinputBackgroundcolor,
        }}
        onPress={() =>
          navigation.navigate("IntershipDetails", {
            Item: item,
          })
        }
      >
        <View
          style={{
            ...globalStyles.FlatListView,
            backgroundColor: colors.AppmainColor,
          }}
        >
          {/* Show value inside parentheses if exists, otherwise "1 Day" */}
          <Text
            style={{
              ...globalStyles.FlatListText,
              color: colors.ButtonTextColor,
            }}
          >
            {parenthesesText.split(" ")[0]}
          </Text>
          <Text
            style={{
              ...globalStyles.FlatListText,
              color: colors.ButtonTextColor,
            }}
          >
            {parenthesesText.split(" ")[1]}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...styles.title, color: colors.AppmainColor }}>
            {item.projectTitle}
          </Text>
          <Text style={{ ...styles.info, color: colors.textColor }}>
            Posted: {item.postedDate}
          </Text>
          <Text style={{ ...styles.info, color: colors.textColor }}>
            Start Date: {item.proStartDate}
          </Text>
          <Text style={{ ...styles.info, color: colors.textColor }}>
            Duration: {item.proDuration}
          </Text>
          <View style={globalStyles.FlatList2}>
            <Image
              style={globalStyles.ImageView}
              source={
                item?.UserDetail?.ProfilePhoto
                  ? { uri: item?.UserDetail?.ProfilePhoto }
                  : require("../../assets/placeholderprofileimage.png")
              }
            />
            <View>
              <Text style={{ ...styles.title, color: colors.AppmainColor }}>
                {item?.UserDetail?.UserName}
              </Text>
              <Text style={{ ...styles.info, color: colors.textColor }}>
                {item?.UserDetail?.JobTitle}
              </Text>
              <Text style={{ ...styles.info, color: colors.textColor }}>
                {item?.UserDetail?.CompanyName}
              </Text>
            </View>
          </View>
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
            {item.proPreferredLocation}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const renderItemMyInternship = ({ item }) => {
    // Extract main duration (before parentheses)
    const mainDuration = item?.proDuration.split("(")[0].trim(); // "7 Day (1 week)" → "7 Day"

    // Extract number and unit from the main duration
    const extractedDuration = mainDuration.match(/(\d+)\s(\w+)/);
    const durationValue = extractedDuration ? extractedDuration[1] : "1"; // Default to "1"
    const durationUnit = extractedDuration ? extractedDuration[2] : "Day"; // Default to "Day"

    // Extract text inside parentheses (e.g., "1 week" from "7 Day (1 week)")
    const parenthesesTextMatch = item?.proDuration.match(/\(([^)]+)\)/);
    const parenthesesText = parenthesesTextMatch
      ? parenthesesTextMatch[1]
      : "1 Day";

    return (
      <TouchableOpacity
        style={{
          ...styles.card,
          backgroundColor: colors.textinputBackgroundcolor,
        }}
        onPress={() =>
          navigation.navigate("IntershipDetails", {
            Item: item,
          })
        }
      >
        <View
          style={{
            ...globalStyles.FlatListView,
            backgroundColor: colors.AppmainColor,
          }}
        >
          {/* Show value inside parentheses if exists, otherwise "1 Day" */}
          <Text
            style={{
              ...globalStyles.FlatListText,
              color: colors.ButtonTextColor,
            }}
          >
            {parenthesesText.split(" ")[0]}
          </Text>
          <Text
            style={{
              ...globalStyles.FlatListText,
              color: colors.ButtonTextColor,
            }}
          >
            {parenthesesText.split(" ")[1]}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...styles.title, color: colors.AppmainColor }}>
            {item.protIndusCategoryName}
          </Text>

          <Text style={{ ...styles.info, color: colors.textColor }}>
            Posted: {item.postedDate}
          </Text>
          <Text style={{ ...styles.info, color: colors.textColor }}>
            Start Date: {item.proStartDate}
          </Text>
          <Text style={{ ...styles.info, color: colors.textColor }}>
            Duration: {item.proDuration}
          </Text>
          {valueMyInter ? (
            <View style={{ justifyContent: "flex-end", flexDirection: "row" }}>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => {
                  setSelectedSection("AddInternship"), setEditMyInterShip(item);
                }}
              >
                <Icon
                  name="pencil"
                  size={18}
                  color={colors.placeholderTextColor}
                  type="Octicons"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteProject({ item: item })}
              >
                <Icon
                  name="delete"
                  size={18}
                  color={colors.placeholderTextColor}
                  type="MaterialCommunityIcons"
                />
              </TouchableOpacity>
            </View>
          ) : null}

          {valueBookmarked || valueInterested ? (
            <View style={globalStyles.FlatList2}>
              <Image
                style={globalStyles.ImageView}
                source={
                  item?.UserDetail?.ProfilePhoto
                    ? { uri: item?.UserDetail?.ProfilePhoto }
                    : require("../../assets/placeholderprofileimage.png")
                }
              />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View>
                  <Text style={{ ...styles.title, color: colors.AppmainColor }}>
                    {item?.UserDetail?.UserName}
                  </Text>
                  <Text style={{ ...styles.info, color: colors.textColor }}>
                    {item?.UserDetail?.JobTitle}
                  </Text>
                  <Text style={{ ...styles.info, color: colors.textColor }}>
                    {item?.UserDetail?.CompanyName}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>
        {valueBookmarked ? (
          <View style={globalStyles.FlatListIconView}>
            <Icon
              name="location"
              size={18}
              color={colors.backIconColor}
              type="Ionicons"
            />
            <Text
              style={{ ...styles.info, color: colors.textColor, flexShrink: 1 }}
            >
              {item.proPreferredLocation}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };
  const currencyOptions = [
    { label: "INR", value: "INR" },
    { label: "USD", value: "USD" },
  ];
  const handleSelect = (currency) => {
    setSelectedCurrency(currency);
    setDropdownVisible(false);
  };
  const handleCountrySelection = (country) => {
    setSelectedCountry(country);
    setErrorCountry();
    setModalVisible1(!!modalVisible1);
  };
  const options2 = [
    "1 Day",
    "2 Day",
    "3 Day",
    "7 Day (1 week)",
    "14 Day (2 week)",
    "21 Day (3 week)",
    "28 Day (1 month)",
    "60 Day (2 month)",
    "90 Day (3 month)",
  ];
  const selectOption2 = (option) => {
    setSelectedValue1(option);
    setIsOpen2(false);
  };
  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2), setErrorTotalDays();
  };
  const options5 = [
    "Web and Software development",
    "Legal",
    "Graphic Design/Multimedia",
    "Writing/Editing/Translation",
    "Mobile App ",
    "Accounting/Finance",
    "Business Consulting",
    "Marketing/Sales",
    "Administrative",
    "Others",
  ];
  // const selectOption5 = (option) => {
  //   setSelectedValue5(option);
  //   setIsOpen5(false);
  // };
  const selectOption5 = (item, option) => {
    setIndustryValue(item.Name);
    setSelectedValue5(option);
    setShowIndustryModal(false);
  };
  const toggleDropdown5 = () => {
    setIsOpen5(!isOpen5);
  };
  const options6 = ["Entry level", "Intermediary", "Expert"];
  const selectOption6 = (option) => {
    setSelectedValue6(option);
    setIsOpen6(false);
  };
  const toggleDropdown6 = () => {
    setIsOpen6(!isOpen6);
  };
  const options7 = ["Active", "Inactive"];
  const selectOption7 = (option) => {
    setSelectedValue7(option);
    setIsOpen7(false);
  };
  const toggleDropdown7 = () => {
    setIsOpen7(!isOpen7);
  };
  const toggleDropdown3 = () => setIsOpen3(!isOpen3);
  const selectOption3 = (option) => {
    setSelectedValue2(option);
    setIsOpen3(false);
  };
  const options4 = ["Part Time", "Full Time", "Flexible"];
  const toggleDropdown4 = (option) => {
    setIsOpen4(!isOpen4);
  };
  const selectOption4 = (option) => {
    setSelectedValue4(option);
    setIsOpen4(false);
  };
  const renderItemInter = ({ item }) => {
    // console.log(item)
    return (
      <TouchableOpacity
        onPress={() => {
          setIndustryValue(item?.Name), setFlatlist(!flatlist);
          setErrorIndustry();
          setIndustryValueID(item?.Id);
        }}
        style={{ backgroundColor: Colors.lite_gray, margin: 5, padding: 5 }}
      >
        <Text>{item.Name}</Text>
      </TouchableOpacity>
    );
  };
  const renderItemInternSeeker = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: colors.textinputBackgroundcolor,
          margin: 5,
          padding: 20,
          borderBottomWidth: 1,
          borderColor: Colors.borderColor,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={
              item?.ProfilePhoto
                ? { uri: item?.ProfilePhoto }
                : require("../../assets/placeholderprofileimage.png")
            }
            style={{ width: 60, height: 60, borderRadius: 30, marginRight: 10 }}
          />
          <Text style={{ ...globalStyles.SeekerText, color: colors.textColor }}>
            {item?.UserName}
          </Text>
        </View>
        <View
          style={{
            marginTop: 10,
            borderTopWidth: 1,
            borderColor: colors.textinputbordercolor,
          }}
        >
          <Text style={{ color: colors.placeholderTextColor, paddingTop: 10 }}>
            Service offered
          </Text>
          <Text style={{ color: colors.textColor }}>
            {item?.Serviceoffered}
          </Text>
        </View>
        <View
          style={{
            marginTop: 10,
          }}
        >
          <Text style={{ color: colors.placeholderTextColor, paddingTop: 10 }}>
            Work Experience
          </Text>
          <Text style={{ color: colors.textColor }}>
            {item?.WorkExperience}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            ...globalStyles.saveButton,
            backgroundColor: colors.AppmainColor,
          }}
          onPress={() => {
            setSeekerValue(item), setMySeekerData();
            setTimeout(() => {
              scrollRef.current?.scrollTo({ y: 0, animated: true });
            }, 100);
          }}
        >
          <Text
            style={{
              ...globalStyles.saveButtonText,
              color: colors.ButtonTextColor,
            }}
          >
            View Full Profile
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const handleMySeekerProfile = async (item) => {
    setSeekerValue();
    try {
      const response = await fetch(`${baseUrl}${myinternseekerprofile}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
        }),
      });

      const data = await response.json();
      if (response.ok && data.Status === 1) {
        setMySeekerData(data.Data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };
  const [editViewTrue, setEditViewTrue] = useState(false);
  const [skill, setSkill] = useState("");
  const [skillsList, setSkillsList] = useState([]);
  useEffect(() => {
    if (editViewTrue && mySeekerData?.length > 0) {
      setSelectedValue5(mySeekerData[0]?.Serviceoffered);
      const skillsArray = mySeekerData[0]?.Skills
        ? mySeekerData[0].Skills.split(",").map((skill) => skill.trim())
        : [];
      setSkillsList(skillsArray);
      setProTitleInSeeker(mySeekerData[0]?.ProfessionalTitle || "");
      setOverViewSeeker(mySeekerData[0]?.BriefProfessonal || "");
      setSelectedValue6(mySeekerData[0]?.WorkExperience || "Select");
    }
  }, [mySeekerData, editViewTrue]);

  const isAddingRef = useRef(false);

  const addSkill = () => {
    const trimmedSkill = skill.trim();

    if (!trimmedSkill) {
      setErrorSkill(true);
      return;
    }

    // Prevent rapid taps using ref
    if (isAddingRef.current) return;
    isAddingRef.current = true;

    // Deduplicate with latest list
    setSkillsList((prevSkills) => {
      const alreadyExists = prevSkills.some(
        (s) => s.toLowerCase() === trimmedSkill.toLowerCase()
      );
      if (alreadyExists) {
        setErrorSkill(true);
        return prevSkills;
      } else {
        setErrorSkill(false);
        setSkill("");
        return [...prevSkills, trimmedSkill];
      }
    });

    // Reset the lock after short delay
    setTimeout(() => {
      isAddingRef.current = false;
    }, 500);
  };

  const removeSkill = (skillToRemove) => {
    setSkillsList((prev) => prev.filter((item) => item !== skillToRemove));
  };

  const [errorsServieSeeker, setErrorsServieSeeker] = useState(false);
  console.log("errorsServieSeeker ---- > ", errorsServieSeeker);
  const [errorsSkillsSeeker, setErrorsSkillsSeeker] = useState(false);
  const [errorTitle1, setErrorTitle1] = useState(false);
  const [errorDescription1, setErrorDescription1] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditMySeekerProfile = async () => {
    let isValid = true;

    if (selectedValue5 === "Select") {
      setErrorsServieSeeker(true);
      isValid = false;
      console.log("Service selection is invalid");
    } else {
      setErrorsServieSeeker(false);
    }

    if (skillsList.length === 0) {
      setErrorsSkillsSeeker(true);
      isValid = false;
      console.log("No skills provided");
    } else {
      setErrorsSkillsSeeker(false);
    }

    if (!proTitleInSeeker.trim()) {
      setErrorTitle1(true);
      isValid = false;
      console.log("Professional title is empty");
    } else {
      setErrorTitle1(false);
    }

    if (!overViewSeeker.trim()) {
      setErrorDescription1(true);
      isValid = false;
      console.log("Professional overview is empty");
    } else {
      setErrorDescription1(false);
    }

    if (!selectedValue6.trim() || !selectedValue7.trim()) {
      showError("Please select experience levels.");
      isValid = false;
      console.log("Experience values missing");
    }

    if (!isValid) {
      console.log("Form is invalid. Errors:", {
        errorsServieSeeker,
        errorsSkillsSeeker,
        errorTitle1,
        errorDescription1,
      });
      return;
    }

    const [seeker] = mySeekerData;

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}${internseekerupdate}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          serviceOffered: seekerSericeId || seeker?.ServiceofferedId,
          jobSkills: skillsList.toString(),
          experienceLevel: selectedValue6,
          professionalTitle: proTitleInSeeker,
          professionalBrief: overViewSeeker,
          freelancerStatus: selectedValue7 ? 1 : 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Edit OR Add Seeker Profile Success:", data);
        setSelectedSection("Home");
        handleMySeekerProfile();
      } else {
        console.error("Server Validation Error:", data);
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const [newSkill, setNewSkill] = useState("");
  const [skillsArray, setSkillsArray] = useState([]);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkillsArray([...skillsArray, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkillsArray(skillsArray.filter((s) => s !== skill));
  };
  if (initialLoading) {
    return <CommonLoader visible={true} />;
  }
  const renderTopTabs = () => (
    <View style={globalStyles.HeadeViewIcon}>
      <View
        style={{
          ...globalStyles.HeadeViewIcon2,
          borderColor: colors.textinputbordercolor,
        }}
      >
        <TouchableOpacity
          style={[
            globalStyles.HeadeViewTouch,
            {
              height: 75,
              backgroundColor: isActive("Home")
                ? colors.AppmainColor
                : isDark
                ? colors.textinputBackgroundcolor
                : "#bdbdbd",
            },
          ]}
          onPress={() => {
            setSelectedSection("Home");
            fetchArticles();
            setSeekerValue();
            setEditMyInterShip();
            setMySeekerData();
            setEditViewTrue(false);
          }}
        >
          <Icon
            name="home"
            size={18}
            color={colors.ButtonTextColor}
            type="FontAwesome"
          />
          <Text
            style={{
              color: colors.ButtonTextColor,
              marginTop: 5,
              fontSize: 10,
            }}
          >
            Apply
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          ...globalStyles.HeadeViewIcon2,
          borderColor: colors.textinputbordercolor,
        }}
      >
        <TouchableOpacity
          style={[
            globalStyles.HeadeViewTouch,
            {
              height: 75,
              backgroundColor: isActive("AddInternship")
                ? colors.AppmainColor
                : isDark
                ? colors.textinputBackgroundcolor
                : "#bdbdbd",
            },
          ]}
          onPress={() => {
            setSelectedSection("AddInternship"), setSeekerValue();
            setEditMyInterShip();
            setMySeekerData();
            setEditViewTrue(false);
          }}
        >
          <Icon
            name="plus"
            size={18}
            color={colors.ButtonTextColor}
            type="FontAwesome"
          />
          <Text
            style={{
              color: colors.ButtonTextColor,
              marginTop: 5,
              fontSize: 10,
            }}
          >
            Post Internship
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          ...globalStyles.HeadeViewIcon2,
          borderColor: colors.textinputbordercolor,
        }}
      >
        <TouchableOpacity
          style={[
            globalStyles.HeadeViewTouch,
            {
              height: 75,
              backgroundColor: isActive("Search")
                ? colors.AppmainColor
                : isDark
                ? colors.textinputBackgroundcolor
                : "#bdbdbd",
            },
          ]}
          onPress={() => {
            setSelectedSection("Search"), setSeekerValue();
            setEditMyInterShip();
            setMySeekerData();
            setEditViewTrue(false);
          }}
        >
          <Icon
            name="search"
            size={18}
            color={colors.ButtonTextColor}
            type="FontAwesome"
          />
          <Text
            style={{
              color: colors.ButtonTextColor,
              marginTop: 5,
              fontSize: 10,
            }}
          >
            Find Internship
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          ...globalStyles.HeadeViewIcon2,
          borderColor: colors.textinputbordercolor,
        }}
      >
        <TouchableOpacity
          style={[
            globalStyles.HeadeViewTouch,
            {
              height: 75,
              backgroundColor: isActive("Database")
                ? colors.AppmainColor
                : isDark
                ? colors.textinputBackgroundcolor
                : "#bdbdbd",
            },
          ]}
          onPress={() => {
            setSelectedSection("Database"), setSeekerValue();
            setEditMyInterShip();
            setMySeekerData();
            setEditViewTrue(false);
          }}
        >
          <Icon
            name="database"
            size={18}
            color={colors.ButtonTextColor}
            type="AntDesign"
          />
          <Text
            style={{
              color: colors.ButtonTextColor,
              marginTop: 5,
              fontSize: 10,
            }}
          >
            Manage Internship
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          ...globalStyles.HeadeViewIcon2,
          borderRightWidth: 0,
          borderColor: colors.textinputbordercolor,
        }}
      >
        <TouchableOpacity
          style={[
            globalStyles.HeadeViewTouch,
            {
              height: 75,
              backgroundColor: isActive("Profile")
                ? colors.AppmainColor
                : isDark
                ? colors.textinputBackgroundcolor
                : "#bdbdbd",
            },
          ]}
          onPress={() => {
            setSelectedSection("Profile"), setSeekerValue();
            setEditMyInterShip();
            setMySeekerData();
            setEditViewTrue(false);
          }}
        >
          <Icon
            name="person"
            size={18}
            color={colors.ButtonTextColor}
            type="Ionicons"
          />
          <Text
            style={{
              color: colors.ButtonTextColor,
              marginTop: 5,
              fontSize: 10,
            }}
          >
            Internship Seeker
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case "Home":
        return (
          <>
            <View
              style={{
                ...globalStyles.ViewINter,
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: colors.textinputBackgroundcolor,
              }}
            >
              <Text
                style={{
                  ...globalStyles.headlineText,
                  color: colors.textColor,
                }}
              >
                All Internships
              </Text>
            </View>

            <FlatList
              data={projectList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    color: colors.textColor,
                  }}
                >
                  No projects available.
                </Text>
              }
            />
          </>
        );
      case "AddInternship":
        return (
          <>
            <View style={{ flex: 1 }}>
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: 20,
                  }}
                >
                  <View style={globalStyles.ViewINter}>
                    <Text
                      style={{
                        ...globalStyles.headlineText,
                        color: colors.textColor,
                      }}
                    >
                      POST A INTERNSHIPS
                    </Text>
                  </View>

                  <View
                    style={{
                      ...globalStyles.JobfiledSection,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.JobfiledSectionText,
                        color: colors.textColor,
                        // color: errorTitle ? Colors.error : Colors.gray,
                      }}
                    >
                      Internship title<Text style={styles.redstar}>*</Text>
                    </Text>

                    <TextInput
                      style={{
                        ...styles.textInput,
                        borderColor: errorTitle
                          ? Colors.error
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}
                      onChangeText={(value) => {
                        onChangeNumber(value);
                        setErrorTitle(value.trim().length === 0);
                      }}
                      value={number}
                      placeholder="Write your internship title"
                      keyboardType="default"
                      multiline
                      placeholderTextColor={colors.placeholderTextColor}
                    />
                  </View>

                  <View
                    style={{
                      ...globalStyles.JobfiledSection,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.JobfiledSectionText,
                        color: colors.textColor,
                        // color: errorIndustry ? Colors.error : Colors.gray,
                      }}
                    >
                      Industry category<Text style={styles.redstar}>*</Text>
                    </Text>

                    {/* <TouchableOpacity
                      onPress={() => setFlatlist(!flatlist)}
                      style={{
                        ...styles.textInput,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderColor: errorIndustry
                          ? Colors.error
                          : colors.textinputbordercolor,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}
                    >
                      <Text style={{ color: colors.textColor }}>
                        {industryValue ? industryValue : "Industry"}
                      </Text>
                      <Icon
                        name="down"
                        size={15}
                        color={colors.backIconColor}
                        type="AntDesign"
                      />
                    </TouchableOpacity>

                    {flatlist ? (
                      <FlatList
                        data={industryData}
                        renderItem={renderItemInter}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                      />
                    ) : null} */}
                    <TouchableOpacity
                      onPress={() => setShowIndustryModal(true)}
                      style={{
                        ...styles.textInput,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderColor: errorIndustry
                          ? Colors.error
                          : colors.textinputbordercolor,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}
                    >
                      <Text style={{ color: colors.textColor }}>
                        {industryValue || "Industry"}
                      </Text>

                      <Icon
                        name="down"
                        size={15}
                        color={colors.backIconColor}
                        type="AntDesign"
                      />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={{
                      marginTop: 20,
                      paddingHorizontal: 10,
                      color: colors.textColor,
                      // color: errorCountry ? Colors.error : 'black',
                    }}
                  >
                    Country<Text style={styles.redstar}>*</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible1();
                    }}
                    style={{
                      marginHorizontal: 10,
                      ...globalStyles.seclectIndiaView,

                      borderColor: errorCountry
                        ? Colors.error
                        : colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.JobfiledSectionText,
                        paddingBottom: 0,
                        color: colors.textColor,
                        // color: errorCountry ? Colors.error : 'black',
                      }}
                    >
                      {selectedCountry ? selectedCountry : "Country"}
                    </Text>
                    <Icon
                      // onPress={() => navigation.goBack()}
                      type="AntDesign"
                      name="down"
                      size={15}
                      color={colors.backIconColor}
                      style={{ paddingLeft: 10 }}
                    />
                  </TouchableOpacity>

                  <View
                    style={{
                      ...globalStyles.JobfiledSection,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.JobfiledSectionText,
                        color: colors.textColor,
                        // color: errorCity ? Colors.error : Colors.gray,
                      }}
                    >
                      City<Text style={styles.redstar}>*</Text>
                    </Text>

                    <TextInput
                      style={{
                        ...styles.textInput,
                        borderColor: errorCity
                          ? Colors.error
                          : colors.textinputbordercolor,
                        backgroundColor: colors.textinputBackgroundcolor,
                        color: colors.textColor,
                      }}
                      onChangeText={(value) => {
                        setCity(value);
                        SetErrorCity(value.trim().length === 0);
                      }}
                      value={city}
                      placeholder="Write your City"
                      keyboardType="default"
                      multiline
                      placeholderTextColor={colors.placeholderTextColor}
                    />
                  </View>

                  <View style={styles.dobView}>
                    <Text
                      style={{ ...styles.dobText, color: colors.textColor }}
                    >
                      Internship Start date
                      <Text style={styles.redstar}>*</Text>
                    </Text>
                    <View style={styles.seconDOMView}>
                      <TextInput
                        style={{
                          ...styles.textInputDOM,
                          borderColor: errorDay
                            ? Colors.error
                            : colors.textinputbordercolor,
                          backgroundColor: colors.textinputBackgroundcolor,
                          color: colors.textColor,
                        }}
                        // onChangeText={value => {
                        //   setDay(value);
                        //   setErrorDay(value.trim().length === 0);
                        // }}
                        onChangeText={(value) => {
                          const numericValue = value.replace(/[^0-9]/g, "");
                          setDay(numericValue);
                          setErrorDay(numericValue.trim().length === 0);
                          if (numericValue.length === 2)
                            monthRef.current?.focus();
                        }}
                        value={day}
                        placeholder="DD"
                        multiline={false}
                        placeholderTextColor={colors.placeholderTextColor}
                        maxLength={2}
                        keyboardType="numeric"
                      />

                      <TextInput
                        ref={monthRef}
                        style={{
                          ...styles.textInputDOM,
                          borderColor: errorMonth
                            ? Colors.error
                            : colors.textinputbordercolor,
                          backgroundColor: colors.textinputBackgroundcolor,
                          color: colors.textColor,
                        }}
                        onChangeText={(value) => {
                          const numericValue = value.replace(/[^0-9]/g, "");
                          setMonth(numericValue);
                          setErrorMonth(numericValue.trim().length === 0);
                          if (numericValue.length === 2)
                            yearRef.current?.focus();
                        }}
                        value={month}
                        placeholder="MM"
                        keyboardType="numeric"
                        multiline={false}
                        placeholderTextColor={colors.placeholderTextColor}
                        maxLength={2}
                      />
                      <TextInput
                        ref={yearRef}
                        style={{
                          ...styles.textInputDOM,
                          borderColor: errorYear
                            ? Colors.error
                            : colors.textinputbordercolor,
                          backgroundColor: colors.textinputBackgroundcolor,
                          color: colors.textColor,
                          marginRight: 0,
                        }}
                        onChangeText={(value) => {
                          const numericValue = value.replace(/[^0-9]/g, "");
                          setYear(numericValue);
                          setErrorYear(numericValue.trim().length === 0);
                        }}
                        // onChangeText={value => {
                        //   setYear(value);
                        //   setErrorYear(value.trim().length === 0);
                        // }}
                        value={year}
                        placeholder="YYYY"
                        keyboardType="numeric"
                        multiline={false}
                        placeholderTextColor={colors.placeholderTextColor}
                        maxLength={4}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      ...globalStyles.JobfiledSection,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.JobfiledSectionText,
                        color: colors.textColor,
                        // color: errorPerred ? Colors.error : Colors.gray,
                      }}
                    >
                      Preferred location of the Internship Seeker
                      {/* <Text style={styles.redstar}>*</Text> */}
                    </Text>

                    <TextInput
                      style={{
                        ...styles.textInput,
                        borderColor: colors.textinputbordercolor,
                        backgroundColor: colors.textinputBackgroundcolor,
                        color: colors.textColor,
                        // borderColor: errorPerred ? Colors.error : Colors.gray,
                      }}
                      onChangeText={(value) => {
                        setPreferredLoc(value);
                        //setErrorPerred(value.trim().length === 0);
                      }}
                      value={preferredLoc}
                      placeholder="Write your Preferred location"
                      keyboardType="default"
                      multiline
                      placeholderTextColor={colors.placeholderTextColor}
                    />
                  </View>

                  <View
                    style={{
                      ...globalStyles.JobfiledSection,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.JobfiledSectionText,
                        color: colors.textColor,
                        // color: errorWork ? Colors.error : Colors.gray,
                      }}
                    >
                      Work location
                      {/* <Text style={styles.redstar}>*</Text> */}
                    </Text>

                    <TextInput
                      style={{
                        ...styles.textInput,
                        borderColor: colors.textinputbordercolor,
                        backgroundColor: colors.textinputBackgroundcolor,
                        color: colors.textColor,
                        // borderColor: errorWork ? Colors.error : Colors.gray,
                      }}
                      onChangeText={(value) => {
                        setWorkLoc(value);
                        //setErrorWork(value.trim().length === 0);
                      }}
                      value={workLoc}
                      placeholder="Write your Work location"
                      keyboardType="default"
                      multiline
                      placeholderTextColor={colors.placeholderTextColor}
                    />
                  </View>

                  <Text
                    style={{
                      marginTop: 20,
                      paddingHorizontal: 10,
                      color: colors.textColor,
                      // color: errorTotalDays ? Colors.error : Colors.gray,
                    }}
                  >
                    Duration of the Internship
                    <Text style={styles.redstar}>*</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={toggleDropdown2}
                    style={{
                      marginHorizontal: 10,
                      ...globalStyles.seclectIndiaView,
                      borderColor: colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.JobfiledSectionText,
                        paddingBottom: 0,
                        color: colors.textColor,
                      }}
                    >
                      {selectedValue1}
                    </Text>
                    <Icon
                      type="AntDesign"
                      name="down"
                      size={15}
                      color={colors.backIconColor}
                      style={{ paddingLeft: 10 }}
                    />
                  </TouchableOpacity>
                  {isOpen2 && (
                    <View
                      style={{
                        ...globalStyles.dropdownList,
                        backgroundColor: colors.textinputBackgroundcolor,
                        borderColor: colors.textinputbordercolor,
                      }}
                    >
                      {options2.map((option, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{
                            ...globalStyles.dropdownItem,
                            borderColor: colors.textinputbordercolor,
                          }}
                          onPress={() => selectOption2(option)}
                        >
                          <Text
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

                  <View style={globalStyles.containerSkill}>
                    <View
                      style={{
                        ...globalStyles.JobfiledSection,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text
                        style={{
                          ...styles.JobfiledSectionText,
                          color: colors.textColor,
                          // color: errorPrice ? Colors.error : Colors.gray,
                        }}
                      >
                        Stipend for the Duration
                        {/* <Text style={styles.redstar}>*</Text> */}
                      </Text>

                      <TextInput
                        style={{
                          ...styles.textInput,
                          borderColor: colors.textinputbordercolor,
                          color: colors.textColor,
                          backgroundColor: colors.textinputBackgroundcolor,
                          // borderColor: errorPrice ? Colors.error : Colors.gray,
                        }}
                        onChangeText={(value) => {
                          setPrice(value);
                          // setErrorPrice(value.trim().length === 0);
                        }}
                        value={price}
                        placeholder="Amount"
                        keyboardType="default"
                        multiline
                        placeholderTextColor={colors.placeholderTextColor}
                      />
                    </View>

                    <TouchableOpacity
                      onPress={() => setDropdownVisible(!isDropdownVisible)}
                      style={{
                        marginHorizontal: 10,
                        ...globalStyles.seclectIndiaView,
                        borderColor: colors.textinputbordercolor,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}
                    >
                      <Text style={{ ...styles.text, color: colors.textColor }}>
                        {selectedCurrency
                          ? selectedCurrency.label
                          : "Select Currency"}
                      </Text>
                    </TouchableOpacity>

                    {isDropdownVisible && (
                      <View
                        style={{
                          marginTop: 5,
                          borderWidth: 1,
                          borderColor: colors.textinputbordercolor,
                          backgroundColor: colors.textinputBackgroundcolor,
                          padding: 10,
                        }}
                      >
                        <FlatList
                          data={currencyOptions}
                          keyExtractor={(item) => item.value}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              onPress={() => handleSelect(item)}
                              style={{
                                padding: 5,
                                borderBottomWidth: 1,
                                borderColor: colors.textinputbordercolor,
                              }}
                            >
                              <Text style={{ color: colors.textColor }}>
                                {item.label}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    )}
                  </View>

                  <View style={globalStyles.JobfiledSection}>
                    <Text
                      style={{
                        ...styles.JobfiledSectionText,
                        paddingHorizontal: 10,
                        color: colors.textColor,
                        // color: errorDescription ? Colors.error : Colors.gray,
                      }}
                    >
                      Description<Text style={styles.redstar}>*</Text>
                    </Text>
                    <TextInput
                      style={{
                        ...styles.textInput,
                        color: colors.textColor,
                        marginHorizontal: 10,
                        height: 80,
                        borderColor: errorDescription
                          ? Colors.error
                          : colors.textinputbordercolor,
                        backgroundColor: colors.textinputBackgroundcolor,
                        textAlignVertical: "top",
                      }}
                      onChangeText={(value) => {
                        setDescription(value);
                        setErrorDescription(value.trim().length === 0);
                      }}
                      value={description}
                      placeholder="Write your Description"
                      keyboardType="default"
                      multiline
                      placeholderTextColor={colors.placeholderTextColor}
                    />
                  </View>

                  <Text
                    style={{
                      marginTop: 20,
                      paddingHorizontal: 10,
                      color: colors.textColor,
                    }}
                  >
                    Skills<Text style={styles.redstar}>*</Text>
                  </Text>

                  <View style={globalStyles.containerSkill}>
                    <FlatList
                      data={skillsList}
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={3}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={{
                            ...globalStyles.skillTag,
                            backgroundColor: colors.AppmainColor,
                          }}
                          onPress={() => removeSkill(item)}
                        >
                          <Text
                            style={{
                              ...globalStyles.skillText,
                              color: colors.ButtonTextColor,
                            }}
                          >
                            {item} ✕
                          </Text>
                        </TouchableOpacity>
                      )}
                    />

                    <View style={globalStyles.inputContainerSkill}>
                      <TextInput
                        placeholder="Enter skill..."
                        placeholderTextColor={colors.placeholderTextColor}
                        value={skill}
                        onChangeText={setSkill}
                        style={{
                          ...globalStyles.inputSkill,
                          borderColor: errorSkill
                            ? Colors.error
                            : colors.textinputbordercolor,
                          color: colors.textColor,
                          backgroundColor: colors.textinputBackgroundcolor,
                        }}
                      />
                      <TouchableOpacity
                        onPress={addSkill}
                        style={{
                          ...globalStyles.addButton,
                          backgroundColor: colors.AppmainColor,
                        }}
                      >
                        <Text
                          style={{
                            ...globalStyles.addText,
                            color: colors.ButtonTextColor,
                          }}
                        >
                          + Add
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text
                    style={{
                      marginTop: 20,
                      paddingHorizontal: 10,
                      color: colors.textColor,
                    }}
                  >
                    Nature of Internship duration
                  </Text>
                  <TouchableOpacity
                    onPress={toggleDropdown3}
                    style={{
                      marginHorizontal: 10,
                      ...globalStyles.seclectIndiaView,
                      borderColor: colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.JobfiledSectionText,
                        paddingBottom: 0,
                        color: colors.textColor,
                      }}
                    >
                      {selectedValue2 || "Select"}
                    </Text>
                    <Icon
                      type="AntDesign"
                      name="down"
                      size={15}
                      color={colors.backIconColor}
                      style={{ paddingLeft: 10 }}
                    />
                  </TouchableOpacity>
                  {isOpen3 && (
                    <View
                      style={{
                        ...globalStyles.dropdownList,
                        backgroundColor: colors.textinputBackgroundcolor,
                        borderColor: colors.textinputbordercolor,
                      }}
                    >
                      {options3.map((option, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{
                            ...globalStyles.dropdownItem,
                            borderColor: colors.textinputbordercolor,
                          }}
                          onPress={() => selectOption3(option)}
                        >
                          <Text
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
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 20,
                      marginHorizontal: 10,
                      borderLeftWidth: 4,
                      paddingLeft: 10,
                      borderColor: colors.AppmainColor,
                    }}
                  >
                    <TouchableOpacity onPress={handleCheckboxToggle}>
                      <MaterialCommunityIcons
                        name={
                          checked ? "checkbox-marked" : "checkbox-blank-outline"
                        }
                        size={24}
                        color={colors.AppmainColor}
                        style={{ marginRight: 10 }}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 14,
                        flexShrink: 1,
                        color: colors.textColor,
                      }}
                    >
                      I confirm that this is a commercial internship. I am aware
                      that I may receive a written warning for violating the
                      General Terms and Conditions and that my internship may be
                      deactivated.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{
                      ...globalStyles.saveButton,
                      backgroundColor: colors.AppmainColor,
                      margin: 20,
                      opacity: checked ? 1 : 0.5,
                    }}
                    disabled={!checked}
                    onPress={() => AddInternship()}
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
                </ScrollView>
              </KeyboardAvoidingView>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible1}
                onRequestClose={() => {
                  setModalVisible1(!modalVisible1);
                }}
              >
                <View style={styles.centeredView}>
                  <View
                    style={{
                      ...styles.modalView,
                      flex: 0.6,
                      padding: 20,
                      backgroundColor: colors.modelBackground,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible1(!!modalVisible1);
                      }}
                      style={{ alignSelf: "flex-end" }}
                    >
                      <Icon
                        name="cross"
                        size={25}
                        color={colors.backIconColor}
                        type="Entypo"
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        alignItems: "center",
                        borderBottomWidth: 0.5,
                        borderColor: colors.textinputbordercolor,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          padding: 15,
                          fontWeight: "700",
                          color: colors.textColor,
                        }}
                      >
                        {"Select Country"}
                      </Text>
                    </View>

                    <DemoTest
                      setSelectedCountry={handleCountrySelection}
                      Datatype={"wantCountryeData"}
                    />
                  </View>
                </View>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                  setModalVisible2(!modalVisible2);
                }}
              >
                <View style={styles.centeredView}>
                  <View
                    style={{
                      ...styles.modalView,
                      flex: 0.6,
                      padding: 20,
                      backgroundColor: colors.modelBackground,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible2(!!modalVisible2);
                      }}
                      style={{ alignSelf: "flex-end" }}
                    >
                      <Icon
                        name="cross"
                        size={15}
                        color={colors.backIconColor}
                        type="Entypo"
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        alignItems: "center",
                        borderColor: colors.textinputbordercolor,
                        borderBottomWidth: 0.5,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          padding: 15,
                          fontWeight: "700",
                          color: colors.textColor,
                        }}
                      >
                        Key Skills
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        marginBottom: 10,
                        margin: 20,
                      }}
                    >
                      <TextInput
                        style={{
                          ...styles.textInput,
                          borderColor: colors.textinputbordercolor,
                          color: colors.textColor,
                          backgroundColor: colors.textinputBackgroundcolor,
                          flex: 0,
                          height: 40,
                          paddingTop: 0,
                        }}
                        value={number}
                        onChangeText={(value) => {
                          handleKeySkill(value);
                        }}
                        onSubmitEditing={() => {
                          handleSaveKeySkill(number);
                        }}
                        returnKeyType="done"
                      />
                      {keyValue.length > 0 ? (
                        <View style={styles.skillValueMainView}>
                          {keyValue.map((item, index) => (
                            <View key={index} style={styles.skllSecondView}>
                              <Text style={globalStyles.skillText}>
                                {typeof item === "object"
                                  ? item.skillText
                                  : item}
                              </Text>
                              <TouchableOpacity
                                style={{ paddingLeft: 2 }}
                                onPress={() => {
                                  deleteSkills(item);
                                }}
                              >
                                <Icon
                                  name="cross"
                                  size={15}
                                  color={colors.backIconColor}
                                  type="Entypo"
                                />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      ) : null}
                    </View>

                    <View style={globalStyles.flexRow}>
                      <TouchableOpacity
                        onPress={() => {
                          setModalVisible2(!!modalVisible2);
                          closeSkillsModal();
                        }}
                        // onPress={() => handleSaveKeySkill()}
                        style={{
                          ...styles.save,
                          borderWidth: 0.5,
                          marginRight: 10,
                          flex: 1,
                          borderColor: colors.textinputbordercolor,
                        }}
                      >
                        <Text
                          style={{
                            ...styles.saveText,
                            color: Colors.black,
                          }}
                        >
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        // onPress={addSkills}
                        style={{
                          ...styles.save,
                          flex: 1,
                          backgroundColor: colors.AppmainColor,
                        }}
                      >
                        <Text style={styles.saveText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </>
        );
      case "Search":
        return (
          <>
            <View style={{}}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    ...globalStyles.JobfiledSection,
                    paddingHorizontal: 10,
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      ...styles.JobfiledSectionText,
                      color: colors.textColor,
                    }}
                  >
                    What Internship name
                  </Text>

                  <TextInput
                    style={{
                      ...styles.textInput,
                      borderColor: colors.textinputbordercolor,
                      color: colors.textColor,
                      backgroundColor: colors.textinputBackgroundcolor,
                      //   borderColor: errorJob ? Colors.error : Colors.gray,
                    }}
                    onChangeText={(value) => {
                      setTitle(value);
                      //   setErrorJov(value.trim().length === 0);
                    }}
                    value={title}
                    placeholder=""
                    keyboardType="default"
                    multiline
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                </View>

                <View
                  style={{
                    ...globalStyles.JobfiledSection,
                    paddingHorizontal: 10,
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      ...styles.JobfiledSectionText,
                      color: colors.textColor,
                      // height: 40,
                      //   color: errorJob ? Colors.error : Colors.gray,
                    }}
                  >
                    Where City or country
                  </Text>

                  <TextInput
                    style={{
                      ...styles.textInput,
                      borderColor: colors.textinputbordercolor,
                      color: colors.textColor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                    onChangeText={(value) => {
                      setCityTitle(value);
                    }}
                    value={cityTitle}
                    placeholder=""
                    keyboardType="default"
                    multiline
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                </View>
              </View>

              <Text
                style={{
                  marginTop: 20,
                  paddingHorizontal: 10,
                  color: colors.textColor,
                }}
              >
                Nature of Internship
              </Text>
              <TouchableOpacity
                onPress={toggleDropdown4}
                style={{
                  marginHorizontal: 10,
                  ...globalStyles.seclectIndiaView,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.textinputBackgroundcolor,
                }}
              >
                <Text
                  style={{
                    ...styles.JobfiledSectionText,
                    paddingBottom: 0,
                    color: colors.textColor,
                  }}
                >
                  {selectedValue4}
                </Text>
              </TouchableOpacity>
              {isOpen4 && (
                <View
                  style={{
                    ...globalStyles.dropdownList,
                    backgroundColor: colors.textinputBackgroundcolor,
                    borderColor: colors.textinputbordercolor,
                  }}
                >
                  {options4.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        ...globalStyles.dropdownItem,
                        borderColor: colors.textinputbordercolor,
                      }}
                      onPress={() => selectOption4(option)}
                    >
                      <Text style={{ ...styles.text, color: colors.textColor }}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={{
                  ...globalStyles.saveButton,
                  backgroundColor: colors.AppmainColor,
                  margin: 20,
                }}
                onPress={() => {
                  fetchArticles(), setCityTitle(""), setTitle("");
                }}
              >
                <Text
                  style={{
                    ...globalStyles.saveButtonText,
                    color: colors.ButtonTextColor,
                  }}
                >
                  Search
                </Text>
              </TouchableOpacity>
            </View>

            <View style={globalStyles.ViewINter1}>
              <Text
                style={{
                  ...globalStyles.headlineText,
                  color: colors.textColor,
                }}
              >
                All Internship{" "}
              </Text>
            </View>

            <FlatList
              data={projectList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    color: colors.textColor,
                  }}
                >
                  No projects available.
                </Text>
              }
            />
          </>
        );
      case "Database":
        return (
          <>
            <View style={{}}>
              <TouchableOpacity
                onPress={() => handlePress("myIntern")}
                style={{
                  ...globalStyles.Myintern,
                  backgroundColor: valueMyInter
                    ? colors.AppmainColor
                    : colors.textinputBackgroundcolor,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  style={{
                    ...globalStyles.SearchInternText,
                    color: valueMyInter ? Colors.white : colors.textColor,
                  }}
                >
                  My Internship
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePress("bookmarked")}
                style={{
                  ...globalStyles.Myintern,
                  backgroundColor: valueBookmarked
                    ? colors.AppmainColor
                    : colors.textinputBackgroundcolor,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  style={{
                    ...globalStyles.SearchInternText,
                    color: valueBookmarked ? Colors.white : colors.textColor,
                  }}
                >
                  Bookmarked Internship
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePress("interested")}
                style={{
                  ...globalStyles.Myintern,
                  backgroundColor: valueInterested
                    ? colors.AppmainColor
                    : colors.textinputBackgroundcolor,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  style={{
                    ...globalStyles.SearchInternText,
                    color: valueInterested ? Colors.white : colors.textColor,
                  }}
                >
                  Internship I am interested in
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                style={{
                  ...globalStyles.saveButton,
                  margin: 20,
                  backgroundColor: colors.AppmainColor,
                  paddingVertical: 10,
                }}
                onPress={() => setSelectedSection("AddInternship")}
              >
                <Text
                  style={{
                    ...globalStyles.saveButtonText,
                    color: colors.ButtonTextColor,
                  }}
                >
                  Post a Internship{" "}
                </Text>
              </TouchableOpacity>
            </View>
            {valueInterested ? (
              myProjectData?.length == 0 ? (
                <View
                  style={{
                    marginTop: 10,
                    paddingBottom: 40,
                  }}
                >
                  <View style={{ flex: 1, margin: 35 }}>
                    <Text
                      style={{
                        color: colors.textColor,
                        fontWeight: "800",
                        fontSize: 14,
                      }}
                    >
                      You have not shown your interest in working for any
                      Project.
                    </Text>
                  </View>

                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={{ color: colors.textColor }}>
                      Explore suitable projects now!
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setSelectedSection("Search")}
                    style={{
                      backgroundColor: colors.AppmainColor,
                      alignSelf: "center",
                      padding: 10,
                      margin: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.ButtonTextColor,
                        fontWeight: "600",
                        fontSize: 14,
                      }}
                    >
                      Find Projects
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null
            ) : null}

            <View>
              {valueMyInter ? (
                <FlatList
                  data={myProjectData}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItemMyInternship}
                />
              ) : null}
              {valueBookmarked ? (
                <FlatList
                  data={myProjectData}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItemMyInternship}
                />
              ) : null}
              {valueInterested ? (
                <FlatList
                  data={myProjectData}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItemMyInternship}
                />
              ) : null}
            </View>
          </>
        );
      case "Profile":
        return (
          <>
            <ScrollView
              ref={scrollRef}
              style={{}}
              showsVerticalScrollIndicator={false}
            >
              <View>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      backgroundColor: colors.textinputBackgroundcolor,
                      padding: 10,
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontSize: 18, color: colors.textColor }}>
                      Internship Seekers
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (mySeekerData?.length > 0) {
                        setEditViewTrue(true);
                        handleMySeekerProfile();
                        getIndustryList({ Val: "projectindustries" });
                      } else {
                        handleMySeekerProfile();
                        getIndustryList({ Val: "projectindustries" });
                        if (internSeekerSelf === false) {
                          setEditViewTrue(true);
                        }
                      }
                    }}
                    style={{
                      backgroundColor: colors.AppmainColor,
                      padding: 10,
                      flex: 1,
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.ButtonTextColor,
                        fontWeight: "700",
                      }}
                    >
                      {internSeekerSelf
                        ? mySeekerData?.length > 0
                          ? "Edit my Project Seeker profile"
                          : "My Project Seeker profile"
                        : "Resigter"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View>
                  {editViewTrue ? (
                    <>
                      <View
                        style={{
                          backgroundColor: colors.background,
                          marginTop: 10,
                        }}
                      >
                        <View
                          style={{
                            padding: 10,
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: colors.textinputbordercolor,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 18,
                              color: colors.AppmainColor,
                              fontWeight: "800",
                            }}
                          >
                            {internSeekerSelf === false
                              ? `Register as a Project Seeker on ${universityFullName}`
                              : " Update Project Seeker profile"}
                          </Text>
                          <Text
                            style={{
                              marginTop: 10,
                              fontSize: 14,
                              color: colors.placeholderTextColor,
                            }}
                          >
                            {internSeekerSelf === false
                              ? "At the outset, it will be great to know your expertise which will help us connect you with relevant projects and help you grow your business."
                              : null}
                          </Text>
                        </View>

                        <Text
                          style={{
                            marginTop: 20,
                            paddingHorizontal: 10,
                            color: errorsServieSeeker
                              ? Colors.error
                              : colors.placeholderTextColor,
                          }}
                        >
                          Your area of service offered
                        </Text>
                        <TouchableOpacity
                          onPress={toggleDropdown5}
                          style={{
                            marginHorizontal: 10,
                            ...globalStyles.seclectIndiaView,
                            borderColor: errorsServieSeeker
                              ? Colors.error
                              : colors.textinputbordercolor,
                            backgroundColor: colors.textinputBackgroundcolor,
                          }}
                        >
                          <Text
                            style={{
                              ...styles.JobfiledSectionText,
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
                              backgroundColor: colors.textinputBackgroundcolor,
                              borderColor: colors.textinputbordercolor,
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
                                  selectOption5(item?.Name),
                                    setSeekerSericeId(item?.Id);
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.text,
                                    color: colors.textColor,
                                  }}
                                >
                                  {item?.Name}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}

                        <View style={globalStyles.containerSkill}>
                          <Text
                            style={{
                              marginTop: 20,
                              color: errorsSkillsSeeker
                                ? Colors.error
                                : colors.placeholderTextColor,
                            }}
                          >
                            Skills
                          </Text>
                          <FlatList
                            data={skillsList}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={3}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                style={{
                                  ...globalStyles.skillTag,
                                  backgroundColor: colors.AppmainColor,
                                }}
                                onPress={() => removeSkill(item)}
                              >
                                <Text
                                  style={{
                                    ...globalStyles.skillText,
                                    color: colors.ButtonTextColor,
                                  }}
                                >
                                  {item} ✕
                                </Text>
                              </TouchableOpacity>
                            )}
                          />

                          <View style={globalStyles.inputContainerSkill}>
                            <TextInput
                              placeholder="Enter skill..."
                              placeholderTextColor={colors.placeholderTextColor}
                              value={skill}
                              onChangeText={(val) => {
                                setSkill(val), setErrorsSkillsSeeker(false);
                              }}
                              style={{
                                ...globalStyles.inputSkill,
                                borderColor: errorsSkillsSeeker
                                  ? Colors.error
                                  : colors.textinputbordercolor,
                                color: colors.textColor,
                                backgroundColor:
                                  colors.textinputBackgroundcolor,
                              }}
                            />
                            <TouchableOpacity
                              onPress={addSkill}
                              style={{
                                ...globalStyles.addButton,
                                backgroundColor: colors.AppmainColor,
                              }}
                            >
                              <Text
                                style={{
                                  ...globalStyles.addText,
                                  color: colors.ButtonTextColor,
                                }}
                              >
                                + Add
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <Text
                          style={{
                            marginTop: 20,
                            paddingHorizontal: 10,
                            color: colors.placeholderTextColor,
                            // color: errorTotalDays ? Colors.error : Colors.gray,
                          }}
                        >
                          Work experience level
                        </Text>
                        <TouchableOpacity
                          onPress={toggleDropdown6}
                          style={{
                            marginHorizontal: 10,
                            ...globalStyles.seclectIndiaView,
                            borderColor: colors.textinputbordercolor,
                            backgroundColor: colors.textinputBackgroundcolor,
                          }}
                        >
                          <Text
                            style={{
                              ...styles.JobfiledSectionText,
                              paddingBottom: 0,
                              color: colors.textColor,
                            }}
                          >
                            {selectedValue6}
                          </Text>
                        </TouchableOpacity>
                        {isOpen6 && (
                          <View
                            style={{
                              ...globalStyles.dropdownList,
                              backgroundColor: colors.textinputBackgroundcolor,
                              borderColor: colors.textinputbordercolor,
                            }}
                          >
                            {options6.map((option, index) => (
                              <TouchableOpacity
                                key={index}
                                style={{
                                  ...globalStyles.dropdownItem,
                                  borderColor: colors.textinputbordercolor,
                                }}
                                onPress={() => selectOption6(option)}
                              >
                                <Text
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

                        <View
                          style={{
                            ...globalStyles.JobfiledSection,
                            paddingHorizontal: 10,
                          }}
                        >
                          <Text
                            style={{
                              ...styles.JobfiledSectionText,
                              color: errorTitle1
                                ? Colors.error
                                : colors.placeholderTextColor,
                            }}
                          >
                            Professional title that best describes your work
                          </Text>

                          <TextInput
                            style={{
                              ...styles.textInput,
                              borderColor: errorTitle1
                                ? Colors.error
                                : colors.textinputbordercolor,
                              color: colors.textColor,
                              backgroundColor: colors.textinputBackgroundcolor,
                            }}
                            onChangeText={(value) => {
                              setProTitleInSeeker(value);
                              setErrorTitle1(value.trim().length === 0);
                            }}
                            value={proTitleInSeeker}
                            placeholder="Write your Industry category"
                            keyboardType="default"
                            multiline
                            placeholderTextColor={colors.placeholderTextColor}
                          />
                        </View>

                        <View style={globalStyles.JobfiledSection}>
                          <Text
                            style={{
                              ...styles.JobfiledSectionText,
                              paddingHorizontal: 10,
                              color: errorDescription1
                                ? Colors.error
                                : colors.placeholderTextColor,
                            }}
                          >
                            Brief professional overview (maximum 5000
                            characters)
                          </Text>
                          <TextInput
                            style={{
                              ...styles.textInput,
                              marginHorizontal: 10,
                              height: 80,
                              borderColor: errorDescription1
                                ? Colors.error
                                : colors.textinputbordercolor,
                              color: colors.textColor,
                              backgroundColor: colors.textinputBackgroundcolor,
                            }}
                            onChangeText={(value) => {
                              setOverViewSeeker(value);
                              setErrorDescription1(value.trim().length === 0);
                            }}
                            value={overViewSeeker}
                            placeholder="Write your Description"
                            keyboardType="default"
                            multiline
                            placeholderTextColor={colors.placeholderTextColor}
                          />
                        </View>

                        <Text
                          style={{
                            marginTop: 20,
                            paddingHorizontal: 10,
                            color: colors.placeholderTextColor,
                          }}
                        >
                          Work experience level
                        </Text>
                        <TouchableOpacity
                          onPress={toggleDropdown7}
                          style={{
                            marginHorizontal: 10,
                            ...globalStyles.seclectIndiaView,
                            borderColor: colors.textinputbordercolor,
                            backgroundColor: colors.textinputBackgroundcolor,
                          }}
                        >
                          <Text
                            style={{
                              ...styles.JobfiledSectionText,
                              paddingBottom: 0,
                              color: colors.textColor,
                            }}
                          >
                            {selectedValue7}
                          </Text>
                        </TouchableOpacity>
                        {isOpen7 && (
                          <View
                            style={{
                              ...globalStyles.dropdownList,
                              backgroundColor: colors.textinputBackgroundcolor,
                              borderColor: colors.textinputbordercolor,
                            }}
                          >
                            {options7.map((option, index) => (
                              <TouchableOpacity
                                key={index}
                                style={{
                                  ...globalStyles.dropdownItem,
                                  borderColor: colors.textinputbordercolor,
                                }}
                                onPress={() => selectOption7(option)}
                              >
                                <Text
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
                        <TouchableOpacity
                          style={{
                            ...globalStyles.saveButton,
                            marginHorizontal: 10,
                            backgroundColor: colors.AppmainColor,
                          }}
                          onPress={() => {
                            handleEditMySeekerProfile();
                          }}
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
                      </View>
                    </>
                  ) : null}

                  {seekerValue ? (
                    <View
                      style={{
                        backgroundColor: colors.textinputBackgroundcolor,
                        flex: 1,
                        marginTop: 10,
                        marginHorizontal: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={
                            seekerValue?.ProfilePhoto
                              ? {
                                  uri: seekerValue?.ProfilePhoto,
                                }
                              : require("../../assets/placeholderprofileimage.png")
                          }
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            marginTop: 10,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            ...globalStyles.SeekerText,
                            color: colors.AppmainColor,
                          }}
                        >
                          {seekerValue?.UserName}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("ChatDetails", {
                              Item: seekerValue,
                            })
                          }
                          style={{
                            backgroundColor: colors.AppmainColor,
                            padding: 5,
                            borderRadius: 5,
                          }}
                        >
                          <Text
                            style={{
                              ...globalStyles.SearchInternText,
                              color: colors.ButtonTextColor,
                            }}
                          >
                            Send message
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          marginTop: 10,
                          borderTopWidth: 1,
                          borderColor: colors.textinputbordercolor,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.placeholderTextColor,
                            paddingTop: 10,
                          }}
                        >
                          Service offered
                        </Text>
                        <Text style={{ color: colors.textColor }}>
                          {seekerValue?.Serviceoffered}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginTop: 10,
                          borderTopWidth: 1,
                          borderBottomWidth: 1,
                          paddingVertical: 8,
                          borderColor: colors.textinputbordercolor,
                        }}
                      >
                        <Text style={{ color: colors.textColor }}>
                          {seekerValue?.ProfessionalTitle}
                        </Text>
                      </View>

                      <View style={{ marginTop: 10 }}>
                        <Text
                          style={{
                            color: colors.placeholderTextColor,
                            paddingTop: 10,
                          }}
                        >
                          Skills
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginTop: 5,
                          }}
                        >
                          {seekerValue?.Skills?.split(",").map(
                            (skill, index) => (
                              <View
                                key={index}
                                style={{
                                  backgroundColor: colors.background,
                                  borderRadius: 10,
                                  paddingHorizontal: 10,
                                  paddingVertical: 5,
                                  marginRight: 5,
                                  marginBottom: 5,
                                }}
                              >
                                <Text style={{ color: colors.textColor }}>
                                  {skill.trim()}
                                </Text>
                              </View>
                            )
                          )}
                        </View>
                      </View>

                      <View
                        style={{
                          marginTop: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.placeholderTextColor,
                            paddingTop: 10,
                          }}
                        >
                          Work Experience
                        </Text>
                        <Text style={{ fontSize: 18, color: colors.textColor }}>
                          {seekerValue?.WorkExperience}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginVertical: 15,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.placeholderTextColor,
                            paddingTop: 10,
                          }}
                        >
                          Brief Professonal overview
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            marginTop: 20,
                            color: colors.textColor,
                          }}
                        >
                          {seekerValue?.BriefProfessonal}
                        </Text>
                      </View>
                    </View>
                  ) : null}

                  {editViewTrue == true ? null : mySeekerData?.length > 0 ? (
                    <View
                      style={{
                        backgroundColor: colors.textinputBackgroundcolor,
                        flex: 1,
                        marginTop: 10,
                        marginHorizontal: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={
                            mySeekerData[0]?.ProfilePhoto
                              ? {
                                  uri: mySeekerData[0]?.ProfilePhoto,
                                }
                              : require("../../assets/placeholderprofileimage.png")
                          }
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            marginTop: 10,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            ...globalStyles.SeekerText,
                            color: colors.AppmainColor,
                          }}
                        >
                          {mySeekerData[0]?.UserName}
                        </Text>
                        <View
                          style={{
                            backgroundColor: colors.AppmainColor,
                            padding: 5,
                            borderRadius: 5,
                          }}
                        >
                          <Text
                            style={{
                              ...globalStyles.SearchInternText,
                              color: colors.ButtonTextColor,
                            }}
                          >
                            Send message
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          marginTop: 10,
                          borderTopWidth: 1,
                          borderColor: colors.textinputbordercolor,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.placeholderTextColor,
                            paddingTop: 10,
                          }}
                        >
                          Service offered
                        </Text>
                        <Text>{mySeekerData[0]?.Serviceoffered}</Text>
                      </View>

                      <View
                        style={{
                          marginTop: 10,
                          borderTopWidth: 1,
                          borderBottomWidth: 1,
                          paddingVertical: 8,
                          borderColor: colors.textinputbordercolor,
                        }}
                      >
                        <Text>{mySeekerData[0]?.ProfessionalTitle}</Text>
                      </View>

                      <View style={{ marginTop: 10 }}>
                        <Text
                          style={{
                            color: colors.placeholderTextColor,
                            paddingTop: 10,
                          }}
                        >
                          Skills
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginTop: 5,
                          }}
                        >
                          {mySeekerData[0]?.Skills?.split(",").map(
                            (skill, index) => (
                              <View
                                key={index}
                                style={{
                                  backgroundColor: colors.background,
                                  borderRadius: 10,
                                  paddingHorizontal: 10,
                                  paddingVertical: 5,
                                  marginRight: 5,
                                  marginBottom: 5,
                                }}
                              >
                                <Text style={{ color: colors.textColor }}>
                                  {skill.trim()}
                                </Text>
                              </View>
                            )
                          )}
                        </View>
                      </View>

                      <View style={{ marginTop: 10 }}>
                        <Text
                          style={{
                            color: colors.placeholderTextColor,
                            paddingTop: 10,
                          }}
                        >
                          Work Experience
                        </Text>
                        <Text style={{ fontSize: 18, color: colors.textColor }}>
                          {mySeekerData[0]?.WorkExperience}
                        </Text>
                      </View>

                      <View style={{ marginVertical: 15 }}>
                        <Text
                          style={{
                            color: colors.placeholderTextColor,
                            paddingTop: 10,
                          }}
                        >
                          Brief Professional Overview
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            marginTop: 20,
                            color: colors.textColor,
                          }}
                        >
                          {mySeekerData[0]?.BriefProfessonal}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                  {editViewTrue == true ? null : (
                    <FlatList
                      data={internSeeker}
                      keyExtractor={(item) => item.UserId?.toString()}
                      renderItem={renderItemInternSeeker}
                    />
                  )}
                </View>
              </View>
            </ScrollView>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header title="Internships Project" navigation={navigation} />
      <KeyboardAvoidingWrapper offset={40}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 12,
            // backgroundColor: colors.textinputBackgroundcolor,
          }}
        >
          {renderTopTabs()}
          <View style={{ flex: 1 }}>{renderContent()}</View>
        </View>
      </KeyboardAvoidingWrapper>
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
              // height: 400,
              backgroundColor: colors.textinputBackgroundcolor,
              borderRadius: 8,
              flex: 1,
              maxHeight: 400,
            }}
          >
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
          <TouchableOpacity
            onPress={() => setShowIndustryModal(false)}
            style={{
              position: "absolute",
              top: "50%",
              right: 20,
              transform: [{ translateY: -200 }],
              padding: 10,
              zIndex: 10,
            }}
          >
            <Icon
              type="Entypo"
              name="cross"
              size={30}
              color={colors.backIconColor}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 10,
    // backgroundColor: '#f9f9f9',
    // backgroundColor: 'white',
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
  subtitle: {
    color: "#666",
    fontSize: 14,
  },
  info: {
    // color: '#444',
    fontSize: 12,
    marginTop: 2,
  },
  label: {
    fontSize: 16,
    paddingRight: 10,
    color: "#888",
  },

  JobfiledSectionText: { fontSize: 13, paddingBottom: 10 },
  textInput: {
    paddingTop: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 5,
    height: 40,
  },
  mainView: { flex: 1, backgroundColor: Colors.white },
  headerView: {
    flex: 0.09,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
  },
  secondMainView: { flex: 1, paddingHorizontal: 6 },
  JobfiledSection: { paddingTop: 10 },

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
    // backgroundColor: 'white',
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
  inputIcon: {
    position: "absolute",
    right: 10, // Place the icon at the right of the TextInput
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

  text: {
    fontSize: 14,
  },
  redstar: {
    color: "red",
  },
});

export default IntershipProject;
