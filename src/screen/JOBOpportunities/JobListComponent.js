import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import globalStyles from '../GlobalCSS';
import Header from '../Header/Header';
import Colors from '../color';
import Icon from '../Icons/Icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl, ListJob, listoption} from '../baseURL/api';
import CommonLoader from '../components/CommonLoader';
import {showError} from '../components/Toast';
import {useTheme} from '../../theme/ThemeContext';

const JobListComponent = ({navigation, route}) => {
  const {CategoryPress = {}} = route.params || {};
  const {CareerLevel = {}} = route.params || {};
  const {isDark, colors, toggleTheme} = useTheme();
  const [jobsData, setJobsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchView, setSearchView] = useState(false);
  const [selectedValue5, setSelectedValue5] = useState('Industry Select');
  const [isOpen5, setIsOpen5] = useState(false);
  const [industryData, setIndustryData] = useState([]);
  const [number, onChangeNumber] = useState('');
  const [number1, onChangeNumber1] = useState('');
  const [selectedValue2, setSelectedValue2] = useState('Career Select');
  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedValueApply, setSelectedValueApply] = useState('Select');
  const [isOpenApply, setIsOpenApply] = useState(false);
  const [userData, setUserData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (CategoryPress) {
      handleCategoryPress();
    }
  }, [CategoryPress]);

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

  let requestTimeout;

  const handleCategoryPress = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setInitialLoading(true);
    clearTimeout(requestTimeout);
    requestTimeout = setTimeout(async () => {
      const careerLevelValue =
        CareerLevel && typeof CareerLevel !== 'object' ? CareerLevel : '';

      let popularJobsValue = '';
      if (Array.isArray(CategoryPress)) {
        popularJobsValue = CategoryPress.toString();
      } else if (
        typeof CategoryPress === 'object' &&
        Object.keys(CategoryPress).length > 0
      ) {
        popularJobsValue = JSON.stringify(CategoryPress);
      } else if (typeof CategoryPress === 'number') {
        popularJobsValue = CategoryPress.toString();
      }

      const jobTitleValue = number ? String(number) : '';
      const jobLocationValue = number1 ? String(number1) : '';
      const companyNameValue =
        selectedValueApply && selectedValueApply !== 'Select'
          ? String(selectedValueApply)
          : '';

      try {
        const response = await fetch(`${baseUrl}${ListJob}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            userId: userData?.User?.userId,
            jobTitle: jobTitleValue,
            jobLocation: jobLocationValue,
            companyName: companyNameValue,
            careerLevel: careerLevelValue,
            popularJobs: popularJobsValue,
          }),
        });

        const responseData = await response.json();

        setJobsData(responseData.Data);
        console.log('API Response:', responseData);
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setIsLoading(false);
        setInitialLoading(false);
      }
    }, 500);
  };

  const renderItem2 = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          style={{
            ...styles.card,
            backgroundColor: colors.textinputBackgroundcolor,
          }}
          onPress={() =>
            navigation.navigate('JobDetails', {
              Item: item,
            })
          }>
          <View style={{flex: 1}}>
            <Text style={{...styles.title, color: colors.AppmainColor}}>
              {item.jobTitle}
            </Text>
            <Text style={{...styles.info, color: colors.textColor}}>
              {item.jobCatName}
            </Text>
            <Text style={{...styles.info, color: colors.textColor}}>
              Start Date: {item.dateAdded}
            </Text>
            <Text style={{...styles.info, color: colors.textColor}}>
              Company: {item.companyName}
            </Text>
          </View>
          <View style={globalStyles.FlatListIconView}>
            <Icon
              name="location"
              size={18}
              color={colors.backIconColor}
              type="Ionicons"
            />
            <Text
              style={{...styles.info, flexShrink: 1, color: colors.textColor}}>
              {item.companyAddress}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const getIndustryList = async Val => {
    console.log(' value --- > ', Val);
    try {
      const response = await fetch(`${baseUrl}${listoption}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          optionType: Val,
        }),
      });

      const data = await response.json();
      console.log(' value data --------->>>>>> > ', data?.DataList);

      if (response.ok) {
        setIndustryData(data?.DataList);
      } else {
        showError(data.message || 'Failed to Industry List');
      }
    } catch (error) {
      console.error('Fetch Error Industry List:', error);
    }
  };
  const selectOption5 = option => {
    // setPerfID1(option?.Id);
    setSelectedValue5(option?.Name);
    setIsOpen5(false);
  };
  const toggleDropdown5 = () => {
    getIndustryList('industry');
    setIsOpen5(!isOpen5);
  };
  const selectOption2 = option => {
    // setPerfID2(option?.Id);
    setSelectedValue2(option?.Name);
    setIsOpen2(false);
  };
  const toggleDropdown2 = () => {
    getIndustryList('careerlevel');
    setIsOpen2(!isOpen2);
  };
  const optionsApply = ['Job Post By', 'Company', 'Consultancy'];
  const selectOptionApply = option => {
    // setPerfID2(option?.Id);
    setSelectedValueApply(option);
    setIsOpenApply(false);
  };
  const toggleDropdownApply = () => {
    // getIndustryList('careerlevel');
    setIsOpenApply(!isOpenApply);
  };

  // if (initialLoading) {
  //   return <CommonLoader visible={true} />;
  // }

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}>
      <Header title="Job List" navigation={navigation} />
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}>
          <Text
            style={{
              ...globalStyles.headlineText,
              paddingRight: 10,
              color: colors.textColor,
            }}>
            Jobs Search
          </Text>
          <Text style={{...globalStyles.headlineText, color: colors.textColor}}>
            {jobsData?.length} Results found
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setSearchView(!searchView)}
          style={{
            borderWidth: 1,
            margin: 10,
            padding: 10,
            borderRadius: 10,
            backgroundColor: colors.textinputBackgroundcolor,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{color: colors.textColor}}>Search</Text>
        </TouchableOpacity>

        {searchView ? (
          <View style={globalStyles.ViewINter1}>
            <View
              style={{
                ...globalStyles.JobfiledSection,
                paddingHorizontal: 10,
              }}>
              <TextInput
                style={{
                  ...globalStyles.textInput,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.textinputBackgroundcolor,
                  color: colors.textColor,
                  // borderColor: errorTitle ? Colors.error : Colors.gray,
                }}
                onChangeText={value => {
                  onChangeNumber(value);
                  // setErrorTitle(value.trim().length === 0);
                }}
                value={number}
                placeholder="Keywords"
                keyboardType="default"
                multiline
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <View
              style={{
                ...globalStyles.JobfiledSection,
                paddingHorizontal: 10,
              }}>
              <TextInput
                style={{
                  ...globalStyles.textInput,
                  borderColor: colors.textinputbordercolor,
                  backgroundColor: colors.textinputBackgroundcolor,
                  color: colors.textColor,
                  // borderColor: errorTitle ? Colors.error : Colors.gray,
                }}
                onChangeText={value => {
                  onChangeNumber1(value);
                  // setErrorTitle(value.trim().length === 0);
                }}
                value={number1}
                placeholder="Location"
                keyboardType="default"
                multiline
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <View style={{marginHorizontal: 10}}>
              <TouchableOpacity
                onPress={toggleDropdown5}
                style={{
                  ...globalStyles.seclectIndiaView,
                  borderColor: colors.textinputbordercolor,
                  // borderColor: errorCategory ? Colors.error : Colors.gray,
                }}>
                <Text
                  style={{
                    ...globalStyles.JobfiledSectionText,
                    paddingBottom: 0,
                    color: colors.textColor,
                  }}>
                  {selectedValue5}
                </Text>
              </TouchableOpacity>
              {isOpen5 && (
                <View
                  style={{
                    ...globalStyles.dropdownList,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}>
                  {industryData.map(item => (
                    <TouchableOpacity
                      key={item.Id}
                      style={{
                        ...globalStyles.dropdownItem,
                        borderColor: colors.textinputbordercolor,
                      }}
                      onPress={() => {
                        selectOption5(item);
                      }}>
                      <Text style={{fontSize: 14, color: colors.textColor}}>
                        {item?.Name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={{marginHorizontal: 10}}>
              <TouchableOpacity
                onPress={toggleDropdown2}
                style={{
                  //   marginHorizontal: 10,
                  ...globalStyles.seclectIndiaView,
                  borderColor: colors.textinputbordercolor,
                  // borderColor: errorCareerLevel ? Colors.error : Colors.gray,
                }}>
                <Text
                  style={{
                    ...globalStyles.JobfiledSectionText,
                    paddingBottom: 0,
                    color: colors.textColor,
                  }}>
                  {selectedValue2}
                </Text>
              </TouchableOpacity>
              {isOpen2 && (
                <View
                  style={{
                    ...globalStyles.dropdownList,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}>
                  {industryData.map(item => (
                    <TouchableOpacity
                      key={item.Id}
                      style={{
                        ...globalStyles.dropdownItem,
                        borderColor: colors.textinputbordercolor,
                      }}
                      onPress={() => {
                        selectOption2(item);
                      }}>
                      <Text style={{fontSize: 14, color: colors.textColor}}>
                        {item?.Name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={{marginHorizontal: 10}}>
              <TouchableOpacity
                onPress={toggleDropdownApply}
                style={{
                  //   marginHorizontal: 10,
                  ...globalStyles.seclectIndiaView,
                  borderColor: colors.textinputbordercolor,
                  // borderColor: errorPerference2 ? Colors.error : Colors.gray,
                }}>
                <Text
                  style={{
                    ...globalStyles.JobfiledSectionText,
                    paddingBottom: 0,
                    color: colors.textColor,
                  }}>
                  {selectedValueApply}
                </Text>
              </TouchableOpacity>
              {isOpenApply && (
                <View
                  style={{
                    ...globalStyles.dropdownList,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}>
                  {optionsApply.map(item => (
                    <TouchableOpacity
                      key={item.Id}
                      style={{
                        ...globalStyles.dropdownItem,
                        borderColor: colors.textinputbordercolor,
                      }}
                      onPress={() => {
                        selectOptionApply(item);
                      }}>
                      <Text style={{fontSize: 14, color: colors.textColor}}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* <TouchableOpacity
              style={{...globalStyles.saveButton, marginHorizontal: 10}}
              // onPress={handleCategoryPress}
            >
              <Text style={globalStyles.saveButtonText}>Search</Text>
            </TouchableOpacity> */}
          </View>
        ) : null}

        <FlatList
          data={jobsData}
          keyExtractor={item => item.id?.toString()}
          renderItem={renderItem2}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 10,
    margin: 10,
    //backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    //color: Colors.secondGreen,
  },
  info: {
    // color: '#444',
    fontSize: 12,
    marginTop: 2,
  },
});

export default JobListComponent;
