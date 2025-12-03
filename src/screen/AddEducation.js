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
  Alert,
} from 'react-native';
import Colors from './color';
import Icon from 'react-native-vector-icons/AntDesign';
import CalIcon from 'react-native-vector-icons/FontAwesome5';
import MonthPicker from 'react-native-month-year-picker';
import globalStyles from './GlobalCSS';
import Header from './Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl, addEducation, editEducation} from './baseURL/api';
import {useTheme} from '../theme/ThemeContext';

const AddEducation = ({navigation, route}) => {
  const {Item = {}} = route.params || {};
  const {isDark, colors, toggleTheme} = useTheme();
  const [number, onChangeNumber] = useState('');
  const [campany, setCampany] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [specialisation, setSpecialisation] = useState('');
  const [date, setDate] = useState(null);
  const [date1, setDate1] = useState(null);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [errorJob, setErrorJov] = useState(false);
  const [errorCampany, SetErrorCampany] = useState(false);
  const [errorIndustry, setErrorIndustry] = useState(false);
  const [errorSpecialisation, SetErrorSpecialisation] = useState(false);
  const [errorDescription, SetErrorDescription] = useState(false);
  const [userData, setUserData] = useState(null);

  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem('userData');
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };
  useEffect(() => {
    UserValue();
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
  const showPicker = () => {
    setShow(true);
  };
  const showPicker1 = () => {
    setShow1(true);
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

    if (industry.trim().length === 0) {
      setErrorIndustry(true);
      isValid = false;
    } else {
      setErrorIndustry(false);
    }

    if (description.trim().length === 0) {
      SetErrorDescription(true);
      isValid = false;
    } else {
      SetErrorDescription(false);
    }
    if (specialisation.trim().length === 0) {
      SetErrorSpecialisation(true);
      isValid = false;
    } else {
      SetErrorSpecialisation(false);
    }
    if (isValid) {
      console.log('All fields are valid');

      const year = date?.getFullYear();
      const month = date?.getMonth() + 1; // getMonth() is zero-based
      const toYear = date?.getFullYear();
      const toMonth = date?.getMonth() + 1;

      try {
        const response = await fetch(
          `${baseUrl}${Item?.Degree ? editEducation : addEducation}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: Item?.Degree ? Item?.Id : null,
              userId: userData?.User?.userId,
              universitySchool: number,
              fieldOfStudy: campany,
              degree: industry,
              specialisationSubject: specialisation,
              description: description,
              fromMonth: Item?.Degree ? Item?.FromMonth : month,
              fromYear: Item?.Degree ? Item?.FromYear : year,
              toMonth: Item?.Degree ? Item?.ToMonth : toMonth,
              toYear: Item?.Degree ? Item?.ToYear : toYear,
            }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          console.log('Add data  ----', data);
          navigation.goBack();
        } else {
          console.log(data);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (Item) {
      onChangeNumber(Item?.UniversitySchool);
      setCampany(Item?.FieldOfStudy);
      setIndustry(Item?.Degree);
      setSpecialisation(Item?.Specialisation);
      setDescription(Item?.Description);
    }
  }, []);

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}>
      <View style={globalStyles.SafeAreaView}>
        <Header
          title={Item?.Degree ? 'Edit Education' : 'Add Education'}
          navigation={navigation}
        />

        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, paddingHorizontal: 12}}>
            <View style={{paddingVertical: 15, borderBottomWidth: 0.2}}>
              <Text style={{fontSize: 18, color: colors.textColor}}>
                Educational background
              </Text>
            </View>

            <View style={styles.JobfiledSection}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  color: errorJob ? Colors.error : colors.textColor,
                }}>
                School or University
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
                  onChangeNumber(value);
                  setErrorJov(value.trim().length === 0);
                }}
                value={number}
                placeholder="Write your school or university"
                keyboardType="default"
                multiline
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <View style={styles.JobfiledSection}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  color: errorCampany ? Colors.error : colors.textColor,
                }}>
                Field of study
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
                onChangeText={value => {
                  setCampany(value);
                  SetErrorCampany(value.trim().length === 0);
                }}
                value={campany}
                placeholder="Write your study"
                keyboardType="default"
                multiline
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <View style={styles.JobfiledSection}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  color: errorIndustry ? Colors.error : colors.textColor,
                }}>
                (Future) degree:
              </Text>
              <TextInput
                style={{
                  ...styles.textInput,
                  borderColor: errorIndustry
                    ? Colors.error
                    : colors.textinputbordercolor,
                  color: colors.textColor,
                  backgroundColor: colors.textinputBackgroundcolor,
                }}
                onChangeText={value => {
                  setIndustry(value);
                  setErrorIndustry(value.trim().length === 0);
                }}
                value={industry}
                placeholder="Write your degree"
                keyboardType="default"
                multiline
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <View style={styles.JobfiledSection}>
              <Text style={{fontSize: 13, color: colors.textColor}}>
                Period
              </Text>
            </View>

            <View style={globalStyles.dateSection}>
              <Text style={{fontSize: 13, color: colors.textColor}}>Form</Text>

              {Item?.FromMonth && Item?.FromMonth ? (
                <TouchableOpacity
                  style={globalStyles.flexRow}
                  onPress={showPicker}>
                  <Text style={{...styles.label, color: colors.textColor}}>
                    {Item?.FromMonth} {Item?.FromYear}
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={globalStyles.flexRow}
                    onPress={showPicker}>
                    <Text style={{...styles.label, color: colors.textColor}}>
                      {date
                        ? date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                          })
                        : 'Select Month & Year'}{' '}
                    </Text>
                    <CalIcon
                      name="calendar-alt"
                      size={20}
                      color={colors.placeholderTextColor}
                    />
                  </TouchableOpacity>
                  {show && (
                    <MonthPicker
                      onChange={onValueChange}
                      value={date || new Date()}
                      minimumDate={new Date(2000, 0)}
                      maximumDate={new Date(2330, 11)}
                      locale="en"
                    />
                  )}
                </>
              )}
            </View>

            <View style={globalStyles.dateSection}>
              <Text style={{fontSize: 13, color: colors.textColor}}>To</Text>

              {Item?.FromMonth && Item?.FromMonth ? (
                <TouchableOpacity
                  style={globalStyles.flexRow}
                  onPress={showPicker1}>
                  <Text style={{...styles.label, color: colors.textColor}}>
                    {Item?.ToMonth} {Item?.ToYear}
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={globalStyles.flexRow}
                    onPress={showPicker1}>
                    <Text style={{...styles.label, color: colors.textColor}}>
                      {date1
                        ? date1.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                          })
                        : 'Select Month & Year'}{' '}
                    </Text>
                    <CalIcon
                      name="calendar-alt"
                      size={20}
                      color={colors.placeholderTextColor}
                    />
                  </TouchableOpacity>

                  {show1 && (
                    <MonthPicker
                      onChange={onValueChange1}
                      value={date1 || new Date()}
                      minimumDate={new Date(2000, 0)}
                      maximumDate={new Date(2330, 11)}
                      locale="en"
                    />
                  )}
                </>
              )}
            </View>
            <View style={styles.JobfiledSection}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  color: errorSpecialisation ? Colors.error : colors.textColor,
                }}>
                Specialisation
              </Text>
              <TextInput
                style={{
                  ...styles.textInput,
                  height: 80,
                  textAlignVertical: 'top',
                  borderColor: errorSpecialisation
                    ? Colors.error
                    : colors.textinputbordercolor,
                  color: colors.textColor,
                  backgroundColor: colors.textinputBackgroundcolor,
                }}
                onChangeText={value => {
                  setSpecialisation(value);
                  SetErrorSpecialisation(value.trim().length === 0);
                }}
                value={specialisation}
                placeholder="Write your Specialisation"
                keyboardType="default"
                multiline
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <View style={styles.JobfiledSection}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,

                  color: errorDescription ? Colors.error : colors.textColor,
                }}>
                Description
              </Text>
              <TextInput
                style={{
                  ...styles.textInput,
                  height: 80,
                  textAlignVertical: 'top',
                  borderColor: errorDescription
                    ? Colors.error
                    : colors.textinputbordercolor,
                  color: colors.textColor,
                  backgroundColor: colors.textinputBackgroundcolor,
                }}
                onChangeText={value => {
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
              onPress={() => handleSave()}>
              <Text
                style={{
                  ...globalStyles.saveButtonText,
                  color: colors.ButtonTextColor,
                }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    paddingRight: 10,
    color: '#888',
  },
  JobfiledSection: {paddingTop: 10},
  JobfiledSectionText: {fontSize: 13, paddingBottom: 10},
  textInput: {
    paddingTop: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    height: 40,
  },
});

export default AddEducation;
