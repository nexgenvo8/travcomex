import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import globalStyles from "../GlobalCSS";
import Header from "../Header/Header";
import Colors from "../color";
import Icon from "../Icons/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import PlaneIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  addjob,
  baseUrl,
  ListCompany,
  listoption,
  updatejob,
} from "../baseURL/api";
import { showError, showSuccess } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { universityFullName } from "../constants";

const AddJob = ({ navigation, route }) => {
  const { Item = {} } = route.params || {};
  const { isDark, colors, toggleTheme } = useTheme();
  const [number, onChangeNumber] = useState("");
  const [selectedValue5, setSelectedValue5] = useState("Select");
  const [isOpen5, setIsOpen5] = useState(false);
  const [selectedValue6, setSelectedValue6] = useState("Select");
  const [isOpen6, setIsOpen6] = useState(false);
  const [selectedValueComp, setSelectedValueComp] = useState("Select");
  const [compValData, setCompValData] = useState([]);
  const [isOpenComp, setIsOpenComp] = useState(false);
  const [selectedValue2, setSelectedValue2] = useState("Select");
  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedValueApply, setSelectedValueApply] =
    useState("Send to Website");
  const [isOpenApply, setIsOpenApply] = useState(false);
  const [industryData, setIndustryData] = useState([]);
  const [perfID1, setPerfID1] = useState("");
  const [perfID2, setPerfID2] = useState("");
  const [description, setDescription] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [skillsArray, setSkillsArray] = useState([]);
  const [cityTitle, setCityTitle] = useState("");
  const [location, setLocation] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const [jobSeekerFind, setJobSeekerFind] = useState("");
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [checked, setChecked] = useState(false);
  const [jobConsultant, setJobConsultant] = useState(false);
  const [userData, setUserData] = useState(null);
  const [compData, setCompData] = useState([]);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorCategory, setErrorCategory] = useState(false);
  const [errorCareerLevel, setErrorCareerLevel] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorSkills, setErrorSkills] = useState(false);
  const [errorMinSalary, setErrorMinSalary] = useState(false);
  const [errorMaxSalary, setErrorMaxSalary] = useState(false);
  const [errorJobConsultant, setErrorJobConsultant] = useState(false);
  const [errorCompany, setErrorCompany] = useState(false);
  const [errorLocation, setErrorLocation] = useState(false);
  const [errorPostcode, setErrorPostcode] = useState(false);
  const [errorAddress, setErrorAddress] = useState(false);
  const [errorIntustry, setErrorIntustry] = useState(false);
  const [errorLink, setErrorLink] = useState(false);
  const [errorJobSeeker, setErrorJobSeeker] = useState(false);
  const [errorChecked, setErrorChecked] = useState(false);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [perPage] = useState(20);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    UserValue();
  }, []);

  const UserValue = async () => {
    try {
      const userDta = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    if (compValData) {
      setSelectedValue6(compValData?.companyTypeName || "Select");
      setLocation(compValData?.companyAddress || "");
      setPinCode(compValData?.postalCode || "");
      setAddress(compValData?.companyAddress || "");
    }
  }, [compValData]);

  useEffect(() => {
    if (Item && typeof Item === "object") {
      setStateFromItem(Item);
    }
  }, [JSON.stringify(Item)]); // Converts Item to string to detect deep changes

  const setStateFromItem = (item) => {
    // console.log('Item --- item.jobCatName', item);
    onChangeNumber(item.jobTitle || "");
    setDescription(item.jobDetails || "");
    setTitle(item.minAnnualSalary || "");
    setCityTitle(item.maxAnnualSalary || "");
    setLocation(item.jobLocation || "");
    setPinCode(item.postalCode || "");
    setAddress(item.companyAddress || "");
    setJobSeekerFind(item.jobKeywords || "");
    setLink(item.companyJobUrl || "");
    setChecked(item.jobStatus === 1);
    setJobConsultant(item.jobConsultant === 1);
    setSelectedValue5(item.jobCatName || "Select");
    setSelectedValue2(item.levelName || "Select");
    setSelectedValueComp(item.companyName || "Select");
    setSelectedValue6(item.companyTypeName || "Select");
    setSkillsArray(item.proSkills ? item.proSkills.split(", ") : []);
  };

  useEffect(() => {
    if (selectedValue5 !== "Select" && selectedValue5) {
      setErrorCategory(false);
    }
    if (selectedValue2 !== "Select" && selectedValue5) {
      setErrorCareerLevel(false);
    }
    if (selectedValueComp !== "Select" && selectedValue5) {
      setErrorCompany(false);
    }

    if (selectedValue6 !== "Select" && selectedValue5) {
      setErrorIntustry(false);
    }
    // if (location) {
    //   setErrorLocation(false);
    // }
    // if (pinCode) {
    //   setErrorPostcode(false);
    // }

    if (address) {
      setErrorAddress(false);
    }
  }, [selectedValue5, selectedValue2, selectedValueComp, selectedValue6]);
  useEffect(() => {
    if (showIndustryModal) {
      setPage(1);
      setHasMore(true);
      getIndustryList(1);
    }
  }, [showIndustryModal]);

  const loadingRef = useRef(false);

  const getIndustryList = async (pageNumber = 1) => {
    if (loadingRef.current || (pageNumber !== 1 && !hasMore)) return;

    loadingRef.current = true;

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
      loadingRef.current = false;
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
  //     console.log("value data --------->>>>>>>", data?.DataList);

  //     if (response.ok) {
  //       setIndustryData(data?.DataList);
  //     } else {
  //       showError(data.message || "Failed to Industry List");
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error Industry List:", error);
  //   }
  // };
  const getCompantListSelf = async (Val) => {
    //  console.log(' value --- > ', Val);
    try {
      const payload = JSON.stringify({
        userId: userData?.User?.userId,
        entityName: "self",
        per_page: 50,
        page: 1,
      });
      const response = await fetch(`${baseUrl}${ListCompany}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });
      const data = await response.json();
      if (response.ok) {
        setCompData(data?.Data);
      } else {
        showError(data.message || "Failed to Industry List");
      }
    } catch (error) {
      console.error("Fetch Error Industry List:", error);
    }
  };
  const selectOption5 = (option) => {
    setPerfID1(option?.Id);
    setSelectedValue5(option?.Name);
    setIsOpen5(false);
  };
  const toggleDropdown5 = () => {
    getIndustryList("industry");
    setIsOpen5(!isOpen5);
  };
  const selectOption6 = (option) => {
    // setPerfID1(option?.Id);
    setSelectedValue6(option?.Name);
    setIsOpen6(false);
  };
  const toggleDropdown6 = () => {
    getIndustryList("industry");
    setIsOpen6(!isOpen6);
  };
  const selectOptionComp = (option) => {
    // setPerfID(option?.Id);
    setSelectedValueComp(option?.companyName);
    setCompValData(option);
    setIsOpenComp(false);
  };
  const toggleDropdownComp = () => {
    // getIndustryList('industry');
    getCompantListSelf();
    setIsOpenComp(!isOpenComp);
  };
  const selectOption2 = (option) => {
    setPerfID2(option?.Id);
    setSelectedValue2(option?.Name);
    setIsOpen2(false);
  };
  const toggleDropdown2 = () => {
    getIndustryList("careerlevel");
    setIsOpen2(!isOpen2);
  };
  const optionsApply = [
    "Send to Website",
    `By ${universityFullName} Messaging`,
  ];
  const selectOptionApply = (option) => {
    // setPerfID2(option?.Id);
    setSelectedValueApply(option);
    setIsOpenApply(false);
  };
  const toggleDropdownApply = () => {
    // getIndustryList('careerlevel');
    setIsOpenApply(!isOpenApply);
  };
  const handleAddSkill = () => {
    setErrorSkills(false);
    if (newSkill.trim()) {
      setSkillsArray([...skillsArray, newSkill]);
      setNewSkill("");
    }
  };
  const handleRemoveSkill = (skill) => {
    setSkillsArray(skillsArray.filter((s) => s !== skill));
  };
  const AddJobPost = async () => {
    // Reset errors
    let isValid = true;
    // console.log('selectedValueComp:', selectedValueComp);
    //console.log('Is Form Valid?', isValid);

    // Validate Job Title
    if (!number.trim()) {
      setErrorTitle(true);
      isValid = false;
    }
    // Validate Job Category
    if (selectedValue5 === "Select") {
      setErrorCategory(true);
      isValid = false;
    }

    // Validate Career Level
    if (selectedValue2 === "Select") {
      setErrorCareerLevel(true);
      isValid = false;
    }

    // Validate Description
    if (!description.trim()) {
      setErrorDescription(true);
      isValid = false;
    }

    // Validate Skills
    if (skillsArray.length === 0) {
      setErrorSkills(true);
      isValid = false;
    }

    // const minSalary = parseFloat(title);
    // const maxSalary = parseFloat(cityTitle);
    // if (!title.trim() || isNaN(minSalary)) {
    //   setErrorMinSalary(true);
    //   isValid = false;
    // }
    // if (!cityTitle.trim() || isNaN(maxSalary) || maxSalary < minSalary) {
    //   setErrorMaxSalary(true);
    //   isValid = false;
    // }

    // Validate Company
    // if (jobConsultant === false) {
    //   setErrorJobConsultant(true);
    //   isValid = false;
    // }

    // Validate Company
    // if (selectedValueComp == 'Select') {
    //   setErrorCompany(true);
    //   isValid = false;
    // }

    // Validate intustry
    if (selectedValue6 == "Select") {
      setErrorIntustry(true);
      isValid = false;
    }

    // Validate Job Location
    // if (!location) {
    //   setErrorLocation(true);
    //   isValid = false;
    // }

    // Validate Postcode (basic numeric check)
    // if (!pinCode) {
    //   setErrorPostcode(true);
    //   isValid = false;
    // }

    // Validate Address
    if (!address) {
      setErrorAddress(true);
      isValid = false;
    }

    // Validate How to Apply Link
    if (selectedValueApply === "Send to Website" && !link.trim()) {
      setErrorLink(true);
      isValid = false;
    }

    // if (!jobSeekerFind) {
    //   setErrorJobSeeker(true);
    //   isValid = false;
    // }
    // Validate Confirmation Checkbox
    if (!checked) {
      setErrorChecked(true);
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }
    // Cleaning skills array
    const cleanedSkillsArray = skillsArray
      .map((skill) => skill.trim())
      .join(", ");
    try {
      const payload = JSON.stringify({
        id: Item?.id || "",
        userId: userData?.User?.userId,
        companyId: compValData?.id || Item?.id || "",
        jobTitle: number,
        jobDetails: description,
        appliedType: 1, // 1 or 2
        jobCatId: perfID1 || Item.jobCatId,
        levelId: perfID2 || Item.levelId,
        proSkills: cleanedSkillsArray,
        minAnnualSalary: title,
        maxAnnualSalary: cityTitle,
        companyName: selectedValueComp,
        companyTypeId: compValData?.companyTypeId || Item?.companyTypeId || 0,
        jobLocation: location,
        postalCode: compValData?.postalCode || Item?.postalCode,
        companyAddress: address,
        companyJobUrl:
          compValData?.companyUrl || Item?.companyJobUrl || Item?.companyUrl,
        jobKeywords: jobSeekerFind,
        jobConsultant: jobConsultant === true ? 1 : 0, // 0 or 1
        jobStatus: checked == true ? 1 : 0,
        status: 1,
      });

      const response = await fetch(
        `${baseUrl}${
          Item?.appliedType ? (Item?.id ? updatejob : addjob) : addjob
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
        }
      );
      // const text = await response.text();
      // console.log('texttexttexttexttexttext', text);
      const data = await response.json();
      if (response.ok) {
        console.log("Add data  ----", data);
        showSuccess(data.Message);
        if (Item?.companyUrl) {
          navigation.navigate("CompanyProfiles");
        } else if (Item?.id) {
          navigation.navigate("JobOpportunities");
        } else {
          navigation.goBack();
        }
      } else {
        showError(data.message);
        console.log(data);
      }
    } catch (error) {
      console.error("Fetch Error AddJobPost:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header title="Add Job Opportunities" navigation={navigation} />
      <KeyboardAvoidingWrapper offset={40}>
        <View style={{ flex: 1 }}>
          <View style={{}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={globalStyles.ViewINter1}>
                <Text
                  style={{
                    ...globalStyles.headlineText,
                    color: colors.textColor,
                  }}
                >
                  Create Job profile
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
                    ...globalStyles.JobfiledSectionText,
                    color: colors.textColor,
                    // color: errorTitle ? Colors.error : Colors.gray,
                  }}
                >
                  Job Title <Text style={{ color: "red" }}>*</Text>
                </Text>

                <TextInput
                  style={{
                    ...globalStyles.textInput,
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
                  placeholder=""
                  keyboardType="default"
                  multiline
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>

              <View style={{ marginHorizontal: 10 }}>
                <Text
                  style={{
                    marginTop: 20,
                    color: colors.textColor,
                    // color: errorCategory ? Colors.error : Colors.gray,
                  }}
                >
                  Job Category <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setShowIndustryModal(true)}
                  style={{
                    ...globalStyles.seclectIndiaView,
                    borderColor: errorCategory
                      ? Colors.error
                      : colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                >
                  <Text
                    style={{
                      ...globalStyles.JobfiledSectionText,
                      paddingBottom: 0,
                      color: colors.textColor,
                    }}
                  >
                    {selectedValue5 || "Select"}
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={toggleDropdown5}
                  style={{
                    ...globalStyles.seclectIndiaView,
                    borderColor: errorCategory
                      ? Colors.error
                      : colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
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
                )} */}
              </View>
              <View style={{ marginHorizontal: 10 }}>
                <Text
                  style={{
                    marginTop: 20,
                    color: colors.textColor,
                  }}
                >
                  Career level <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={toggleDropdown2}
                  style={{
                    //   marginHorizontal: 10,
                    ...globalStyles.seclectIndiaView,
                    borderColor: errorCareerLevel
                      ? Colors.error
                      : colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                >
                  <Text
                    style={{
                      ...globalStyles.JobfiledSectionText,
                      paddingBottom: 0,
                      color: colors.textColor,
                    }}
                  >
                    {selectedValue2}
                  </Text>
                </TouchableOpacity>
                {isOpen2 && (
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
                          selectOption2(item);
                        }}
                      >
                        <Text style={{ fontSize: 14, color: colors.textColor }}>
                          {item?.Name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={globalStyles.JobfiledSection}>
                <Text
                  style={{
                    ...globalStyles.JobfiledSectionText,
                    paddingHorizontal: 10,
                    color: colors.textColor,
                    // color: errorDescription ? Colors.error : Colors.gray,
                  }}
                >
                  Job description <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    marginHorizontal: 10,
                    height: 80,
                    borderColor: errorDescription
                      ? Colors.error
                      : colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    color: colors.textColor,
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

              <View style={globalStyles.containerSkill}>
                <FlatList
                  data={skillsArray}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={3}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        ...globalStyles.skillTag,
                        backgroundColor: colors.AppmainColor,
                      }}
                      onPress={() => handleRemoveSkill(item)}
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
                <Text
                  style={{
                    ...globalStyles.JobfiledSectionText,
                    color: colors.textColor,
                    // color: errorDescription ? Colors.error : Colors.gray,
                  }}
                >
                  Required skills and experience{" "}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>
                {/* Input Field */}
                <View style={globalStyles.inputContainerSkill}>
                  <TextInput
                    placeholderTextColor={colors.placeholderTextColor}
                    placeholder="Enter skill..."
                    value={newSkill}
                    onChangeText={setNewSkill}
                    style={{
                      ...globalStyles.inputSkill,
                      // backgroundColor:"red",
                      borderColor: errorSkills
                        ? Colors.error
                        : colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                      color: colors.textColor,
                    }}
                  />
                  <TouchableOpacity
                    onPress={handleAddSkill}
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
                      ...globalStyles.JobfiledSectionText,
                      color: colors.textColor,
                      // color: errorMinSalary ? Colors.error : Colors.gray,
                    }}
                  >
                    Min. annual salary
                  </Text>

                  <TextInput
                    style={{
                      ...globalStyles.textInput,
                      borderColor: colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                      color: colors.textColor,
                      // borderColor: errorMinSalary ? Colors.error : Colors.gray,
                    }}
                    onChangeText={(value) => {
                      setTitle(value);
                      //setErrorMinSalary(value.trim().length === 0);
                    }}
                    value={title}
                    keyboardType="default"
                    multiline
                    //placeholderTextColor={colors.placeholderTextColor}
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
                      ...globalStyles.JobfiledSectionText,
                      color: colors.textColor,
                      // color: errorMaxSalary ? Colors.error : Colors.gray,
                    }}
                  >
                    Max. annual salary
                  </Text>

                  <TextInput
                    style={{
                      ...globalStyles.textInput,
                      borderColor: colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                      color: colors.textColor,
                      //  borderColor: errorMaxSalary ? Colors.error : Colors.gray,
                    }}
                    onChangeText={(value) => {
                      setCityTitle(value);
                      // setErrorMaxSalary(value.trim().length === 0);
                    }}
                    value={cityTitle}
                    keyboardType="default"
                    multiline
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setJobConsultant(!jobConsultant),
                    setErrorJobConsultant(false);
                }}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 2,
                    borderColor: colors.textinputbordercolor,
                    marginRight: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 10,
                  }}
                >
                  {jobConsultant && (
                    <Icon
                      name="check"
                      size={18}
                      color={colors.backIconColor}
                      type="AntDesign"
                    />
                  )}
                </View>
                <Text style={{ color: colors.textColor }}>
                  This job by consultant
                </Text>
              </TouchableOpacity>

              <View style={globalStyles.ViewINter1}>
                <Text
                  style={{
                    ...globalStyles.headlineText,
                    color: colors.textColor,
                  }}
                >
                  Employer
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
                    ...globalStyles.JobfiledSectionText,
                    color: errorCompany ? Colors.error : colors.textColor,
                  }}
                >
                  Company <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={toggleDropdownComp}
                  style={{
                    ...globalStyles.seclectIndiaView,
                    borderColor: errorCompany
                      ? Colors.error
                      : colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                >
                  <Text
                    style={{
                      ...globalStyles.JobfiledSectionText,
                      paddingBottom: 0,
                      color: colors.textColor,
                    }}
                  >
                    {selectedValueComp}
                  </Text>
                </TouchableOpacity>
                {isOpenComp && (
                  <View
                    style={{
                      ...globalStyles.dropdownList,
                      borderColor: colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                  >
                    {compData.map((item) => (
                      <TouchableOpacity
                        key={item.Id}
                        style={{
                          ...globalStyles.dropdownItem,
                          borderColor: colors.textinputbordercolor,
                        }}
                        onPress={() => {
                          selectOptionComp(item);
                        }}
                      >
                        <Text style={{ fontSize: 14, color: colors.textColor }}>
                          {item?.companyName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={{ marginHorizontal: 10 }}>
                <Text
                  style={{
                    marginTop: 20,
                    color: colors.textColor,
                    // color: errorIntustry ? Colors.error : Colors.gray,
                  }}
                >
                  Industry <Text style={{ color: "red" }}>*</Text>
                </Text>

                <TouchableOpacity
                  onPress={toggleDropdown6}
                  style={{
                    ...globalStyles.seclectIndiaView,
                    borderColor: errorIntustry
                      ? Colors.error
                      : colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                >
                  <Text
                    style={{
                      ...globalStyles.JobfiledSectionText,
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
                          selectOption6(item);
                        }}
                      >
                        <Text style={{ fontSize: 14, color: colors.textColor }}>
                          {item?.Name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

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
                      ...globalStyles.JobfiledSectionText,
                      color: colors.textColor,
                      // color: errorLocation ? Colors.error : Colors.gray,
                    }}
                  >
                    Job location
                  </Text>

                  <TextInput
                    style={{
                      ...globalStyles.textInput,
                      borderColor: colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                      color: colors.textColor,
                      // borderColor: errorLocation ? Colors.error : Colors.gray,
                    }}
                    onChangeText={(value) => {
                      setLocation(value);
                      // setErrorLocation(value.length === 0);
                    }}
                    value={location}
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
                      ...globalStyles.JobfiledSectionText,
                      color: colors.textColor,
                      // color: errorPostcode ? Colors.error : Colors.gray,
                    }}
                  >
                    Postcode
                  </Text>

                  <TextInput
                    style={{
                      ...globalStyles.textInput,
                      borderColor: colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                      color: colors.textColor,
                      // borderColor: errorPostcode ? Colors.error : Colors.gray,
                    }}
                    onChangeText={(value) => {
                      setPinCode(value);
                    }}
                    value={pinCode}
                    keyboardType="default"
                    multiline
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                </View>
              </View>

              <View style={globalStyles.JobfiledSection}>
                <Text
                  style={{
                    ...globalStyles.JobfiledSectionText,
                    paddingHorizontal: 10,
                    color: colors.textColor,
                    // color: errorAddress ? Colors.error : Colors.gray,
                  }}
                >
                  Address <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    marginHorizontal: 10,
                    height: 80,
                    borderColor: errorAddress
                      ? Colors.error
                      : colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    color: colors.textColor,
                  }}
                  onChangeText={(value) => {
                    setAddress(value);
                  }}
                  value={address}
                  placeholder="Write your Address"
                  keyboardType="default"
                  multiline
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>

              <View style={globalStyles.ViewINter1}>
                <Text
                  style={{
                    ...globalStyles.headlineText,
                    color: colors.textColor,
                  }}
                >
                  How to apply <Text style={{ color: "red" }}>*</Text>
                </Text>
              </View>

              <View style={{ marginHorizontal: 10 }}>
                <TouchableOpacity
                  onPress={toggleDropdownApply}
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
                    {selectedValueApply}
                  </Text>
                </TouchableOpacity>
                {isOpenApply && (
                  <View
                    style={{
                      ...globalStyles.dropdownList,
                      borderColor: colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                  >
                    {optionsApply.map((item) => (
                      <TouchableOpacity
                        key={item.Id}
                        style={{
                          ...globalStyles.dropdownItem,
                          borderColor: colors.textinputbordercolor,
                        }}
                        onPress={() => {
                          selectOptionApply(item);
                        }}
                      >
                        <Text style={{ fontSize: 14, color: colors.textColor }}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              {selectedValueApply === "Send to Website" ? (
                <View
                  style={{
                    ...globalStyles.JobfiledSection,
                    paddingHorizontal: 10,
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      ...globalStyles.JobfiledSectionText,
                      color: colors.textColor,
                    }}
                  >
                    Enter The Link
                  </Text>

                  <TextInput
                    style={{
                      ...globalStyles.textInput,
                      borderColor: colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                      color: colors.textColor,
                      // borderColor: errorLink ? Colors.error : Colors.gray,
                    }}
                    onChangeText={(value) => {
                      setLink(value);
                      // setErrorLink(value.trim().length === 0);
                    }}
                    value={link}
                    keyboardType="default"
                    multiline
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                </View>
              ) : null}

              <View style={globalStyles.JobfiledSection}>
                <Text
                  style={{
                    ...globalStyles.headlineText,
                    padding: 10,
                    color: colors.textColor,
                    // color: errorJobSeeker ? Colors.error : Colors.gray,
                  }}
                >
                  Help jobseekers find your job ad
                </Text>

                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    marginHorizontal: 10,
                    height: 80,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    color: colors.textColor,
                    // borderColor: errorJobSeeker ? Colors.error : Colors.gray,
                  }}
                  onChangeText={(value) => {
                    setJobSeekerFind(value);
                    //setErrorJobSeeker(value.trim().length === 0);
                  }}
                  value={jobSeekerFind}
                  placeholder="Which keywords should be assigned to this job ad?"
                  keyboardType="default"
                  multiline
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>

              <View
                style={{
                  marginTop: 20,
                  // marginHorizontal: 10,
                  borderLeftWidth: 4,
                  paddingLeft: 10,
                  borderColor: colors.AppmainColor,
                  marginHorizontal: 10,
                }}
              >
                {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => setChecked(!checked)}>
                  <MaterialCommunityIcons
                    name={
                      checked ? 'checkbox-marked' : 'checkbox-blank-outline'
                    }
                    size={24}
                    color={Colors.main_primary}
                    style={{marginRight: 10}}
                  />
                </TouchableOpacity>
                <Text style={{fontSize: 14, flexShrink: 1}}>
                  Display job ad on the {universityFullName} Jobs
                </Text>
              </View> */}
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => setChecked(!checked)}>
                    <MaterialCommunityIcons
                      name={
                        checked ? "checkbox-marked" : "checkbox-blank-outline"
                      }
                      size={24}
                      color={colors.AppmainColor}
                      style={{ marginRight: 10 }}
                    />
                  </TouchableOpacity>
                  {/* <PlaneIcon
                  name="checksquare"
                  size={20}
                  color={Colors.main_primary}
                  style={{marginRight: 10}}
                /> */}
                  <Text
                    style={{
                      fontSize: 14,
                      flexShrink: 1,
                      color: colors.AppmainColor,
                    }}
                  >
                    I confirm that I am authorized to create this Job and the
                    information given is correct.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={{
                  ...globalStyles.saveButton,
                  margin: 20,
                  backgroundColor: colors.AppmainColor,
                }}
                onPress={() => AddJobPost()}
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
          </View>
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
              activeOpacity={0.7}
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
    </SafeAreaView>
  );
};

export default AddJob;
