import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  Button,
  FlatList,
} from 'react-native';
import globalStyles from '../GlobalCSS';
import Header from '../Header/Header';
import Colors from '../color';
import Icon from '../Icons/Icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ViewCountApi} from '../baseURL/ExperienceList';
import {ApplyJob, baseUrl, DeleteJob, ViewCountJob} from '../baseURL/api';
import {showError} from '../components/Toast';
import {useTheme} from '../../theme/ThemeContext';

const JobDetails = ({navigation, route}) => {
  const {Item = {}, AdditionalData = []} = route.params || {};
  const {isDark, colors, toggleTheme} = useTheme();
  const [userData, setUserData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userTitle, setUserTitle] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [userTitleError, setUserTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);

  console.log('Length of AppliedUserDetail:', Item?.AppliedUserDetail?.length);

  useEffect(() => {
    if (userTitle.trim()) {
      setUserTitleError(false);
    }
    if (userDescription.trim()) {
      setDescriptionError(false);
    }
  }, [userTitle, userDescription]);

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
  // This is use for Count the Jobs Views
  useEffect(() => {
    if (userData) {
      ViewCountApi(ViewCountJob, Item?.id, userData, setLoadingContacts);
    }
  }, [userData]);

  const handleDelete = ({item}) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this Job?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes', // If Yes is pressed, proceed with deletion
          onPress: async () => {
            try {
              const response = await fetch(`${baseUrl}${DeleteJob}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: Item?.id,
                }),
              });

              const data = await response.json();

              if (response.ok) {
                navigation.goBack(); // Navigate back after successful delete
              } else {
                showError('Failed to delete the item.');
              }
            } catch (error) {
              console.error('Delete Error:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleSubmit = async () => {
    let isValid = true;

    // Validation for both fields
    if (!userTitle.trim()) {
      setUserTitleError(true);
      isValid = false;
    } else {
      setUserTitleError(false);
    }

    if (!userDescription.trim()) {
      setDescriptionError(true);
      isValid = false;
    } else {
      setDescriptionError(false);
    }

    if (isValid) {
      try {
        const payload = JSON.stringify({
          applyUserId: userData?.User?.userId,
          applyToId: Item?.UserDetail?.UserId,
          jobId: Item?.id,
          userSubject: userTitle,
          JobDescription: userDescription,
        });
        const response = await fetch(`${baseUrl}${ApplyJob}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: payload,
        });
        // const text = await response.text();
        // console.log('texttexttexttexttexttext', text);
        const data = await response.json();
        console.log('data', data);
        if (response.ok) {
          navigation.goBack();
        }
      } catch (error) {
        console.error('ApplyJob Error:', error);
      }
    }
  };

  const handleApply = () => {
    setIsModalVisible(true);
  };

  const renderItem = ({item}) => {
    // console.log('item ----- >>>', item);

    return (
      <View style={globalStyles.FlatList2}>
        <Image
          style={globalStyles.ImageView}
          source={{uri: item?.ProfilePhoto}}
        />
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              marginBottom: 5,
              color: colors.AppmainColor,
            }}>
            {item?.UserName}
          </Text>
          {item?.JobTitle ? (
            <Text
              style={{
                color: colors.placeholderTextColor,
                fontSize: 12,
                marginTop: 2,
              }}>
              {item?.JobTitle}
            </Text>
          ) : null}

          {item?.CompanyName ? (
            <Text
              style={{
                color: colors.placeholderTextColor,
                fontSize: 12,
                marginTop: 2,
              }}>
              {item?.CompanyName}
            </Text>
          ) : null}

          <Text
            style={{
              color: colors.placeholderTextColor,
              fontSize: 12,
              marginTop: 2,
            }}>
            {item?.UserSubject}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}>
      <Header title="Job's Details" navigation={navigation} />
      <View style={{flex: 1, padding: 10}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {userData?.User?.userId === Item?.UserDetail?.UserId ? (
            <View
              style={{
                marginTop: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: colors.textColor, marginVertical: 5}}>
                This job is posted by you
              </Text>

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('AddJob', {
                      Item: Item,
                    })
                  }>
                  <Icon
                    name="pencil"
                    size={20}
                    color={colors.placeholderTextColor}
                    type="Octicons"
                    style={{paddingHorizontal: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete}>
                  <Icon
                    name="delete"
                    size={20}
                    color={colors.placeholderTextColor}
                    type="MaterialCommunityIcons"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: '500',
                  color: colors.textColor,
                }}>
                {Item?.jobTitle}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.placeholderTextColor,
                  marginTop: 3,
                }}>
                Posted: {Item?.dateAdded}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginRight: 10,
                alignItems: 'center',
              }}>
              <Icon
                name="eye"
                size={20}
                color={colors.placeholderTextColor}
                type="AntDesign"
              />
              <Text style={{color: colors.textColor}}>{Item?.viewStatus}</Text>
            </View>
          </View>

          <View style={{marginTop: 20}}>
            <Text style={{color: colors.placeholdercolor, marginVertical: 5}}>
              Stipend
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 22, color: colors.textColor}}>
                {Item?.minAnnualSalary} -{' '}
              </Text>
              <Text style={{fontSize: 22, color: colors.textColor}}>
                {Item?.maxAnnualSalary}
              </Text>
            </View>
          </View>

          <View
            style={{
              ...globalStyles.headView,
              borderColor: colors.textinputbordercolor,
            }}>
            <Text
              style={{
                ...globalStyles.HeadText,
                color: colors.placeholderTextColor,
              }}>
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

          <View
            style={{
              ...globalStyles.headView,
              borderColor: colors.textinputbordercolor,
            }}>
            <Text
              style={{
                ...globalStyles.HeadText,
                color: colors.placeholderTextColor,
              }}>
              Description
            </Text>
            <Text style={{fontSize: 15, color: colors.textColor}}>
              {Item?.jobDetails}
            </Text>
          </View>

          <View
            style={{
              ...globalStyles.headView,
              borderColor: colors.textinputbordercolor,
            }}>
            <Text
              style={{
                ...globalStyles.HeadText,
                color: colors.placeholderTextColor,
              }}>
              Employer Detail
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 14,
                  color: colors.textColor,
                }}>
                Company:{' '}
              </Text>
              <Text style={{color: colors.textColor}}>
                {Item?.UserDetail?.CompanyName}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 4}}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 14,
                  color: colors.textColor,
                }}>
                Industry:{' '}
              </Text>
              <Text style={{color: colors.textColor}}>
                {Item?.companyTypeName}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 4}}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 14,
                  color: colors.textColor,
                }}>
                Job Location:{' '}
              </Text>
              <Text style={{color: colors.textColor}}>{Item?.jobLocation}</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 4}}>
              <Text style={{fontWeight: '700', color: colors.textColor}}>
                Postal Code:{' '}
              </Text>
              <Text style={{color: colors.textColor}}>{Item?.postalCode}</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 4}}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 14,
                  color: colors.textColor,
                }}>
                Address:{' '}
              </Text>
              <Text style={{color: colors.textColor}}>
                {Item?.companyAddress}
              </Text>
            </View>
          </View>
          {userData?.User?.userId ===
          Item?.UserDetail?.UserId ? null : Item?.IsApplied == false ? (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.AppmainColor,
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  alignItems: 'center',
                }}
                onPress={handleApply}>
                <Text
                  style={{color: colors.ButtonTextColor, fontWeight: '900'}}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: colors.AppmainColor,
                  marginVertical: 5,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                You have already applied for this job
              </Text>
            </View>
          )}

          {userData?.User?.userId === Item?.UserDetail?.UserId ? (
            <View
              style={{
                ...globalStyles.headView,
                borderColor: colors.textinputbordercolor,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...globalStyles.HeadText,
                    color: colors.AppmainColor,
                  }}>
                  {Item?.AppliedUserDetail?.length} users have applied for this
                  job
                </Text>
              </View>
              <FlatList
                data={Item?.AppliedUserDetail}
                renderItem={renderItem}
                keyExtractor={item => item?.id}
              />
            </View>
          ) : null}

          <View
            style={{
              ...globalStyles.headView,
              borderColor: colors.textinputbordercolor,
            }}>
            <Text
              style={{
                ...globalStyles.HeadText,
                color: colors.placeholderTextColor,
              }}>
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

          {/* Modal for Apply */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}>
            <View style={globalStyles.modalOverlay}>
              <View
                style={{
                  ...globalStyles.modalContent,
                  backgroundColor: colors.modelBackground,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: colors.textColor,
                  }}>
                  Apply
                </Text>
                <Text style={{marginVertical: 10, color: colors.textColor}}>
                  Please provide your details
                </Text>

                <TextInput
                  placeholderTextColor={colors.placeholderTextColor}
                  placeholder="Your Title"
                  value={userTitle}
                  onChangeText={setUserTitle}
                  style={{
                    ...globalStyles.inputField,
                    borderColor: userTitleError
                      ? 'red'
                      : colors.textinputbordercolor,
                    color: colors.textColor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                />
                <TextInput
                  textAlignVertical="top"
                  textAlign="left"
                  placeholder="Your Description"
                  placeholderTextColor={colors.placeholderTextColor}
                  value={userDescription}
                  onChangeText={setUserDescription}
                  style={[
                    globalStyles.inputField,
                    {
                      height: 100,
                      borderColor: descriptionError
                        ? 'red'
                        : colors.textinputbordercolor,
                      color: colors.textColor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    },
                  ]}
                  multiline
                />

                <Button
                  title="Submit"
                  color={colors.AppmainColor}
                  onPress={handleSubmit}
                />

                <TouchableOpacity
                  style={{marginTop: 10}}
                  onPress={() => setIsModalVisible(false)}>
                  <Text style={{color: colors.AppmainColor}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default JobDetails;
