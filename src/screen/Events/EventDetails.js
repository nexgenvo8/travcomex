import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import globalStyles from "../GlobalCSS";
import Header from "../Header/Header";
import Colors from "../color";
import Icon from "../Icons/Icons";
import {
  AreYouGoingInEvent,
  baseUrl,
  DeleteEvents,
  UpdateCareerbusiness,
  DeleteCareerBusiness,
} from "../baseURL/api";
import ImagePicker from "react-native-image-crop-picker";
import { showError, showSuccess } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";

const EventDetails = ({ navigation, route }) => {
  const { Item = {}, Career = {} } = route.params || {};
  // console.log('ItemCareerCareerCareer', Career);
  const { isDark, colors, toggleTheme } = useTheme();
  const [images, setImages] = useState([]);
  const [image, setImage] = useState(null);
  const [imagesName, setImagesName] = useState([]);
  const [base64, setBase64] = useState([]);
  const [base64Logo, setBase64Logo] = useState([]);
  const [selectedValue1, setSelectedValue1] = useState("Share with Public");
  const [modalVisibleImg, setModalVisibleImg] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isOpen2, setIsOpen2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const toggleDropdown2 = () => setIsOpen2(!isOpen2);
  const options2 = ["Yes", "Maybe", "No"];
  const statusMapping = { Yes: 1, Maybe: 2, No: 3 };

  const selectOption2 = async (option) => {
    setSelectedValue1(option);
    setIsOpen2(false);
    const status = statusMapping[option];
    try {
      const response = await fetch(`${baseUrl}${AreYouGoingInEvent}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Item?.Organiser?.UserId,
          eventId: Item?.id,
          status,
        }),
      });

      const data = await response.json();
      console.log("data ", data);
      if (response.ok) {
        Alert.alert("Success", `You Select "${option}" for Going in Event`);
      } else {
        Alert.alert("Error", data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Failed to update status.");
    }
  };

  const handleDeleteComment = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this Event?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await fetch(`${baseUrl}${DeleteEvents}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: Item?.id,
                }),
              });

              const data = await response.json();
              console.log("data ------- ", data);

              if (response.ok) {
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

  const DeleteCareerBusinessApi = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this Business?",
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
                `${baseUrl}${DeleteCareerBusiness}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },

                  body: JSON.stringify({
                    id: Career?.id,
                  }),
                }
              );

              const data = await response.json();
              console.log("data ------- ", data);

              if (response.ok) {
                showSuccess(data.message);
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

  const selectImage = () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: "photo",
      compressImageQuality: 0.8,
      includeBase64: true,
    })
      .then((selectedImage) => {
        const imagePath = selectedImage.path;
        const imageName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
        const base64Image = selectedImage.data;

        const imageObj = {
          path: imagePath,
          name: imageName,
          base64: base64Image,
        };

        setImage(imageObj);
        uploadImage(imageObj);
      })
      .catch((error) => {
        console.error("Image selection cancelled:", error);
      });
  };

  const uploadImage = async (imageObj) => {
    if (!Career || !imageObj) {
      showError("Please select an image before uploading.");
      return;
    }
    const UpdateCareerbusinessApiUrl = `${baseUrl}${UpdateCareerbusiness}`;
    const updatedData = {
      id: Career.id,
      userId: Career.UserId,
      companyBusinessName: Career.CompanyBusinessName,
      companyTypeId: Career.CompanyTypeId,
      subIndustryId: 5,
      establishedYear: Career.EstablishedYear,
      countryId: Career.CountryId,
      stateId: Career.StateId,
      cityName: Career.CityName,
      postalCode: Career.PostalCode,
      phoneNumber: Career.PhoneNumber,
      emailAaddress: Career.EmailAaddress,
      businessWebsiteUrl: Career.BusinessWebsiteUrl,
      shortDescription: Career.ShortDescription,
      longDescription: Career.LongDescription,
      completeAddress: Career.CompleteAddress,
      empnoId: Career.EmpnoId,
      viewStatus: 1,
      emailSent: 0,
      contactPerson: Career.ContactPerson,
      postType: 9,
      images: {
        imageName: imageObj.name,
        imageData: imageObj.base64,
      },
    };

    try {
      setLoading(true);
      const response = await fetch(UpdateCareerbusinessApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log(data, "API response");
      } else {
        const text = await response.text();
        console.log("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      if (response.ok) {
        showSuccess("Image updated successfully.");
        if (data.uploadedImages && data.uploadedImages.length > 0) {
          setUploadedImageUrl(data.uploadedImages[0].imageUrl);
        }
      } else {
        showError(data?.message || "Failed to update.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      showError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const openURL = () => {
    Linking.openURL(Item?.websiteurl).catch((err) =>
      console.error("Couldn't open URL", err)
    );
  };
  // const latitude = 28.6139; // Example Latitude (New Delhi)
  // const longitude = 77.2090; // Example Longitude (New Delhi)

  // const openMap = () => {
  //   const url = Platform.select({
  //     ios: `maps://app?saddr=${latitude},${longitude}`,  // Apple Maps
  //     android: `geo:${latitude},${longitude}?q=${latitude},${longitude}` // Google Maps
  //   });

  //   Linking.openURL(url).catch(err => console.error("Couldn't open map", err));
  // };

  const location = Item?.eventVenue;
  const openMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location
    )}`;

    Linking.openURL(url).catch((err) =>
      console.error("Couldn't open map", err)
    );
  };
  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header
        title={Career?.CompanyBusinessName ? "Career Details" : "Event Details"}
        navigation={navigation}
      />
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              borderBottomWidth: Career?.CompanyBusinessName ? 1 : 0,
              borderColor: Career?.CompanyBusinessName
                ? colors.textinputbordercolor
                : "transparent",
            }}
          >
            {(() => {
              const fallbackImageUri =
                Item?.Images?.length > 0
                  ? Item.Images[Item.Images.length - 1]?.imageName
                  : Career?.FileUploaded?.length > 0
                  ? Career.FileUploaded[Career.FileUploaded.length - 1]?.Image
                  : null;

              const imageUriToUse = uploadedImageUrl || fallbackImageUri;

              const fullImageUri = imageUriToUse
                ? imageUriToUse.startsWith("http")
                  ? imageUriToUse
                  : `https://travcomexapi.vecospace.com/api/${imageUriToUse}`
                : null;

              return (
                <>
                  <Image
                    source={
                      fullImageUri
                        ? { uri: fullImageUri }
                        : require("../../assets/noimageplaceholder.png")
                    }
                    style={{
                      width: 150,
                      height: 150,
                      margin: 5,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                    resizeMode="cover"
                  />
                  <TouchableOpacity onPress={selectImage}>
                    <Icon
                      name="device-camera"
                      size={17}
                      color={colors.placeholderTextColor}
                      type="Octicons"
                    />
                  </TouchableOpacity>
                </>
              );
            })()}
          </View>
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              right: 10,
              top: 10,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  Career?.CompanyBusinessName ? "AddCareer" : "AddEvent",
                  {
                    Item: Item,
                    Career: Career,
                  }
                )
              }
            >
              <Icon
                name="pencil"
                size={17}
                style={{ paddingHorizontal: 5 }}
                color={colors.placeholderTextColor}
                type="Octicons"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Career.id ? DeleteCareerBusinessApi() : handleDeleteComment()
              }
            >
              <Icon
                name="delete"
                size={20}
                color={colors.placeholderTextColor}
                type="MaterialCommunityIcons"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: Career?.CompanyBusinessName
                ? null
                : isDark
                ? colors.textinputBackgroundcolor
                : "rgba(0,0,0,0.7)",
              padding: 20,
              borderBottomWidth: Career?.CompanyBusinessName ? 1 : 0,
              borderColor: Career?.CompanyBusinessName
                ? colors.textinputbordercolor
                : "",
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "500",
                color: Career?.CompanyBusinessName
                  ? isDark
                    ? colors.textColor
                    : "black"
                  : "white",
              }}
            >
              {Item?.eventName || Career?.CompanyBusinessName}
            </Text>
            {/* {Career?.CompanyBusinessName ? (
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: '500',
                  color: Career?.CompanyBusinessName ? 'black' : 'white',
                }}>
                {Item?.eventName || Career?.CompanyBusinessName}
              </Text>
            ) : null} */}
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              marginLeft: Career?.CompanyBusinessName ? 20 : 0,
              borderBottomWidth: Career?.CompanyBusinessName ? 1 : 0,
              borderColor: Career?.CompanyBusinessName
                ? colors.textinputbordercolor
                : "",
            }}
          >
            {Career?.CompanyBusinessName ? null : (
              <View style={{ padding: 20 }}>
                <Icon
                  type="AntDesign"
                  name="clockcircleo"
                  size={20}
                  color={colors.backIconColor}
                />
              </View>
            )}

            <View>
              {Career?.CompanyBusinessName ? (
                <View style={globalStyles?.FD_Row_PV_5}>
                  <Text
                    style={{
                      ...globalStyles?.FS_16_FW_B,
                      color: colors.textColor,
                    }}
                  >
                    Contact Person:
                  </Text>
                  <Text style={{ fontSize: 16, color: colors.textColor }}>
                    {Career?.CompanyBusinessName}
                  </Text>
                </View>
              ) : null}

              <View style={globalStyles?.FD_Row_PV_5}>
                <Text
                  style={{
                    ...globalStyles?.FS_16_FW_B,
                    color: colors.textColor,
                  }}
                >
                  {Career?.CompanyBusinessName
                    ? "Number of Employees:"
                    : "Start"}
                </Text>
                <Text style={{ fontSize: 16 }}>
                  {Item?.eventDate} {Item?.starttime}
                  {Career?.EmpnoId}
                  {/*Career?.EmpnoId this for the value then completed by backend   */}
                </Text>
              </View>

              <View style={globalStyles?.FD_Row_PV_5}>
                <Text
                  style={{
                    ...globalStyles?.FS_16_FW_B,
                    color: colors.textColor,
                  }}
                >
                  {Career?.CompanyBusinessName
                    ? "Year of Establishment:"
                    : "End"}
                </Text>
                <Text style={{ fontSize: 16, color: colors.textColor }}>
                  {Item?.eventDate} {Item?.endtime}
                  {Career?.EstablishedYear}
                </Text>
              </View>

              <View style={globalStyles?.FD_Row_PV_5}>
                <Text
                  style={{
                    ...globalStyles?.FS_16_FW_B,
                    color: colors.textColor,
                  }}
                >
                  {/* Event Type:{' '}
                   */}
                  {Career?.CompanyBusinessName ? "Location:" : "Event Type:"}{" "}
                </Text>
                <Text style={{ fontSize: 16, color: colors.textColor }}>
                  {Item?.eventType || Career?.CityName} {Career?.StateId}
                </Text>
              </View>
              {Career?.CompleteAddress ? (
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: 5,
                    flexWrap: "wrap",
                  }}
                >
                  <Text
                    style={{
                      ...globalStyles?.FS_16_FW_B,
                      color: colors.textColor,
                    }}
                  >
                    Address:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      flexShrink: 1,
                      color: colors.textColor,
                    }}
                  >
                    {Career?.CompleteAddress}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          {Career?.CompanyBusinessName ? null : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ padding: 17 }}>
                <Icon
                  type="Entypo"
                  name="location-pin"
                  size={25}
                  color={colors.backIconColor}
                />
              </View>
              <TouchableOpacity style={{ flexShrink: 1 }} onPress={openMap}>
                <View style={globalStyles?.FD_Row_PV_5}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: colors.AppmainColor,
                    }}
                  >
                    {Item?.eventVenue}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {Career?.CompanyBusinessName ? null : (
            <TouchableOpacity
              onPress={toggleDropdown2}
              style={{
                flex: 0.95,
                backgroundColor: colors.AppmainColor,
                flexDirection: "row",
                justifyContent: "center",
                padding: 10,
                margin: 10,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: colors.ButtonTextColor,
                }}
              >
                Are You Going
              </Text>

              <TouchableOpacity onPress={toggleDropdown2}>
                <Icon
                  type="AntDesign"
                  name="down"
                  size={20}
                  color={colors.ButtonTextColor}
                  style={{ paddingLeft: 10 }}
                />
              </TouchableOpacity>

              <View
                style={{
                  position: "absolute",
                  left: 200,
                  top: 0,
                }}
              >
                {isOpen2 && (
                  <View
                    style={{
                      backgroundColor: colors.modelBackground,
                      borderRadius: 4,
                      elevation: 5, // For shadow on Android
                      shadowColor: "#000", // For shadow on iOS
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      padding: 10,
                      zIndex: 999,
                    }}
                  >
                    {options2.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          ...globalStyles.dropdownItemShare,
                          borderColor: colors.textinputbordercolor,
                        }}
                        onPress={() => selectOption2(option)}
                      >
                        <Text style={{ fontSize: 14, color: colors.textColor }}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          {Career?.CompanyBusinessName ? null : (
            <View style={{ margin: 10 }}>
              <Text
                style={{ ...globalStyles?.FS_20_FW_B, color: colors.textColor }}
              >
                Guest List
              </Text>

              {Item?.Guestlist?.map((guest, index) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ProfileDetails", {
                      Item: guest,
                    })
                  }
                  key={index}
                  style={{
                    flexDirection: "row",
                    marginTop: 20,
                  }}
                >
                  <View>
                    <Image
                      source={{
                        uri: guest?.ProfilePhoto
                          ? guest?.ProfilePhoto
                          : require("../../assets/placeholderprofileimage.png"),
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        marginRight: 10,
                        backgroundColor: Colors?.lite_gray,
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        ...globalStyles?.FS_16_FW_B,
                        color: colors.textColor,
                      }}
                    >
                      {guest?.UserName}
                    </Text>
                    <Text style={{ color: colors.placeholderTextColor }}>
                      {guest?.CompanyName}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {Item?.eventBrief ? (
            <View style={globalStyles?.MH_10_PV_30}>
              <Text
                style={{ ...globalStyles?.FS_20_FW_B, color: colors.textColor }}
              >
                Brief profile of the Event
              </Text>
              <Text
                style={{
                  paddingVertical: 10,
                  fontSize: 15,
                  color: colors.textColor,
                }}
              >
                {Item?.eventBrief}
              </Text>
            </View>
          ) : null}
          {Item?.eventDetails ? (
            <View style={globalStyles?.MH_10_PV_30}>
              <Text
                style={{ ...globalStyles?.FS_20_FW_B, color: colors.textColor }}
              >
                Details about the Event
              </Text>
              <Text
                style={{
                  paddingVertical: 10,
                  fontSize: 15,
                  color: colors.textColor,
                }}
              >
                {Item?.eventDetails}
              </Text>
            </View>
          ) : null}
          {Item?.eventAgenda ? (
            <View style={globalStyles?.MH_10_PV_30}>
              <Text
                style={{ ...globalStyles?.FS_20_FW_B, color: colors.textColor }}
              >
                Agenda of the Event
              </Text>
              <Text
                style={{
                  paddingVertical: 10,
                  fontSize: 15,
                  color: colors.textColor,
                }}
              >
                {Item?.eventAgenda}
              </Text>
            </View>
          ) : null}
          {Item?.websiteurl ? (
            <View style={globalStyles?.MH_10_PV_30}>
              <Text
                style={{ ...globalStyles?.FS_20_FW_B, color: colors.textColor }}
              >
                Website URL
              </Text>
              <TouchableOpacity onPress={openURL}>
                <Text
                  style={{
                    paddingVertical: 10,
                    fontSize: 15,
                    color: colors.AppmainColor,
                  }}
                >
                  {Item?.websiteurl}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View>
            {Item?.Images?.length > 0 ? (
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  margin: 10,
                  color: colors.textColor,
                }}
              >
                Photographs
              </Text>
            ) : null}
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {Item?.Images?.length > 0
                ? Item.Images.map((img, index) => (
                    <View style={{}}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedImageIndex(index);
                          setModalVisibleImg(true);
                        }}
                      >
                        <Image
                          key={index}
                          source={{ uri: img.imageName }}
                          style={{
                            backgroundColor: Colors?.lite_gray,
                            width: 90,
                            height: 90,
                            marginRight: 10,
                            margin: 15,
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <Modal
                        visible={modalVisibleImg}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setModalVisibleImg(false)}
                      >
                        <SafeAreaView
                          style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.8)",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            style={{ ...styles.closeButtonimg }}
                            onPress={() => setModalVisibleImg(false)}
                          >
                            <Text style={styles.closeTextimg}>Close</Text>
                          </TouchableOpacity>

                          {Item.Images.length > 1 ? (
                            <FlatList
                              data={Item.Images}
                              horizontal
                              keyExtractor={(image, index) => index.toString()}
                              initialScrollIndex={selectedImageIndex}
                              getItemLayout={(data, index) => ({
                                length: 600,
                                offset: 600 * index,
                                index,
                              })}
                              renderItem={({ item }) => (
                                <Image
                                  source={{ uri: item.imageName }}
                                  style={{
                                    width: 600,
                                    height: 600,
                                    marginHorizontal: 10,
                                    marginTop: 30,
                                  }}
                                  resizeMode="contain"
                                />
                              )}
                              showsHorizontalScrollIndicator={false}
                            />
                          ) : (
                            <Image
                              source={{ uri: Item.Images[0].imageName }}
                              style={{
                                width: 600,
                                height: 600,
                                marginTop: 30,
                              }}
                              resizeMode="contain"
                            />
                          )}
                        </SafeAreaView>
                      </Modal>
                    </View>
                  ))
                : null}
            </View>
          </View>
          <View style={{ marginHorizontal: 10, marginTop: 20 }}>
            <Text
              style={{ ...globalStyles?.FS_20_FW_B, color: colors.textColor }}
            >
              {Career?.CompanyBusinessName
                ? "Posted By"
                : "About the organiser"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProfileDetails", {
                Item: Item?.Organiser || Career?.UserDetails,
              })
            }
            style={{ margin: 10, flexDirection: "row", alignItems: "center" }}
          >
            <View style={{ margin: 10 }}>
              <Image
                source={
                  Item?.Organiser?.ProfilePhoto
                    ? { uri: Item.Organiser.ProfilePhoto }
                    : Career?.UserDetails?.ProfilePhoto
                    ? { uri: Career.UserDetails.ProfilePhoto }
                    : require("../../assets/placeholderprofileimage.png")
                }
                style={{
                  backgroundColor: Colors?.lite_gray,
                  width: 80,
                  height: 80,
                  borderRadius: 50,
                }}
              />
            </View>
            {(Item?.Organiser || Career?.CompanyBusinessName) && (
              <View style={{ marginVertical: 5 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: colors.textColor,
                  }}
                >
                  {Item?.Organiser?.UserName || Career?.UserDetails?.UserName}
                </Text>
                <Text style={{ color: colors.placeholderTextColor }}>
                  {Item?.Organiser?.CompanyName ||
                    Career?.UserDetails?.CompanyName}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={{ marginHorizontal: 10 }}>
            <Text
              style={{ ...globalStyles?.FS_20_FW_B, color: colors.textColor }}
            >
              {Career?.CompanyBusinessName ? "Description" : "Event venue"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {Career?.CompanyBusinessName ? (
              <>
                <View style={{ margin: 10 }}>
                  <Text style={{ color: colors.textColor, fontSize: 15 }}>
                    {Career?.LongDescription}
                  </Text>
                </View>
              </>
            ) : (
              <>
                {" "}
                <View style={{ padding: 17 }}>
                  <Icon
                    type="Entypo"
                    name="location-pin"
                    size={25}
                    color={colors.backIconColor}
                  />
                </View>
                <View style={{ flexShrink: 1 }}>
                  <View style={{ paddingVertical: 5 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: colors.AppmainColor,
                      }}
                    >
                      {Item?.eventVenue} {Item?.eventCountry}
                    </Text>

                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: colors.AppmainColor,
                      }}
                    >
                      Open in Google Maps
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: 200,
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 30,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#000",
  },
  inputIcon: {
    position: "absolute",
    right: 10,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  placeholder: {
    fontSize: 16,
    color: "#999",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start", // Align items at the top
  },
  firstImage: {
    width: "78%",
    height: 495,
    marginRight: 10, // Spacing between big and small images
    borderRadius: 8,
    // resizeMode:"contain"
  },
  smallImage: {
    width: 93,
    height: 93,
    // marginTop:30,
    marginBottom: 10, // Spacing between small images
    borderRadius: 8,
  },
  //
  containerimg: {
    padding: 10,
  },
  rowimg: {
    flexDirection: "row",
    alignItems: "center",
  },
  firstImageimg: {
    height: 200,
    borderRadius: 10,
  },
  smallImagesColumnimg: {
    flexDirection: "column",
    marginLeft: 10,
  },
  smallImageimg: {
    width: 80,
    height: 80,
    marginBottom: 5,
    borderRadius: 10,
  },
  moreContainerimg: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  moreTextimg: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainerimg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImageimg: {
    width: 600,
    height: 600,
    marginHorizontal: 10,
  },
  closeButtonimg: {
    backgroundColor: "white",
    // alignItems:'center',
    marginRight: 20,
    alignSelf: "flex-end",
    padding: 10,
    borderRadius: 5,
  },
  closeTextimg: {
    fontWeight: "bold",
  },
});

export default EventDetails;
