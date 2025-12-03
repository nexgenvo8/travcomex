import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import Header from "./Header/Header";
import Colors from "./color";
import globalStyles from "./GlobalCSS";
import Icon from "./Icons/Icons";
import { ScrollView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ImagePicker from "react-native-image-crop-picker";
import {
  baseUrl,
  coursenameApi,
  departmentnameApi,
  ListUser,
  updateplacementregistration,
  generateutcnumber,
} from "./baseURL/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showError, showSuccess } from "./components/Toast";
import { useTheme } from "../theme/ThemeContext";
import { universityFullName } from "./constants";

const PlacementRegistration = ({ navigation }) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const [userFullDetail, setUserFullDetail] = useState("");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [checked, setChecked] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentPicker, setCurrentPicker] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [courseList, setCourseList] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [studentId, setStudentId] = useState("");
  const [gender, setGender] = useState("");
  const [passingYear, setPassingYear] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [semester, setSemester] = useState("");
  const [photoIdType, setPhotoIdType] = useState("");
  const [universityIdImage, setUniversityIdImage] = useState(null);
  const [studentPhotoImage, setStudentPhotoImage] = useState(null);
  const [base64UniversityId, setBase64UniversityId] = useState("");
  const [base64StudentPhoto, setBase64StudentPhoto] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const photoIdOptions = [
    { id: 1, document: "Aadhar Card" },
    { id: 2, document: "Pan Card" },
    { id: 3, document: "Voter Id Card" },
    { id: 4, document: "Driving Licence" },
  ];
  useEffect(() => {
    if (userId) {
      fetchListUser(userId);
    }
  }, [userId]);
  useEffect(() => {
    fetchCourses();
    fetchDepartments();
    loadUserFromStorage();
  }, []);
  const loadUserFromStorage = async () => {
    try {
      const userDta = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userDta);
      if (parsedData?.User?.userId) {
        setUserId(parsedData.User.userId);
      } else {
        console.error("User ID not found in storage");
      }
    } catch (error) {
      console.error("Error reading user data from AsyncStorage:", error);
    }
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
  const fetchListUser = async (uid) => {
    try {
      const payload = JSON.stringify({ userId: uid });
      const response = await fetch(`${baseUrl}${ListUser}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: payload,
      });
      const data = await response.json();
      if (data?.DataList?.length > 0) {
        setUserFullDetail(data.DataList[0]);
      } else {
        console.warn("No user data found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    if (userFullDetail) {
      populateFormFields(userFullDetail);
    }
  }, [userFullDetail]);
  const populateFormFields = (user) => {
    const registered = !!user.RegistrationNo;
    setIsFormDisabled(registered);
    setRegistrationNo(user.RegistrationNo || "");
    setName(user.name || `${user.firstName} ${user.lastName}`);
    setEmail(user.email || "");
    setMobile(user.mobile || "");
    setStudentId(user.studentId || "");
    setGender(user.gender || "");
    setPassingYear(user.passingyear || "");
    setSemester(user.semester || "");
    setProfilePhoto(user.profilePhoto || "");
    if (user.universityIdAttachment) {
      setUniversityIdImage(user.universityIdAttachment);
      setBase64UniversityId(null);
    }
    if (user.studentPhotoId) {
      setStudentPhotoImage(user.studentPhotoId);
      setBase64StudentPhoto(null);
    }

    if (user.photoIdType) {
      const selected = photoIdOptions.find(
        (opt) => opt.id.toString() === user.photoIdType.toString()
      );
      if (selected) setPhotoIdType(selected);
    }
    const dept = departmentList.find(
      (d) => d.DepartmentName === user.departmentname
    );
    if (dept) setSelectedDepartment(dept);

    const course = courseList?.find((c) => c.Name === user.coursename);
    if (course) setSelectedCourse(course);
  };
  const handlePlacementRegistrationApi = async () => {
    try {
      if (!userId) {
        console.warn("User ID is missing");
        return;
      }
      if (!name || name.trim().length === 0) {
        showError("Name is required");
        return;
      }
      if (!email || !email.includes("@")) {
        showError("Valid Email is required");
        return;
      }
      if (!gender) {
        showError("Gender is required");
        return;
      }
      if (!passingYear) {
        showError("Passing Year is required");
        return;
      }
      if (!selectedDepartment || !selectedDepartment.DepartmentName) {
        showError("Department is required");
        return;
      }
      if (!selectedCourse || !selectedCourse.Name) {
        showError("Course is required");
        return;
      }
      if (!semester || isNaN(parseInt(semester))) {
        showError("Semester is required");
        return;
      }
      if (!photoIdType || !photoIdType.id) {
        showError("Photo ID Type is required");
        return;
      }
      if (!studentId) {
        showError("Student ID is required");
        return;
      }
      if (!mobile || mobile.length !== 10) {
        showError("Mobile number is required");
        return;
      }
      if (!base64UniversityId && !universityIdImage) {
        showError("University ID is required");
        return;
      }
      if (!base64StudentPhoto && !studentPhotoImage) {
        showError("Photo ID Card is required");
        return;
      }

      const payload = {
        userId,
        firstName: name.split(" ")[0] || "",
        lastName: name.split(" ")[1] || "",
        email,
        gender,
        passingyear: passingYear,
        departmentname: selectedDepartment?.DepartmentName || "",
        coursename: selectedCourse?.Name || "",
        semester: parseInt(semester),
        photoIdType: photoIdType?.id || null,
        studentId: studentId,
        mobile: mobile,
        universityIdAttachment: base64UniversityId,
        studentPhotoId: base64StudentPhoto,
      };
      const response = await fetch(`${baseUrl}${updateplacementregistration}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.status === 1) {
        generateUPC_Api();
        navigation.goBack();
        showSuccess(data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };
  const generateUPC_Api = async () => {
    try {
      const response = await fetch(`${baseUrl}${generateutcnumber}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      // const text = await response.text();
      // console.log('Responsetexttexttexttexttexttexttexttexttext:', text);
      const data = await response.json();
      if (data.status === 1) {
        setRegistrationNo(data.registrationNo);
        showSuccess(data.message);
      }
      console.log("Response generateUPC_Api:", data);
    } catch (error) {
      console.error("Error generateUPC_Api:", error);
    }
  };
  const renderOptions = (options, onSelect, getLabel = (item) => item) =>
    options.map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => onSelect(item)}
        style={{
          padding: 12,
          borderBottomWidth: 1,
          borderColor: colors.textinputbordercolor,
        }}
      >
        <Text style={{ fontSize: 16, color: colors.textColor }}>
          {getLabel(item)}
        </Text>
      </TouchableOpacity>
    ));
  const selectImage = async (type) => {
    try {
      const pickedImage = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        includeBase64: true,
      });

      const base64Data = pickedImage.data;

      if (type === "universityId") {
        setUniversityIdImage(pickedImage.path);
        setBase64UniversityId(base64Data);
      } else if (type === "studentPhoto") {
        setStudentPhotoImage(pickedImage.path);
        setBase64StudentPhoto(base64Data);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: colors.background }}
    >
      <Header title="Placement Registration" navigation={navigation} />
      <View style={globalStyles.FX_1_BG_LiteGray}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cardContainer}>
            <Text
              style={{ ...styles.placementTitleText, color: colors.textColor }}
            >
              Placement Registration Form for JMI Students
            </Text>
            <View
              style={{
                ...styles.line,
                backgroundColor: colors.textinputbordercolor,
              }}
            />
            <Text
              style={{ ...styles.placementSubText, color: colors.textColor }}
            >
              Placement Registration form for students of {universityFullName}
            </Text>
            {isFormDisabled && registrationNo ? (
              <Text style={{ ...styles.UPCText, color: colors.AppmainColor }}>
                You are registered with UPC No#:{" "}
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    lineHeight: 22,
                  }}
                >
                  {registrationNo}
                </Text>
              </Text>
            ) : null}
            <Image
              style={styles.cardImage}
              source={
                profilePhoto
                  ? { uri: profilePhoto }
                  : require("../assets/placeholderprofileimage.png")
              }
            />
            <View style={styles.namedepartmentMainBox}>
              <View style={styles.nameBox}>
                <Text style={{ ...styles.nameText, color: colors.textColor }}>
                  Name<Text style={styles.redText}> *</Text>{" "}
                </Text>
                <TextInput
                  editable={!isFormDisabled}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    ...styles.inputText,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    color: colors.textColor,
                  }}
                  value={name}
                  onChangeText={setName}
                  placeholder="Name"
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>
              <View style={styles.departmentBox}>
                <Text
                  numberOfLines={1}
                  style={{ ...styles.nameText, color: colors.textColor }}
                >
                  Department/Faculty<Text style={styles.redText}> *</Text>{" "}
                </Text>
                <TouchableOpacity
                  disabled={isFormDisabled}
                  onPress={() => setCurrentPicker("department")}
                  style={{
                    ...styles.departmentselectBox,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      ...styles.departmentselectText,
                      color: colors.placeholderTextColor,
                    }}
                  >
                    {selectedDepartment?.DepartmentName || "Select Department"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.placeholderTextColor}
                    style={{ right: 6 }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.namedepartmentMainBox}>
              <View style={styles.nameBox}>
                <Text
                  numberOfLines={1}
                  style={{ ...styles.nameText, color: colors.textColor }}
                >
                  Name of Course<Text style={styles.redText}> *</Text>{" "}
                </Text>
                <TouchableOpacity
                  disabled={isFormDisabled}
                  onPress={() => setCurrentPicker("course")}
                  style={{
                    ...styles.departmentselectBox,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      ...styles.departmentselectText,
                      color: colors.placeholderTextColor,
                    }}
                  >
                    {selectedCourse?.Name || "Select Course"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.placeholderTextColor}
                    style={{ right: 6 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.departmentBox}>
                <Text style={{ ...styles.nameText, color: colors.textColor }}>
                  Semester<Text style={styles.redText}> *</Text>{" "}
                </Text>
                <TouchableOpacity
                  disabled={isFormDisabled}
                  onPress={() => setCurrentPicker("semester")}
                  style={{
                    ...styles.departmentselectBox,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                >
                  <Text
                    style={{
                      ...styles.departmentselectText,
                      color: colors.placeholderTextColor,
                    }}
                  >
                    {semester ? `Semester ${semester}` : "Select Semester"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.placeholderTextColor}
                    style={{ right: 6 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.namedepartmentMainBox}>
              <View style={styles.nameBox}>
                <Text style={{ ...styles.nameText, color: colors.textColor }}>
                  Year of Passing<Text style={styles.redText}> *</Text>{" "}
                </Text>
                <TouchableOpacity
                  disabled={isFormDisabled}
                  onPress={() => setCurrentPicker("passingYear")}
                  style={{
                    ...styles.departmentselectBox,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                >
                  <Text
                    style={{
                      ...styles.departmentselectText,
                      color: colors.placeholderTextColor,
                    }}
                  >
                    {passingYear ? passingYear : "Select Year"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.placeholderTextColor}
                    style={{ right: 6 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.nameBox}>
                <Text style={{ ...styles.nameText, color: colors.textColor }}>
                  Email<Text style={styles.redText}> *</Text>{" "}
                </Text>
                <TextInput
                  editable={!isFormDisabled}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    ...styles.inputText,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    color: colors.textColor,
                  }}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter Your Email"
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>
            </View>
            <View style={styles.namedepartmentMainBox}>
              <View style={styles.nameBox}>
                <Text style={{ ...styles.nameText, color: colors.textColor }}>
                  Mobile No<Text style={styles.redText}> *</Text>{" "}
                </Text>
                <TextInput
                  editable={!isFormDisabled}
                  maxLength={10}
                  keyboardType="numeric"
                  style={{
                    ...styles.inputText,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    color: colors.textColor,
                  }}
                  value={mobile}
                  onChangeText={setMobile}
                  placeholder="Mobile No"
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>
              <View style={styles.departmentBox}>
                <Text style={{ ...styles.nameText, color: colors.textColor }}>
                  Gender<Text style={styles.redText}> *</Text>{" "}
                </Text>
                <TouchableOpacity
                  disabled={isFormDisabled}
                  onPress={() => setCurrentPicker("gender")}
                  style={{
                    ...styles.departmentselectBox,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                >
                  <Text
                    style={{
                      ...styles.departmentselectText,
                      color: colors.placeholderTextColor,
                    }}
                  >
                    {["Male", "Female", "Other"].includes(gender)
                      ? gender
                      : "Select Gender"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.placeholderTextColor}
                    style={{ right: 6 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 14 }}>
              <Text style={{ ...styles.nameText, color: colors.textColor }}>
                Upload Your University ID<Text style={styles.redText}> *</Text>{" "}
              </Text>
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: colors.textinputBackgroundcolor,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                {!universityIdImage && (
                  <>
                    <TouchableOpacity
                      disabled={isFormDisabled}
                      onPress={() => selectImage("universityId")}
                    >
                      <Icon
                        name="cloud-upload"
                        size={60}
                        color={colors.AppmainColor}
                        type="FontAwesome"
                      />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, color: colors.AppmainColor }}>
                      Upload Image
                    </Text>
                  </>
                )}
                {universityIdImage && (
                  <View
                    style={{
                      width: 200,
                      height: 110,
                      borderRadius: 10,
                      position: "relative",
                      marginTop: 10,
                    }}
                  >
                    <Image
                      source={{ uri: universityIdImage }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                      }}
                      resizeMode="cover"
                    />

                    <TouchableOpacity
                      onPress={() => {
                        setUniversityIdImage(null);
                        setBase64UniversityId(null);
                      }}
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        backgroundColor: "rgba(255,255,255,0.7)",
                        borderRadius: 12,
                        padding: 2,
                        zIndex: 10,
                      }}
                    >
                      <Icon name="cross" size={20} color="#000" type="Entypo" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.namedepartmentMainBox}>
              <View style={styles.nameBox}>
                <Text style={{ ...styles.nameText, color: colors.textColor }}>
                  Student Id<Text style={styles.redText}> *</Text>{" "}
                </Text>
                <TextInput
                  editable={!isFormDisabled}
                  style={{
                    ...styles.inputText,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    color: colors.textColor,
                  }}
                  value={studentId}
                  onChangeText={setStudentId}
                  placeholder="Student Id"
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>
              <View style={styles.departmentBox}>
                <Text style={{ ...styles.nameText, color: colors.textColor }}>
                  Photo ID Type<Text style={styles.redText}> *</Text>{" "}
                </Text>
                <TouchableOpacity
                  disabled={isFormDisabled}
                  onPress={() => setCurrentPicker("photoId")}
                  style={{
                    ...styles.departmentselectBox,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                >
                  <Text
                    style={{
                      ...styles.departmentselectText,
                      color: colors.placeholderTextColor,
                    }}
                  >
                    {photoIdType ? photoIdType.document : "Photo ID Type"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.placeholderTextColor}
                    style={{ right: 6 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 14 }}>
              <Text style={{ ...styles.nameText, color: colors.textColor }}>
                Upload Your Photo ID Card<Text style={styles.redText}> *</Text>{" "}
              </Text>
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: colors.textinputBackgroundcolor,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                {!studentPhotoImage && (
                  <>
                    <TouchableOpacity
                      disabled={isFormDisabled}
                      onPress={() => selectImage("studentPhoto")}
                    >
                      <Icon
                        name="cloud-upload"
                        size={60}
                        color={colors.AppmainColor}
                        type="FontAwesome"
                      />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, color: colors.AppmainColor }}>
                      Upload Image
                    </Text>
                  </>
                )}
                {studentPhotoImage && (
                  <View
                    style={{
                      width: 200,
                      height: 110,
                      borderRadius: 10,
                      position: "relative",
                      marginTop: 10,
                    }}
                  >
                    <Image
                      source={{ uri: studentPhotoImage }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                      }}
                      resizeMode="cover"
                    />

                    <TouchableOpacity
                      onPress={() => {
                        setStudentPhotoImage(null);
                        setBase64StudentPhoto(null);
                      }}
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        backgroundColor: "rgba(255,255,255,0.7)",
                        borderRadius: 12,
                        padding: 2,
                        zIndex: 10,
                      }}
                    >
                      <Icon name="cross" size={20} color="#000" type="Entypo" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View
              style={{
                borderLeftWidth: 4,
                paddingLeft: 10,
                borderColor: colors.AppmainColor,
                backgroundColor: colors.textinputBackgroundcolor,
                paddingVertical: 10,
                marginVertical: 20,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  disabled={isFormDisabled}
                  onPress={() => setChecked(!checked)}
                >
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
                    fontSize: 13,
                    flexShrink: 1,
                    fontWeight: "400",
                    lineHeight: 18,
                    color: colors.textColor,
                  }}
                >
                  I wish to abide by all the rules & guidelines given by
                  University Placement Cell from time to time
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            disabled={isFormDisabled}
            onPress={handlePlacementRegistrationApi}
            style={{
              alignItems: "center",
              backgroundColor: colors.AppmainColor,
              marginHorizontal: 12,
              padding: 10,
              borderRadius: 4,
              marginVertical: 20,
              opacity: isFormDisabled ? 0.9 : 1,
            }}
          >
            <Text style={{ fontSize: 18, color: colors.ButtonTextColor }}>
              {isFormDisabled ? "Already Registered" : "Submit"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <Modal visible={!!currentPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={{
              ...styles.modalBox,
              backgroundColor: colors.modelBackground,
            }}
          >
            {(currentPicker === "course" || currentPicker === "department") && (
              <TextInput
                placeholder={`Search ${currentPicker}`}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  borderWidth: 1,
                  borderColor: colors.textinputbordercolor,
                  color: colors.textColor,
                  backgroundColor: colors.textinputBackgroundcolor,
                  borderRadius: 8,
                  padding: 8,
                  margin: 10,
                }}
                placeholderTextColor={colors.placeholderTextColor}
              />
            )}

            <ScrollView style={{ maxHeight: 300 }}>
              {currentPicker === "gender" &&
                renderOptions(["Male", "Female", "Other"], (g) => {
                  setGender(g);
                  setCurrentPicker(null);
                })}

              {currentPicker === "year" &&
                renderOptions(years, setSelectedYear)}

              {currentPicker === "passingYear" &&
                renderOptions(
                  Array.from({ length: 10 }, (_, i) => (2025 + i).toString()),
                  (year) => {
                    setPassingYear(year);
                    setCurrentPicker(null);
                  }
                )}

              {currentPicker === "photoId" &&
                renderOptions(
                  photoIdOptions,
                  (item) => {
                    setPhotoIdType(item);
                    setCurrentPicker(null);
                  },
                  (item) => item.document
                )}

              {currentPicker === "semester" &&
                renderOptions(
                  Array.from({ length: 8 }, (_, i) => (i + 1).toString()),
                  (s) => {
                    setSemester(s);
                    setCurrentPicker(null);
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
                  },
                  (c) => c.Name
                )}

              {currentPicker === "department" &&
                renderOptions(
                  departmentList.filter(
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
                  },
                  (d) => d.DepartmentName
                )}
            </ScrollView>

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

export default PlacementRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 12,
    paddingHorizontal: 12,
  },

  placementTitleText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    lineHeight: 26,
  },
  placementSubText: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 20,
    marginBottom: 10,
  },
  line: {
    height: 1,
    marginVertical: 16,
  },
  UPCText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 28,
    marginVertical: 16,
  },
  cardImage: {
    width: 110,
    height: 120,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: Colors.lite_gray,
  },
  namedepartmentMainBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  nameBox: { flex: 1, marginRight: 10 },
  nameText: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
  },
  redText: { color: "red" },
  inputText: {
    //  height: 40,
    borderWidth: 1,
    padding: 10,
    color: "black",
    borderRadius: 8,
    // borderColor: Colors.placeholdercolor,
    // flex: 1,
  },
  departmentBox: {
    flex: 1,
  },
  departmentselectBox: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    // borderColor: Colors.placeholdercolor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // flex: 1,
  },
  departmentselectText: {
    // color: Colors.placeholdercolor,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  modalBox: {
    // backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: "70%",
  },
  modalContent: {
    // padding: 20,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  cancelButton: {
    backgroundColor: "#333",
    padding: 12,
    alignItems: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
