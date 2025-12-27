import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import Colors from "./color";
import CalIcon from "react-native-vector-icons/FontAwesome5";
import MonthPicker from "react-native-month-year-picker";
import CheckBox from "@react-native-community/checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "../screen/Icons/Icons";
import Header from "./Header/Header";
import globalStyles from "./GlobalCSS";
import {
  baseUrl,
  addExperience,
  editExperience,
  listoption,
} from "./baseURL/api";
import { showError } from "./components/Toast";
import { useTheme } from "../theme/ThemeContext";

const AddExperience = ({ navigation, route }) => {
  const { Item = {} } = route.params || {};
  const { isDark, colors, toggleTheme } = useTheme();
  const [number, onChangeNumber] = useState("");
  const [campany, setCampany] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [date1, setDate1] = useState(null);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [errorJob, setErrorJov] = useState(false);
  const [errorCampany, SetErrorCampany] = useState(false);
  const [errorIndustry, setErrorIndustry] = useState(false);
  const [errorLocation, SetErrorLocation] = useState(false);
  const [errorDescription, SetErrorDescription] = useState(false);
  const [flatlist, setFlatlist] = useState(false);
  const [industryValue, setIndustryValue] = useState("");
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [perPage] = useState(20);
  const [loading, setLoading] = useState(false);
  console.log("industryValue", industryValue);
  const [userData, setUserData] = useState(null);
  const formatMonthYear = (d) => {
    if (!d) return "";
    return `${d.toLocaleString("default", {
      month: "short",
    })} ${d.getFullYear()}`;
  };
  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem("userData");
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };
  useEffect(() => {
    UserValue();
    // getIndustryList();
  }, []);

  const onValueChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShow(false);
  };

  const onValueChange1 = (event, selectedDate) => {
    if (selectedDate) {
      setDate1(selectedDate);
    }
    setShow1(false);
  };
  const handleCheckboxChange = (newValue) => {
    setIsChecked(newValue);
  };
  const showPicker = () => {
    setShow(true);
  };
  const showPicker1 = () => {
    setShow1(true);
  };
  const [industryData, setIndustryData] = useState([]);
  // const getIndustryList = async () => {
  //   try {
  //     const response = await fetch(`${baseUrl}${listoption}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         optionType: "industry",
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setIndustryData(data?.DataList);
  //     } else {
  //       showError(data.message || "Failed to Industry List");
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //   }
  // };
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
  const handleSave = async () => {
    let isValid = true;

    // Validation checks
    if (number.trim().length === 0) {
      //showError('Enter job title');
      setErrorJov(true);
      isValid = false;
    } else {
      setErrorJov(false);
    }

    if (campany.trim().length === 0) {
      SetErrorCampany(true);
      // showError('Enter company name');
      isValid = false;
    } else {
      SetErrorCampany(false);
    }

    if (industryValue.trim().length === 0) {
      setErrorIndustry(true);
      //showError('Select industry');
      isValid = false;
    } else {
      setErrorIndustry(false);
    }

    if (location.trim().length === 0) {
      SetErrorLocation(true);
      // showError('Enter job location');
      isValid = false;
    } else {
      SetErrorLocation(false);
    }

    if (description.trim().length === 0) {
      SetErrorDescription(true);
      //  showError('Enter job description');
      isValid = false;
    } else {
      SetErrorDescription(false);
    }

    if (isValid) {
      console.log("All fields are valid");
      const fromYear = date
        ? date.getFullYear()
        : Item?.FromYear || new Date().getFullYear();
      const fromMonth = date
        ? date.getMonth() + 1
        : Item?.FromMonth || new Date().getMonth() + 1;

      const toYear = date1
        ? date1.getFullYear()
        : Item?.ToYear || new Date().getFullYear();
      const toMonth = date1
        ? date1.getMonth() + 1
        : Item?.ToMonth || new Date().getMonth() + 1;

      try {
        const payload = JSON.stringify({
          id: Item?.JobTitle ? Item?.Id : null,
          userId: userData?.User?.userId,
          jobTitle: number,
          companyName: campany,
          industry: industryValue,
          jobLocation: location,
          currentPosition: isChecked ? 1 : 0,
          positionDetail: description,
          fromMonth: fromMonth,
          fromYear: fromYear,
          toMonth: isChecked ? 0 : toMonth,
          toYear: isChecked ? 0 : toYear,
        });
        const response = await fetch(
          `${baseUrl}${Item?.JobTitle ? editExperience : addExperience}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: payload,
          }
        );
        const data = await response.json();
        if (response.ok) {
          console.log("Add data  ----", data);
          navigation.goBack();
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

  useEffect(() => {
    if (Item) {
      onChangeNumber(Item?.JobTitle);
      setCampany(Item?.CompanyName);
      setIndustry(Item?.IndustryName);
      setLocation(Item?.JobLocation);
      setIndustryValue(Item?.IndustryId);
      setDescription(Item?.PositionDetail);
    }
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setIndustryValue(item?.Name),
            setFlatlist(!flatlist),
            setErrorIndustry(false);
        }}
        style={{
          backgroundColor: colors.textinputBackgroundcolor,
          margin: 5,
          padding: 5,
        }}
      >
        <Text style={{ color: colors.textColor }}>{item.Name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <View style={globalStyles.SafeAreaView}>
        <Header
          title={Item?.JobTitle ? "Edit Experience" : "Add Experience"}
          navigation={navigation}
        />

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, paddingHorizontal: 12 }}>
            <View
              style={{
                paddingVertical: 15,
                borderBottomWidth: 0.2,
                borderColor: colors.textinputbordercolor,
              }}
            >
              <Text style={{ fontSize: 18, color: colors.textColor }}>
                Professional experience
              </Text>
            </View>

            <View style={globalStyles.JobfiledSection}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  color: errorJob ? Colors.error : colors.textColor,
                }}
              >
                Job Title
              </Text>

              <TextInput
                style={{
                  ...styles.textInput,
                  borderColor: errorJob
                    ? Colors.error
                    : colors.textinputbordercolor,
                  color: colors.textColor,
                  backgroundColor: colors.textinputBackgroundcolor,
                }}
                onChangeText={(value) => {
                  onChangeNumber(value);
                  setErrorJov(value.trim().length === 0);
                }}
                value={number}
                placeholder="Write your job title"
                keyboardType="default"
                multiline
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <View style={globalStyles.JobfiledSection}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  color: errorCampany ? Colors.error : colors.textColor,
                }}
              >
                Company Name
              </Text>
              <TextInput
                style={{
                  ...styles.textInput,
                  borderColor: errorCampany
                    ? Colors.error
                    : colors.textinputbordercolor,
                  color: colors.textColor,
                  backgroundColor: colors.textinputBackgroundcolor,
                }}
                onChangeText={(value) => {
                  setCampany(value);
                  SetErrorCampany(value.trim().length === 0);
                }}
                value={campany}
                placeholder="Write your campany name "
                keyboardType="default"
                multiline
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <View style={globalStyles.JobfiledSection}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  color: errorIndustry ? Colors.error : colors.textColor,
                }}
              >
                Industry
              </Text>
              <TouchableOpacity
                onPress={() => setShowIndustryModal(true)}
                style={{
                  ...globalStyles.seclectIndiaView,
                  borderColor: errorIndustry
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
                  {industryValue ? industryValue : "Industry"}
                </Text>
              </TouchableOpacity>
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
                  renderItem={renderItem}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                />
              ) : null} */}
            </View>

            <View style={globalStyles.JobfiledSection}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  color: errorLocation ? Colors.error : colors.textColor,
                }}
              >
                Location
              </Text>
              <TextInput
                style={{
                  ...styles.textInput,
                  borderColor: errorLocation
                    ? Colors.error
                    : colors.textinputbordercolor,
                  color: colors.textColor,
                  backgroundColor: colors.textinputBackgroundcolor,
                }}
                onChangeText={(value) => {
                  setLocation(value);
                  SetErrorLocation(value.trim().length === 0);
                }}
                value={location}
                placeholder="Write your location"
                keyboardType="default"
                multiline
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <CheckBox
                value={isChecked}
                onValueChange={(newValue) => handleCheckboxChange(newValue)}
                style={{
                  transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                }}
              />
              <Text style={{ color: colors.textColor }}>Current position</Text>
            </View>

            <View style={globalStyles.JobfiledSection}>
              <Text style={{ fontSize: 13, color: colors.textColor }}>
                Period
              </Text>
            </View>
            <View
              style={{
                paddingTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 13, color: colors.textColor }}>
                From
              </Text>

              {Item?.FromMonth ? (
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={showPicker}
                >
                  <Text style={{ ...styles.label, color: colors.textColor }}>
                    {Item?.FromMonth}/{Item?.FromYear}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={showPicker}
                >
                  <Text style={{ ...styles.label, color: colors.textColor }}>
                    {date ? formatMonthYear(date) : "Select Month & Year"}{" "}
                  </Text>
                  <CalIcon
                    name="calendar-alt"
                    size={20}
                    color={colors.placeholderTextColor}
                  />
                </TouchableOpacity>
              )}
            </View>

            {show && (
              <MonthPicker
                onChange={(event, selectedDate) => {
                  setShow(false);
                  if (selectedDate) setDate(selectedDate);
                }}
                value={date || new Date()}
                minimumDate={new Date(2000, 0)}
                maximumDate={new Date(2030, 11)}
                locale="en"
              />
            )}

            {isChecked === false && (
              <View
                style={{
                  paddingTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 13, color: colors.textColor }}>
                  To
                </Text>

                {Item?.ToMonth ? (
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={showPicker1}
                  >
                    <Text style={{ ...styles.label, color: colors.textColor }}>
                      {Item?.ToMonth}/{Item?.ToYear}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={showPicker1}
                  >
                    <Text style={{ ...styles.label, color: colors.textColor }}>
                      {date1 ? formatMonthYear(date1) : "Select Month & Year"}{" "}
                    </Text>
                    <CalIcon
                      name="calendar-alt"
                      size={20}
                      color={colors.placeholderTextColor}
                    />
                  </TouchableOpacity>
                )}

                {show1 && (
                  <MonthPicker
                    onChange={(event, selectedDate) => {
                      setShow1(false);
                      if (selectedDate) setDate1(selectedDate);
                    }}
                    value={date1 || new Date()}
                    minimumDate={new Date(2000, 0)}
                    maximumDate={new Date(2030, 11)}
                    locale="en"
                  />
                )}
              </View>
            )}
            <View style={globalStyles.JobfiledSection}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  color: errorDescription ? Colors.error : colors.textColor,
                }}
              >
                Description
              </Text>
              <TextInput
                style={{
                  ...styles.textInput,
                  height: 80,
                  textAlignVertical: "top",
                  borderColor: errorDescription
                    ? Colors.error
                    : colors.textinputbordercolor,
                  color: colors.textColor,
                  backgroundColor: colors.textinputBackgroundcolor,
                }}
                onChangeText={(value) => {
                  setDescription(value);
                  SetErrorDescription(value.trim().length === 0);
                }}
                value={description}
                placeholder="Write your Description"
                keyboardType="default"
                multiline
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <TouchableOpacity
              style={{
                ...globalStyles.saveButton,
                backgroundColor: colors.AppmainColor,
              }}
              onPress={() => handleSave()}
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
        </ScrollView>
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
                    setIndustryValue(item?.Name);
                    setShowIndustryModal(false);
                  }}
                >
                  <Text style={{ color: colors.textColor }}>{item?.Name}</Text>
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
const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    paddingRight: 10,
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
});

export default AddExperience;
