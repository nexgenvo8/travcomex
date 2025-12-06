import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "./color";
import { TextInput } from "react-native-gesture-handler";
import Icon from "./Icons/Icons";
import PlaneIcon from "react-native-vector-icons/AntDesign";
import {
  baseUrl,
  RegistrationApi,
  coursenameApi,
  departmentnameApi,
  destinationlistApi,
  listindustriesApi,
} from "./baseURL/api";
import { useNavigation } from "@react-navigation/native";
import { showError, showSuccess } from "./components/Toast";
import { useTheme } from "../theme/ThemeContext";
import {
  registrationbackgroundimage,
  registrationbackgroundimage_dark,
  registrationlogoimage,
  registrationtopTextImage,
  registrationtopTextImage_dark,
  universityFullName,
  universityName,
} from "./constants";

const Registration = () => {
  const navigation = useNavigation();
  const { isDark, colors, toggleTheme } = useTheme();
  const [selectedGender, setSelectedGender] = useState("male");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentPicker, setCurrentPicker] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passingYear, setPassingYear] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedRole, setSelectedRole] = useState("DMC");
  const [selectedSegments, setSelectedSegments] = useState("");

  const [courseList, setCourseList] = useState(null);
  // const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [destinationList, setDestinationList] = useState([]);
  const [destinationPage, setDestinationPage] = useState(1);
  const [destinationLastPage, setDestinationLastPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industryList, setIndustryList] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const roleTypeMap = {
    DMC: 1,
    "Travel Agent": 2,
    "Hotel/Resort": 3,
    Airline: 4,
    "Tourism Board": 5,
    Media: 6,
    Cruze: 7,
    "Transport Company": 8,
    "Travel Association": 9,
    "Travel Consultant": 10,
    "Tour Escort": 11,
    "Tour Guide": 12,
    "Institute/College": 13,
    Student: 14,
    "IT Company": 15,
    "Digital Marketing Company": 16,
    "Government Department": 17,
    "International organisation": 18,
    Restaurant: 19,
    "Activity Company": 20,
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const segmentsMap = {
    "Inbound Tourism": 1,
    "Outbound Tourism": 2,
    "MICE Tourism": 3,
    "Domestic Tourism": 4,
    OTA: 5,
    "Corporate Travel": 6,
    "Medical Tourism": 7,
    Hospitality: 8,
    Logistic: 9,
    Others: 10,
  };
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const passingyears = Array.from({ length: 8 }, (_, i) => currentYear + i);
  const startYear = currentYear - 10;
  const years = Array.from({ length: 100 }, (_, i) => startYear - i);

  const [searchQuery, setSearchQuery] = useState("");
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
    );
  };

  // const renderPaginatedOptions = ({
  //   data,
  //   onSelect,
  //   onEndReached = null,
  //   isLoadingMore = false,
  // }) => (
  //   <FlatList
  //     style={[styles.modalContent, { maxHeight: 400 }]} // scrollable
  //     data={data}
  //     keyExtractor={(item, index) =>
  //       item.id ? item.id.toString() : index.toString()
  //     }
  //     renderItem={({ item }) => {
  //       const label =
  //         typeof item === "object" ? item.Name || item.name || "" : item;
  //       return (
  //         <TouchableOpacity
  //           onPress={() => {
  //             onSelect(item);
  //             setCurrentPicker(null);
  //           }}
  //         >
  //           <Text
  //             style={{
  //               ...styles.optionText,
  //               borderColor: colors.textinputbordercolor,
  //               color: colors.textColor,
  //             }}
  //           >
  //             {label}
  //           </Text>
  //         </TouchableOpacity>
  //       );
  //     }}
  //     onEndReachedThreshold={0.1} // call when 10% from bottom
  //     onEndReached={() => {
  //       if (onEndReached && !isLoadingMore) {
  //         onEndReached();
  //       }
  //     }}
  //     ListFooterComponent={
  //       isLoadingMore ? (
  //         <ActivityIndicator
  //           size="small"
  //           color={colors.textColor}
  //           style={{ margin: 10 }}
  //         />
  //       ) : null
  //     }
  //   />
  // );
  const renderPaginatedOptions = ({
    data,
    onSelect,
    onEndReached = null,
    isLoadingMore = false,
  }) => {
    // Check if data is empty or null
    if (!data || data.length === 0) {
      return (
        <View
          style={[
            styles.modalContent,
            {
              alignItems: "center",
              justifyContent: "center",
              //height: 400,
            },
          ]}
        >
          <Text
            style={{
              // textAlign: "center",
              color: colors.textColor,
              fontSize: 16,
            }}
          >
            No data found
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        style={[styles.modalContent]} // scrollable
        data={data}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => {
          const label =
            typeof item === "object" ? item.Name || item.name || "" : item;
          return (
            <TouchableOpacity
              onPress={() => {
                onSelect(item);
                setCurrentPicker(null);
              }}
            >
              <Text
                style={{
                  ...styles.optionText,
                  borderColor: colors.textinputbordercolor,
                  color: colors.textColor,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        }}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (onEndReached && !isLoadingMore) {
            onEndReached();
          }
        }}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator
              size="small"
              color={colors.AppmainColor}
              style={{ margin: 10 }}
            />
          ) : null
        }
      />
    );
  };

  const renderOptions = (data, onSelect) => (
    <ScrollView style={styles.modalContent}>
      {data.map((item, index) => {
        // const label = typeof item === 'object' ? item.Name : item;
        // const label = typeof item === "object" ? item.name : item;
        const label = typeof item === "object" ? item.Name || item.name : item;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              onSelect(item);
              setCurrentPicker(null);
            }}
          >
            <Text
              style={{
                ...styles.optionText,
                borderColor: colors.textinputbordercolor,
                color: colors.textColor,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
  // useEffect(() => {

  //   // fetchCourses();
  //   //fetchDepartments();
  //   //fetchIndustries();
  // }, []);
  // Initial load
  useEffect(() => {
    loadDestinations(1, "");
  }, []);

  useEffect(() => {
    if (currentPicker === "Destination") {
      loadDestinations(1, searchQuery);
    }
  }, [searchQuery, currentPicker]);

  const fetchDestinationsLists = async (page = 1, search = "") => {
    try {
      const response = await fetch(`${baseUrl}${destinationlistApi}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: search,
          page: page,
          per_page: 500,
        }),
      });

      const data = await response.json();
      if (data.success === true) {
        return data;
      }
    } catch (error) {
      console.error("Error fetching destination list:", error);
    }
    return null;
  };

  const loadDestinations = async (page, search) => {
    const res = await fetchDestinationsLists(page, search);

    if (res) {
      setDestinationPage(res.current_page);
      setDestinationLastPage(res.last_page);

      if (page === 1) {
        setDestinationList(res.data);
      } else {
        setDestinationList((prev) => [...prev, ...res.data]);
      }
    }
  };

  const loadMoreDestinations = async () => {
    if (destinationPage >= destinationLastPage) return;

    setIsLoadingMore(true);
    await loadDestinations(destinationPage + 1, searchQuery);
    setIsLoadingMore(false);
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${baseUrl}${coursenameApi}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "" }),
      });
      const data = await response.json();
      if (data.Status === 1) {
        setCourseList(data.DataList);
      } else {
        console.error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${baseUrl}${departmentnameApi}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (data.Status === 1) {
        setDepartmentList(data.DataList);
      } else {
        console.error("Failed to fetch departments");
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  const fetchIndustries = async () => {
    try {
      const response = await fetch(`${baseUrl}${listindustriesApi}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      // console.log(data, "datadatadatadatadatadatadatadata");

      if (data.Status === 1) {
        setIndustryList(data.DataList);
      } else {
        console.error("Failed to fetch Industries");
      }
    } catch (error) {
      console.error("Error fetching Industries:", error);
    }
  };
  const handleRegister = async () => {
    if (!email) {
      showError("Email is required");
      return;
    }
    if (!isValidEmail(email)) {
      showError("Please enter a valid email address");
      return;
    }
    const payload = {
      firstName,
      lastName,
      email,
      password: "r00t@12345",
      day: selectedDay,
      month: months.indexOf(selectedMonth) + 1,
      year: selectedYear,
      // gender: selectedGender === "male" ? "Male" : "Female",
      gender:
        selectedGender === "male"
          ? "Male"
          : selectedGender === "female"
          ? "Female"
          : "Other",

      userstype: roleTypeMap[selectedRole],
      segments: segmentsMap[selectedSegments] || "Null",
      employmentId: 101,
      membershipId: 2001,
      templateId: 45,
      jobTitle: jobTitle || "Null",
      passingyear: parseInt(passingYear) || 0,
      departmentname: department || "Null",
      companyName: companyName || "Company Name.",
      industryId: selectedIndustry?.Id || 1,
      countryName: "India",
      cityName: "Delhi",
      locationName: "South Extension",
      userurl: `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Date.now()}`,
      taglineText: "Passionate Developer",
      ppAndTcStatus: "1",
      onlineDateTime: "2025-03-18 12:00:00",
      serviceOffered: 3,
      jobSkills: "PHP, Laravel, MySQL",
      experienceLevel: "Mid-Level",
      professionalTitle: "Software Developer",
      professionalBrief: "Experienced in Laravel and API Development",
      freelancerStatus: 1,
      freelancerRegDate: 20240318,
      lastPost: 5,
      passStatus: "A",
      onlineLastUpdate: 1710763200,
      resetPasswordTime: 1710763200,
      regDate: 1710763200,
      timeZone: "Asia/Kolkata",
      backgroundPhoto: "background-image.png",
      coursename: selectedCourse?.Name || "Null",
      numberofMentees: 10,
      profilePhoto: null,
      destination: selectedDestination?.name || "Null",
      designation: designation || "Null",
      CompanyWebsite: websiteUrl || "Null",
    };
    console.log(payload, "payloadpayloadpayloadpayloadpayload");
    try {
      const response = await fetch(`${baseUrl}${RegistrationApi}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log("Server response:", result);
      if (response.ok) {
        showSuccess("Registration successful!");
        navigation.navigate("Login");
      } else {
        showError(result.message || result.error.email);
      }
    } catch (error) {
      console.error("Error:", error);
      showError("Network error. Please try again.");
    }
  };
  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case "DMC":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDestination
                    ? selectedDestination.name
                    : "Destination"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`${selectedRole || ""} Name`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={websiteUrl}
                  onChangeText={setWebsiteUrl}
                  placeholder={`Website Url`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Travel Agent":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Segments")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedSegments ? selectedSegments : "Segments"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Destination"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={websiteUrl}
                  onChangeText={setWebsiteUrl}
                  placeholder={`Website Url`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`${selectedRole || ""} Name`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Hotel/Resort":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Segments")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedSegments ? selectedSegments : "Segments"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Location"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={websiteUrl}
                  onChangeText={setWebsiteUrl}
                  placeholder={`Website Url`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                    includeFontPadding: false,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`${selectedRole || ""} Name`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Airline":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={websiteUrl}
                  onChangeText={setWebsiteUrl}
                  placeholder={`Website Url`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>

            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                    includeFontPadding: false,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`${selectedRole || ""} Name`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Tourism Board":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Location"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={websiteUrl}
                  onChangeText={setWebsiteUrl}
                  placeholder={`Website Url`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                    includeFontPadding: false,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`${selectedRole || ""} Name`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Media":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Segments")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedSegments ? selectedSegments : "Segments"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Location"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={websiteUrl}
                  onChangeText={setWebsiteUrl}
                  placeholder={`Website Url`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                    includeFontPadding: false,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`${selectedRole || ""} Name`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Cruze":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Destination"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={websiteUrl}
                  onChangeText={setWebsiteUrl}
                  placeholder={`Website Url`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                    includeFontPadding: false,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`${selectedRole || ""} Name`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Transport Company":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Segments")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedSegments ? selectedSegments : "Segments"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Destination"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={websiteUrl}
                  onChangeText={setWebsiteUrl}
                  placeholder={`Website Url`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                    includeFontPadding: false,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`${selectedRole || ""} Name`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Travel Association":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Segments")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedSegments ? selectedSegments : "Segments"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Location"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={websiteUrl}
                  onChangeText={setWebsiteUrl}
                  placeholder={`Website Url`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                    includeFontPadding: false,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`Name Of ${selectedRole || ""}`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Travel Consultant":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Segments")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedSegments ? selectedSegments : "Segments"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Destination"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>
          </>
        );
      case "Tour Escort":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Segments")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedSegments ? selectedSegments : "Segments"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Destination"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>
          </>
        );
      case "Tour Guide":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Segments")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedSegments ? selectedSegments : "Segments"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Destination"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>
          </>
        );
      case "Institute/College":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Location"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                    includeFontPadding: false,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`${selectedRole || ""} Name`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Student":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Location"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`Course`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("passingYear")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {passingYear ? passingYear : "Passing Year"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                    includeFontPadding: false,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`${selectedRole || ""} Name`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "IT Company":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Location"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                    includeFontPadding: false,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`${selectedRole || ""} Name`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Digital Marketing Company":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Location"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`Name of ${selectedRole || ""}`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Government Department":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Location"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`Name Of Ministry`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "International organisation":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Location"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`Name of ${selectedRole || ""}`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Restaurant":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Location"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`Name of ${selectedRole || ""}`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      case "Activity Company":
        return (
          <>
            <View style={styles.studentMainBox}>
              <TouchableOpacity
                onPress={() => setCurrentPicker("role")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedRole ? selectedRole : "Select Role"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("Destination")}
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ ...styles.StudentText, color: colors.textColor }}
                >
                  {selectedDepartment
                    ? selectedDepartment.DepartmentName
                    : "Location"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  // style={{right: 6}}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={designation}
                  onChangeText={setDesignation}
                  placeholder={`Designation`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder={`Department`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
            <View style={styles.studentMainBox}>
              <View
                style={{
                  ...styles.StudentBox,
                  borderColor: colors.textinputbordercolor,
                  includeFontPadding: false,
                }}
              >
                <TextInput
                  style={{
                    ...styles.inputTextinsideBox,
                    color: colors.textColor,
                  }}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder={`Name of ${selectedRole || ""}`}
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </View>
            </View>
          </>
        );
      default:
        return null;
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* <View style={styles.header}>
          <Image
            source={registrationlogoimage}
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
          <Image
            source={
              isDark ? registrationtopTextImage_dark : registrationtopTextImage
            }
            style={{ width: 150, height: 150 }}
            resizeMode="contain"
          />
        </View> */}
        <View style={styles.header}>
          <Image
            source={registrationlogoimage}
            style={{ width: 70, height: 72, marginTop: 30 }}
            resizeMode="contain"
          />
          <Image
            source={registrationtopTextImage}
            style={{ width: 170, height: 60 }}
            resizeMode="contain"
          />
        </View>
        <ImageBackground
          source={
            isDark
              ? registrationbackgroundimage_dark
              : registrationbackgroundimage
          }
          resizeMode="cover"
          style={{
            flex: 1,
            justifyContent: "center",
            paddingVertical: 40,
          }}
        >
          <View
            style={{
              ...styles.whiteBox,
              backgroundColor: colors.cardBackground,
            }}
          >
            <Text
              style={{ ...styles.registerText, color: colors.AppmainColor }}
            >
              Register Now !!!
            </Text>
            <View style={styles.nameBox}>
              <TextInput
                style={{
                  ...styles.inputText,
                  borderColor: colors.textinputbordercolor,
                  color: colors.textColor,
                }}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                placeholderTextColor={colors.placeholderTextColor}
              />
              <TextInput
                style={{
                  ...styles.inputText,
                  borderColor: colors.textinputbordercolor,
                  color: colors.textColor,
                }}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>
            <TextInput
              style={{
                ...styles.emailTextInput,
                borderColor: colors.textinputbordercolor,
                color: colors.textColor,
              }}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={colors.placeholderTextColor}
            />
            <TextInput
              maxLength={10}
              keyboardType="numeric"
              style={{
                ...styles.emailTextInput,
                borderColor: colors.textinputbordercolor,
                color: colors.textColor,
              }}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone "
              placeholderTextColor={colors.placeholderTextColor}
            />
            <Text style={{ ...styles.birthdayText, color: colors.textColor }}>
              Birthday
            </Text>
            <View style={styles.birthdayBox}>
              <TouchableOpacity
                style={{
                  ...styles.dayBox,
                  borderColor: colors.textinputbordercolor,
                }}
                onPress={() => setCurrentPicker("day")}
              >
                <Text style={{ ...styles.dayText, color: colors.textColor }}>
                  {selectedDay || "Day"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  style={{ paddingLeft: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.dayBox,
                  borderColor: colors.textinputbordercolor,
                }}
                onPress={() => setCurrentPicker("month")}
              >
                <Text style={{ ...styles.dayText, color: colors.textColor }}>
                  {selectedMonth || "Month"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  style={{ paddingLeft: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPicker("year")}
                style={{
                  ...styles.dayBox,
                  borderColor: colors.textinputbordercolor,
                }}
              >
                <Text style={{ ...styles.dayText, color: colors.textColor }}>
                  {selectedYear || "Year"}
                </Text>
                <Icon
                  name="down"
                  type="AntDesign"
                  size={15}
                  color={colors.placeholderTextColor}
                  style={{ paddingLeft: 10 }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.maleMainBox}>
              <TouchableOpacity
                style={styles.maleBox}
                onPress={() => setSelectedGender("male")}
              >
                <View
                  style={{
                    ...styles.maleCircleBox,
                    borderColor: colors.textinputbordercolor,
                  }}
                >
                  {selectedGender === "male" && (
                    <View
                      style={{
                        ...styles.selectedCircle,
                        backgroundColor: colors.AppmainColor,
                      }}
                    />
                  )}
                </View>
                <Text style={{ ...styles.maleText, color: colors.textColor }}>
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.maleBox}
                onPress={() => setSelectedGender("female")}
              >
                <View
                  style={{
                    ...styles.maleCircleBox,
                    borderColor: colors.textinputbordercolor,
                  }}
                >
                  {selectedGender === "female" && (
                    <View
                      style={{
                        ...styles.selectedCircle,
                        backgroundColor: colors.AppmainColor,
                      }}
                    />
                  )}
                </View>
                <Text style={{ ...styles.maleText, color: colors.textColor }}>
                  Female
                </Text>
              </TouchableOpacity>
              {/* <View></View> */}
              <TouchableOpacity
                style={styles.maleBox}
                onPress={() => setSelectedGender("Others")}
              >
                <View
                  style={{
                    ...styles.maleCircleBox,
                    borderColor: colors.textinputbordercolor,
                  }}
                >
                  {selectedGender === "Others" && (
                    <View
                      style={{
                        ...styles.selectedCircle,
                        backgroundColor: colors.AppmainColor,
                      }}
                    />
                  )}
                </View>
                <Text style={{ ...styles.maleText, color: colors.textColor }}>
                  Others
                </Text>
              </TouchableOpacity>
            </View>
            {renderRoleSpecificFields()}
            {/* {selectedRole == "Faculty" && (
                <TouchableOpacity
                  onPress={() => setCurrentPicker("department")}
                  style={{
                    ...styles.StudentBox,
                    borderColor: colors.textinputbordercolor,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ ...styles.StudentText, color: colors.textColor }}
                  >
                    {selectedDepartment
                      ? selectedDepartment.DepartmentName
                      : "Department"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.placeholderTextColor}
                    // style={{right: 6}}
                  />
                </TouchableOpacity>
              )} */}
            {/* {selectedRole == "Industry Professional" && (
                <TouchableOpacity
                  onPress={() => setCurrentPicker("Industry")}
                  style={{
                    ...styles.StudentBox,
                    borderColor: colors.textinputbordercolor,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ ...styles.StudentText, color: colors.textColor }}
                  >
                    {selectedIndustry ? selectedIndustry.Name : "Industry"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.placeholderTextColor}
                    // style={{right: 6}}
                  />
                </TouchableOpacity>
              )} */}

            {/* {selectedRole !== "Faculty" &&
                selectedRole !== "Industry Professional" && (
                  <TouchableOpacity
                    onPress={() => setCurrentPicker("course")}
                    style={{
                      ...styles.StudentBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ ...styles.StudentText, color: colors.textColor }}
                    >
                      {selectedCourse ? selectedCourse.Name : "Course"}
                    </Text>
                    <Icon
                      name="down"
                      type="AntDesign"
                      size={15}
                      color={colors.placeholderTextColor}
                    />
                  </TouchableOpacity>
                )} */}

            {/* {selectedRole !== "Faculty" &&
              selectedRole !== "Industry Professional" && (
                <View style={styles.studentMainBox}>
                  <TouchableOpacity
                    onPress={() => setCurrentPicker("department")}
                    style={{
                      ...styles.StudentBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ ...styles.StudentText, color: colors.textColor }}
                    >
                      {selectedDepartment
                        ? selectedDepartment.DepartmentName
                        : "Department"}
                    </Text>
                    <Icon
                      name="down"
                      type="AntDesign"
                      size={15}
                      color={colors.placeholderTextColor}
                      // style={{right: 6}}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setCurrentPicker("passingYear")}
                    style={{
                      ...styles.StudentBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ ...styles.StudentText, color: colors.textColor }}
                    >
                      {passingYear ? passingYear : "Passing Year"}
                    </Text>
                    <Icon
                      name="down"
                      type="AntDesign"
                      size={15}
                      color={colors.placeholderTextColor}
                    />
                  </TouchableOpacity>
                </View>
              )}
            {selectedRole == "Alumni" && (
              <>
                <View style={styles.nameBox}>
                  <TextInput
                    style={{
                      ...styles.inputText,
                      borderColor: colors.textinputbordercolor,
                      color: colors.textColor,
                    }}
                    value={jobTitle}
                    onChangeText={setJobTitle}
                    placeholder="Enter Job Title"
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                  <TextInput
                    style={{
                      ...styles.inputText,
                      borderColor: colors.textinputbordercolor,
                      color: colors.textColor,
                    }}
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholder="Company Name"
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                </View>

                <View style={styles.studentMainBox}>
                  <TouchableOpacity
                    onPress={() => setCurrentPicker("Industry")}
                    style={{
                      ...styles.StudentBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ ...styles.StudentText, color: colors.textColor }}
                    >
                      {selectedIndustry ? selectedIndustry.Name : "Industry"}
                    </Text>
                    <Icon
                      name="down"
                      type="AntDesign"
                      size={15}
                      color={colors.placeholderTextColor}
                      // style={{right: 6}}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
            {selectedRole == "Industry Professional" && (
              <>
                <View style={styles.nameBox}>
                  <TextInput
                    style={{
                      ...styles.inputText,
                      borderColor: colors.textinputbordercolor,
                      color: colors.textColor,
                    }}
                    value={jobTitle}
                    onChangeText={setJobTitle}
                    placeholder="Enter Job Title"
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                  <TextInput
                    style={{
                      ...styles.inputText,
                      borderColor: colors.textinputbordercolor,
                      color: colors.textColor,
                    }}
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholder="Company Name"
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                </View>
              </>
            )}
            {selectedRole !== "Industry Professional" && (
              <TextInput
                numberOfLines={1}
                ellipsizeMode="tail"
                editable={false}
                style={{
                  ...styles.jamiaTextInput,
                  borderColor: colors.textinputbordercolor,
                }}
                placeholder={universityName}
                placeholderTextColor={colors.placeholderTextColor}
              />
            )} */}

            <View style={styles.tickTextBox}>
              <PlaneIcon
                name="checksquare"
                size={20}
                color={colors.AppmainColor}
                style={{ marginRight: 10 }}
              />
              <Text
                style={{ fontSize: 14, flexShrink: 1, color: colors.textColor }}
              >
                I accept {universityFullName}'s Terms & Conditions
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleRegister}
              style={{
                alignItems: "center",
                backgroundColor: colors.AppmainColor,
                marginHorizontal: 12,
                padding: 10,
                borderRadius: 8,
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: 18, color: colors.ButtonTextColor }}>
                Register Now
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            padding: 5,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("PrivacyScreen")}
          >
            <Text>Privacy |</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("TermsScreen")}>
            <Text>Terms |</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("AboutScreen")}>
            <Text>About |</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ContactUsScreen")}
          >
            <Text>Contact Us |</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("FAQScreen")}>
            <Text>FAQ's</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={!!currentPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={{
              ...styles.modalBox,
              backgroundColor: colors.modelBackground,
            }}
          >
            {(currentPicker === "course" ||
              currentPicker === "Destination") && (
              <TextInput
                // style={styles.searchInput}
                placeholder={`Search ${currentPicker}`}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  borderWidth: 1,
                  borderColor: colors.textinputbordercolor,
                  borderRadius: 8,
                  padding: 8,
                  margin: 10,
                  color: colors.textColor,
                }}
                placeholderTextColor={colors.placeholderTextColor}
              />
            )}
            {currentPicker === "day" && renderOptions(days, setSelectedDay)}
            {currentPicker === "month" &&
              renderOptions(months, setSelectedMonth)}
            {currentPicker === "year" && renderOptions(years, setSelectedYear)}
            {currentPicker === "passingYear" &&
              renderOptions(passingyears, setPassingYear)}
            {currentPicker === "role" &&
              renderOptions(
                [
                  "DMC",
                  "Travel Agent",
                  "Hotel/Resort",
                  "Airline",
                  "Tourism Board",
                  "Media",
                  "Cruze",
                  "Transport Company",
                  "Travel Association",
                  "Travel Consultant",
                  "Tour Escort",
                  "Tour Guide",
                  "Institute/College",
                  "Student",
                  "IT Company",
                  "Digital Marketing Company",
                  "Government Department",
                  "International organisation",
                  "Restaurant",
                  "Activity Company",
                ],
                setSelectedRole
              )}

            {currentPicker === "Segments" &&
              renderOptions(
                [
                  "Inbound Tourism",
                  "Outbound Tourism",
                  "MICE Tourism",
                  "Domestic Tourism",
                  "OTA",
                  "Corporate Travel",
                  "Medical Tourism",
                  "Hospitality",
                  "Logistic",
                  "Others",
                ],
                setSelectedSegments
              )}

            {/* {currentPicker === 'course' &&
              renderOptions(courseList, setSelectedCourse)}
            {currentPicker === 'department' &&
              renderOptions(departmentList, setSelectedDepartment)} */}
            {currentPicker === "Industry" &&
              renderOptions(
                industryList.filter(
                  (c) =>
                    c?.Name &&
                    c.Name.toLowerCase().includes(searchQuery.toLowerCase())
                ),
                (c) => {
                  setSelectedIndustry(c);
                  setCurrentPicker(null);
                  setSearchQuery("");
                }
              )}
            {currentPicker === "course" &&
              renderOptions(
                courseList.filter(
                  (c) =>
                    c?.Name &&
                    c.Name.toLowerCase().includes(searchQuery.toLowerCase())
                ),
                (c) => {
                  setSelectedCourse(c);
                  setCurrentPicker(null);
                  setSearchQuery("");
                }
              )}

            {/* {currentPicker === "Destination" &&
              renderOptions(
                destinationList.filter(
                  (d) =>
                    d?.DepartmentName &&
                    d.DepartmentName.toLowerCase().includes(
                      searchQuery.toLowerCase()
                    )
                ),
                (d) => {
                  setSelectedDepartment(d);
                  setCurrentPicker(null);
                  setSearchQuery("");
                }
              )} */}
            {currentPicker === "Destination" &&
              renderPaginatedOptions({
                data: destinationList,
                onSelect: (d) => {
                  setSelectedDestination(d);
                  setCurrentPicker(null);
                  setSearchQuery("");
                },
                onEndReached: loadMoreDestinations,
                isLoadingMore: isLoadingMore,
              })}
            {/* {currentPicker === "Destination" &&
              renderOptions(
                destinationList.filter(
                  (d) =>
                    d?.name &&
                    d.name.toLowerCase().includes(searchQuery.toLowerCase())
                ),
                (d) => {
                  setSelectedDestination(d);
                  setCurrentPicker(null);
                  setSearchQuery("");
                }
              )} */}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setCurrentPicker(null), setSearchQuery("");
              }}
            >
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Registration;

const styles = StyleSheet.create({
  header: {
    // flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  whiteBox: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "90%",
  },
  registerText: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 10,
  },
  inputText: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    marginTop: 8,
  },
  inputTextinsideBox: { flex: 1 },
  nameBox: {
    flexDirection: "row",
    width: "100%",
    gap: 8,
  },
  emailTextInput: {
    height: 40,
    paddingVertical: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  birthdayText: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
  },
  birthdayBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayBox: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  dayText: { fontSize: 14, fontWeight: "400" },
  maleMainBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  maleBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  maleCircleBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  selectedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  maleText: {
    fontSize: 16,
  },
  studentMainBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  StudentBox: {
    width: "48%",
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  StudentText: {
    fontSize: 16,
  },
  jamiaTextInput: {
    height: 40,
    width: "60%",
    // paddingVertical: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  tickTextBox: {
    flexDirection: "row",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  modalBox: {
    borderRadius: 8,
    maxHeight: "70%",
    flex: 1,
  },
  modalContent: {
    // padding: 20,
    paddingHorizontal: 20,
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  cancelButton: {
    backgroundColor: "#333",
    padding: 12,
    alignItems: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
