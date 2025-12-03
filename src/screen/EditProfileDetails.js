import React, {useState, useEffect} from 'react';
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
  Button,
  ActivityIndicator,
} from 'react-native';
import Colors from './color';
import Icon from 'react-native-vector-icons/AntDesign';
import DemoTest from './DemoTest';
import CheckBox from '@react-native-community/checkbox';
import CrossIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from './GlobalCSS';
import {baseUrl, Profile_Detail, UpdateBasicDetails} from './baseURL/api';
import {showError} from './components/Toast';
import {useTheme} from '../theme/ThemeContext';
import KeyboardAvoidingWrapper from './components/KeyboardAvoidingWrapper';

const EditProfileDetails = ({navigation}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const [number, onChangeNumber] = useState(null);
  const [campany, setCampany] = useState(null);
  const [description, setDescription] = useState('');
  const [modalVisible1, setModalVisible1] = useState(false);
  const [errorJob, setErrorJov] = useState(false);
  const [errorCampany, SetErrorCampany] = useState(false);
  const [errorDay, setErrorDay] = useState(false);
  const [errorMonth, setErrorMonth] = useState(false);
  const [errorYear, setErrorYear] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [wantStateData, SetWantStateData] = useState(false);
  const [wantCountryeData, SetWantCountryData] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [errorGander, setErrorGander] = useState('');
  const [errorCountry, setErrorCountry] = useState('');
  const [errorState, setErrorState] = useState('');
  const [errorCity, setErrorCity] = useState('');
  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState([]);

  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem('userData');
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };

  useEffect(() => {
    UserValue();
  }, []);

  useEffect(() => {
    if (userData?.User?.userId) {
      GetProfileData();
    }
  }, [userData?.User?.userId]);

  const GetProfileData = async () => {
    setLoading(true);
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
        setProfileData(data);
        await AsyncStorage.setItem('userProfileData', JSON.stringify(data));
        // await AsyncStorage.setItem(
        //   'userProfileDataDrawer',
        //   JSON.stringify(data),
        // );
        console.log('Getting the user Profile data ----', data);
      } else {
        showError(data.message || 'Failed to fetch posts');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    let isValid = true;

    if (number.trim().length === 0) {
      setErrorJov(true);
      isValid = false;
    } else {
      setErrorJov(false);
    }

    if (campany.trim().length === 0) {
      SetErrorCampany(true);
      isValid = false;
    } else {
      SetErrorCampany(false);
    }

    if (description.trim().length === 0) {
      setErrorCity(true);
      isValid = false;
    } else {
      setErrorCity(false);
    }

    if (selectedGender.trim().length === 0) {
      setErrorGander(true);
      isValid = false;
    } else {
      setErrorGander(false);
    }

    if (selectedCountry.trim().length === 0) {
      setErrorCountry(true);
      isValid = false;
    } else {
      setErrorCountry(false);
    }

    if (selectedState.trim().length === 0) {
      setErrorState(true);
      isValid = false;
    } else {
      setErrorState(false);
    }

    if (day.trim().length === 0) {
      setErrorDay(true);
      isValid = false;
    } else {
      setErrorDay(false);
    }
    if (month.trim().length === 0) {
      setErrorMonth(true);
      isValid = false;
    } else {
      setErrorMonth(false);
    }

    if (year.trim().length === 0) {
      setErrorYear(true);
      isValid = false;
    } else {
      setErrorYear(false);
    }

    if (isValid) {
      console.log('All fields are valid');

      // Map month name to numeric value
      const monthMapping = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
      };

      const normalizedMonth =
        month.trim().charAt(0).toUpperCase() +
        month.trim().slice(1).toLowerCase();
      const dayPadded = day.padStart(2, '0');
      const formattedMonth = monthMapping[normalizedMonth];
      const formattedDate = `${year}-${formattedMonth}-${dayPadded}`;
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}${UpdateBasicDetails}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userData?.User?.userId,
            firstName: number,
            lastName: campany,
            gender: selectedGender,
            dob: formattedDate.toString(),
            countryName: selectedCountry,
            cityName: selectedState,
            locationName: description,
            timeZone: 'Asia/Kolkata',
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Update basic details ----', data);
          //await GetProfileData();
          navigation.goBack();
        } else {
          showError(data.message || 'Failed to fetch posts');
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCountrySelection = country => {
    setSelectedCountry(country);
    setModalVisible1(!!modalVisible1);
  };

  const handleStateSelection = state => {
    setSelectedState(state);
    setModalVisible1(!!modalVisible1);
  };

  useEffect(() => {
    if (profileData) {
      onChangeNumber(profileData?.Data?.firstName);
      setCampany(profileData?.Data?.lastName);
      setSelectedGender(profileData?.Data?.gender);

      const dob = profileData?.Data?.dob;
      console.log('profileData?.Data?.dob', profileData?.Data?.dob);
      if (dob && typeof dob === 'string' && dob.includes('-')) {
        const [day, month, year] = dob.split('-');
        setDay(day);
        setMonth(month);
        setYear(year);
      } else {
        console.warn('Invalid dob format:', dob);
      }

      setSelectedCountry(profileData?.Data?.countryName);
      setSelectedState(profileData?.Data?.cityName);
      setDescription(profileData?.Data?.locationName);
    }
  }, [profileData]);

  return (
    <SafeAreaView
      style={{...styles.mainView, backgroundColor: colors.background}}>
      <KeyboardAvoidingWrapper offset={40}>
        {loading ? (
          <View>
            <ActivityIndicator size={'large'} />
          </View>
        ) : (
          <View style={styles.mainView}>
            {/*  Start Header Section  */}
            <View
              style={{
                ...styles.headerView,
                borderColor: colors.textinputbordercolor,
              }}>
              <Icon
                onPress={() => navigation.goBack()}
                name="left"
                size={25}
                color={colors.backIconColor}
                style={{paddingLeft: 10}}
              />
              <Text style={{fontSize: 18, color: colors.textColor}}>
                Edit Profile
              </Text>
              <View style={{flex: 0.1}}></View>
            </View>
            <ScrollView style={styles.secondMainView}>
              <View style={styles.secondMainView}>
                <View
                  style={{
                    paddingVertical: 15,
                    borderBottomWidth: 0.2,
                    borderColor: colors.textinputbordercolor,
                  }}>
                  <Text style={{fontSize: 18, color: colors.textColor}}>
                    Edit Personal Data
                  </Text>
                </View>

                <View style={styles.JobfiledSection}>
                  <Text
                    style={{
                      ...globalStyles.JobfiledSectionText,
                      color: errorJob ? Colors.error : colors.textColor,
                    }}>
                    First Name
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
                    onChangeText={value => {
                      const cleanedValue = value.replace(/\s+/g, '');
                      onChangeNumber(cleanedValue);
                      setErrorJov(cleanedValue.length === 0);
                    }}
                    // onChangeText={value => {
                    //   onChangeNumber(value);
                    //   setErrorJov(value.trim().length === 0);
                    // }}
                    value={number}
                    placeholder="Write your first name"
                    keyboardType="default"
                    multiline
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                </View>

                <View style={styles.JobfiledSection}>
                  <Text
                    style={{
                      ...globalStyles.JobfiledSectionText,
                      color: errorCampany ? Colors.error : colors.textColor,
                    }}>
                    Last Name
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
                    // onChangeText={value => {
                    //   setCampany(value);
                    //   SetErrorCampany(value.trim().length === 0);
                    // }}
                    onChangeText={value => {
                      const cleanedValue = value.replace(/\s+/g, '');
                      setCampany(cleanedValue);
                      SetErrorCampany(cleanedValue.trim().length === 0);
                    }}
                    value={campany}
                    placeholder="Write your last name"
                    keyboardType="default"
                    multiline
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                </View>

                <View style={styles.JobfiledSection}>
                  <Text
                    style={{
                      ...globalStyles.JobfiledSectionText,
                      color: colors.textColor,
                    }}>
                    Gander
                  </Text>

                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 10,
                      }}
                      onPress={() => {
                        setSelectedGender('Male');
                      }}>
                      <CheckBox
                        value={selectedGender === 'Male'}
                        onValueChange={() => setSelectedGender('Male')}
                        style={{
                          transform: [{scaleX: 0.8}, {scaleY: 0.8}],
                        }}
                      />
                      <Text style={{color: colors.textColor}}>Male</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{flexDirection: 'row', alignItems: 'center'}}
                      onPress={() => setSelectedGender('Female')}>
                      <CheckBox
                        color={colors.textColor}
                        value={selectedGender === 'Female'}
                        onValueChange={() => setSelectedGender('Female')}
                        style={{
                          transform: [{scaleX: 0.8}, {scaleY: 0.8}],
                        }}
                      />
                      <Text style={{color: colors.textColor}}>Female</Text>
                    </TouchableOpacity>
                  </View>
                  {errorGander ? (
                    <Text
                      style={{
                        color: errorGander ? Colors.error : colors.textColor,
                      }}>
                      Please select Gander
                    </Text>
                  ) : null}
                </View>

                <View style={styles.dobView}>
                  <Text style={{...styles.dobText, color: colors.textColor}}>
                    Date Of Birth
                  </Text>
                  <View style={styles.seconDOMView}>
                    <TextInput
                      style={{
                        ...styles.textInputDOM,
                        borderColor: errorDay
                          ? Colors.error
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}
                      onChangeText={value => {
                        setDay(value);
                        setErrorDay(value.trim().length === 0);
                      }}
                      value={day}
                      placeholder="DD"
                      multiline={false}
                      placeholderTextColor={
                        errorDay ? Colors.error : colors.placeholderTextColor
                      }
                      maxLength={2}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={{
                        ...styles.textInputDOM,
                        borderColor: errorMonth
                          ? Colors.error
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}
                      onChangeText={value => {
                        setMonth(value);
                        setErrorMonth(value.trim().length === 0);
                      }}
                      value={month}
                      placeholder="MM"
                      keyboardType="numeric"
                      multiline={false}
                      placeholderTextColor={
                        errorMonth ? Colors.error : colors.placeholderTextColor
                      }
                      maxLength={2}
                    />
                    <TextInput
                      style={{
                        ...styles.textInputDOM,
                        borderColor: errorYear
                          ? Colors.error
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                        backgroundColor: colors.textinputBackgroundcolor,
                        marginRight: 0,
                      }}
                      onChangeText={value => {
                        setYear(value);
                        setErrorYear(value.trim().length === 0);
                      }}
                      value={year}
                      placeholder="YYYY"
                      keyboardType="numeric"
                      multiline={false}
                      placeholderTextColor={
                        errorYear ? Colors.error : colors.placeholderTextColor
                      }
                      maxLength={4}
                    />
                  </View>
                </View>

                <Text
                  style={{
                    marginTop: 20,
                    color: errorCountry ? Colors.error : colors.textColor,
                  }}>
                  Country
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible1(), SetWantCountryData(true);
                  }}
                  style={{
                    ...globalStyles.seclectIndiaView,
                    borderColor: errorCountry
                      ? Colors.error
                      : colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}>
                  <Text
                    style={{
                      ...globalStyles.JobfiledSectionText,
                      paddingBottom: 0,
                      color: errorCountry ? Colors.error : colors.textColor,
                    }}>
                    {selectedCountry ? selectedCountry : 'Country'}
                  </Text>
                  <Icon
                    name="down"
                    size={15}
                    color={colors.backIconColor}
                    style={{paddingLeft: 10}}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    marginTop: 20,
                    color: errorState ? Colors.error : colors.textColor,
                  }}>
                  State
                </Text>
                <TouchableOpacity
                  style={{
                    ...globalStyles.seclectIndiaView,
                    borderColor: errorState
                      ? Colors.error
                      : colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                  onPress={() => {
                    setModalVisible1(), SetWantStateData(true);
                  }}>
                  <Text
                    style={{
                      ...globalStyles.JobfiledSectionText,
                      paddingBottom: 0,
                      color: errorState ? Colors.error : colors.textColor,
                    }}>
                    {selectedState ? selectedState : 'State'}
                  </Text>
                  <Icon
                    name="down"
                    size={15}
                    color={colors.backIconColor}
                    style={{paddingLeft: 10}}
                  />
                </TouchableOpacity>

                <View style={styles.JobfiledSection}>
                  <Text
                    style={{
                      ...globalStyles.JobfiledSectionText,
                      color: errorCity ? Colors.error : colors.textColor,
                    }}>
                    City
                  </Text>
                  <TextInput
                    style={{
                      ...styles.textInput,
                      borderColor: errorCity
                        ? Colors.error
                        : colors.textinputbordercolor,
                      color: colors.textColor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                    onChangeText={value => {
                      setDescription(value);
                      setErrorCity(value.trim().length === 0);
                    }}
                    value={description}
                    placeholder="Write your city"
                    keyboardType="default"
                    multiline
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                </View>

                <TouchableOpacity
                  style={{...styles.save, backgroundColor: colors.AppmainColor}}
                  onPress={() => handleSave()}>
                  <Text
                    style={{...styles.saveText, color: colors.ButtonTextColor}}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible1}
              onRequestClose={() => {
                setModalVisible1(!modalVisible1);
              }}>
              <View style={globalStyles.centeredView}>
                <View
                  style={{
                    ...globalStyles.modalView,
                    flex: 0.6,
                    padding: 20,
                    backgroundColor: colors.modelBackground,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible1(!!modalVisible1),
                        SetWantStateData(false),
                        SetWantCountryData(false);
                    }}
                    style={{alignSelf: 'flex-end'}}>
                    <CrossIcon
                      name="cross"
                      size={25}
                      color={colors.backIconColor}
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
                      {wantStateData ? 'Select States' : 'Select Country'}
                    </Text>
                  </View>

                  <DemoTest
                    setSelectedState={handleStateSelection}
                    setSelectedCountry={handleCountrySelection}
                    Datatype={
                      wantStateData ? 'wantStateData' : 'wantCountryeData'
                    }
                  />
                </View>
              </View>
            </Modal>
          </View>
        )}
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainView: {flex: 1},
  headerView: {
    flex: 0.09,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
  },
  secondMainView: {flex: 1, paddingHorizontal: 6},
  JobfiledSection: {paddingTop: 10},
  textInput: {
    paddingTop: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 0.5,
    borderRadius: 5,
    height: 40,
  },
  dobView: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dobText: {fontSize: 13},

  seconDOMView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputDOM: {
    width: 60,
    height: 40,
    paddingTop: 5,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    marginRight: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  save: {
    borderRadius: 4,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveText: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: '700',
  },
});

export default EditProfileDetails;
