import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import globalStyles from '../GlobalCSS';
import Header from '../Header/Header';
import Colors from '../color';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../Icons/Icons';
import {useIsFocused} from '@react-navigation/native';
import {AddCompanyPost, baseUrl} from '../baseURL/api';
import {showError} from '../components/Toast';
import {useTheme} from '../../theme/ThemeContext';

const AddUpdatePost = ({navigation, route}) => {
  const {Item = {}, ItemCompanyData = {}} = route.params || {};
  const {isDark, colors, toggleTheme} = useTheme();
  const isFocused = useIsFocused();
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [imagesName, setImagesName] = useState([]);
  const [base64, setBase64] = useState([]);
  const [userData, setUserData] = useState([]);

  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem('userData');
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };

  useEffect(() => {
    UserValue();
    if (Item?.ArticleId) {
      setHeadline(Item?.PostTitle || ''); // Ensure headline is updated correctly when Item is passed
      setDescription(Item?.PostText || '');
      setImages(Item?.Images[0]?.PostImage);
    }
  }, [Item, isFocused]); // Add Item as a dependency here to trigger the effect when it changes

  const selectImage = () => {
    ImagePicker.openPicker({
      multiple: false, // Allow only one image selection
      mediaType: 'photo',
      compressImageQuality: 0.8,
      includeBase64: true, // Include Base64 if needed
    })
      .then(image => {
        // Extract details of the selected image
        const imagePath = image.path;
        const imageName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
        const base64Image = image.data;

        setImages([imagePath]);
        setImagesName([imageName]);
        setBase64([base64Image]);
      })
      .catch(error => {
        console.error('Image selection cancelled:', error);
      });
  };
  const postAdd = async () => {
    if (
      userData?.User?.userId &&
      userData?.User?.userstype &&
      description &&
      imagesName &&
      base64
    ) {
      const imagesArray = imagesName.map((name, index) => ({
        imageName: name?.toString(), // Move imageName to the first position
        imageData: base64[index]?.toString(), // Move imageData to the second position
      }));

      try {
        const response = await fetch(`${baseUrl}${AddCompanyPost}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userData?.User?.userId,
            companyId: ItemCompanyData?.id,
            groupId: 0,
            shareType: 1,
            postTitle: headline,
            postText: description,
            images: imagesArray,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Add Articles successfully:', data);
          navigation.replace('CompanyProfiles');
        } else {
          console.log(data);
          showError(data || 'Failed to add Articles');
        }
      } catch (error) {
        console.error('Fetch Error add Articles:', error);
      }
    } else {
      console.log('Missing required fields');
    }
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}>
      <Header
        title={Item.ArticleId ? 'Edit Article' : 'Add Company Post'}
        navigation={navigation}
      />
      <View style={globalStyles.MainView}>
        <ScrollView>
          <View style={globalStyles.MT_20}>
            <Text
              style={{...globalStyles.FS_18_FW_600, color: colors.textColor}}>
              Add Company Post
            </Text>
          </View>

          {images?.length == 0 || images == null ? (
            <TouchableOpacity
              style={{
                ...globalStyles.selectImgArticle,
                marginVertical: 10,
                borderColor: colors.textinputbordercolor,
                backgroundColor: colors.textinputBackgroundcolor,
              }}
              onPress={selectImage}>
              <Text
                style={{...globalStyles.FS_18_FW_600, color: colors.textColor}}>
                Select Company Image
              </Text>
            </TouchableOpacity>
          ) : null}

          {images?.length > 0 ? (
            <>
              <TouchableOpacity
                onPress={() => setImages(null)}
                style={globalStyles.AS_End_PV_5}>
                <Icon
                  name="cross"
                  size={20}
                  color={colors.backIconColor}
                  type="Entypo"
                />
              </TouchableOpacity>

              <View style={globalStyles.containerArticle}>
                <View style={globalStyles.rowArticle}>
                  <Image
                    style={globalStyles.firstImage}
                    source={
                      images && images.length > 0
                        ? images[0]?.startsWith('http') // Check if the path is a URL
                          ? {uri: images.toString()} // Use the URL if it's a remote image
                          : {uri: images.toString()} // Use the local path directly for local images
                        : null // Fallback to a placeholder if no image is selected
                    }
                  />
                </View>
              </View>
            </>
          ) : null}

          <View style={globalStyles?.MT_20}>
            <TextInput
              style={{
                ...globalStyles.InputTitle,
                borderColor: colors.textinputbordercolor,
                color: colors.textColor,
                backgroundColor: colors.textinputBackgroundcolor,
              }}
              onChangeText={val => setHeadline(val)}
              value={headline}
              placeholder="Write your Headline"
              keyboardType="default"
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>
          <View style={{marginTop: 10}}>
            <TextInput
              style={{
                ...globalStyles.InputTitle,
                borderColor: colors.textinputbordercolor,
                color: colors.textColor,
                backgroundColor: colors.textinputBackgroundcolor,
                height: 200,
                paddingVertical: 10,
                // justifyContent:"center"
              }}
              onChangeText={val => setDescription(val)}
              value={description}
              placeholder="Write your Company Description"
              keyboardType="default"
              multiline
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>

          <View style={globalStyles.IconViewArticles}>
            <Icon
              name="checksquare"
              size={20}
              color={colors.AppmainColor}
              style={{marginRight: 10}}
              type="AntDesign"
            />
            <Text
              style={{...globalStyles.TextArticles, color: colors.textColor}}>
              I confirm that I am authorized to Post this article on Jamia
              Millia Islamia VECOSPACE and if any image is used, I have the
              rights to use the image.
            </Text>
          </View>

          <TouchableOpacity
            style={{
              ...globalStyles.saveButton,
              backgroundColor: colors.AppmainColor,
            }}
            onPress={() => postAdd()}>
            <Text
              style={{
                ...globalStyles.saveButtonText,
                color: colors.ButtonTextColor,
              }}>
              Save
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddUpdatePost;
