import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from "react-native";
import globalStyles from "../GlobalCSS";
import Header from "../Header/Header";
import ImagePicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNBlobUtil from "react-native-blob-util";
import {
  baseUrl,
  addarticle,
  updatearticle,
  GroupAddPost,
  AddKnowledgeHubApi,
  UpdateKnowledge,
  listoption,
} from "../baseURL/api";
import { useIsFocused } from "@react-navigation/native";
import Colors from "../color";
import { pick, keepLocalCopy } from "@react-native-documents/picker";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { showError } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";
import { universityFullName } from "../constants";

const AddKnowledgeHub = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const { Item = {}, GroupDetails = {} } = route.params || {};

  // console.log("Item ------ >>>",Item)
  // State Variables
  const { isDark, colors, toggleTheme } = useTheme();
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagesName, setImagesName] = useState([]);
  const [base64, setBase64] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorHeadline, setErrorHeadline] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorIndustry, setErrorIndustry] = useState(false);
  const [errorPrivacy, setErrorPrivacy] = useState(false);
  const [errorTag, setErrorTag] = useState(false);
  const [errorFile, setErrorFile] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selectedValue5, setSelectedValue5] = useState("Select");
  const [isOpen5, setIsOpen5] = useState(false);
  const [selectedValueComp, setSelectedValueComp] = useState("Select");
  const [selectedValue2, setSelectedValue2] = useState("Select");
  const [isOpen2, setIsOpen2] = useState(false);
  const [industryData, setIndustryData] = useState([]);
  const [perfID1, setPerfID1] = useState("");
  const [number, onChangeNumber] = useState("");
  const [file, setFile] = useState(null);
  const [base64Data, setBase64Data] = useState("");

  useEffect(() => {
    if (selectedValue5 !== "Select" && selectedValue5) {
      setErrorIndustry(false);
    }
    if (selectedValue2 !== "Select" && selectedValue5) {
      setErrorPrivacy(false);
    }
    if (selectedValueComp !== "Select" && selectedValue5) {
      setErrorCompany(false);
    }
  }, [selectedValue5, selectedValue2, selectedValueComp]);

  const pickDocument = async () => {
    try {
      const [result] = await pick({
        type: ["*/*"], // or a specific MIME list
        allowMultiSelection: false,
        allowVirtualFiles: false,
      });

      if (result && result.uri) {
        // Optionally keep a local copy
        const [local] = await keepLocalCopy({
          files: [
            {
              uri: result.uri,
              fileName: result.name ?? "unknown",
            },
          ],
          destination: "documentDirectory", // e.g., RNFS.DocumentDirectoryPath
        });

        const fileUri = local?.uri ?? result.uri;
        const normalizedUri = fileUri.startsWith("file://")
          ? fileUri
          : `file://${fileUri}`;

        const base64String = await RNFS.readFile(normalizedUri, "base64");
        setBase64Data(base64String);
        setFile(result);
      }
    } catch (err) {
      // Handle cancellation or errors
      console.log("Error in picking file:", err);
    }
  };
  const openFile = async (fileObject) => {
    try {
      if (!fileObject || !fileObject.uri) {
        console.log("Invalid file object:", fileObject);
        Alert.alert("Invalid file", "No file selected or file is missing.");
        return;
      }

      const uri = fileObject.uri;

      console.log("File URI:", uri);

      if (!uri.startsWith("content://")) {
        Alert.alert("Invalid URI", "Expected a content:// URI");
        return;
      }

      const destPath = `${RNBlobUtil.fs.dirs.DocumentDir}/${fileObject.name}`;

      await RNBlobUtil.fs
        .cp(uri, destPath)
        .then(() => {
          console.log("Copied to:", destPath);
          return FileViewer.open(destPath);
        })
        .then(() => {
          console.log("File opened successfully");
        })
        .catch((err) => {
          console.error("Error copying or opening file:", err);
          showError("Error", err.message || "Could not open file");
        });
    } catch (error) {
      console.error("Unexpected error:", error);
      showError("Error", error.message || "Unexpected failure");
    }
  };

  // const requestStoragePermission = async () => {
  //   if (Platform.OS !== 'android') return true;

  //   try {
  //     if (Platform.Version >= 33) {
  //       // Android 13+ (API 33+)
  //       const readImagePermission = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
  //       );
  //       const readVideoPermission = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
  //       );
  //       const readAudioPermission = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
  //       );

  //       return (
  //         readImagePermission === PermissionsAndroid.RESULTS.GRANTED ||
  //         readVideoPermission === PermissionsAndroid.RESULTS.GRANTED ||
  //         readAudioPermission === PermissionsAndroid.RESULTS.GRANTED
  //       );
  //     } else {
  //       // Android < 13
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //       );
  //       return granted === PermissionsAndroid.RESULTS.GRANTED;
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //     return false;
  //   }
  // };

  // Fetch User Data
  const fetchUserData = useCallback(async () => {
    try {
      const userDta = await AsyncStorage.getItem("userData");
      if (userDta) {
        setUserData(JSON.parse(userDta));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    if (Item?.id) {
      setHeadline(Item?.name || "");
      setDescription(Item?.longDescription || "");
      setFile(Item?.documentFile || " ");
      setSelectedValue5(Item?.categoryNames || " ");
      setSelectedValue2(Item?.privacy || " ");
      onChangeNumber(Item?.keywords || " ");
    }
  }, [Item, isFocused, fetchUserData]);
  // Image Picker
  const selectImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        multiple: false,
        mediaType: "photo",
        compressImageQuality: 0.8,
        includeBase64: true,
      });

      const imagePath = image.path;
      const imageName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
      const base64Image = image.data;

      setImages([imagePath]);
      setImagesName([imageName]);
      setBase64([base64Image]);
    } catch (error) {
      console.error("Image selection cancelled:", error);
    }
  };
  const handleCheckboxToggle = () => {
    const isValid =
      file &&
      headline.trim() &&
      description.trim() &&
      selectedValue5 !== "Select" &&
      selectedValue2 !== "Select" &&
      number.trim();

    if (isValid) {
      setChecked(!checked);
    } else {
      if (!file) setErrorFile(true);
      if (!headline.trim()) setErrorHeadline(true);
      if (!description.trim()) setErrorDescription(true);
      if (selectedValue5 === "Select") setErrorIndustry(true);
      if (selectedValue2 === "Select") setErrorPrivacy(true);
      if (!number.trim()) setErrorTag(true);
    }
  };

  const articleAdd = async () => {
    setErrorHeadline(false);
    setErrorDescription(false);
    if (!checked) {
      showError("Please check the confirmation box before publishing.");
      return;
    }

    if (!file) {
      setErrorFile(true);
      // return;
    }

    if (!headline.trim()) {
      setErrorHeadline(true);
      // return;
    }

    if (!description.trim()) {
      setErrorDescription(true);
      // return;
    }
    if (selectedValue5 === "Select") {
      setErrorIndustry(true);
      // return;
    }
    if (selectedValue2 === "Select") {
      setErrorPrivacy(true);
      // return;
    }

    if (!number.trim()) {
      setErrorTag(true);
      // return;
    }

    const requestData = JSON.stringify({
      id: Item?.id || "",
      userId: userData?.User?.userId,
      name: headline,
      longDescription: description,
      catIds: perfID1 || Item?.categoryIds,
      fileSize: 2048, // change it ""
      privacy: selectedValue2?.label
        ? selectedValue2?.label == "Public"
          ? 1
          : 2
        : selectedValue2 == "Public"
        ? 1
        : 2, // public 1 ,Private 2
      views: 1, // change it ""
      docsDownlods: 1, // change it ""
      documentKeyword: number,
      documentFile: base64Data?.toString() || "",
    });

    setLoading(true);

    console.log("requestData ------>", requestData);

    // try {
    //   const response = await fetch(`${baseUrl}${Item?.id ? UpdateKnowledge:AddKnowledgeHubApi }`, {
    //     method:  Item?.id ? "PUT":' POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: requestData,
    //   });

    //   const data = await response.json();
    //   if (response.ok) {
    //     console.log(`${Item?.id ? "Edit Article":  "Article Added"}:`, data);
    //     navigation.pop(2);

    //   }
    // } catch (error) {
    //   Alert.alert('Error', 'Failed to add article. Please try again.');
    //   console.error('Fetch Error:', error);
    // } finally {
    //   setLoading(false);
    // }

    try {
      const response = await fetch(
        `${baseUrl}${Item?.id ? UpdateKnowledge : AddKnowledgeHubApi}`,
        {
          method: Item?.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: requestData,
        }
      );

      const textResponse = await response.text(); // Get response as text
      console.log("Raw Response:", textResponse);

      const data = JSON.parse(textResponse); // Parse it manually
      if (response.ok) {
        console.log(`${Item?.id ? "Edit Article" : "Article Added"}:`, data);
        navigation.pop(2);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const optionsApply1 = [
    { id: 1, label: "Public" },
    { id: 2, label: "Private" },
  ];
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
      // console.log(' value data --------->>>>>> > ', data?.DataList);

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
  const selectOption2 = (option) => {
    setSelectedValue2(option);
    setIsOpen2(false);
  };
  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2);
  };
  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header title={"Add Knowledge Hub"} navigation={navigation} />
      <View style={globalStyles.MainView}>
        <ScrollView>
          <View style={globalStyles.MT_20}>
            <Text
              style={{ ...globalStyles.FS_18_FW_600, color: colors.textColor }}
            >
              {"Add Knowledge Hub"}
            </Text>
          </View>

          {!file ? (
            <TouchableOpacity
              style={{
                ...globalStyles.selectImgArticle,
                marginVertical: 10,
                borderColor: errorFile
                  ? Colors.error
                  : colors.placeholderTextColor,
              }}
              // onPress={selectImage}
              onPress={pickDocument}
            >
              <Text
                style={{
                  ...globalStyles.FS_18_FW_600,
                  color: colors.textColor,
                }}
              >
                {"+ Add Knowledge Hub File"}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              {file && (
                <View style={styles.fileContainer}>
                  <Text style={{ ...styles.fileName, color: colors.textColor }}>
                    📄 {file.name}
                  </Text>
                  <Text style={{ color: colors.textColor }}>
                    Type: {file.type || "Unknown"}
                  </Text>
                  <Text style={{ color: colors.textColor }}>
                    Size: {(file.size / 1024).toFixed(2)} KB
                  </Text>

                  <TouchableOpacity
                    onPress={() => openFile(file)}
                    // onPress={openFile}
                    style={{ ...styles.openButton, color: colors.AppmainColor }}
                  >
                    <Text
                      style={{
                        ...styles.openButtonText,
                        color: colors.textColor,
                      }}
                    >
                      📂 See Your File
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          <TextInput
            style={{
              ...globalStyles.InputTitle,
              borderWidth: 1,
              borderColor: errorHeadline
                ? Colors.error
                : colors.textinputbordercolor,
              backgroundColor: colors.textinputBackgroundcolor,
              color: colors.textColor,
            }}
            onChangeText={(val) => {
              setHeadline(val);
              setErrorHeadline(false);
            }}
            value={headline}
            placeholder={"Write your Title"}
            placeholderTextColor={colors.placeholderTextColor}
          />

          <TextInput
            style={{
              ...globalStyles.InputTitle,
              height: 100,
              marginVertical: 10,
              borderColor: errorDescription
                ? Colors.error
                : colors.textinputbordercolor,
              backgroundColor: colors.textinputBackgroundcolor,
              color: colors.textColor,
            }}
            onChangeText={(val) => {
              setDescription(val);
              setErrorDescription(false);
            }}
            value={description}
            placeholder={"Write your description"}
            multiline
            placeholderTextColor={colors.placeholderTextColor}
          />

          <View style={{ marginBottom: 0 }}>
            <Text>Industry</Text>
            <TouchableOpacity
              onPress={toggleDropdown5}
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
                    style={globalStyles.dropdownItem}
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
            )}
          </View>

          <View style={{ marginBottom: 0 }}>
            <Text
              style={{
                marginTop: 20,
                color: colors.textColor,
              }}
            >
              Privacy
            </Text>
            <TouchableOpacity
              onPress={toggleDropdown2}
              style={{
                ...globalStyles.seclectIndiaView,
                borderColor: errorPrivacy
                  ? Colors.error
                  : colors.textinputbordercolor,
                backgroundColor: colors.textinputBackgroundcolor,
              }}
            >
              <Text
                style={{
                  ...globalStyles.JobfiledSectionText,
                  color: colors.textColor,
                  paddingBottom: 0,
                }}
              >
                {selectedValue2?.label
                  ? selectedValue2?.label
                  : selectedValue2 || "Select "}
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
                    style={globalStyles.dropdownItem}
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
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                ...globalStyles.JobfiledSectionText,
                color: colors.textColor,
              }}
            >
              Tag
            </Text>

            <TextInput
              style={{
                ...globalStyles.textInput,
                borderColor: errorTag
                  ? Colors.error
                  : colors.textinputbordercolor,
                backgroundColor: colors.textinputBackgroundcolor,
                color: colors.textColor,
              }}
              onChangeText={(value) => {
                onChangeNumber(value);
                setErrorTag(value.trim().length === 0);
              }}
              value={number}
              placeholder="Enter comma separated keywords"
              keyboardType="default"
              multiline
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>

          <View style={{ flexDirection: "row" }}>
            {/* <PlaneIcon
              name="checksquare"
              size={20}
              color={Colors.main_primary}
              style={{marginRight: 10}}
            /> */}
            <TouchableOpacity
              onPress={handleCheckboxToggle}
              //onPress={() => setChecked(!checked)}
            >
              <MaterialCommunityIcons
                name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
                size={24}
                color={colors.AppmainColor}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <Text
              style={{ fontSize: 14, flexShrink: 1, color: colors.textColor }}
            >
              I confirm that I am authorized to Post this document on{" "}
              {universityFullName} and if any image is used, I have the rights
              to use the image.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              globalStyles.saveButton,
              {
                opacity: checked ? 1 : 0.5,
                backgroundColor: colors.AppmainColor,
              },
            ]}
            onPress={articleAdd}
            disabled={!checked || loading}
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
                Publish
              </Text>
            )}
          </TouchableOpacity>
          <View style={{ marginVertical: 10 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: { backgroundColor: "#007bff", padding: 0, borderRadius: 5 },
  buttonText: { color: "white", fontWeight: "bold" },
  fileContainer: { marginVertical: 40, alignItems: "center", width: "100%" },
  fileName: { fontWeight: "bold", marginBottom: 5, fontSize: 18 },
  openButton: {
    marginTop: 10,
    // backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  openButtonText: { fontWeight: "bold" },
});
export default AddKnowledgeHub;
