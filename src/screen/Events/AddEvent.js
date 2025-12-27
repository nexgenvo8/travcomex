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
import PlaneIcon from "react-native-vector-icons/AntDesign";
import {
  AddCompanyApi,
  AddEvents,
  addjob,
  baseUrl,
  CountryList,
  UpdateCompany,
  UpdateEvents,
  updatejob,
} from "../baseURL/api";
import ImagePicker from "react-native-image-crop-picker";
import DatePicker from "react-native-date-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { showError, showSuccess } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { universityFullName } from "../constants";

const AddEvent = ({ navigation, route }) => {
  const { Item = {} } = route.params || {};
  // console.log("ItemItemItemItemItemItemItem", Item);
  const { isDark, colors, toggleTheme } = useTheme();
  const [number, onChangeNumber] = useState("");
  const [selectedValue5, setSelectedValue5] = useState("Select");
  const [selectedValueComp, setSelectedValueComp] = useState("Select");
  const [selectedValue2, setSelectedValue2] = useState("Select");
  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedValue3, setSelectedValue3] = useState("Select");
  const [isOpen3, setIsOpen3] = useState(false);
  const [perfID1, setPerfID1] = useState("");
  const [description, setDescription] = useState("");
  const [userData, setUserData] = useState(null);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorCategory, setErrorCategory] = useState(false);
  const [errorCareerLevel, setErrorCareerLevel] = useState(false);
  const [errorCareerLevel1, setErrorCareerLevel1] = useState(false);
  // const [errorDescription, setErrorDescription] = useState(false);
  const [errorCompany, setErrorCompany] = useState(false);
  const [tag, setTag] = useState("");
  const [errorCountry, setErrorCountry] = useState("");
  const [errorState, setErrorState] = useState("");
  const [errorTag, setErrorTag] = useState(false);
  const [errorImg, setErrorImg] = useState(false);
  const [city, setCity] = useState("");
  // const [errorCity, setErrorCity] = useState(false);
  const [errorPostalCode, setErrorPostalCode] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [pNo, setPNo] = useState("");
  const [eMail, setEMail] = useState("");
  const [compURL, setCompURL] = useState("");
  const [aboutComp, setAboutComp] = useState("");
  const [errorCopmURL, setErrorCopmURL] = useState(false);
  const [errorAboutComp, setErrorAboutComp] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [stateLoading, setStateLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [logoImage, setLogoImage] = useState([]);
  const [imagesName, setImagesName] = useState([]);
  const [bannerImage, setBannerImage] = useState(null);
  const [base64Logo, setBase64Logo] = useState(null);
  const [base64Banner, setBase64Banner] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [imagesNamebase64, setImagesNameBase64] = useState([]);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [checked, setChecked] = useState(false);
  const [date1, setDate1] = useState(null);
  const [time1, setTime1] = useState(null);
  const [openDate1, setOpenDate1] = useState(false);
  const [openTime1, setOpenTime1] = useState(false);
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
  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    // "15-Jun-2025"
    const [day, monthStr, year] = dateStr.split("-");

    const monthMap = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const month = monthMap[monthStr];

    if (month === undefined) return null;

    return new Date(Number(year), month, Number(day), 0, 0, 0);
  };

  const parseTime = (timeStr, baseDate = new Date()) => {
    if (!timeStr || !baseDate) return null;

    const [time, modifier] = timeStr.split(" ");
    if (!time || !modifier) return null;

    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);

    return date;
  };

  // useEffect(() => {
  //   if (Item) {
  //     onChangeNumber(Item?.eventName);
  //     setSelectedValue2(Item?.eventType);
  //     setDescription(Item?.eventVenue);
  //     setSelectedCountry(Item?.eventCountry);
  //     setSelectedValue3(Item?.eventDuration);
  //     setCity(Item?.eventBrief);
  //     setPostalCode(Item?.eventDetails);
  //     setPNo(Item?.eventAgenda);
  //     setEMail(Item?.websiteurl);
  //     const startDate = parseDate(Item?.eventDate);
  //     const endDate = parseDate(Item?.eventTillDate);

  //     if (startDate) setDate(startDate);
  //     if (endDate) setDate1(endDate);

  //     const startTime = parseTime(Item?.starttime, startDate);
  //     const endTime = parseTime(Item?.endtime, endDate);

  //     if (startTime) setTime(startTime);
  //     if (endTime) setTime1(endTime);
  //   }
  // }, [Item]);
  useEffect(() => {
    if (!Item?.id) return; // 👈 stop for Add mode
    if (Item.Images && Item.Images.length > 0) {
      const imageUrls = Item.Images.map((img) => img.imageName);
      setLogoImage(imageUrls);
    }
    onChangeNumber(Item.eventName || "");
    setSelectedValue2(Item.eventType || "Select");
    setDescription(Item.eventVenue || "");
    setSelectedCountry(Item.eventCountry || null);
    setSelectedValue3(Item.eventDuration || "Select");
    setCity(Item.eventBrief || "");
    setPostalCode(Item.eventDetails || "");
    setPNo(Item.eventAgenda || "");
    setEMail(Item.websiteurl || "");

    const startDate = parseDate(Item.eventDate);
    const endDate = parseDate(Item.eventTillDate);

    if (startDate) setDate(startDate);
    if (endDate) setDate1(endDate);

    const startTime = parseTime(Item.starttime, startDate);
    const endTime = parseTime(Item.endtime, endDate);

    if (startTime) setTime(startTime);
    if (endTime) setTime1(endTime);
  }, [Item?.id]);

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
    // if (selectedValue5 !== 'Select' && selectedValue5) {
    //   setErrorCategory(false);
    // }
    if (selectedValue2 !== "Select" && selectedValue2) {
      setErrorCareerLevel(false);
    }
    if (selectedValue3 !== "Select" && selectedValue3) {
      setErrorCareerLevel1(false);
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
    if (date !== null && date) {
      setErrorDate(false);
    }
    if (time !== null && date) {
      setErrorTime(false);
    }
    if (time1 !== null && time) {
      setErrorTime1(false);
    }
    if (date1 !== null && date1) {
      setErrorDate1(false);
    }
  }, [
    // selectedValue5,
    selectedValue2,
    selectedValue3,
    selectedCountry,
    selectedState,
    image,
    date,
    time,
    date1,
    time1,
  ]);

  const selectOption2 = (option) => {
    setSelectedValue2(option);
    setIsOpen2(false);
  };
  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2);
  };
  const optionsApply1 = [
    { id: 1, label: "Ticketed" },
    { id: 2, label: "Open" },
    { id: 3, label: "By Invite" },
  ];
  const optionsApply3 = [
    { id: 1, label: "Full Day Event" },
    { id: 2, label: "Half Day Event" },
    { id: 3, label: "Other" },
  ];
  const selectOption3 = (option) => {
    setSelectedValue3(option);
    setIsOpen3(false);
  };
  const toggleDropdown3 = () => {
    setIsOpen3(!isOpen3);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // Convert Time to "hh:mm A"
  const formatTime = (time) => {
    if (!time) return "";
    const d = new Date(time);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )} ${ampm}`;
  };
  const [errorDate, setErrorDate] = useState(false);
  const [errorTime, setErrorTime] = useState(false);
  const [errorDate1, setErrorDate1] = useState(false);
  const [errorTime1, setErrorTime1] = useState(false);
  const validateForm = () => {
    let isValid = true;

    if (!number) {
      setErrorTitle(true);
      isValid = false;
    }
    if (!selectedValue2) {
      setErrorCareerLevel(true);
      isValid = false;
    }
    if (!selectedValue3) {
      setErrorCareerLevel1(true);
      isValid = false;
    }
    if (!date) {
      setErrorDate(true);
      isValid = false;
    }
    if (!time) {
      setErrorTime(true);
      isValid = false;
    }
    if (!date1) {
      setErrorDate1(true);
      isValid = false;
    }
    if (!time1) {
      setErrorTime1(true);
      isValid = false;
    }
    if (!selectedCountry) {
      setErrorCountry(true);
      isValid = false;
    }
    if (!postalCode) {
      setErrorPostalCode(true);
      isValid = false;
    }

    return isValid;
  };

  const handleCheckboxToggle = () => {
    const isValid = validateForm();

    if (isValid) {
      setChecked(!checked);
    } else {
      console.log("Validation failed. Checkbox not toggled.");
    }
  };

  const AddCompanyPost = async () => {
    const formattedEventDate = formatDate(date);
    const formattedEventTillDate = formatDate(date1);
    const formattedStartTime = formatTime(time);
    const formattedEndTime = formatTime(time1);
    const isValid = validateForm();
    // let isValid = true;
    // if (!number) {
    //   setErrorTitle(true);
    //   isValid = false;
    // }
    // if (selectedValue2 === 'Select') {
    //   setErrorCareerLevel(true);
    //   isValid = false;
    // }
    // if (selectedValue3 === 'Select') {
    //   setErrorCareerLevel1(true);
    //   isValid = false;
    // }
    // if (!date) {
    //   setErrorDate(true);
    //   isValid = false;
    // }
    // if (!time) {
    //   setErrorTime(true);
    //   isValid = false;
    // }
    // if (!date1) {
    //   setErrorDate1(true);
    //   isValid = false;
    // }
    // if (!time1) {
    //   setErrorTime1(true);
    //   isValid = false;
    // }
    // if (!selectedCountry) {
    //   setErrorCountry(true);
    //   isValid = false;
    // }
    // if (!postalCode) {
    //   setErrorPostalCode(true);
    //   isValid = false;
    // }

    // if (!description) {
    //   setErrorDescription(true);
    //   isValid = false;
    // }

    // if (!city) {
    //   setErrorCity(true);
    //   isValid = false;
    // }

    // if (!pNo) {
    //   setErrorPNo(true);
    //   isValid = false;
    // }
    // if (!eMail) {
    //   setErrorEmail(true);
    //   isValid = false;
    // }
    // if (!logoImage) {
    //   setErrorImg(true);
    //   isValid = false;
    // }

    if (!isValid) {
      setLoading(false);
      return;
    }
    const imagesArray = imagesName.map((name, index) => ({
      imageName: name?.toString(),
      imageData: base64Logo[index]?.toString(),
    }));

    // console.log('formattedStartTime:', formattedStartTime);

    // Logging values for debugging
    console.log("API Payload:", {
      id: Item?.id || null,
      userId: userData?.User?.userId || "",
      eventType: selectedValue2?.label
        ? selectedValue2?.label
        : selectedValue2 || "",
      eventName: number || "",
      eventDate: formattedEventDate, // ✅ Formatted
      eventTillDate: formattedEventTillDate, // ✅ Formatted
      starttime: formattedStartTime, // ✅ Formatted
      endtime: formattedEndTime, // ✅ Formatted
      eventVenue: description || "",
      eventCountry: selectedCountry?.label
        ? selectedCountry?.label
        : selectedCountry || "",
      eventBrief: city || "",
      eventDuration: selectedValue3?.label
        ? selectedValue3?.label
        : selectedValue3 || "",
      eventDetails: postalCode || "",
      eventAgenda: pNo || "",
      websiteurl: eMail || "",
      otherDetails: "Limited seats available, register now!",
      eventThumb: "",
      eventBanner: "",
      eventImages: imagesArray || [],
    });

    const apiUrl = `${baseUrl}${Item?.id ? UpdateEvents : AddEvents}`;
    console.log("API URL:", apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Item?.id || null,
          userId: userData?.User?.userId || "",
          eventType: selectedValue2?.label
            ? selectedValue2?.label
            : selectedValue2 || "",
          eventName: number || "",
          eventDate: formattedEventDate, // ✅ Formatted
          eventTillDate: formattedEventTillDate, // ✅ Formatted
          starttime: formattedStartTime, // ✅ Formatted
          endtime: formattedEndTime, // ✅ Formatted
          eventVenue: description || "",
          eventCountry: selectedCountry?.label
            ? selectedCountry?.label
            : selectedCountry || "",
          eventBrief: city || "",
          eventDuration: selectedValue3?.label
            ? selectedValue3?.label
            : selectedValue3 || "",
          eventDetails: postalCode || "",
          eventAgenda: pNo || "",
          websiteurl: eMail || "",
          otherDetails: "Limited seats available, register now!",
          eventThumb: "",
          eventBanner: "",
          eventImages: imagesArray ? imagesArray : [],
        }),
      });

      const contentType = response.headers.get("content-type");
      const responseText = await response.text();

      console.log("Raw response:", responseText);

      if (contentType && contentType.includes("application/json")) {
        const data = JSON.parse(responseText);
        // const data = await response.json();
        if (response.ok) {
          console.log("Add data:", data);
          navigation.goBack();
          showSuccess(data?.Message);
        } else {
          showError(data?.message || "Failed to add event");
        }
      }
    } catch (error) {
      console.error("Fetch Error:", error.message);
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
  // const selectImage = async type => {
  //   try {
  //     const pickedImages = await ImagePicker.openPicker({
  //       multiple: true, // Enable multiple image selection
  //       width: 300,
  //       height: 300,
  //       cropping: true,
  //       includeBase64: true,
  //     });

  // if (type === 'logo') {
  //   setLogoImage(pickedImages.map(img => img.path)); // Store image paths in an array
  //   setBase64Logo(pickedImages.map(img => img.data));
  // } else {
  //   setBannerImage(pickedImages.map(img => img.path));
  //   setBase64Banner(pickedImages.map(img => img.data));
  // }
  //   } catch (error) {
  //     console.error('Error picking images:', error);
  //   }
  // };

  const selectImage = () => {
    ImagePicker.openPicker({
      multiple: true, // Allow multiple image selection
      mediaType: "photo",
      compressImageQuality: 0.8,
      includeBase64: true, // Include Base64 if needed
    })
      .then((selectedImages) => {
        // Initialize arrays to store image details
        const imagePaths = [];
        const imageNames = [];
        const base64Images = [];

        // Iterate over the selected images
        selectedImages.forEach((image) => {
          const imagePath = image.path;
          const imageName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
          const base64Image = image.data;

          // Push details into respective arrays
          imagePaths.push(imagePath);
          imageNames.push(imageName);
          base64Images.push(base64Image);
        });

        setLogoImage(imagePaths); // Store all image paths
        setImagesName(imageNames); // Store all image names
        setBase64Logo(base64Images); // Store all Base64 strings
      })
      .catch((error) => {
        console.error("Image selection cancelled:", error);
      });
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header title="Add Event" navigation={navigation} />
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
                  Post New Event
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
                  Event Name <Text style={{ color: "red" }}>*</Text>
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
                    // color: errorDate ? Colors.error : Colors.gray,
                  }}
                >
                  Event start date/time <Text style={{ color: "red" }}>*</Text>
                </Text>
              </View>

              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {/* Date Picker */}
                <TouchableOpacity
                  onPress={() => setOpenDate(true)}
                  style={{
                    padding: 10,
                    backgroundColor: colors.textinputBackgroundcolor,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: errorDate ? Colors.error : colors.textColor,
                    }}
                  >
                    📅{" "}
                    {date
                      ? date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Select Date"}
                  </Text>
                </TouchableOpacity>

                <DatePicker
                  modal
                  open={openDate}
                  date={date || new Date()}
                  mode="date"
                  onConfirm={(selectedDate) => {
                    setOpenDate(false);
                    setDate(selectedDate);
                  }}
                  onCancel={() => setOpenDate(false)}
                />

                {/* Time Picker */}
                <TouchableOpacity
                  onPress={() => setOpenTime(true)}
                  style={{
                    padding: 10,
                    backgroundColor: colors.textinputBackgroundcolor,
                    borderRadius: 5,
                    //   marginTop: 10,
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: errorTime ? Colors.error : colors.textColor,
                    }}
                  >
                    ⏰{" "}
                    {time
                      ? time?.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Select Time"}
                  </Text>
                </TouchableOpacity>

                <DatePicker
                  modal
                  open={openTime}
                  date={time || new Date()} // Use new Date() if null
                  mode="time"
                  // onConfirm={selectedTime => {
                  //   setOpenTime(false);
                  //   setTime(
                  //     new Date(
                  //       0,
                  //       0,
                  //       0,
                  //       selectedTime.getHours(),
                  //       selectedTime.getMinutes(),
                  //     ),
                  //   );
                  // }}
                  onConfirm={(selectedTime) => {
                    setOpenTime(false);
                    setTime(selectedTime);
                  }}
                  onCancel={() => setOpenTime(false)}
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
                    color: errorTag ? Colors.error : colors.textColor,
                  }}
                >
                  Event End date/time <Text style={{ color: "red" }}>*</Text>
                </Text>
                {/* {errorDate ? <Text style={{color:'red'}}>{errorDate1}</Text> : null}
              {errorDate ? <Text style={{color:'red',paddingVertical:5}}>{errorTime1}</Text> : null} */}
              </View>

              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {/* Date Picker */}
                <TouchableOpacity
                  onPress={() => setOpenDate1(true)}
                  style={{
                    padding: 10,
                    backgroundColor: colors.textinputBackgroundcolor,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: errorDate1 ? Colors.error : colors.textColor,
                    }}
                  >
                    📅{" "}
                    {date1
                      ? date1.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Select Date"}
                  </Text>
                </TouchableOpacity>

                <DatePicker
                  modal
                  open={openDate1}
                  date={date1 || new Date()} // Use new Date() if null
                  mode="date"
                  onConfirm={(selectedDate) => {
                    setOpenDate1(false);
                    setDate1(selectedDate);
                  }}
                  onCancel={() => setOpenDate1(false)}
                />

                {/* Time Picker */}
                <TouchableOpacity
                  onPress={() => setOpenTime1(true)}
                  style={{
                    padding: 10,
                    backgroundColor: colors.textinputBackgroundcolor,
                    borderRadius: 5,
                    //   marginTop: 10,
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: errorTime1 ? Colors.error : colors.textColor,
                    }}
                  >
                    ⏰{" "}
                    {time1
                      ? time1.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Select Time"}
                  </Text>
                </TouchableOpacity>

                <DatePicker
                  modal
                  open={openTime1}
                  date={time1 || new Date()} // Use new Date() if null
                  mode="time"
                  onConfirm={(selectedTime) => {
                    setOpenTime1(false);
                    setTime1(selectedTime);
                  }}
                  onCancel={() => setOpenTime1(false)}
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
                  Event Type <Text style={{ color: "red" }}>*</Text>
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
                    {selectedValue2?.label
                      ? selectedValue2?.label
                      : selectedValue2 || "Select Event Type"}
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
                  Event venue
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
                    // setErrorDescription(value.trim().length === 0);
                  }}
                  value={description}
                  placeholder="Write your Address"
                  keyboardType="default"
                  multiline
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>

              <View style={{ marginHorizontal: 10, marginTop: 20 }}>
                <Text style={{ color: colors.textColor }}>
                  Country <Text style={{ color: "red" }}>*</Text>
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
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.textinputBackgroundcolor,
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
                          borderRadius: 8,
                          padding: 8,
                          marginTop: 10,
                          marginBottom: 10,
                          borderColor: colors.textinputbordercolor,
                          backgroundColor: colors.textinputBackgroundcolor,
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
                        <View style={{ flex: 1 }}>
                          <FlatList
                            data={filteredCountries}
                            //data={countryList}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                onPress={() => {
                                  setSelectedCountry(item);
                                  setSelectedState(null); // Reset state when country changes
                                  setModalVisible(false);
                                }}
                                style={{
                                  paddingVertical: 10,
                                  borderBottomWidth: 1,
                                  borderBottomColor:
                                    colors.textinputbordercolor,
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
                        </View>
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
              </View>

              <View style={{ marginHorizontal: 10 }}>
                <Text
                  style={{
                    marginTop: 20,
                    color: colors.textColor,
                    // color: errorCareerLevel1 ? Colors.error : Colors.gray,
                  }}
                >
                  Duration of the event <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={toggleDropdown3}
                  style={{
                    ...globalStyles.seclectIndiaView,
                    borderColor: errorCareerLevel1
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
                    {selectedValue3?.label
                      ? selectedValue3?.label
                      : selectedValue3 || "Select Event Duration"}
                  </Text>
                </TouchableOpacity>
                {isOpen3 && (
                  <View
                    style={{
                      ...globalStyles.dropdownList,
                      backgroundColor: colors.textinputBackgroundcolor,
                      borderColor: colors.textinputbordercolor,
                    }}
                  >
                    {optionsApply3.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={{
                          ...globalStyles.dropdownItem,
                          borderColor: colors.textinputbordercolor,
                        }}
                        onPress={() => selectOption3(item)}
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
                    // color: errorCity ? Colors.error : Colors.gray,
                  }}
                >
                  Brief profile of the event
                </Text>

                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    height: 80,
                    backgroundColor: colors.textinputBackgroundcolor,
                    borderColor: colors.textinputbordercolor,
                    color: colors.textColor,
                    //borderColor: errorCity ? Colors.error : Colors.gray,
                  }}
                  onChangeText={(value) => {
                    setCity(value);
                    // setErrorCity(value.trim().length === 0);
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
                  Details about the event{" "}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>

                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    height: 80,
                    borderColor: errorPostalCode
                      ? Colors.error
                      : colors.textinputbordercolor,
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
                  Agenda of the event
                </Text>

                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    height: 80,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    color: colors.textColor,
                    // borderColor: errorPNo ? Colors.error : Colors.gray,
                  }}
                  onChangeText={(value) => {
                    setPNo(value);
                    // setErrorPNo(value.trim().length === 0);
                  }}
                  value={pNo}
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
                    // color: errorEmail ? Colors.error : Colors.gray,
                  }}
                >
                  Event website url
                </Text>

                <TextInput
                  style={{
                    ...globalStyles.textInput,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    color: colors.textColor,
                    // borderColor: errorEmail ? Colors.error : Colors.gray,
                  }}
                  onChangeText={(value) => {
                    setEMail(value);
                    //setErrorEmail(value.trim().length === 0);
                  }}
                  value={eMail}
                  placeholder=""
                  keyboardType="default"
                  multiline
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>

              <View>
                <Text
                  style={{
                    padding: 10,
                    ...globalStyles.JobfiledSectionText,
                    color: colors.textColor,
                  }}
                >
                  Photographs from the past events
                </Text>
                <View
                  style={{
                    alignItems: "center",
                    backgroundColor: colors.textinputBackgroundcolor,
                    margin: 10,
                    padding: 20,
                    borderRadius: 10,
                    borderWidth: errorImg ? 1 : 0,
                    borderColor: errorImg ? "red" : "",
                  }}
                >
                  {/* {!logoImage && (
                  <TouchableOpacity onPress={() => selectImage('logo')}>
                    <Icon
                      name="cloud-upload"
                      size={60}
                      color={Colors.main_primary}
                      type="FontAwesome"
                    />
                  </TouchableOpacity>
                )}
                {!logoImage && (
                  <Text style={{fontSize: 16, color: Colors.main_primary}}>
                    Upload Images
                  </Text>
                )} */}
                  {logoImage?.length === 0 && (
                    <>
                      <TouchableOpacity onPress={() => selectImage("logo")}>
                        <Icon
                          name="cloud-upload"
                          size={60}
                          color={colors.AppmainColor}
                          type="FontAwesome"
                        />
                      </TouchableOpacity>
                      <Text
                        style={{ fontSize: 16, color: colors.AppmainColor }}
                      >
                        Upload Images
                      </Text>
                    </>
                  )}
                  {/* Show Selected Images */}
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      marginTop: 10,
                    }}
                  >
                    {logoImage?.map((image, index) => (
                      <View
                        key={index}
                        style={{ position: "relative", margin: 5 }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            const updatedImages = logoImage?.filter(
                              (_, i) => i !== index
                            );
                            setLogoImage(updatedImages);
                          }}
                          style={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            zIndex: 1,
                          }}
                        >
                          <Icon
                            name="close"
                            size={20}
                            color={colors.backIconColor}
                            type="AntDesign"
                          />
                        </TouchableOpacity>
                        <Image
                          source={{ uri: image }}
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 10,
                          }}
                        />
                      </View>
                    ))}
                  </View>
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
                    I confirm that I am authorized to Post this event on{" "}
                    {universityFullName} and if any image is used, I have the
                    rights to use the image.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={{
                  ...globalStyles.saveButton,
                  margin: 20,
                  opacity: checked ? 1 : 0.5,
                  backgroundColor: colors.AppmainColor,
                }}
                disabled={!checked || loading}
                onPress={() => AddCompanyPost()}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={{
                      ...globalStyles.saveButtonText,
                      color: colors.ButtonTextColor,
                    }}
                  >
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default AddEvent;
