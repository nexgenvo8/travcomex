import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import globalStyles from '../GlobalCSS';
import Header from '../Header/Header';
import Colors from '../color';
import Icon from '../Icons/Icons';
import {
  adddeletebookmark,
  adddeleteintrest,
  baseUrl,
  ViewCountIntern,
} from '../baseURL/api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {ViewCountApi} from '../baseURL/ExperienceList';
import {useTheme} from '../../theme/ThemeContext';

const IntershipDetails = ({navigation, route}) => {
  const {Item = {}} = route.params || {};
  const [userData, setUserData] = useState(null);
  const {isDark, colors, toggleTheme} = useTheme();
  const [applyValue, setApplyValue] = useState(Item?.isApply || false);
  const [bookMarkValue, setBookMarkValue] = useState(Item?.isBookmark || false);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // console.log('Item --------->>>>>>>', Item);

  useEffect(() => {
    UserValue();
  }, []);

  const UserValue = async () => {
    try {
      const userDta = await AsyncStorage.getItem('userData');
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    } catch (error) {
      console.log('Error', error);
    }
  };

  // This is use for Count the KnowledgeHub Views
  useEffect(() => {
    if (userData) {
      ViewCountApi(ViewCountIntern, Item?.id, userData, setLoadingContacts);
    }
  }, [userData]);

  // Sync state when Item changes
  useEffect(() => {
    setApplyValue(Item?.isApply || false);
    setBookMarkValue(Item?.isBookmark || false);
  }, [Item]);

  const handleBookMark = async () => {
    setBookMarkValue(prev => !prev);
    try {
      const response = await fetch(`${baseUrl}${adddeletebookmark}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          projectId: Item?.id,
        }),
      });
      console.log('Missing ');

      const data = await response.json();
      console.log('ADd Like Data ----', data);

      if (response.ok) {
        setBookMarkValue(!bookMarkValue);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  const handleApplyNow = async () => {
    setApplyValue(prev => !prev);
    try {
      const response = await fetch(`${baseUrl}${adddeleteintrest}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          projectId: Item?.id,
        }),
      });
      console.log('Missing ');

      const data = await response.json();
      console.log('ADd Like Data ----', data);

      if (response.ok) {
        setApplyValue(!applyValue);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  //    const fetchAddLike = async ({item}) => {
  //       if (
  //         !itemOfPostForLike ||
  //         !itemOfPostForLike.id ||
  //         !itemOfPostForLike.PostType
  //       ) {
  //         console.error('Missing postId or postType in item:', item);
  //         return;
  //       }
  //       console.log('Missing ');

  //       try {
  //         const response = await fetch('http://154.210.160.217:8081/api/addlike', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             postId: itemOfPostForLike.id,
  //             postType: itemOfPostForLike.PostType,
  //             userId: userData?.User?.userId,
  //           }),
  //         });
  //         console.log('Missing ');

  //         const data = await response.json();
  //         console.log('ADd Like Data ----', data);

  //         if (response.ok) {
  //           setAddLike(data);
  //           setItemOfPostForLike([]);
  //           setRefresh(!refresh);
  //         }
  //       } catch (error) {
  //         Alert.alert('Error', 'Failed to fetch posts. Please try again later.');
  //         console.error('Fetch Error:', error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}>
      <Header title="Intership Details" navigation={navigation} />
      <View style={{flex: 1, padding: 10}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '80%'}}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: '500',
                  color: colors.textColor,
                }}>
                {Item?.projectTitle}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.placeholderTextColor,
                  marginTop: 3,
                }}>
                Posted: {Item?.postedDate}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Icon
                  name="eye"
                  size={20}
                  color={colors.backIconColor}
                  type="AntDesign"
                />
                <Text style={{color: colors.textColor}}>
                  {Item?.projectViews}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="bookmark"
                  size={18}
                  color={colors.backIconColor}
                  type="FontAwesome"
                />
                <Text style={{color: colors.textColor}}>
                  {' '}
                  {Item?.totalBookmark}
                </Text>
              </View>
            </View>
          </View>

          <View style={{flex: 0.15, flexDirection: 'row', marginTop: 20}}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.AppmainColor,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 20,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '800',
                  color: colors.textColor,
                }}>
                {Item.proDuration}
              </Text>
              <Text style={{fontSize: 13, color: colors.textColor}}>
                DURATION
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.placeholderTextColor,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: isDark ? 'black' : colors.textColor,
                }}>
                {Item.proStartDate}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: isDark ? 'black' : colors.textColor,
                }}>
                START DATE
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.textinputBackgroundcolor,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: colors.textColor,
                }}>
                {Item.proNature}
              </Text>
              <Text style={{fontSize: 13, color: colors.textColor}}>
                WORKING HOURS
              </Text>
            </View>
          </View>

          <View style={{marginTop: 20}}>
            <Text
              style={{color: colors.placeholderTextColor, marginVertical: 5}}>
              Stipend
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 22, color: colors.textColor}}>
                {Item?.proCurrency}{' '}
              </Text>
              <Text style={{fontSize: 22, color: colors.textColor}}>
                {Item?.proEstimatedBudget}
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderColor: colors.textinputbordercolor,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{}}>
              <Text
                style={{
                  color: colors.placeholderTextColor,
                  marginVertical: 5,
                  fontSize: 16,
                }}>
                Work Location
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  color: colors.AppmainColor,
                  fontWeight: '600',
                }}>
                {Item?.proWorkLocation}{' '}
              </Text>
            </View>
            <Icon
              name="location"
              size={28}
              color={colors.backIconColor}
              type="Ionicons"
            />
          </View>

          <View style={globalStyles.headView}>
            <Text style={{...globalStyles.HeadText, color: colors.textColor}}>
              Skills
            </Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {Item?.proSkills
                ?.split(',')
                .filter(skill => skill.trim() !== '') // Remove empty strings
                .map((skill, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.textinputBackgroundcolor,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      margin: 3,
                    }}>
                    <Text style={{fontSize: 14, color: colors.textColor}}>
                      {skill.trim()}
                    </Text>
                  </View>
                ))}
            </View>
          </View>

          <View style={globalStyles.headView}>
            <Text style={{...globalStyles.HeadText, color: colors.textColor}}>
              Description
            </Text>
            <Text style={{color: colors.textColor}}>
              {Item?.projectDetails}
            </Text>
          </View>

          <View style={globalStyles.headView}>
            <Text style={{...globalStyles.HeadText, color: colors.textColor}}>
              Posted By
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={
                  Item?.UserDetail?.ProfilePhoto
                    ? {uri: Item?.UserDetail?.ProfilePhoto}
                    : require('../../assets/placeholderprofileimage.png')
                }
                style={{
                  width: 100,
                  height: 100,
                  borderWidth: 3,
                  borderRadius: 50,
                  borderColor: 'yellow',
                  marginRight: 10,
                }}
              />
              <View>
                <Text style={{fontSize: 16, color: colors.AppmainColor}}>
                  {Item?.UserDetail?.UserName}
                </Text>
                <Text style={{fontSize: 13, color: colors.textColor}}>
                  {Item?.UserDetail?.JobTitle}
                </Text>

                <Text style={{fontSize: 13, color: colors.textColor}}>
                  {Item?.UserDetail?.CompanyName}
                </Text>
              </View>
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            {/* <TouchableOpacity
              style={{
                ...globalStyles.saveButton,
                flex: 1,
                marginRight: 10,
                flexDirection: 'row',
              }}
              onPress={() => {
                handleApplyNow()
              }}>
              <Icon name="check" size={28} color="white" type="FontAwesome" />
              <Text style={{...globalStyles.saveButtonText, paddingLeft: 5}}>
                {applyValue === true || Item?.isApply == false  ? 'Apply now' : 'Applied'}
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={{
                ...globalStyles.saveButton,
                flex: 1,
                marginRight: 10,
                flexDirection: 'row',
                backgroundColor: colors.AppmainColor,
              }}
              onPress={handleApplyNow}>
              <Icon name="check" size={28} color={colors.ButtonTextColor} />
              <Text
                style={{
                  ...globalStyles.saveButtonText,
                  paddingLeft: 5,
                  color: colors.ButtonTextColor,
                }}>
                {applyValue ? 'Applied' : 'Apply Now'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...globalStyles.saveButton,
                flex: 1,
                backgroundColor: bookMarkValue
                  ? '#d83f28'
                  : colors.AppmainColor,
                flexDirection: 'row',
              }}
              onPress={handleBookMark}>
              <Icon
                name={bookMarkValue ? 'bookmark' : 'bookmark-o'}
                size={28}
                color={colors.ButtonTextColor}
                type="FontAwesome"
              />
              <Text
                style={{
                  ...globalStyles.saveButtonText,
                  paddingLeft: 5,
                  color: colors.ButtonTextColor,
                }}>
                {bookMarkValue ? 'Remove Bookmark' : 'Add Bookmark'}
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={{
                ...globalStyles.saveButton,
                flex: 1,
                backgroundColor:
                  bookMarkValue || Item?.isBookmark
                    ? '#d83f28'
                    : Colors.main_primary, // Change color based on bookmark state
                flexDirection: 'row',
              }}
              onPress={() => handleBookMark()}>
              <Icon
                name={
                  bookMarkValue == true || Item?.isBookmark ? 'bookmark' : 'bookmark-o'
                } // Show appropriate icon
                size={28}
                color="white"
                type="FontAwesome"
              />
              <Text style={{...globalStyles.saveButtonText, paddingLeft: 5}}>
                {bookMarkValue === true || Item?.isBookmark
                  ? 'Remove Bookmark'
                  : ' Add Bookmark'}
              </Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default IntershipDetails;
