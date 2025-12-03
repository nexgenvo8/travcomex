import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import globalStyles from '../GlobalCSS';
import Header from '../Header/Header';
import Colors from '../color';
import {baseUrl, listoption} from '../baseURL/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showError} from '../components/Toast';

const JobFairRegistration = ({navigation}) => {
  const [name, setName] = useState('');
  const [eMail, setEMail] = useState('');
  const [studentID, setStudentID] = useState('');
  const [studentMobile, setStudentMobile] = useState('');
  const [industryData, setIndustryData] = useState([]);
  const [selectedValue5, setSelectedValue5] = useState('Select');
  const [isOpen5, setIsOpen5] = useState(false);
  const [selectedValue2, setSelectedValue2] = useState('Select');
  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedValue3, setSelectedValue3] = useState('Select');
  const [isOpen3, setIsOpen3] = useState(false);
  const [userData, setUserData] = useState(null);
  const [perfID1, setPerfID1] = useState('');
  const [perfID2, setPerfID2] = useState('');
  const [perfID3, setPerfID3] = useState('');

  // console.log('userData ----- >', userData?.User?.email);
  // const { firstName,late} =userData?.User

  useEffect(() => {
    getIndustryList();
    UserValue();
  }, []);

  useEffect(() => {
    if (userData?.User?.name) {
      setName(userData?.User?.name);
      setEMail(userData?.User?.email);
    }
  });

  const UserValue = async () => {
    try {
      const userDta = await AsyncStorage.getItem('userData');
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    } catch (error) {
      console.log('Error UserValuess', error);
    }
  };
  const getIndustryList = async () => {
    try {
      const response = await fetch(`${baseUrl}${listoption}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({optionType: 'industry'}),
      });

      const data = await response.json();
      if (response.ok) setIndustryData(data?.DataList || []);
      else showError(data.message || 'Failed to fetch Industry List');
    } catch (error) {
      console.error('Fetch Error Industry List:', error);
    }
  };
  const selectOption5 = option => {
    setPerfID1(option?.Id);
    setSelectedValue5(option?.Name);
    setIsOpen5(false);
  };
  const toggleDropdown5 = () => {
    setIsOpen5(!isOpen5);
  };
  const selectOption2 = option => {
    setPerfID2(option?.Id);
    setSelectedValue2(option?.Name);
    setIsOpen2(false);
  };
  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2);
  };
  const selectOption3 = option => {
    setPerfID3(option?.Id);
    setSelectedValue3(option?.Name);
    setIsOpen3(false);
  };
  const toggleDropdown3 = () => {
    setIsOpen3(!isOpen3);
  };
  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorStudentId, setErrorStudentId] = useState(false);
  const [errorStudentMobile, setErrorStudentMobile] = useState(false);
  const [errorPerference1, setErrorPerference1] = useState(false);
  const [errorPerference2, setErrorPerference2] = useState(false);
  const [errorPerference3, setErrorPerference3] = useState(false);

  useEffect(() => {
    if (selectedValue5 !== 'Select' && selectedValue5) {
      setErrorPerference1(false);
    }
    if (selectedValue2 !== 'Select' && selectedValue5) {
      setErrorPerference2(false);
    }
    if (selectedValue3 !== 'Select' && selectedValue5) {
      setErrorPerference3(false);
    }
  }, [selectedValue5, selectedValue2, selectedValue3]);

  const handleJobFair = async () => {
    console.log('Test');
    let isValid = true;

    if (studentID.trim().length === 0) {
      setErrorStudentId(true);
      isValid = false;
    } else {
      setErrorStudentId(false);
    }
    if (studentMobile.trim().length === 0) {
      setErrorStudentMobile(true);
      isValid = false;
    } else {
      setErrorStudentMobile(false);
    }

    if (selectedValue5 === 'Select') {
      setErrorPerference1(true);
      isValid = false;
    } else {
      setErrorPerference1(false);
    }

    if (selectedValue2 === 'Select') {
      setErrorPerference2(true);
      isValid = false;
    } else {
      setErrorPerference2(false);
    }

    if (selectedValue3 === 'Select') {
      setErrorPerference3(true);
      isValid = false;
    } else {
      setErrorPerference3(false);
    }

    if (isValid) {
      try {
        const response = await fetch(`${baseUrl}${'jobfairregistration'}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userData?.User?.userId,
            studentId: studentID,
            mobile: studentMobile,
            preference1: perfID1,
            preference2: perfID2,
            preference3: perfID3,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Add Job Fair Done  ----', data);
          setStudentID();
          setStudentMobile();
          setSelectedValue5();
          setSelectedValue2();
          setSelectedValue3();
          navigation.goBack();
        } else {
          console.error('Fetch Error:', data);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={globalStyles.SafeAreaView}>
      <Header title="Job Fair Registration" navigation={navigation} />
      <View style={{flex: 1, backgroundColor: Colors.lite_gray}}>
        <ScrollView>
          <View
            style={{
              ...globalStyles.ViewINter1,
              margin: 10,
              borderBottomWidth: 1,
              borderColor: Colors.borderColor,
            }}>
            <Text
              style={{...globalStyles.headlineText, fontSize: 22, padding: 5}}>
              Job Fair Registration
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: Colors.white,
              marginHorizontal: 10,
              paddingVertical: 10,
            }}>
            <View
              style={{
                ...globalStyles.JobfiledSection,
                paddingHorizontal: 10,
                flex: 1,
              }}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  color: Colors.gray,
                }}>
                Name
              </Text>
              <View
                style={{
                  ...styles.textInput,
                  borderColor: Colors.gray,
                }}>
                <Text>{userData?.User?.name}</Text>
              </View>
            </View>

            <View
              style={{
                ...globalStyles.JobfiledSection,
                paddingHorizontal: 10,
                flex: 1,
              }}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  color: Colors.gray,
                }}>
                Email
              </Text>
              <View
                style={{
                  ...styles.textInput,
                  borderColor: Colors.gray,
                }}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{flexGrow: 1}}>
                  <Text>{userData?.User?.email}</Text>
                </ScrollView>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: Colors.white,
              marginHorizontal: 10,
            }}>
            <View
              style={{
                ...globalStyles.JobfiledSection,
                paddingHorizontal: 10,
                flex: 1,
              }}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  // color: errorStudentId ? Colors.error : Colors.gray,
                }}>
                Student Id *
              </Text>

              <TextInput
                style={{
                  ...styles.textInput,
                  borderColor: errorStudentId ? Colors.error : Colors.gray,
                }}
                onChangeText={value => {
                  setStudentID(value);
                  setErrorStudentId(value.trim().length === 0);
                }}
                value={studentID}
                keyboardType="default"
                multiline
                placeholderTextColor="#aaa"
              />
            </View>

            <View
              style={{
                ...globalStyles.JobfiledSection,
                paddingHorizontal: 10,
                flex: 1,
              }}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  // color: errorStudentMobile ? Colors.error : Colors.gray,
                }}>
                Mobile No *
              </Text>

              <TextInput
                style={{
                  ...styles.textInput,
                  borderColor: errorStudentMobile ? Colors.error : Colors.gray,
                }}
                onChangeText={value => {
                  setStudentMobile(value);
                  setErrorStudentMobile(value.trim().length === 0);
                }}
                value={studentMobile}
                keyboardType="default"
                multiline
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          <View style={{backgroundColor: 'white', marginHorizontal: 10}}>
            <Text style={globalStyles.MT_20_PH_10}>Preference 1 *</Text>
            <TouchableOpacity
              onPress={toggleDropdown5}
              style={{
                marginHorizontal: 10,
                ...styles.seclectIndiaView,
                borderColor: errorPerference1 ? Colors.error : Colors.gray,
              }}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  paddingBottom: 0,
                }}>
                {selectedValue5}
              </Text>
            </TouchableOpacity>
            {isOpen5 && (
              <View style={styles.dropdownList}>
                {industryData.map(item => (
                  <TouchableOpacity
                    key={item.Id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      selectOption5(item);
                    }}>
                    <Text style={styles.text}>{item?.Name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={{backgroundColor: 'white', marginHorizontal: 10}}>
            <Text style={globalStyles.MT_20_PH_10}>Preference 2 *</Text>
            <TouchableOpacity
              onPress={toggleDropdown2}
              style={{
                marginHorizontal: 10,
                ...styles.seclectIndiaView,
                borderColor: errorPerference2 ? Colors.error : Colors.gray,
              }}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  paddingBottom: 0,
                }}>
                {selectedValue2}
              </Text>
            </TouchableOpacity>
            {isOpen2 && (
              <View style={styles.dropdownList}>
                {industryData.map(item => (
                  <TouchableOpacity
                    key={item.Id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      selectOption2(item);
                    }}>
                    <Text style={styles.text}>{item?.Name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View
            style={{
              backgroundColor: 'white',
              marginHorizontal: 10,
              paddingBottom: 20,
            }}>
            <Text style={globalStyles.MT_20_PH_10}>Preference 3 *</Text>
            <TouchableOpacity
              onPress={toggleDropdown3}
              style={{
                marginHorizontal: 10,
                ...styles.seclectIndiaView,
                borderColor: errorPerference3 ? Colors.error : Colors.gray,
              }}>
              <Text
                style={{
                  ...styles.JobfiledSectionText,
                  paddingBottom: 0,
                }}>
                {selectedValue3}
              </Text>
            </TouchableOpacity>
            {isOpen3 && (
              <View style={styles.dropdownList}>
                {industryData.map(item => (
                  <TouchableOpacity
                    key={item.Id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      selectOption3(item);
                    }}>
                    <Text style={styles.text}>{item?.Name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={{...globalStyles.saveButton, marginHorizontal: 10}}
              onPress={() => {
                handleJobFair();
              }}>
              <Text style={globalStyles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: Colors.secondGreen,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
  },
  info: {
    color: '#444',
    fontSize: 12,
    marginTop: 2,
  },
  label: {
    fontSize: 16,
    paddingRight: 10,
    color: '#888',
  },

  JobfiledSectionText: {fontSize: 13, paddingBottom: 10, fontWeight: '700'},
  textInput: {
    paddingTop: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    height: 40,
  },
  mainView: {flex: 1, backgroundColor: Colors.white},
  headerView: {
    flex: 0.09,
    backgroundColor: Colors.white,
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
    borderColor: 'gray',
    borderRadius: 5,
    height: 40,
  },
  dobView: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dobText: {fontSize: 13},

  seconDOMView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '',
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
    borderRadius: 10,
    paddingVertical: 15,
    backgroundColor: Colors.main_primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveText: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: '700',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    flex: 0.44,
    backgroundColor: 'white',
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
  seclectIndiaView: {
    marginTop: 5,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  inputIcon: {
    position: 'absolute',
    right: 10, // Place the icon at the right of the TextInput
  },

  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 14,
    color: 'black',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#f9f9f9',
  },
  dropdownList: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    fontSize: 14,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
  },
});

export default JobFairRegistration;
