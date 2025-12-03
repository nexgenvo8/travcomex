import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
} from 'react-native';
import Colors from './color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PencilIcon from 'react-native-vector-icons/Octicons';
import DownIcon from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from '../screen/Icons/Icons';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import globalStyles from './GlobalCSS';
import {
  baseUrl,
  DeleteEducation,
  DeleteExploring,
  DeleteInterest,
  DeleteProfessionalExp,
  DeleteSkills,
  ListEducation,
  ListExploring,
  Listinterest,
  ListProfessionalExp,
  ListSkills,
  Profile_Detail,
  UpdateBasicDetails,
  UpdateExplorinn,
  UpdateInterest,
  UpdateSkills,
} from './baseURL/api';
import {showError, showSuccess} from './components/Toast';
import CommonLoader from './components/CommonLoader';
import {useTheme} from '../theme/ThemeContext';
import {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {universityFullName, universityName} from './constants';

const Profile = ({navigation, tabBarVisible}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const isFocused = useIsFocused();
  const [number, onChangeNumber] = useState('');
  const [languages, setLanguages] = useState('');
  const [interests, setInterests] = useState('');
  const [jmi, setJmi] = useState('');
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [modalVisible5, setModalVisible5] = useState(false);
  const [keyValue, setKeyValue] = useState([]);
  const [languagesValue, setLanguagesValue] = useState([]);
  const levels = ['Beginner', 'Intermediate', 'Advanced']; // Example levels
  const [interestsValue, setInterestsValue] = useState([]);
  const [jmiValue, setJmiValue] = useState([]);
  const [languageLastValue, setLanguageLastValue] = useState('');
  const [languagesLevel, setLanguagesLevel] = useState('');
  const options = ['Basic', 'Good', 'Fluent', 'First Language'];
  const [selectedValue, setSelectedValue] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [apiValue, setApiValue] = useState([]);
  const [interestsValueApi, setInterestsValueApi] = useState([]);
  const [skillsValueApi, setakillsValueApi] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [listEducation, setListEducation] = useState([]);
  const [listExperience, setListExperience] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const currentOffset = event.contentOffset.y;
      if (currentOffset > scrollY.value && currentOffset > 50) {
        tabBarVisible.value = false;
      } else if (currentOffset < scrollY.value) {
        tabBarVisible.value = true;
      }
      scrollY.value = currentOffset;
    },
  });

  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem('userData');
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };

  useEffect(() => {
    UserValue();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectOption = option => {
    setSelectedValue(option);
    setIsOpen(false);
  };

  const [editableText, setEditableText] = useState();
  console.log('editableText', editableText);

  const handleSave = text => {
    setModalVisible1(false);
  };

  const handleEdit = text => {
    setEditableText(text);
  };
  const handleKeySkill = text => {
    onChangeNumber(text);
  };
  const handleLangauge = text => {
    setLanguages(text);
  };
  const handInterests = text => {
    setInterests(text);
  };
  const handJmi = text => {
    setJmi(text);
  };

  const handleSaveKeySkill = () => {
    const trimmed = number.trim();
    if (!trimmed) return;

    const exists = keyValue.some(
      skill => skill.skillText?.toLowerCase() === trimmed.toLowerCase(),
    );

    if (exists) return;

    const newSkill = {skillText: trimmed};
    setKeyValue(prev => [...prev, newSkill]);
    setakillsValueApi(prev => [...prev, newSkill]);
    onChangeNumber('');
  };

  const handleSaveLangauge = () => {
    if (languages.trim()) {
      setLanguagesValue(prevState => [...prevState, languages]);
      setLanguages([]);
    } else {
    }
  };
  const handleSaveLangauge1 = () => {
    setLanguageLastValue(languages);
    setLanguagesLevel(selectedValue);
  };
  const handleSaveInterests = () => {
    const trimmed = interests.trim();
    if (trimmed) {
      const newItem = {
        id: Date.now(),
        interestText: trimmed,
      };

      setInterestsValue(prev => [...prev, newItem]);
      setInterestsValueApi(prev => [...prev, newItem]);
      setInterests('');
    } else {
      showError('Please enter a value before adding.');
    }
  };
  const handleSaveJmi = () => {
    if (jmi.trim()) {
      const newItem = {
        id: Date.now(),
        exploringText: jmi.trim(),
      };

      setJmiValue(prevState => [...prevState, newItem]);
      setApiValue(prevState => [...prevState, newItem]);
      setJmi('');
      setModalVisible3(false);
    } else {
      showError('Please enter a value before adding.');
    }
  };

  useEffect(() => {
    if (userData?.User?.userId && isFocused) {
      fetchExploringListUpdate();
      InterestsList();
      SkillsList();
      getEducationList();
      getExperienceList();
    }
  }, [userData?.User?.userId, isFocused]);

  const fetchExploringListUpdate = async () => {
    try {
      const response = await fetch(`${baseUrl}${ListExploring}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
        }),
      });

      const data = await response.json();
      console.log('Listing exploring data ----', data);

      if (response.ok) {
        const exploringData = data.Data;
        setJmiValue(exploringData);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchExploringAdd_Update = async () => {
    const formattedApiValue = apiValue.map(item =>
      typeof item === 'object' ? item.exploringText : item,
    );

    const payload = {
      userId: userData?.User?.userId,
      exploring: formattedApiValue,
    };

    try {
      const response = await fetch(`${baseUrl}${UpdateExplorinn}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse JSON:', text);
        return;
      }
      if (response.ok) {
        console.log('Add exploring success:', data);
        setModalVisible4(false);
        fetchExploringListUpdate();
      } else {
        console.error('Server responded with error:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExploringDelete = async item => {
    if (!item) return;
    if (!item.id || item.id.toString().length > 12) {
      setJmiValue(prev => prev.filter(i => i !== item));
      setApiValue(prev => prev.filter(i => i !== item));
      return;
    }

    try {
      const response = await fetch(`${baseUrl}${DeleteExploring}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: item.id}),
      });

      const data = await response.json();

      if (response.ok && data.Status === 1) {
        setJmiValue(prev => prev.filter(i => i.id !== item.id));
        setApiValue(prev => prev.filter(i => i.id !== item.id));
        showSuccess('Item removed successfully.');
      } else {
        console.error('Delete failed:', data);
      }
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };

  const handleDeleteJmi = () => {
    const filteredJmiValue = jmiValue.filter(item => typeof item === 'object');
    setJmiValue(filteredJmiValue);
  };
  const InterestsList = async () => {
    try {
      const response = await fetch(`${baseUrl}${Listinterest}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: userData?.User?.userId}),
      });

      const data = await response.json();
      if (response.ok) {
        setInterestsValue(data.Data || []);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const addInterest = async () => {
    try {
      const payload = {
        userId: userData?.User?.userId,
        interest: interestsValueApi.map(i => i.interestText),
      };

      const response = await fetch(`${baseUrl}${UpdateInterest}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      try {
        const data = JSON.parse(text);
        console.log('Add Interest data ----', data);

        if (response.ok) {
          showSuccess(data.Message);
          setModalVisible5(false);
          setInterests('');
          setInterestsValueApi([]);
          InterestsList();
        } else {
          console.error('Server responded with error:', data);
        }
      } catch (parseError) {
        console.error('Non-JSON response:', text);
      }
    } catch (error) {
      console.error('Fetch Error Add Interest:', error);
    } finally {
      setLoading(false);
    }
  };
  const deleteInterest = async item => {
    if (!item) return;

    // 🔒 If ID is fake (from Date.now), skip backend call
    const isFakeId = item.id && item.id.toString().startsWith('175'); // or just use: item.id > 1000000000000
    if (isFakeId) {
      console.warn('Skipping delete for unsaved item:', item);

      // Just remove from local state
      setInterestsValue(prev => prev.filter(i => i.id !== item.id));
      setInterestsValueApi(prev =>
        prev.filter(i => i.interestText !== item.interestText),
      );
      return;
    }

    try {
      const response = await fetch(`${baseUrl}${DeleteInterest}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: item.id}), // ✅ real ID only
      });

      const data = await response.json();
      console.log('Delete response:', data);

      if (response.ok && data.Status === 1) {
        setInterestsValue(prev => prev.filter(i => i.id !== item.id));
        setInterestsValueApi(prev => prev.filter(i => i.id !== item.id));
      } else {
        console.error('Delete failed:', data);
      }
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };
  const deleteInterests = () => {
    const filteredJmiValue = interestsValue.filter(
      item => typeof item === 'object',
    );
    setInterestsValue(filteredJmiValue);
  };
  const SkillsList = async () => {
    try {
      const response = await fetch(`${baseUrl}${ListSkills}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
        }),
      });

      const data = await response.json();
      console.log('Listing Skills data ----', data);

      if (response.ok) {
        const InterestsData = data.Data;
        setKeyValue(InterestsData);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const addSkills = async () => {
    try {
      const response = await fetch(`${baseUrl}${UpdateSkills}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          skills: skillsValueApi.map(item =>
            typeof item === 'object' ? item.skillText : item,
          ),
          //skills: skillsValueApi,
        }),
      });

      const responseText = await response.text();
      console.log('Raw Response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return;
      }

      if (response.ok) {
        showSuccess('Skills updated successfully');
        setModalVisible2(false);
        setakillsValueApi([]);
        await SkillsList();
      } else {
        console.error('Server error:', data);
      }
    } catch (error) {
      console.error('Fetch Error Failed to add Skills:', error);
    } finally {
      setLoading(false);
    }
  };
  const deleteSkills = async item => {
    if (!item || !item.id) {
      console.warn('Deleting local-only skill:', item);
      setKeyValue(prev => prev.filter(i => i.skillText !== item.skillText));
      return;
    }

    try {
      const response = await fetch(`${baseUrl}${DeleteSkills}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: item.id}),
      });

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (response.ok) {
        setKeyValue(prev => prev.filter(i => i.id !== item.id));
        showSuccess('Item deleted successfully.');
      } else {
        console.error('Server error:', data);
      }
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };
  const closeSkillsModal = () => {
    const filteredJmiValue = keyValue.filter(item => typeof item === 'object');
    setKeyValue(filteredJmiValue);
  };

  const selectImage = async () => {
    try {
      const pickedImage = await ImagePicker.openPicker({
        width: 300, // Desired width
        height: 300, // Desired height
        cropping: true, // Enable cropping
        cropperCircleOverlay: true, // Circular cropping overlay
        includeBase64: true, // Include Base64 in the response
      });
      // setImage(pickedImage.path); // Set the selected image path

      await UpdateProfilePhotoApi({base64Image: pickedImage.data});
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };
  const GetProfileData = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch(`${baseUrl}${Profile_Detail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfileData(data.Data);
      } else {
      }
    } catch (error) {
      showError('Failed to fetch profile data. Please try again later.');
      console.error('Fetch Error:', error);
    } finally {
      setInitialLoading(false);
    }
  };
  const UpdateProfilePhotoApi = async ({base64Image}) => {
    try {
      const response = await fetch(`${baseUrl}${UpdateBasicDetails}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          profileImage: base64Image,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Profile photo updated successfully:', data);
        await GetProfileData();
      } else {
        showError(data.message || 'Failed to update profile photo');
      }
    } catch (error) {
      showError('Failed to update profile photo. Please try again later.');
      console.error('Fetch Error:', error);
    }
  };
  const UpdateTagLine = async ({base64Image}) => {
    try {
      const response = await fetch(`${baseUrl}${UpdateBasicDetails}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          taglineText: editableText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Profile Tag updated', data);
        await GetProfileData();
        setModalVisible1(!!modalVisible1);
      } else {
        showError('Error', data.message || 'Failed to update profile tag');
      }
    } catch (error) {
      console.error('Fetch Error UpdateTagLine:', error);
    }
  };
  // useEffect(() => {
  //   if (userData?.User?.userId) {
  //     GetProfileData();
  //   }
  // }, [userData?.User?.userId]);
  useFocusEffect(
    useCallback(() => {
      if (userData?.User?.userId) {
        GetProfileData();
      }
    }, [userData?.User?.userId]),
  );
  // useFocusEffect(
  //   useCallback(() => {
  //     GetProfileData();
  //   }, []),
  // );
  useEffect(() => {
    if (profileData?.taglineText) {
      setEditableText(profileData.taglineText);
    }
  }, [profileData]);

  // Education Api's
  const getEducationList = async () => {
    try {
      const response = await fetch(`${baseUrl}${ListEducation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Education List ---', data);
        // setListEducation(data);
        setListEducation(data?.Data);
      } else {
        showError(data.message || 'Failed to Education List');
      }
    } catch (error) {
      console.error('Fetch Error Education List:', error);
    }
  };
  const handleDeleteEducation = async ({item}) => {
    try {
      const response = await fetch(`${baseUrl}${DeleteEducation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: item?.Id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        getEducationList();
      }
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };
  const renderEducationList = ({item}) => {
    return (
      <View
        style={{
          ...globalStyles.listEucation,
          backgroundColor: colors.textinputBackgroundcolor,
        }}>
        <View>
          <Text
            style={{fontSize: 16, fontWeight: '600', color: colors.textColor}}>
            {item?.UniversitySchool}
          </Text>
          <Text style={{color: colors.textColor}}>
            {item.Degree} {item.FieldOfStudy}
          </Text>
          <View style={globalStyles.flexRow}>
            <Text style={{color: colors.textColor}}>
              {item.FromMonth} {item.FromYear} -
            </Text>
            <Text style={{color: colors.textColor}}>
              {item.ToMonth} {item.ToYear}
            </Text>
          </View>
        </View>

        <View style={globalStyles.flexRow}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddEducation', {
                Item: item,
              })
            }>
            <Icon
              name="pencil"
              size={15}
              style={{paddingHorizontal: 5}}
              color={colors.placeholderTextColor}
              type="Octicons"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleDeleteEducation({item: item})}>
            <Icon
              name="delete"
              size={15}
              color={colors.placeholderTextColor}
              type="MaterialCommunityIcons"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  // Experience Api's
  const getExperienceList = async () => {
    try {
      const response = await fetch(`${baseUrl}${ListProfessionalExp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Experience List ---', data);

        setListExperience(data.Data);
      } else {
        showError(data.message || 'Failed to Education List');
      }
    } catch (error) {
      console.error('Fetch Error Education List:', error);
    }
  };
  const handleDeleteExperience = async ({item}) => {
    try {
      const response = await fetch(`${baseUrl}${DeleteProfessionalExp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: item?.Id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        getExperienceList();
      }
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };
  const renderExperienceList = ({item}) => {
    return (
      <View
        style={{
          ...globalStyles.listEucation,
          backgroundColor: colors.textinputBackgroundcolor,
        }}>
        <View>
          <Text
            style={{fontSize: 16, fontWeight: '600', color: colors.textColor}}>
            {item?.JobTitle}
          </Text>
          <Text style={{color: colors.textColor}}>{item?.CompanyName}</Text>
          <View style={globalStyles.flexRow}>
            <Text style={{color: colors.textColor}}>
              {item.FromMonth} {item.FromYear} -
            </Text>
            <Text style={{color: colors.textColor}}>
              {item.ToMonth} {item.ToYear} | {item.TotalYear}
            </Text>
          </View>
          <Text style={{color: colors.textColor}}>{item.JobLocation}</Text>
        </View>
        <View style={globalStyles.flexRow}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddExperience', {
                Item: item,
              })
            }>
            <Icon
              name="pencil"
              size={15}
              style={{paddingHorizontal: 5}}
              color={colors.placeholderTextColor}
              type="Octicons"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteExperience({item: item})}>
            <Icon
              name="delete"
              size={15}
              color={colors.placeholderTextColor}
              type="MaterialCommunityIcons"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const totalSections = 7;
  const completedSections =
    (profileData?.profilePhoto ? 1 : 0) +
    (profileData?.firstName && profileData?.lastName ? 1 : 0) +
    (profileData?.taglineText ? 1 : 0) +
    (listExperience?.length > 0 ? 1 : 0) +
    (listEducation?.length > 0 ? 1 : 0) +
    (keyValue?.length > 0 ? 1 : 0) +
    (interestsValue?.length > 0 ? 1 : 0);

  const completionPercentage = Math.round(
    (completedSections / totalSections) * 100,
  );
  if (initialLoading) {
    return <CommonLoader visible={true} />;
  }
  return (
    <SafeAreaView
      style={{
        ...globalStyles?.SafeAreaView,
        backgroundColor: colors.background,
      }}>
      <View style={globalStyles?.FX_1_BG_White}>
        <ScrollView
          // onScroll={scrollHandler}
          // scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={{flex: 0.9}}>
          <View style={styles.profileSection}>
            <View>
              <Image
                style={styles.profileSectionImg}
                source={
                  profileData?.profilePhoto
                    ? {uri: profileData.profilePhoto}
                    : require('../assets/placeholderprofileimage.png')
                }
              />
              <PencilIcon
                onPress={selectImage}
                name="device-camera"
                size={22}
                style={{alignSelf: 'flex-end', bottom: 20, right: 10}}
                color={colors.placeholderTextColor}
              />
            </View>

            <View style={styles.profileFirstView}>
              <Text style={{fontSize: 20, color: colors.textColor}}>
                {profileData?.firstName} {profileData?.lastName}
              </Text>
              <PencilIcon
                onPress={() => navigation.navigate('EditProfileDetails')}
                name="pencil"
                size={20}
                style={{left: 10}}
                color={colors.placeholderTextColor}
              />
            </View>
            <Text style={{...styles.titleText, color: colors.textColor}}>
              {profileData?.jobTitle}
            </Text>
            <Text style={{...styles.titleText, color: colors.textColor}}>
              DeBox Global
            </Text>
            <Text style={{...styles.titleText, color: colors.textColor}}>
              {profileData?.locationName},{profileData?.cityName},
              {profileData?.countryName}
            </Text>
          </View>

          <View style={{padding: 15}}>
            <Text
              style={{fontSize: 16, marginBottom: 5, color: colors.textColor}}>
              Profile Completion: {completionPercentage}%
            </Text>
            <View
              style={{
                height: 10,
                width: '100%',
                backgroundColor: '#e0e0e0',
                borderRadius: 5,
                overflow: 'hidden',
              }}>
              <View
                style={{
                  height: '100%',
                  width: `${completionPercentage}%`,
                  backgroundColor: colors.AppmainColor,
                }}
              />
            </View>
          </View>

          <View
            style={{
              ...styles.editView,
              borderColor: colors.textinputbordercolor,
            }}>
            <Text style={{...styles.editText, color: colors.textColor}}>
              {profileData?.taglineText}
            </Text>

            <PencilIcon
              onPress={() => setModalVisible1()}
              name="pencil"
              size={20}
              color={colors.placeholderTextColor}
            />
          </View>

          <View
            style={{
              ...globalStyles.sectionView,
              borderBottomWidth: 0,
              backgroundColor: colors.textinputBackgroundcolor,
            }}>
            <Text
              style={{...globalStyles.sectionText, color: colors.textColor}}>
              Professional experience
            </Text>
            <PencilIcon
              onPress={() => navigation.navigate('AddExperience')}
              name="plus"
              size={22}
              color={colors.placeholderTextColor}
            />
          </View>
          <FlatList
            data={listExperience}
            keyExtractor={item => item.Id.toString()}
            renderItem={renderExperienceList}
          />

          <View
            style={{
              ...globalStyles.sectionView,
              backgroundColor: colors.textinputBackgroundcolor,
            }}>
            <Text
              style={{...globalStyles.sectionText, color: colors.textColor}}>
              Educational background
            </Text>
            <PencilIcon
              onPress={() => navigation.navigate('AddEducation')}
              name="plus"
              size={22}
              color={colors.placeholderTextColor}
            />
          </View>
          <FlatList
            data={listEducation}
            keyExtractor={item => item.Id.toString()}
            renderItem={renderEducationList}
          />

          <View
            style={{
              ...styles.skillMainView,
              borderColor: colors.textinputbordercolor,
            }}>
            <TouchableOpacity
              hitSlop={20}
              style={styles.secongSkillView}
              onPress={() => setModalVisible2()}>
              <Text
                style={{...globalStyles.sectionText, color: colors.textColor}}>
                Key Skills
              </Text>
              <PencilIcon
                name="plus"
                size={20}
                color={colors.placeholderTextColor}
              />
            </TouchableOpacity>
            <View>
              {keyValue.length > 0 ? (
                <View style={styles.skillValueMainView}>
                  {keyValue.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        ...styles.skllSecondView,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}>
                      <Text
                        style={{...styles.skillText, color: colors.textColor}}>
                        {typeof item === 'object' ? item.skillText : item}
                      </Text>

                      <TouchableOpacity
                        style={{paddingLeft: 2}}
                        onPress={() => {
                          deleteSkills(item);
                        }}>
                        <Icon
                          name="cross"
                          size={15}
                          color={colors.backIconColor}
                          type="Entypo"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          <View
            style={{
              ...styles.skillMainView,
              borderColor: colors.textinputbordercolor,
            }}>
            <TouchableOpacity
              onPress={() => setModalVisible4()}
              style={styles.secongSkillView}>
              <Text
                style={{...globalStyles.sectionText, color: colors.textColor}}>
                What am I exploring on {universityFullName}
              </Text>
              <PencilIcon
                name="plus"
                size={20}
                color={colors.placeholderTextColor}
              />
            </TouchableOpacity>
            <View>
              {jmiValue.length > 0 ? (
                <View style={styles.skillValueMainView}>
                  {jmiValue.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        ...styles.skllSecondView,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}>
                      <Text
                        style={{...styles.skillText, color: colors.textColor}}>
                        {typeof item === 'object' ? item.exploringText : item}
                      </Text>
                      <TouchableOpacity
                        style={{paddingLeft: 2}}
                        onPress={() => {
                          fetchExploringDelete(item);
                        }}>
                        <Icon
                          name="cross"
                          size={15}
                          color={colors.backIconColor}
                          type="Entypo"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          <View
            style={{
              ...styles.skillMainView,
              borderColor: colors.textinputbordercolor,
              marginBottom: 40,
            }}>
            <TouchableOpacity
              onPress={() => setModalVisible5()}
              style={styles.secongSkillView}>
              <Text
                style={{...globalStyles.sectionText, color: colors.textColor}}>
                Interests
              </Text>
              <PencilIcon
                name="plus"
                size={20}
                color={colors.placeholderTextColor}
              />
            </TouchableOpacity>

            <View>
              {interestsValue.length > 0 ? (
                <View style={styles.skillValueMainView}>
                  {interestsValue.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        ...styles.skllSecondView,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}>
                      <Text
                        style={{...styles.skillText, color: colors.textColor}}>
                        {typeof item === 'object' ? item.interestText : item}
                      </Text>

                      <TouchableOpacity
                        style={{paddingLeft: 2}}
                        onPress={() => {
                          deleteInterest(item);
                        }}>
                        <Icon
                          name="cross"
                          size={15}
                          color={colors.backIconColor}
                          type="Entypo"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={{color: colors.textColor}}>No data found</Text>
              )}
            </View>
          </View>

          {/* this modal is use for add Title of user */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible1}
            onRequestClose={() => {
              setModalVisible1(!modalVisible1);
            }}>
            <View style={styles.centeredView}>
              <View
                style={{
                  ...styles.modalView,
                  flex: 0.6,
                  padding: 20,
                  backgroundColor: colors.modelBackground,
                }}>
                <TouchableOpacity
                  hitSlop={10}
                  onPress={() => {
                    setModalVisible1(!!modalVisible1);
                  }}
                  style={{alignSelf: 'flex-end'}}>
                  <Icon
                    name="cross"
                    size={20}
                    color={colors.backIconColor}
                    type="Entypo"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    alignItems: 'center',
                    // backgroundColor: '',
                    // borderBottomWidth: 0.5,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      padding: 15,
                      fontWeight: '700',
                      color: colors.textColor,
                    }}>
                    Abouts
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    marginBottom: 10,
                    borderWidth: 0.3,
                    margin: 20,
                  }}>
                  <TextInput
                    style={{
                      ...styles.textInput,
                      textAlignVertical: 'top',
                      borderColor: colors.textinputbordercolor,
                      color: colors.textColor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                    value={editableText}
                    onChangeText={text => handleEdit(text)}
                    multiline
                  />
                </View>

                <TouchableOpacity
                  onPress={UpdateTagLine}
                  style={{
                    ...styles.save,
                    backgroundColor: colors.AppmainColor,
                  }}>
                  <Text
                    style={{...styles.saveText, color: colors.ButtonTextColor}}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* this modal is use for add Skills */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible2}
            onRequestClose={() => {
              setModalVisible2(!modalVisible2);
              closeSkillsModal();
            }}>
            <View style={styles.centeredView}>
              <View
                style={{
                  ...styles.modalView,
                  flex: 0.6,
                  padding: 20,
                  backgroundColor: colors.modelBackground,
                }}>
                <TouchableOpacity
                  hitSlop={20}
                  onPress={() => {
                    setModalVisible2(!!modalVisible2);
                    closeSkillsModal();
                  }}
                  style={{alignSelf: 'flex-end'}}>
                  <Icon
                    name="cross"
                    size={20}
                    color={colors.backIconColor}
                    type="Entypo"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    alignItems: 'center',
                    borderColor: colors.textinputbordercolor,
                    borderBottomWidth: 0.5,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      padding: 15,
                      fontWeight: '700',
                      color: colors.textColor,
                    }}>
                    Key Skills
                  </Text>
                </View>

                <View
                  style={{
                    //flex: 1,
                    // marginBottom: 10,
                    //margin: 20,
                    marginVertical: 20,
                    flexDirection: 'row',
                  }}>
                  <TextInput
                    style={{
                      ...styles.textInput,
                      flex: 0,
                      height: 40,
                      paddingTop: 0,
                      flex: 1,
                      borderColor: colors.textinputbordercolor,
                      color: colors.textColor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                    value={number}
                    onChangeText={onChangeNumber}
                    onSubmitEditing={handleSaveKeySkill}
                    // onChangeText={value => {
                    //   handleKeySkill(value);
                    // }}
                    // onSubmitEditing={() => {
                    //   handleSaveKeySkill(number);
                    // }}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    // onPress={() => handleSaveKeySkill(number)}
                    onPress={() => handleSaveKeySkill()}
                    style={{
                      marginLeft: 10,
                      backgroundColor: colors.AppmainColor,
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      borderRadius: 4,
                    }}>
                    <Text
                      style={{
                        fontWeight: '600',
                        color: colors.ButtonTextColor,
                      }}>
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
                {keyValue.length > 0 ? (
                  <View style={styles.skillValueMainView}>
                    {keyValue.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          ...styles.skllSecondView,
                          backgroundColor: colors.textinputBackgroundcolor,
                        }}>
                        <Text
                          style={{
                            ...styles.skillText,
                            color: colors.textColor,
                          }}>
                          {typeof item === 'object' ? item.skillText : item}
                        </Text>
                        <TouchableOpacity
                          style={{paddingLeft: 2}}
                          onPress={() => {
                            deleteSkills(item);
                          }}>
                          <Icon
                            name="cross"
                            size={15}
                            color={colors.backIconColor}
                            type="Entypo"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : null}

                <View style={globalStyles.flexRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible2(!!modalVisible2);
                      closeSkillsModal();
                    }}
                    style={{
                      ...styles.save,
                      backgroundColor: colors.textinputBackgroundcolor,
                      borderColor: colors.textinputbordercolor,
                      borderWidth: 0.5,
                      marginRight: 10,
                      flex: 1,
                    }}>
                    <Text style={{...styles.saveText, color: colors.textColor}}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={addSkills}
                    style={{
                      ...styles.save,
                      flex: 1,
                      backgroundColor: colors.AppmainColor,
                    }}>
                    <Text
                      style={{
                        ...styles.saveText,
                        color: colors.ButtonTextColor,
                      }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible3}
            onRequestClose={() => {
              setModalVisible3(!modalVisible3);
            }}>
            <View style={styles.centeredView}>
              <View style={{...styles.modalView, flex: 0.7, padding: 20}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                  <TouchableOpacity
                    hitSlop={10}
                    onPress={() => {
                      setModalVisible3(false);
                    }}
                    style={{alignSelf: 'flex-end'}}>
                    <Icon name="cross" size={20} color="black" type="Entypo" />
                  </TouchableOpacity>
                  <View
                    style={{
                      alignItems: 'center',
                      backgroundColor: '',
                      borderBottomWidth: 0.5,
                    }}>
                    <Text
                      style={{fontSize: 18, padding: 15, fontWeight: '700'}}>
                      Add Languages
                    </Text>
                  </View>

                  <View style={{flex: 0.5, marginBottom: 10, marginTop: 20}}>
                    <TextInput
                      style={{
                        ...styles.textInput,
                        flex: 0,
                        paddingTop: 0,
                        height: 40,
                      }}
                      value={languages}
                      onChangeText={value => {
                        handleLangauge(value);
                      }}
                      onSubmitEditing={() => {
                        handleSaveLangauge(languages);
                      }}
                      returnKeyType="done"
                    />

                    {languagesValue?.length ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}>
                        {languagesValue?.map((item, index) => (
                          <View
                            key={index}
                            style={{
                              marginVertical: 5,
                              marginRight: 5,
                              padding: 10,
                              backgroundColor: Colors.background_Profile_Tag,
                              borderRadius: 10,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text style={{fontSize: 14}}>{item}</Text>
                            <Icon
                              name="cross"
                              size={15}
                              color="black"
                              type="Entypo"
                            />
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>

                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        borderWidth: 0.5,
                        borderRadius: 8,
                        alignItems: 'center',
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                      }}
                      onPress={toggleDropdown}>
                      <Text style={styles.text}>
                        {selectedValue || 'Public'}
                      </Text>
                      <DownIcon name="down" size={15} color="#000" />
                    </TouchableOpacity>

                    {isOpen && (
                      <View style={styles.dropdownList}>
                        {options.map((option, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => selectOption(option)}>
                            <Text style={styles.text}>{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  <View style={globalStyles.flexRow}>
                    <TouchableOpacity
                      onPress={() => handleSaveKeySkill()}
                      style={{
                        ...styles.save,
                        backgroundColor: Colors.white,
                        borderWidth: 0.5,
                        marginRight: 10,
                        flex: 1,
                      }}>
                      <Text style={{...styles.saveText, color: Colors.black}}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleSaveLangauge1()}
                      style={{...styles.save, flex: 1}}>
                      <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible4}
            onRequestClose={() => {
              setModalVisible4(!modalVisible4);
              handleDeleteJmi(); // Pass the `item` for deletion
            }}>
            <View style={styles.centeredView}>
              <View
                style={{
                  ...styles.modalView,
                  flex: 0.6,
                  padding: 20,
                  backgroundColor: colors.modelBackground,
                }}>
                <TouchableOpacity
                  hitSlop={10}
                  onPress={() => {
                    setModalVisible4(!!modalVisible4);
                    handleDeleteJmi();
                  }}
                  style={{alignSelf: 'flex-end'}}>
                  <Icon
                    name="cross"
                    size={20}
                    color={colors.backIconColor}
                    type="Entypo"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    alignItems: 'center',
                    borderBottomWidth: 0.5,
                    borderColor: colors.textinputbordercolor,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      padding: 15,
                      fontWeight: '700',
                      color: colors.textColor,
                    }}>
                    Exploring On {universityName}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    marginBottom: 10,
                    margin: 20,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      style={{
                        ...styles.textInput,
                        flex: 1,
                        height: 40,
                        borderColor: colors.textinputbordercolor,
                        color: colors.textColor,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}
                      value={jmi}
                      onChangeText={value => {
                        handJmi(value);
                      }}
                      onSubmitEditing={() => {
                        handleSaveJmi(jmi);
                      }}
                      returnKeyType="done"
                    />

                    <TouchableOpacity
                      onPress={() => handleSaveJmi(jmi)}
                      style={{
                        ...styles.addButton,
                        backgroundColor: colors.AppmainColor,
                      }}>
                      <Text style={{color: colors.ButtonTextColor}}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  {jmiValue.length > 0 ? (
                    <View style={styles.skillValueMainView}>
                      {jmiValue.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            ...styles.skllSecondView,
                            backgroundColor: colors.textinputBackgroundcolor,
                          }}>
                          <Text
                            style={{
                              ...styles.skillText,
                              color: colors.textColor,
                            }}>
                            {typeof item === 'object'
                              ? item.exploringText
                              : item}
                          </Text>
                          <TouchableOpacity
                            style={{paddingLeft: 2}}
                            onPress={() => {
                              fetchExploringDelete(item);
                            }}>
                            <Icon
                              name="cross"
                              size={15}
                              color={colors.backIconColor}
                              type="Entypo"
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>

                <View style={globalStyles.flexRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible4(!!modalVisible4);
                      handleDeleteJmi();
                    }}
                    style={{
                      ...styles.save,
                      borderWidth: 0.5,
                      marginRight: 10,
                      flex: 1,
                      backgroundColor: colors.textinputBackgroundcolor,
                      borderColor: colors.textinputbordercolor,
                    }}>
                    <Text style={{...styles.saveText, color: colors.textColor}}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={fetchExploringAdd_Update}
                    style={{
                      ...styles.save,
                      flex: 1,
                      backgroundColor: colors.AppmainColor,
                    }}>
                    <Text
                      style={{
                        ...styles.saveText,
                        color: colors.ButtonTextColor,
                      }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible5}
            onRequestClose={() => {
              setModalVisible5(!modalVisible5);
              deleteInterests();
            }}>
            <View style={styles.centeredView}>
              <View
                style={{
                  ...styles.modalView,
                  flex: 0.6,
                  padding: 20,
                  backgroundColor: colors.modelBackground,
                }}>
                <TouchableOpacity
                  hitSlop={10}
                  onPress={() => {
                    setModalVisible5(!!modalVisible5);
                    deleteInterests();
                  }}
                  style={{alignSelf: 'flex-end'}}>
                  <Icon
                    name="cross"
                    size={20}
                    color={colors.backIconColor}
                    type="Entypo"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    alignItems: 'center',
                    borderBottomWidth: 0.5,
                    borderColor: colors.textinputbordercolor,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      padding: 15,
                      fontWeight: '700',
                      color: colors.textColor,
                    }}>
                    Add Interests
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    marginVertical: 20,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      style={{
                        ...styles.textInput,
                        flex: 1,
                        paddingTop: 0,
                        height: 40,
                        borderColor: colors.textinputbordercolor,
                        color: colors.textColor,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}
                      value={interests}
                      onChangeText={setInterests}
                      placeholder="Type your interest"
                      placeholderTextColor={colors.placeholderTextColor}
                    />
                    <TouchableOpacity
                      onPress={() => handleSaveInterests(interests)}
                      style={{
                        ...styles.addButton,
                        backgroundColor: colors.AppmainColor,
                      }}>
                      <Text style={{color: colors.ButtonTextColor}}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  {interestsValue.length > 0 ? (
                    <View style={styles.skillValueMainView}>
                      {interestsValue.map((item, index) => (
                        <View
                          key={item.id || index}
                          style={{
                            ...styles.skllSecondView,
                            backgroundColor: colors.textinputBackgroundcolor,
                          }}>
                          <Text
                            style={{
                              ...styles.skillText,
                              color: colors.textColor,
                            }}>
                            {item.interestText}
                          </Text>
                          <TouchableOpacity
                            onPress={() => deleteInterest(item)}>
                            <Icon
                              name="cross"
                              size={15}
                              color={colors.backIconColor}
                              type="Entypo"
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={{color: colors.textColor}}>No data found</Text>
                  )}
                </View>
                <View style={globalStyles.flexRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible5(!!modalVisible5);
                      deleteInterests();
                    }}
                    style={{
                      ...styles.save,
                      backgroundColor: colors.textinputBackgroundcolor,
                      borderColor: colors.textinputbordercolor,
                      borderWidth: 0.5,
                      marginRight: 10,
                      flex: 1,
                    }}>
                    <Text style={{...styles.saveText, color: colors.textColor}}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={addInterest}
                    style={{
                      ...styles.save,
                      flex: 1,
                      backgroundColor: colors.AppmainColor,
                    }}>
                    <Text
                      style={{
                        ...styles.saveText,
                        color: colors.ButtonTextColor,
                      }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flex: 0.09,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
  },
  headerText: {fontSize: 18, fontWeight: '500'},
  headerView2: {
    flex: 0.1,
  },
  titleText: {fontSize: 13},

  profileFirstView: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 12,
  },
  profileSectionImg: {
    width: 110,
    height: 110,
    borderRadius: 60,
    marginRight: 5,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    flex: 0.44,
    // backgroundColor: 'white',
    borderRadius: 30,
    padding: 35,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
  },
  save: {
    borderRadius: 4,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
  },
  textInput: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 0.5,
    borderRadius: 5,
  },
  editView: {
    marginHorizontal: 12,
    marginTop: 20,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    padding: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {marginRight: 20, flexWrap: 'wrap'},
  skillMainView: {
    marginHorizontal: 12,
    borderBottomWidth: 0.5,
    padding: 10,
    paddingVertical: 15,
    margin: 5,
    borderRadius: 20,
  },
  secongSkillView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skillValueMainView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skllSecondView: {
    marginVertical: 5,
    marginRight: 5,
    padding: 10,
    // backgroundColor: Colors.background_Profile_Tag,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // flexWrap: 'wrap',
    // flex: 1,
  },
  skillText: {fontSize: 14, flexShrink: 1, flexGrow: 1},
  dropdownList: {
    marginTop: 5,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    // alignSelf:"flex-end"
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 4,
  },
});
export default Profile;
