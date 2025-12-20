import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  Modal,
  ActivityIndicator,
  Button,
} from "react-native";
import globalStyles from "../screen/GlobalCSS";
import Header from "../screen/Header/Header";
import Colors from "../screen/color";
import Icon from "../screen/Icons/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagePicker from "react-native-image-crop-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  AddTalent,
  baseUrl,
  listoption,
  ListOption,
  UpdateTalent,
} from "../screen/baseURL/api";
import RNFS from "react-native-fs";
import { CommonActions } from "@react-navigation/native";
import { showError } from "../screen/components/Toast";

const AddTelentProfile = ({ route, navigation }) => {
  const { Item = {}, AdditionalData = [] } = route.params || {};
  const [number, onChangeNumber] = useState("");
  const [selectedValue5, setSelectedValue5] = useState("Select");
  const [isOpen5, setIsOpen5] = useState(false);
  const [selectedValueComp, setSelectedValueComp] = useState("Select");
  const [selectedValue2, setSelectedValue2] = useState("Select");
  const [checked, setChecked] = useState(false);
  const [industryData, setIndustryData] = useState([]);
  const [perfID1, setPerfID1] = useState("");
  const [userData, setUserData] = useState(null);
  const [errorTitle, setErrorTitle] = useState(false);
  console.log("errorTitle", errorTitle);
  const [errorCategory, setErrorCategory] = useState(false);
  const [errorCareerLevel, setErrorCareerLevel] = useState(false);
  const [errorCompany, setErrorCompany] = useState(false);
  const [errorCountry, setErrorCountry] = useState("");
  const [errorState, setErrorState] = useState("");
  const [errorImg, setErrorImg] = useState(false);
  const [compURL, setCompURL] = useState("");
  const [aboutComp, setAboutComp] = useState("");
  const [errorCopmURL, setErrorCopmURL] = useState(false);
  const [errorAboutComp, setErrorAboutComp] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [image, setImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [base64Logo, setBase64Logo] = useState(null);
  const [base64Banner, setBase64Banner] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  useEffect(() => {
    if (Item) {
      onChangeNumber(Item?.TalentName);
      setPerfID1(Item?.CategoryIds);
      setSelectedValue5(Item?.CategoryNames);
      setAboutComp(Item.LongDescription || "");
      setCompURL(Item.ShortDescription || "");
      if (Item?.TalentProfilePhoto) {
        setLogoImage(Item.TalentProfilePhoto);
        // setSelectedImages(Item.TalentProfilePhoto);

        if (Item?.TalentProfilePhoto) {
          fetchImageAsBase64(Item.TalentProfilePhoto).then((imageObject) => {
            if (imageObject) {
              setSelectedImages([imageObject]); // Store in state as array
            }
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    UserValue();
  }, []);
  const UserValue = async () => {
    try {
      const userDta = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    } catch (error) {}
  };
  const fetchImageAsBase64 = async (imageUrl) => {
    try {
      // Define local file path to store the image
      const fileName = imageUrl.split("/").pop(); // Extract file name from URL
      const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Download image from URL and save it to local path
      const downloadResult = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: localFilePath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        // Convert local image to Base64
        const base64Data = await RNFS.readFile(localFilePath, "base64");

        return {
          imageName: fileName,
          imagePath: `${localFilePath}`, // Local file path
          imageData: `${base64Data}`, // Base64 data
        };
      } else {
        console.error("Failed to download image");
        return null;
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
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

  const getIndustryList = async (Val) => {
    console.log(" value --- > ", Val);
    try {
      const response = await fetch(`${baseUrl}${listoption}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionType: Val,
        }),
      });

      const data = await response.json();
      console.log(" value data --------->>>>>> > ", data?.DataList);

      if (response.ok) {
        setIndustryData(data?.DataList);
      } else {
        showError(data.message || "Failed to Industry List");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
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
    if (!selectedValue5) {
      setErrorCategory(true);
      isValid = false;
    }
    if (!compURL) {
      setErrorCopmURL(true);
      isValid = false;
    }
    // if (!aboutComp) {
    //   setErrorAboutComp(true);
    //   isValid = false;
    // }
    if (!logoImage) {
      setErrorImg(true);
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    const apiUrl = `${baseUrl}${Item?.Id ? UpdateTalent : AddTalent}`;

    const Data = {
      id: Item?.Id || Item?.id || "",
      userId: userData?.User?.userId,
      talentName: number,
      shortDescription: compURL,
      longDescription: aboutComp,
      catIds: perfID1.toString(),
      status: 1,
      viewStatus: 1,
      emailSent: 0,
      images: selectedImages,
    };

    console.log("Data -----------", Data);
    try {
      const response = await fetch(apiUrl, {
        method: Item?.Id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Data),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Add data  ----", data);
        //navigation.goBack();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "Drawer",
                state: {
                  routes: [{ name: "GuestSpeakersTrainers" }],
                },
              },
            ],
          })
        );
      } else {
        showError(data.message || "Failed to fetch posts");
        console.log(data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
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

        // const imageArray = pickedImage?.map(img => ({
        //   imageName: img.path.split('/').pop(), // Extract file name
        //   imageData: img.data, // Base64 data
        // }));

        // setSelectedImages(imageArray);

        const imageObject = {
          imageName: pickedImage.path.split("/").pop(),
          imageData: pickedImage.data,
        };

        setSelectedImages([imageObject]); // Store the single image inside an array
      } else {
        setBannerImage(pickedImage.path);
        setBase64Banner(pickedImage.data);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  return (
    <SafeAreaView style={globalStyles.SafeAreaView}>
      <Header title="Add Company Profile" navigation={navigation} />
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: Colors.white }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={globalStyles.ViewINter1}>
              <Text style={{ ...globalStyles.headlineText }}>
                Create Talent Profile
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
                }}
              >
                Name <Text style={styles.red}>*</Text>
              </Text>

              <TextInput
                style={{
                  ...globalStyles.textInput,
                  borderColor: errorTitle ? Colors.error : Colors.gray,
                }}
                onChangeText={(value) => {
                  onChangeNumber(value);
                  setErrorTitle(value.trim().length === 0);
                }}
                value={number}
                placeholder=""
                keyboardType="default"
                multiline
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={{ backgroundColor: "white", marginHorizontal: 10 }}>
              <Text
                style={{
                  marginTop: 20,
                }}
              >
                Select Topics <Text style={styles.red}>*</Text>
              </Text>
              <TouchableOpacity
                onPress={toggleDropdown5}
                style={{
                  ...globalStyles.seclectIndiaView,
                  borderColor: errorCategory ? Colors.error : Colors.gray,
                }}
              >
                <Text
                  style={{
                    ...globalStyles.JobfiledSectionText,
                    paddingBottom: 0,
                  }}
                >
                  {selectedValue5}
                </Text>
              </TouchableOpacity>
              {isOpen5 && (
                <View style={globalStyles.dropdownList}>
                  {industryData.map((item) => (
                    <TouchableOpacity
                      key={item.Id}
                      style={globalStyles.dropdownItem}
                      onPress={() => {
                        selectOption5(item);
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>{item?.Name}</Text>
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
                  // color: errorCopmURL ? Colors.error : Colors.gray,
                }}
              >
                Short Description (maximum 150 characters)
                <Text style={styles.red}>*</Text>
              </Text>

              <TextInput
                style={{
                  ...globalStyles.textInput,
                  borderColor: errorCopmURL ? Colors.error : Colors.gray,
                }}
                onChangeText={(value) => {
                  setCompURL(value);
                  setErrorCopmURL(value.trim().length === 0);
                }}
                value={compURL}
                placeholder=""
                keyboardType="default"
                multiline
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={globalStyles.JobfiledSection}>
              <Text
                style={{
                  ...globalStyles.JobfiledSectionText,
                  paddingHorizontal: 10,
                  // color: errorAboutComp ? Colors.error : Colors.gray,
                }}
              >
                Detailed Description (maximum 5000 characters)
              </Text>
              <TextInput
                style={{
                  ...globalStyles.textInput,
                  marginHorizontal: 10,
                  height: 80,
                  //borderColor: errorAboutComp ? Colors.error : Colors.gray,
                }}
                onChangeText={(value) => {
                  setAboutComp(value);
                  // setErrorAboutComp(value.trim().length === 0);
                }}
                value={aboutComp}
                placeholder="Max 500 Characters"
                keyboardType="default"
                multiline
                placeholderTextColor="#aaa"
              />
            </View>
            <View
              style={{
                alignItems: "center",
                backgroundColor: "#c0c0c0",
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
                    color={Colors.main_primary}
                    type="FontAwesome"
                  />
                </TouchableOpacity>
              )}
              {!logoImage && (
                <Text style={{ fontSize: 16, color: Colors.main_primary }}>
                  Upload Profile Photo
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
                      color={Colors.black}
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

            <View
              style={{
                marginTop: 20,
                marginHorizontal: 10,
                borderLeftWidth: 4,
                paddingLeft: 10,
                borderColor: Colors.main_primary,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => setChecked(!checked)}>
                  <MaterialCommunityIcons
                    name={
                      checked ? "checkbox-marked" : "checkbox-blank-outline"
                    }
                    size={24}
                    color={Colors.main_primary}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
                <Text style={{ fontSize: 14, flexShrink: 1 }}>
                  I confirm that I am authorized to create this talent profile
                  and the information given is correct.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{ ...globalStyles.saveButton, margin: 20 }}
              onPress={() => AddCompanyPost()}
            >
              <Text style={globalStyles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddTelentProfile;
const styles = StyleSheet.create({
  red: {
    color: "red",
  },
});
