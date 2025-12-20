import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
  Button,
} from "react-native";
import globalStyles from "../GlobalCSS";
import Header from "../Header/Header";
import Colors from "../color";
import Icon from "../Icons/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  AddCompanyApi,
  addjob,
  baseUrl,
  CountryList,
  listoption,
  StateList,
  UpdateCompany,
  updatejob,
} from "../baseURL/api";
import ImagePicker from "react-native-image-crop-picker";
import { showError, showSuccess } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";

const AddCompany = ({ navigation, route }) => {
  const { Item = {}, AdditionalData = [] } = route.params || {};
  console.log("Item ---- >", Item);
  const { isDark, colors, toggleTheme } = useTheme();
  const [number, onChangeNumber] = useState("");
  const [selectedValue5, setSelectedValue5] = useState("Select");
  const [isOpen5, setIsOpen5] = useState(false);
  const [selectedValueComp, setSelectedValueComp] = useState("Select");
  const [selectedValue2, setSelectedValue2] = useState("Select");
  const [isOpen2, setIsOpen2] = useState(false);
  const [industryData, setIndustryData] = useState([]);
  const [perfID1, setPerfID1] = useState("");
  const [description, setDescription] = useState("");
  const [userData, setUserData] = useState(null);
  const [errorTitle, setErrorTitle] = useState(false);
  console.log("errorTitle", errorTitle);
  const [errorCategory, setErrorCategory] = useState(false);
  const [errorCareerLevel, setErrorCareerLevel] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorCompany, setErrorCompany] = useState(false);
  const [tag, setTag] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [errorCountry, setErrorCountry] = useState("");
  const [errorState, setErrorState] = useState("");
  const [errorTag, setErrorTag] = useState(false);
  const [errorYear, setErrorYear] = useState(false);
  const [errorImg, setErrorImg] = useState(false);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [city, setCity] = useState("");
  const [errorCity, setErrorCity] = useState(false);
  const [errorPostalCode, setErrorPostalCode] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [pNo, setPNo] = useState("");
  const [eMail, setEMail] = useState("");
  const [compURL, setCompURL] = useState("");
  const [aboutComp, setAboutComp] = useState("");
  const [errorPNo, setErrorPNo] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorCopmURL, setErrorCopmURL] = useState(false);
  const [errorAboutComp, setErrorAboutComp] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  console.log("selectedCountry", selectedCountry);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [stateLoading, setStateLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [base64Logo, setBase64Logo] = useState(null);
  const [base64Banner, setBase64Banner] = useState(null);
  const [checked, setChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryStates, setSearchQueryStates] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [perPage] = useState(10);
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMoreData(true);
  };

  useEffect(() => {
    if (searchQueryStates === "") {
      setFilteredStates(stateList);
    } else {
      const filtered = stateList.filter((item) =>
        item.label.toLowerCase().includes(searchQueryStates.toLowerCase())
      );
      setFilteredStates(filtered);
    }
  }, [searchQueryStates, stateList]);
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredCountries(countryList);
    } else {
      const filtered = countryList.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery, countryList]);

  useEffect(() => {
    if (Item) {
      onChangeNumber(Item?.companyName);
      setTag(Item?.companyName);
      setPerfID1(Item?.companyTypeId);
      setSelectedValue5(Item?.companyTypeName);
      setEstablishedYear(Item.establishedYear?.toString());
      if (Item?.empStrength) {
        const selectedOption = optionsApply1.find(
          (option) => option.id === Item.empStrength
        );
        setSelectedValue2(selectedOption || null);
      }
      setDescription(Item?.companyAddress);
      setSelectedCountry(Item?.countryName);
      setSelectedState(Item?.stateName);
      setAboutComp(Item.aboutCompany || "");
      setCity(Item.cityName || "");
      setCompURL(Item.companyUrl || "");
      setPNo(Item.phoneNumber || "");
      setEMail(Item.emailAddress || "");
      setPostalCode(Item.postalCode || "");
      if (Item?.companyLogo) {
        // setImage(Item.companyLogo);
        setLogoImage(Item.companyLogo);
      }
    }
  }, []); // Runs only when Item changes

  useEffect(() => {
    UserValue();
  }, []);
  const UserValue = async () => {
    try {
      const userDta = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    } catch (error) {
      console.error("ErrorUserValue:", error);
    }
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

    if (selectedCountry !== null && selectedCountry) {
      setErrorCountry(false);
    }

    if (selectedState !== null && selectedState) {
      setErrorState(false);
    }
    if (image !== null && image) {
      setErrorImg(false);
    }
  }, [
    selectedValue5,
    selectedValue2,
    selectedValueComp,
    selectedCountry,
    selectedState,
    image,
  ]);
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
  //   console.log(" value --- > ", Val);
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
  //       showError(data.message);
  //     }
  //   } catch (error) {
  //     console.error("getIndustryListss Error:", error);
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
  const selectOption2 = (option) => {
    setSelectedValue2(option);
    setIsOpen2(false);
  };
  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2);
  };

  const optionsApply1 = [
    { id: 1, label: "0 - 10" },
    { id: 2, label: "10 - 50" },
    { id: 3, label: "50 - 100" },
    { id: 4, label: "100 - 1000" },
    { id: 5, label: "1000 - 10000" },
    { id: 6, label: "10000+" },
  ];
  const AddCompanyPost = async () => {
    let isValid = true;

    if (!number) {
      setErrorTitle(true);
      isValid = false;
    }
    console.log("isValid", isValid);
    if (!tag) {
      setErrorTag(true);
      isValid = false;
    }
    if (!selectedValue5) {
      setErrorCategory(true);
      isValid = false;
    }
    if (selectedValue2 === "Select") {
      setErrorCareerLevel(true);
      isValid = false;
    }
    if (!establishedYear) {
      setErrorYear(true);
      isValid = false;
    }
    // if (!description) {
    //   setErrorDescription(true);
    //   isValid = false;
    // }
    if (selectedCountry === null || selectedCountry === undefined) {
      setErrorCountry(true);
      isValid = false;
    }
    if (selectedState === null || selectedState === undefined) {
      setErrorState(true);
      isValid = false;
    }
    if (!city) {
      setErrorCity(true);
      isValid = false;
    }
    if (!postalCode) {
      setErrorPostalCode(true);
      isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!eMail || !emailRegex.test(eMail.trim())) {
      showError("Please enter a valid email address.");
      setErrorEmail(true);
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    const apiUrl = `${baseUrl}${Item?.id ? UpdateCompany : AddCompanyApi}`;
    const payload = JSON.stringify({
      id: Item?.id,
      userId: userData?.User?.userId,
      companyName: number,
      companyTypeId: perfID1,
      establishedYear: establishedYear,
      countryId: Item?.countryId || selectedCountry?.id,
      stateId: Item?.stateId || selectedState?.id,
      cityName: city,
      postalCode: postalCode,
      phoneNumber: pNo,
      emailAaddress: eMail,
      status: 1,
      companyUrl: compURL,
      aboutCompany: aboutComp,
      companyAddress: description,
      empnoId: selectedValue2?.id,
      tagId: tag,
      fileUploaded: base64Logo || null,
      companyBanner: base64Banner || null,
    });

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Add data  ----", data);
        // navigation.goBack();
        navigation.replace("CompanyProfiles");
        showSuccess(data.Message);
      } else {
        showError(data.message);
        console.log(data);
      }
    } catch (error) {
      console.error("Fetch Error of AddCompanyPost:", error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch country list from API
  const fetchCountryList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}${CountryList}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: "" }),
      });

      const data = await response.json();
      if (data?.Data) {
        setCountryList(
          data.Data.map((item) => ({
            id: item.id,
            label: item.country_name,
            phonecode: item.phonecode,
            country_code: item.country_code,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  // Fetch state list from API based on selected country
  const fetchStateList = async (countryId) => {
    console.log("Fetching states for country:", countryId);
    setStateLoading(true);
    try {
      const response = await fetch(`${baseUrl}${StateList}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: "", countryId: countryId }),
      });

      const data = await response.json();
      console.log("State Data:", data);
      if (data?.Data) {
        setStateList(
          data.Data.map((item) => ({
            id: item.countryId,
            label: item.stateName,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setStateLoading(false);
    }
  };
  const selectImage = async (type) => {
    try {
      const pickedImage = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: type === "logo",
        includeBase64: true, // Keep false if uploading to storage
      });

      if (type === "logo") {
        setLogoImage(pickedImage.path);
        setBase64Logo(pickedImage.data);
      } else {
        setBannerImage(pickedImage.path);
        setBase64Banner(pickedImage.data);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header title="Add Company Profile" navigation={navigation} />
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
                  Create Company Profile
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
                  Company Name<Text style={styles.red}>*</Text>
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
                    // color: errorTag ? Colors.error : Colors.gray,
                  }}
                >
                  Tag ID<Text style={styles.red}>*</Text>
                </Text>
                <View style={{ position: "relative" }}>
                  <Text
                    style={{
                      position: "absolute",
                      left: 15, // Adjust as needed
                      top: "30%",
                      transform: [{ translateY: -10 }],
                      color: colors.placeholderTextColor,
                      fontSize: 16,
                    }}
                  >
                    @
                  </Text>

                  <TextInput
                    style={{
                      ...globalStyles.textInput,
                      borderColor: errorTag
                        ? Colors.error
                        : colors.textinputbordercolor,
                      color: colors.textColor,
                      backgroundColor: colors.textinputBackgroundcolor,
                      paddingLeft: 30, // Add padding to prevent text overlap
                    }}
                    onChangeText={(value) => {
                      setTag(value);
                      setErrorTag(value.trim().length === 0);
                    }}
                    value={tag}
                    placeholder=""
                    keyboardType="default"
                    multiline
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                </View>
              </View>

              <View style={{ marginHorizontal: 10 }}>
                <Text
                  style={{
                    marginTop: 20,
                    color: colors.textColor,
                    // color: errorCategory ? Colors.error : Colors.gray,
                  }}
                >
                  Industry<Text style={styles.red}>*</Text>
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
                    {selectedValue5 || "Select"}
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
                    // color: errorYear ? Colors.error : Colors.gray,
                  }}
                >
                  Established in the year<Text style={styles.red}>*</Text>
                </Text>

                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    borderColor: errorYear
                      ? Colors.error
                      : colors.textinputbordercolor,
                    color: colors.textColor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                  onChangeText={(value) => {
                    const numericValue = value.replace(/[^0-9]/g, "");
                    setEstablishedYear(numericValue);
                    setErrorYear(numericValue.length !== 4);
                  }}
                  value={establishedYear}
                  placeholder="YYYY"
                  keyboardType="numeric"
                  maxLength={4}
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>

              <View style={{ marginHorizontal: 10 }}>
                <Text
                  style={{
                    marginTop: 20,
                    color: colors.textColor,
                    // color: errorCareerLevel ? Colors.error : Colors.gray,
                  }}
                >
                  Employee Strength<Text style={styles.red}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={toggleDropdown2}
                  style={{
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
                    {selectedValue2?.label || "Select Employee Strength"}
                  </Text>
                </TouchableOpacity>
                {isOpen2 && (
                  <View
                    style={{
                      ...globalStyles.dropdownList,
                      backgroundColor: colors.textinputBackgroundcolor,
                      borderColor: colors.textinputbordercolor,
                    }}
                  >
                    {optionsApply1.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={{
                          ...globalStyles.dropdownItem,
                          borderColor: colors.textinputbordercolor,
                        }}
                        onPress={() => selectOption2(item)}
                      >
                        <Text style={{ fontSize: 14, color: colors.textColor }}>
                          {item.label}
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
                  Company address
                </Text>
                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    marginHorizontal: 10,
                    height: 80,
                    borderColor: colors.textinputbordercolor,
                    color: colors.textColor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    // borderColor: errorDescription ? Colors.error : Colors.gray,
                  }}
                  onChangeText={(value) => {
                    setDescription(value);
                    //setErrorDescription(value.trim().length === 0);
                  }}
                  value={description}
                  placeholder="Write your Address"
                  keyboardType="default"
                  multiline
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>

              <View style={{ marginHorizontal: 10, marginTop: 20 }}>
                {/* Select Country */}
                <Text style={{ color: colors.textColor }}>
                  Country<Text style={styles.red}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    fetchCountryList();
                    setModalVisible(true);
                  }}
                  style={{
                    ...globalStyles.seclectIndiaView,
                    borderColor: errorCountry
                      ? Colors.error
                      : colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      ...globalStyles.JobfiledSectionText,
                      color: colors.textColor,
                      // color: errorCountry ? Colors.error : 'black',
                    }}
                  >
                    {/* {selectedCountry || 'Select Country'} */}
                    {selectedCountry
                      ? selectedCountry.label || selectedCountry
                      : "Select Country"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.backIconColor}
                    style={{ paddingLeft: 10 }}
                  />
                </TouchableOpacity>

                {/* Select State */}
                <Text
                  style={{
                    marginTop: 15,
                    color: colors.textColor,
                    // color: errorState ? Colors.error : 'black',
                  }}
                >
                  State<Text style={styles.red}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedCountry) {
                      console.log(
                        "Selected Country:",
                        selectedCountry?.phonecode
                      );
                      fetchStateList(selectedCountry.id);
                      setStateModalVisible(true);
                    } else {
                      showError("Please select a country first");
                    }
                  }}
                  style={{
                    ...globalStyles.seclectIndiaView,
                    flexDirection: "row",
                    alignItems: "center",
                    borderColor: errorState
                      ? Colors.error
                      : colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                >
                  <Text
                    style={{
                      ...globalStyles.JobfiledSectionText,
                      color: colors.textColor,
                      // color: errorState ? Colors.error : 'black',
                    }}
                  >
                    {selectedState
                      ? selectedState.label || selectedState
                      : "Select State"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.backIconColor}
                    style={{ paddingLeft: 10 }}
                  />
                </TouchableOpacity>

                {/* Country Modal */}
                <Modal visible={modalVisible} transparent animationType="slide">
                  <View
                    style={{
                      flex: 1,
                      paddingVertical: 30,
                      justifyContent: "center",
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: colors.modelBackground,
                        padding: 20,
                        marginHorizontal: 30,
                        borderRadius: 10,
                        height: "80%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: colors.textColor,
                        }}
                      >
                        Select a Country
                      </Text>
                      <TextInput
                        placeholder="Search country"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={{
                          borderWidth: 1,
                          borderColor: colors.textinputbordercolor,
                          backgroundColor: colors.textinputBackgroundcolor,
                          borderRadius: 8,
                          padding: 8,
                          marginTop: 10,
                          marginBottom: 10,
                          color: colors.textColor,
                        }}
                        placeholderTextColor={colors.placeholderTextColor}
                      />
                      {loading ? (
                        <ActivityIndicator
                          size="large"
                          color={colors.AppmainColor}
                          style={{ marginTop: 20 }}
                        />
                      ) : (
                        <FlatList
                          data={filteredCountries}
                          // data={countryList}
                          keyExtractor={(item) => item.id.toString()}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedCountry(item);
                                setSelectedState(null);
                                setModalVisible(false);
                              }}
                              style={{
                                paddingVertical: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: colors.textinputbordercolor,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: colors.textColor,
                                }}
                              >
                                {item.label}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                      )}

                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={{
                          marginTop: 20,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "red", fontWeight: "bold" }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>

                {/* State Modal */}
                <Modal
                  visible={stateModalVisible}
                  transparent
                  animationType="slide"
                >
                  <View
                    style={{
                      flex: 1,
                      paddingVertical: 30,
                      justifyContent: "center",
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: colors.modelBackground,
                        padding: 20,
                        marginHorizontal: 30,
                        borderRadius: 10,
                        height: "80%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: colors.textColor,
                        }}
                      >
                        Select a State
                      </Text>
                      <TextInput
                        placeholder="Search State"
                        value={searchQueryStates}
                        onChangeText={setSearchQueryStates}
                        style={{
                          borderWidth: 1,
                          borderColor: colors.textinputbordercolor,
                          backgroundColor: colors.textinputBackgroundcolor,
                          color: colors.textColor,
                          borderRadius: 8,
                          padding: 8,
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                        placeholderTextColor={colors.placeholderTextColor}
                      />
                      {stateLoading ? (
                        <ActivityIndicator
                          size="large"
                          color={colors.AppmainColor}
                          style={{ marginTop: 20 }}
                        />
                      ) : (
                        <FlatList
                          data={filteredStates}
                          //  data={stateList}
                          keyExtractor={(item) => item.id.toString()}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedState(item);
                                setStateModalVisible(false);
                              }}
                              style={{
                                paddingVertical: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: colors.textinputbordercolor,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: colors.textColor,
                                }}
                              >
                                {item.label}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                      )}

                      <TouchableOpacity
                        onPress={() => setStateModalVisible(false)}
                        style={{ marginTop: 20, alignItems: "center" }}
                      >
                        <Text style={{ color: "red", fontWeight: "bold" }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
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
                    // color: errorCity ? Colors.error : Colors.gray,
                  }}
                >
                  City<Text style={styles.red}>*</Text>
                </Text>

                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    borderColor: errorCity
                      ? Colors.error
                      : colors.textinputbordercolor,
                    color: colors.textColor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                  onChangeText={(value) => {
                    setCity(value);
                    setErrorCity(value.trim().length === 0);
                  }}
                  value={city}
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
                }}
              >
                <Text
                  style={{
                    ...globalStyles.JobfiledSectionText,
                    color: colors.textColor,
                    // color: errorPostalCode ? Colors.error : Colors.gray,
                  }}
                >
                  Postal code<Text style={styles.red}>*</Text>
                </Text>

                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    borderColor: errorPostalCode
                      ? Colors.error
                      : colors.textinputbordercolor,
                    color: colors.textColor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                  onChangeText={(value) => {
                    setPostalCode(value);
                    setErrorPostalCode(value.trim().length === 0);
                  }}
                  value={postalCode}
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
                }}
              >
                <Text
                  style={{
                    ...globalStyles.JobfiledSectionText,
                    color: colors.textColor,
                    // color: errorPNo ? Colors.error : Colors.gray,
                  }}
                >
                  Phone number
                </Text>

                <TextInput
                  maxLength={10}
                  style={{
                    ...globalStyles.textInput,
                    borderColor: colors.textinputbordercolor,
                    color: colors.textColor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    // borderColor: errorPNo ? Colors.error : Colors.gray,
                  }}
                  onChangeText={(value) => {
                    setPNo(value);
                    // setErrorPNo(value.trim().length === 0);
                  }}
                  value={pNo}
                  placeholder=""
                  keyboardType="number-pad"
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
                    ...globalStyles.JobfiledSectionText,
                    color: colors.textColor,
                    // color: errorEmail ? Colors.error : Colors.gray,
                  }}
                >
                  Email address<Text style={styles.red}>*</Text>
                </Text>

                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    borderColor: errorEmail
                      ? Colors.error
                      : colors.textinputbordercolor,
                    color: colors.textColor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                  onChangeText={(value) => {
                    setEMail(value);
                    const isValidEmail = validateEmail(value);
                    setErrorEmail(!isValidEmail);
                  }}
                  // onChangeText={value => {
                  //   setEMail(value);
                  //   setErrorEmail(value.trim().length === 0);
                  // }}
                  value={eMail}
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
                }}
              >
                <Text
                  style={{
                    ...globalStyles.JobfiledSectionText,
                    color: colors.textColor,
                    // color: errorCopmURL ? Colors.error : Colors.gray,
                  }}
                >
                  Company website
                </Text>

                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    borderColor: colors.textinputbordercolor,
                    color: colors.textColor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    //borderColor: errorCopmURL ? Colors.error : Colors.gray,
                  }}
                  onChangeText={(value) => {
                    setCompURL(value);
                    // setErrorCopmURL(value.trim().length === 0);
                  }}
                  value={compURL}
                  placeholder=""
                  keyboardType="default"
                  multiline
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>

              <View style={globalStyles.JobfiledSection}>
                <Text
                  style={{
                    ...globalStyles.JobfiledSectionText,
                    paddingHorizontal: 10,
                    color: colors.textColor,
                    // color: errorAboutComp ? Colors.error : Colors.gray,
                  }}
                >
                  About your company
                </Text>
                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    marginHorizontal: 10,
                    height: 80,
                    borderColor: colors.textinputbordercolor,
                    color: colors.textColor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    //borderColor: errorAboutComp ? Colors.error : Colors.gray,
                  }}
                  onChangeText={(value) => {
                    setAboutComp(value);
                    //  setErrorAboutComp(value.trim().length === 0);
                  }}
                  value={aboutComp}
                  placeholder="Max 500 Characters"
                  keyboardType="default"
                  multiline
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>
              <View>
                {/* Logo Upload Section */}
                <View
                  style={{
                    alignItems: "center",
                    backgroundColor: colors.textinputBackgroundcolor,
                    margin: 10,
                    padding: 20,
                    borderRadius: 10,
                  }}
                >
                  {!logoImage && (
                    <TouchableOpacity onPress={() => selectImage("logo")}>
                      <Icon
                        name="cloud-upload"
                        size={60}
                        color={colors.AppmainColor}
                        type="FontAwesome"
                      />
                    </TouchableOpacity>
                  )}
                  {!logoImage && (
                    <Text style={{ fontSize: 16, color: colors.AppmainColor }}>
                      Upload Company Logo
                    </Text>
                  )}

                  {logoImage && (
                    <>
                      <TouchableOpacity
                        onPress={() => setLogoImage(null)}
                        style={{ position: "absolute", top: 10, right: 10 }}
                      >
                        <Icon
                          name="close"
                          size={20}
                          color={colors.backIconColor}
                          type="AntDesign"
                          style={{ padding: 5 }}
                        />
                      </TouchableOpacity>

                      <Image
                        source={{ uri: logoImage }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                          marginTop: 10,
                        }}
                      />
                    </>
                  )}
                </View>

                {/* Banner Upload Section */}
                <View
                  style={{
                    alignItems: "center",
                    backgroundColor: colors.textinputBackgroundcolor,
                    margin: 10,
                    padding: 20,
                    borderRadius: 10,
                  }}
                >
                  {!bannerImage && (
                    <TouchableOpacity onPress={() => selectImage("banner")}>
                      <Icon
                        name="image-inverted"
                        size={60}
                        color={colors.AppmainColor}
                        type="Entypo"
                      />
                    </TouchableOpacity>
                  )}
                  {!bannerImage && (
                    <Text style={{ fontSize: 16, color: colors.AppmainColor }}>
                      Upload Company Banner
                    </Text>
                  )}

                  {bannerImage && (
                    <>
                      <TouchableOpacity
                        onPress={() => setBannerImage(null)}
                        style={{ position: "absolute", top: 10, right: 10 }}
                      >
                        <Icon
                          name="close"
                          size={20}
                          color={colors.backIconColor}
                          type="AntDesign"
                          style={{ padding: 5 }}
                        />
                      </TouchableOpacity>

                      <Image
                        source={{ uri: bannerImage }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 10,
                          marginTop: 10,
                        }}
                      />
                    </>
                  )}
                </View>
              </View>

              <View
                style={{
                  marginTop: 20,
                  marginHorizontal: 10,
                  borderLeftWidth: 4,
                  paddingLeft: 10,
                  borderColor: colors.AppmainColor,
                }}
              >
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
                  <Text
                    style={{
                      fontSize: 14,
                      flexShrink: 1,
                      color: colors.textColor,
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
                onPress={() => AddCompanyPost()}
              >
                <Text
                  style={{
                    ...globalStyles.saveButtonText,
                    color: colors.textColor,
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

export default AddCompany;
const styles = StyleSheet.create({
  red: {
    color: "red",
  },
});
