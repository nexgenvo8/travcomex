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
} from "react-native";
import globalStyles from "./GlobalCSS";
import Header from "./Header/Header";
import Colors from "./color";
import ImagePicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "./Icons/Icons";
import {
  baseUrl,
  addarticle,
  updatearticle,
  GroupAddPost,
} from "./baseURL/api";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import KeyboardAvoidingWrapper from "./components/KeyboardAvoidingWrapper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { showError } from "./components/Toast";
import { useTheme } from "../theme/ThemeContext";
import { universityFullName } from "./constants";

const ArticleAdd = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const { Item = {}, GroupDetails = {} } = route.params || {};
  const { isDark, colors, toggleTheme } = useTheme();
  // State Variables
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagesName, setImagesName] = useState([]);
  const [base64, setBase64] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorHeadline, setErrorHeadline] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [checked, setChecked] = useState(false);

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
    if (Item?.ArticleId) {
      const rawHTML = Item?.PostText;
      const plainText = rawHTML.replace(/<[^>]*>/g, "");
      setHeadline(Item?.PostTitle || "");
      //setDescription(Item?.PostText || '');
      setDescription(plainText || "");
      setImages(Item?.Images[0]?.PostImage ? [Item?.Images[0]?.PostImage] : []);
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
    const isValid = headline.trim() && description.trim();

    if (isValid) {
      setChecked(!checked);
    } else {
      if (!headline.trim()) setErrorHeadline(true);
      if (!description.trim()) setErrorDescription(true);
    }
  };
  const articleAdd = async () => {
    setErrorHeadline(false);
    setErrorDescription(false);

    if (!checked) {
      showError("Please check the confirmation box before Save.");
      return;
    }

    if (!headline.trim()) {
      setErrorHeadline(true);
      return;
    }

    if (!description.trim()) {
      setErrorDescription(true);
      return;
    }

    const isEdit = !!Item?.ArticleId;
    const hasImages = imagesName.length > 0 && base64.length > 0;

    if (userData?.User?.userId && (hasImages || isEdit)) {
      const imagesArray = hasImages
        ? imagesName.map((name, index) => ({
            imageName: name.toString(),
            imageData: base64[index].toString(),
          }))
        : [];

      const apiEndpoint = GroupDetails?.id
        ? GroupAddPost
        : isEdit
        ? updatearticle
        : addarticle;

      const requestData = JSON.stringify({
        id: Item?.ArticleId,
        userId: userData?.User?.userId,
        groupId: GroupDetails?.id ? 1 : 0,
        ...(GroupDetails?.id && { shareType: 1 }),
        postType: GroupDetails?.id ? 4 : 3,
        postTitle: headline,
        postText: description,
        images: imagesArray,
      });

      setLoading(true);

      try {
        const response = await fetch(`${baseUrl}${apiEndpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestData,
        });

        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            showError(errorData?.message || "Failed to add Travel Blogs");
          } else {
            const text = await response.text();
            console.error("Non-JSON response:", text);
          }
          return;
        }
        const data = await response.json();
        if (response.ok) {
          console.log("Article Added:", data);
          // if (apiEndpoint === addarticle) {
          //   navigation.navigate({
          //     name: 'Articles',
          //     params: {refresh: true},
          //     merge: true,
          //   });
          // } else {
          //   navigation.goBack();
          // }
          navigation.goBack();
        } else {
          showError(data.message || "Failed to add article");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      showError("Please fill all required fields");
    }
  };
  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header
        title={
          GroupDetails?.id
            ? "Group Post"
            : Item?.ArticleId
            ? "Edit Travel Blogs"
            : "Add Travel Blogs"
        }
        navigation={navigation}
      />
      <KeyboardAvoidingWrapper offset={40}>
        <View style={globalStyles.MainView}>
          <ScrollView>
            <View style={globalStyles.MT_20}>
              <Text
                style={{
                  ...globalStyles.FS_18_FW_600,
                  color: colors.textColor,
                }}
              >
                {GroupDetails?.id ? "Write a group post" : "Add Travel Blogs"}
              </Text>
            </View>

            {!images.length ? (
              <TouchableOpacity
                style={{
                  ...globalStyles.selectImgArticle,
                  marginVertical: 10,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.textinputBackgroundcolor,
                }}
                onPress={selectImage}
              >
                <Text
                  style={{
                    ...globalStyles.FS_18_FW_600,
                    color: colors.textColor,
                  }}
                >
                  {GroupDetails?.id
                    ? "Select Post Image"
                    : "Select Travel Blogs Image"}
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setImages([])}
                  style={globalStyles.AS_End_PV_5}
                >
                  <Icon
                    name="cross"
                    size={20}
                    color={colors.backIconColor}
                    type="Entypo"
                  />
                </TouchableOpacity>
                <View style={globalStyles.containerArticle}>
                  <Image
                    style={globalStyles.firstImage}
                    source={{ uri: images[0] }}
                  />
                </View>
              </>
            )}

            <TextInput
              style={{
                ...globalStyles.InputTitle,
                borderColor: colors.textinputbordercolor,
                color: colors.textColor,
                backgroundColor: colors.textinputBackgroundcolor,
              }}
              onChangeText={(val) => {
                setHeadline(val);
                setErrorHeadline(false);
              }}
              value={headline}
              placeholder={
                GroupDetails?.id
                  ? "Title for group post"
                  : "Write your Headline"
              }
              placeholderTextColor={colors.placeholderTextColor}
            />
            {errorHeadline && (
              <Text style={{ color: "red", marginTop: 5 }}>
                Headline is required
              </Text>
            )}

            <TextInput
              style={{
                ...globalStyles.InputTitle,
                borderColor: colors.textinputbordercolor,
                color: colors.textColor,
                backgroundColor: colors.textinputBackgroundcolor,
                height: 200,
                marginVertical: 10,
              }}
              onChangeText={(val) => {
                setDescription(val);
                setErrorDescription(false);
              }}
              value={description}
              placeholder={
                GroupDetails?.id
                  ? "Group post description"
                  : "Article description"
              }
              multiline
              placeholderTextColor={colors.placeholderTextColor}
            />
            {errorDescription && (
              <Text style={{ color: "red", marginTop: 5 }}>
                Description is required
              </Text>
            )}
            <View style={globalStyles.IconViewArticles}>
              <TouchableOpacity onPress={handleCheckboxToggle}>
                <MaterialCommunityIcons
                  name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={24}
                  color={colors.AppmainColor}
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  ...globalStyles.TextArticles,
                  color: colors.textColor,
                }}
              >
                I confirm that I am authorized to Post this Travel Blogs on{" "}
                {universityFullName} and if any image is used, I have the rights
                to use the image.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                globalStyles.saveButton,
                { backgroundColor: colors.AppmainColor },
                {
                  opacity: checked ? 1 : 0.8,
                },
              ]}
              onPress={articleAdd}
              disabled={!checked || loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.AppmainColor} />
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
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default ArticleAdd;
