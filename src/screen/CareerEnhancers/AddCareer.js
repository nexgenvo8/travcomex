import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  AddCareereBusiness,
  baseUrl,
  CountryList,
  listoption,
  StateList,
  UpdateCareerbusiness,
} from "../baseURL/api";
import { showError, showSuccess } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";
import { universityFullName } from "../constants";

const AddCareer = ({ navigation, route }) => {
  const { Item = {}, AdditionalData = [], Career = {} } = route.params || {};
  const { isDark, colors, toggleTheme } = useTheme();
  const [number, onChangeNumber] = useState("");
  const [selectedValueComp, setSelectedValueComp] = useState("Select");
  const [selectedValue2, setSelectedValue2] = useState("Select");
  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedValue5, setSelectedValue5] = useState("");
  const [selectedValue6, setSelectedValue6] = useState("");
  const [isOpen5, setIsOpen5] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);
  const [perfID1, setPerfID1] = useState("");
  const [perfID2, setPerfID2] = useState("");
  const [description, setDescription] = useState("");
  const [yearBusiness, setYearBusiness] = useState("");
  const [userData, setUserData] = useState(null);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorCategory, setErrorCategory] = useState(false);
  const [errorCareerLevel, setErrorCareerLevel] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorCompany, setErrorCompany] = useState(false);
  const [establishedYear, setEstablishedYear] = useState("");
  const [errorCountry, setErrorCountry] = useState("");
  const [errorState, setErrorState] = useState("");
  const [errorYear, setErrorYear] = useState(false);
  const [errorImg, setErrorImg] = useState(false);
  const [city, setCity] = useState("");
  const [errorCity, setErrorCity] = useState(false);
  const [errorYearBusiness, setErrorYearBusiness] = useState(false);
  const [errorPostalCode, setErrorPostalCode] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [eMail, setEMail] = useState("");
  const [compURL, setCompURL] = useState("");
  const [aboutComp, setAboutComp] = useState("");
  const [webAddress, setWebAddress] = useState("");
  const [email, setEmail] = useState("");
  const [errorEmail1, setErrorEmail1] = useState(false);
  const [errorPNo, setErrorPNo] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorCopmURL, setErrorCopmURL] = useState(false);
  const [errorAboutComp, setErrorAboutComp] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorWebAddres, setErrorWebAddres] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [stateLoading, setStateLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [modalVisibleYear, setModalVisibleYear] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [checked, setChecked] = useState(false);
  const [checkedSecond, setCheckedSecond] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryStates, setSearchQueryStates] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [perPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const modalData = modalType === "industry" ? industryData : subIndustryData;
  // Industry
  const [industryData, setIndustryData] = useState([]);
  const [industryPage, setIndustryPage] = useState(1);
  const [industryHasMore, setIndustryHasMore] = useState(true);

  // Sub Industry
  const [subIndustryData, setSubIndustryData] = useState([]);
  const [subPage, setSubPage] = useState(1);
  const [subHasMore, setSubHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalType, setModalType] = useState("industry");

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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const isEdit = !!Career;
  const selectYear = (year) => {
    setSelectedYear(year);
    setYearBusiness(year);
    setModalVisibleYear(false);
  };

  useEffect(() => {
    UserValue();
  }, []);
  const UserValue = async () => {
    try {
      const userDta = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    } catch (error) {
      console.error("Fetch Error:", error);
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
    fetchStateList();
  }, []);
  useEffect(() => {
    fetchCountryList();
  }, []);
  useEffect(() => {
    if (Career && Career.CompanyBusinessName) {
      onChangeNumber(Career.CompanyBusinessName);
    }
    if (Career?.ShortDescription) {
      setEstablishedYear(Career.ShortDescription);
    }
    if (Career?.LongDescription) {
      setDescription(Career.LongDescription);
    }
    if (Career?.EmpnoId) {
      const matchedItem = optionsApply1.find(
        (item) => item.id === Career.EmpnoId
      );
      if (matchedItem) {
        setSelectedValue2(matchedItem);
      }
    }
    if (Career?.EstablishedYear) {
      setSelectedYear(Career.EstablishedYear);
    }
    if (Career?.CityName) {
      setCity(Career.CityName);
    }
    if (Career?.PostalCode) {
      setPostalCode(Career.PostalCode);
    }
    if (Career?.CompleteAddress) {
      setAboutComp(Career.CompleteAddress);
    }
    if (Career?.ContactPerson) {
      setEMail(Career.ContactPerson);
    }
    if (Career?.PhoneNumber) {
      setCompURL(Career.PhoneNumber);
    }
    if (Career?.EmailAaddress) {
      setEmail(Career.EmailAaddress);
    }
    if (Career?.BusinessWebsiteUrl) {
      setWebAddress(Career.BusinessWebsiteUrl);
    }
  }, [Career, optionsApply1, Career?.CountryId, countryList, stateList]);

  // const getIndustryList = async (Val) => {
  //   const Dta = {
  //     optionType: Val,
  //     subIndustryId: Val == "subindustry" ? perfID1 : "",
  //   };

  //   try {
  //     const response = await fetch(`${baseUrl}${listoption}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(Dta),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       if (Val == "subindustry") {
  //         setIndustryData(data);
  //       }
  //       setIndustryData(data?.DataList);
  //     } else {
  //       showError(data.message || "Failed to Industry List");
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error getIndustryList:", error);
  //   }
  // };
  const openSubCategoryModal = () => {
    setModalType("subindustry");
    setSubPage(1);
    setSubHasMore(true);
    setSubIndustryData([]);
    setShowIndustryModal(true);

    getIndustryList({
      type: "subindustry",
      pageNumber: 1,
      parentId: perfID1,
    });
  };

  const openIndustryModal = () => {
    setModalType("industry");
    setIndustryPage(1);
    setIndustryHasMore(true);
    setIndustryData([]);
    setShowIndustryModal(true);

    getIndustryList({ type: "industry", pageNumber: 1 });
  };

  useEffect(() => {
    if (showIndustryModal) {
      if (modalType === "industry") {
        setIndustryPage(1);
        setIndustryHasMore(true);
        getIndustryList({ type: "industry", pageNumber: 1 });
      } else if (perfID1) {
        //  console.log("Fetching subindustry with parentId:", perfID1);
        setSubPage(1);
        setSubHasMore(true);
        getIndustryList({
          type: "subindustry",
          pageNumber: 1,
          parentId: perfID1,
        });
      }
    }
  }, [showIndustryModal, modalType, perfID1]);

  const getIndustryList = async ({ type, pageNumber = 1, parentId = "" }) => {
    if (loading) return;

    setLoading(true);

    const payload = {
      optionType: type,
      per_page: perPage,
      page: pageNumber,
      subIndustryId: type === "subindustry" ? parentId : "",
    };

    try {
      const response = await fetch(`${baseUrl}${listoption}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const list = data?.DataList || [];

      if (response.ok) {
        if (type === "industry") {
          setIndustryData((prev) =>
            pageNumber === 1 ? list : [...prev, ...list]
          );
          setIndustryHasMore(list.length === perPage);
          setIndustryPage(pageNumber + 1);
        } else {
          setSubIndustryData((prev) =>
            pageNumber === 1 ? list : [...prev, ...list]
          );
          setSubHasMore(list.length === perPage);
          setSubPage(pageNumber + 1);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // const selectOption5 = (option) => {
  //   setPerfID1(option?.Id);
  //   setSelectedValue5(option?.Name);
  //   setIsOpen5(false);
  // };
  const selectOption5 = (item) => {
    setSelectedValue5(item.Name);
    setPerfID1(item.Id);
    setSelectedValue6("");
  };

  const selectOption6 = (item) => {
    setSelectedValue6(item.Name);
  };

  const toggleDropdown5 = () => {
    getIndustryList("industry");
    setIsOpen5(!isOpen5);
  };

  // const selectOption6 = (option) => {
  //   setPerfID2(option?.Id);
  //   setSelectedValue6(option?.Name);
  //   setIsSubDropdownOpen(false);
  // };
  const toggleDropdown6 = () => {
    getIndustryList("subindustry");
    setIsSubDropdownOpen(!isSubDropdownOpen);
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
      console.log("number");
      isValid = false;
    }

    if (selectedValue5 === "Select") {
      setErrorCategory(true);
      console.log("selectedValue5");
      isValid = false;
    }
    if (selectedValue2 === "Select") {
      setErrorCareerLevel(true);
      console.log("selectedValue2");
      isValid = false;
    }
    if (!establishedYear) {
      setErrorYear(true);
      console.log("establishedYear");
      isValid = false;
    }
    // if (!description) {
    //   setErrorDescription(true);
    //   console.log('description');
    //   isValid = false;
    // }

    if (selectedCountry === null || selectedCountry === undefined) {
      setErrorCountry(true);

      console.log("selectedCountry");
      isValid = false;
    }
    if (selectedState === null || selectedState === undefined) {
      setErrorState(true);
      console.log("selectedState");
      isValid = false;
    }
    if (!isValid) {
      setLoading(false);
      return;
    }

    const apiUrl = isEdit
      ? `${baseUrl}${AddCareereBusiness}`
      : `${baseUrl}${UpdateCareerbusiness}`;
    //const apiUrl = `${baseUrl}${AddCareereBusiness}`;
    console.log("API URL:", apiUrl);
    const dta = {
      ...(isEdit && { id: Career.id }),
      userId: userData?.User?.userId,
      companyBusinessName: number,
      companyTypeId: perfID1,
      subIndustryId: 5,
      establishedYear: selectedYear,
      countryId: selectedCountry?.id?.toString(),
      stateId: selectedState?.id?.toString(),
      cityName: city,
      postalCode: postalCode,
      phoneNumber: compURL,
      emailAaddress: email,
      businessWebsiteUrl: webAddress,
      shortDescription: establishedYear,
      longDescription: description,
      completeAddress: aboutComp,
      empnoId: selectedValue2?.id,
      viewStatus: 1,
      emailSent: 0,
      contactPerson: eMail,
      images: {
        imageName: "",
        imageData: "",
      },
      postType: 9,
    };
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dta),
      });
      const data = await response.json();
      // console.log(data, "datadatadatadatadatadatadatadatadata");

      if (response.ok) {
        navigation.goBack();
        showSuccess(data.message);
      } else {
        showError(data.message);
        console.log(data);
      }
    } catch (error) {
      console.error("Error AddCompanyPost:", error);
    } finally {
      setLoading(false);
    }
  };
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
        const formattedCountries = data.Data.map((item) => ({
          id: item.id,
          label: item.country_name,
          phonecode: item.phonecode,
          country_code: item.country_code,
        }));

        setCountryList(formattedCountries);

        if (Career?.CountryId) {
          const foundCountry = formattedCountries.find(
            (item) => item.id.toString() === Career.CountryId.toString()
          );
          if (foundCountry) {
            console.log("Found country", foundCountry);
            setSelectedCountry(foundCountry);
          } else {
            console.log("Country not found in list for ID", Career.CountryId);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchStateList = async (countryId) => {
    setStateLoading(true);
    try {
      const response = await fetch(`${baseUrl}${StateList}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: "", countryId: countryId }),
      });
      const data = await response.json();
      if (data?.Data) {
        const formattedStates = data.Data.map((item) => ({
          id: item.id, // state ID
          label: item.stateName,
        }));

        setStateList(formattedStates);
        if (Career?.StateId) {
          const foundState = formattedStates.find(
            (item) => item.id.toString() === Career.StateId.toString()
          );
          if (foundState) {
            console.log("Found state", foundState);
            setSelectedState(foundState);
          } else {
            console.log("State not found in list for ID", Career.StateId);
          }
        }

        return formattedStates;
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
      <Header title="Add Career Business" navigation={navigation} />
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
                Create Business Page
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
                }}
              >
                Name of your Company/Business{" "}
                <Text style={{ color: "red" }}>*</Text>
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
              <Text style={{ marginTop: 20, color: colors.textColor }}>
                Industry Category <Text style={{ color: "red" }}>*</Text>
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setModalType("industry");
                  setShowIndustryModal(true);
                }}
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
                  {selectedValue5 || "Select Industry"}
                </Text>
              </TouchableOpacity>

              {selectedValue5 && (
                <View style={{ marginTop: 20 }}>
                  <Text style={{ color: colors.textColor }}>Sub Category </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalType("subindustry");
                      setShowIndustryModal(true);
                    }}
                    style={{
                      ...globalStyles.seclectIndiaView,
                      borderColor: colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                      // borderColor: errorSubCategory ? Colors.error : Colors.gray,
                    }}
                  >
                    <Text
                      style={{
                        ...globalStyles.JobfiledSectionText,
                        color: colors.textColor,
                        paddingBottom: 0,
                      }}
                    >
                      {selectedValue6 || "Select Subcategory"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
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
                Short description about your business (maximum 100 words){" "}
                <Text style={{ color: "red" }}>*</Text>
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
                  setEstablishedYear(value);
                  setErrorYear(value.trim().length === 0);
                }}
                value={establishedYear}
                placeholder="We are the leading providers...."
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
                  // color: errorDescription ? Colors.error : Colors.gray,
                }}
              >
                Detailed Description (maximum 500 words)
              </Text>
              <TextInput
                style={{
                  ...globalStyles.textInput,
                  marginHorizontal: 10,
                  height: 80,
                  borderColor: colors.textinputbordercolor,
                  color: colors.textColor,
                  backgroundColor: colors.textinputBackgroundcolor,
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

            <View style={{ marginHorizontal: 10 }}>
              <Text
                style={{
                  marginTop: 20,
                  color: colors.textColor,
                  // color: errorCareerLevel ? Colors.error : Colors.gray,
                }}
              >
                Number of Employees <Text style={{ color: "red" }}>*</Text>
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
                Year your business was established{" "}
                <Text style={{ color: "red" }}>*</Text>
              </Text>
              <View
                style={{
                  ...styles.yearselectstyleBox,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.textinputBackgroundcolor,
                }}
              >
                <TouchableOpacity
                  style={styles.touchableYearBox}
                  onPress={() => setModalVisibleYear(true)}
                >
                  <Text
                    style={{ ...styles.selectedText, color: colors.textColor }}
                  >
                    {selectedYear || "select"}
                  </Text>
                </TouchableOpacity>

                <Modal visible={modalVisibleYear} animationType="slide">
                  <View
                    style={{
                      ...styles.modalContent,
                      backgroundColor: colors.modelBackground,
                    }}
                  >
                    <Text
                      style={{ ...styles.modalTitle, color: colors.textColor }}
                    >
                      Select a Year
                    </Text>
                    <FlatList
                      data={years}
                      keyExtractor={(item) => item.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => selectYear(item)}
                          style={{
                            ...styles.yearItem,
                            borderColor: colors.textinputbordercolor,
                          }}
                        >
                          <Text
                            style={{
                              ...styles.yearText,
                              color: colors.textColor,
                            }}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </Modal>
              </View>
            </View>

            <View style={{ marginHorizontal: 10, marginTop: 20 }}>
              {/* Select Country */}
              <Text style={{ color: colors.textColor }}>
                Country <Text style={{ color: "red" }}>*</Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  //  fetchCountryList();
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
                    color: errorCountry ? Colors.error : colors.textColor,
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
                }}
              >
                State <Text style={{ color: "red" }}>*</Text>
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
                    color: errorState ? Colors.error : colors.textColor,
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
                        backgroundColor: colors.textinputBackgroundcolor,
                        borderColor: colors.textinputbordercolor,
                        color: colors.textColor,
                        borderRadius: 8,
                        padding: 8,
                        marginTop: 10,
                        marginBottom: 10,
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
                              style={{ fontSize: 16, color: colors.textColor }}
                            >
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    )}

                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={{ marginTop: 20, alignItems: "center" }}
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
                        // data={stateList}
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
                              style={{ fontSize: 16, color: colors.textColor }}
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
                }}
              >
                City
              </Text>

              <TextInput
                style={{
                  ...globalStyles.textInput,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.textinputBackgroundcolor,
                  color: colors.textColor,
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
                }}
              >
                Postal code
              </Text>

              <TextInput
                style={{
                  ...globalStyles.textInput,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.textinputBackgroundcolor,
                  color: colors.textColor,
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

            <View style={globalStyles.JobfiledSection}>
              <Text
                style={{
                  ...globalStyles.JobfiledSectionText,
                  paddingHorizontal: 10,
                  color: colors.textColor,
                }}
              >
                Complete Address
              </Text>
              <TextInput
                style={{
                  ...globalStyles.textInput,
                  marginHorizontal: 10,
                  height: 80,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.textinputBackgroundcolor,
                  color: colors.textColor,
                }}
                onChangeText={(value) => {
                  setAboutComp(value);
                  setErrorAboutComp(value.trim().length === 0);
                }}
                value={aboutComp}
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
                }}
              >
                Contact person's name
              </Text>

              <TextInput
                style={{
                  ...globalStyles.textInput,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.textinputBackgroundcolor,
                  color: colors.textColor,
                }}
                onChangeText={(value) => {
                  setEMail(value);
                  setErrorEmail(value.trim().length === 0);
                }}
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
                }}
              >
                Phone/Number
              </Text>

              <TextInput
                maxLength={10}
                style={{
                  ...globalStyles.textInput,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.textinputBackgroundcolor,
                  color: colors.textColor,
                }}
                onChangeText={(value) => {
                  setCompURL(value);
                  setErrorCopmURL(value.trim().length === 0);
                }}
                value={compURL}
                placeholder=""
                keyboardType="numeric"
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
                }}
              >
                Email address
              </Text>
              <TextInput
                style={{
                  ...globalStyles.textInput,
                  marginHorizontal: 10,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.textinputBackgroundcolor,
                  color: colors.textColor,
                }}
                onChangeText={(value) => {
                  setEmail(value);
                  setErrorEmail1(value.trim().length === 0);
                }}
                value={email}
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
                }}
              >
                Website address of your Business
              </Text>
              <TextInput
                style={{
                  ...globalStyles.textInput,
                  marginHorizontal: 10,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.textinputBackgroundcolor,
                  color: colors.textColor,
                }}
                onChangeText={(value) => {
                  setWebAddress(value);
                  setErrorWebAddres(value.trim().length === 0);
                }}
                value={webAddress}
                placeholder=""
                keyboardType="default"
                multiline
                placeholderTextColor={colors.placeholderTextColor}
              />
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
                  I agree to receive business enquiry from {universityFullName}.
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => setCheckedSecond(!checkedSecond)}
                >
                  <MaterialCommunityIcons
                    name={
                      checkedSecond
                        ? "checkbox-marked"
                        : "checkbox-blank-outline"
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
                  I confirm that I am authorized to create this business page
                  and the information given is correct.
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
              data={modalType === "industry" ? industryData : subIndustryData}
              keyExtractor={(item) => item.Id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={globalStyles.dropdownItem}
                  onPress={() => {
                    modalType === "industry"
                      ? selectOption5(item)
                      : selectOption6(item);

                    setShowIndustryModal(false);
                  }}
                >
                  <Text style={{ color: colors.textColor }}>{item.Name}</Text>
                </TouchableOpacity>
              )}
              onEndReached={() => {
                if (modalType === "industry" && industryHasMore) {
                  getIndustryList({
                    type: "industry",
                    pageNumber: industryPage,
                  });
                }

                if (modalType === "subindustry" && subHasMore) {
                  getIndustryList({
                    type: "subindustry",
                    pageNumber: subPage,
                    parentId: perfID1,
                  });
                }
              }}
              onEndReachedThreshold={0.1}
              contentContainerStyle={{ flexGrow: 1 }}
              ListFooterComponent={() => {
                const isIndustry = modalType === "industry";
                const data = isIndustry ? industryData : subIndustryData;
                const hasMore = isIndustry ? industryHasMore : subHasMore;

                if (loading) {
                  return (
                    <ActivityIndicator size="small" style={{ margin: 10 }} />
                  );
                }

                if (!hasMore && data.length > 0) {
                  return (
                    <Text
                      style={{
                        textAlign: "center",
                        padding: 10,
                        color: colors.textColor,
                      }}
                    >
                      No more data
                    </Text>
                  );
                }

                return null;
              }}
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
                if (modalType === "industry") {
                  setIndustryPage(1);
                  setIndustryHasMore(true);
                  getIndustryList({ type: "industry", pageNumber: 1 });
                } else {
                  setSubPage(1);
                  setSubHasMore(true);
                  getIndustryList({
                    type: "subindustry",
                    pageNumber: 1,
                    parentId: perfID1,
                  });
                }
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
  container: {
    padding: 20,
  },
  yearButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    //backgroundColor: '#f0f0f0',
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  selectedText: {
    // fontSize: 18,
    // color: '#000',
  },
  modalContent: {
    flex: 1,
    paddingTop: 30,
    // backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  yearItem: {
    padding: 16,
    borderBottomWidth: 1,
    //  borderColor: '#ccc',
  },
  yearText: {
    fontSize: 18,
    textAlign: "center",
  },
  yearselectstyleBox: {
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    height: 40,
    // borderColor: 'gray',
    borderRadius: 5,
    width: "100%",
  },
  touchableYearBox: {
    flex: 1,
    justifyContent: "center",
    //alignItems: 'center',
    width: "100%",
    height: "100%",
  },
});

export default AddCareer;
