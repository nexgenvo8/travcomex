import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import globalStyles from '../screen/GlobalCSS';
import Header from '../screen/Header/Header';
import Colors from '../screen/color';
import Icon from '../screen/Icons/Icons';
import {useIsFocused} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AddCompanyApi,
  AddTalentEnquiry,
  AddTalentVideo,
  AddTestmonials,
  baseUrl,
  DeleteCompanyJob,
  DeleteCompanyPost,
  DeleteTalent,
  DeleteTalentVideo,
  DeleteTestmonials,
  ListTalentVideo,
  ListTestmonials,
  SendEnquiryEmail,
  UpdateCompany,
  UpdateTalentVideo,
} from '../screen/baseURL/api';
import {showError, showSuccess} from '../screen/components/Toast';
import {useTheme} from '../theme/ThemeContext';

const GuestDetails = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const {Item = {}, nextItems = []} = route.params || {};
  const {isDark, colors, toggleTheme} = useTheme();
  const [selectedSection, setSelectedSection] = useState('Biography & Topics');
  const sections = ['Biography & Topics', 'Video', 'Testimonials'];
  const sections1 = ['Biography & Topics'];
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input11, setInput11] = useState('');
  const [input22, setInput22] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [videoList, setVideoList] = useState([]);
  const [testmonial, setTestmonial] = useState([]);
  const [data, setData] = useState(false);
  const [value, setValue] = useState({
    name: '',
    item: '',
  });
  useEffect(() => {
    if (isFocused) {
      UserValue();
    }
  }, [isFocused]);

  const UserValue = async () => {
    try {
      const userDta = await AsyncStorage.getItem('userData');
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    } catch (error) {
      console.log('Error', 'Failed to load user data.');
    }
  };
  useEffect(() => {
    setLoading(true); // Ensure loading state is updated before fetching

    fetchTalentVideos();
    fetchTestimonials();
  }, [userData, data]);

  const fetchTalentVideos = async () => {
    try {
      const response = await fetch(`${baseUrl}${ListTalentVideo}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          userId: '',
          talentVideoTitle: '',
        }),
      });

      const result = await response.json();
      setVideoList(result.data);
    } catch (error) {
      console.error('Error fetching talent videos:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTestimonials = async () => {
    if (!userData) return;

    try {
      const response = await fetch(`${baseUrl}${ListTestmonials}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          userId: userData?.User?.userId,
          talentVideoTitle: '',
        }),
      });

      const result = await response.json();
      setTestmonial(result.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    const data = {
      id: value?.item?.id || Item?.id || Item?.Id || '',
      userId: Item?.UserId,
      talentVideoTitle: input1,
      talentVideoURL: input2,
      talentId: Item?.Id,
    };

    console.log('data', data);
    try {
      const response = await fetch(
        `${baseUrl}${
          value?.name === 'EditVedio' ? UpdateTalentVideo : AddTalentVideo
        }`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: value?.item?.id || Item?.id || Item?.Id || '',
            userId: Item?.UserId,
            talentVideoTitle: input1,
            talentVideoURL: input2,
            talentId: Item?.Id,
          }),
        },
      );

      const data = await response.json();
      if (data) {
        fetchTalentVideos();
        setModalVisible(false);
        setData(true);
        setInput1();
        setInput2();
      } else {
        showError('Something went wrong');
      }
    } catch (error) {
      console.error('Follow API Error:', error);
    }
  };
  const handleTestimonial = async () => {
    const Data = {
      userId: Item?.UserId,
      testimonialsDetails: input11,
      testimonialsName: input22,
      talentId: Item?.Id,
    };
    try {
      const response = await fetch(`${baseUrl}${AddTestmonials}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Data),
      });

      const data = await response.json();
      if (data) {
        fetchTestimonials();
        setModalVisible1(false);
        setData(true);
        setInput11();
        setInput22();
      } else {
        showError('Something went wrong');
      }
    } catch (error) {
      console.error('Follow API Error:', error);
    }
  };
  const handleDeleteComment = (type, item) => {
    console.log('type', type);
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this Talent?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              let apiUrl = `${baseUrl}${DeleteTalent}`; // Default API

              if (type === 'DeleteVideo') {
                apiUrl = `${baseUrl}${DeleteTalentVideo}`;
              } else if (type === 'Testimonial') {
                apiUrl = `${baseUrl}${DeleteTestmonials}`;
              }

              const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: item?.id || Item?.id || Item?.Id, // Corrected item reference
                }),
              });

              const data = await response.json();
              if (response.ok) {
                console.log('Delete Response:', data);
                setData(true);
              }
              setData(false);
            } catch (error) {
              console.error('Delete Error:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const [errorName, setErrorName] = useState(false);
  const [errorMobile, setErrorMobile] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleSendEnquiry = async () => {
    setLoading(true);
    setErrorName(false);
    setErrorMobile(false);
    setErrorEmail(false);
    setErrorMessage(false);
    let isValid = true;
    if (!name.trim()) {
      setErrorName(true);
      isValid = false;
    }
    if (!mobile.trim()) {
      setErrorMobile(true);
      isValid = false;
    } else {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobile.trim())) {
        showError('Please enter a valid mobile number');
        setErrorMobile(true);
        isValid = false;
      }
    }
    if (!email.trim()) {
      showError('Email is required');
      setErrorEmail(true);
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        showError('Please enter a valid email address');
        setErrorEmail(true);
        isValid = false;
      }
    }
    if (!message.trim()) {
      setErrorMessage(true);
      isValid = false;
    }
    if (!isValid) {
      setLoading(false);
      return;
    }
    try {
      console.log('Sending enquiry to:', `${baseUrl}${AddTalentEnquiry}`);
      const payload = JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        message: message.trim(),
        userId: Item?.UserId,
        talentId: Item?.Id,
      });
      const response = await fetch(`${baseUrl}${AddTalentEnquiry}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: payload,
      });
      const responseText = await response.text();
      if (!response.ok) {
        console.error(`Error ${response.status}:`, responseText);
        setLoading(false);
        return;
      }
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        console.error('Invalid JSON Response:', responseText);
        setLoading(false);
        return;
      }
      if (data) {
        showSuccess(data.message);
        setModalVisible2(false);

        const emailResponse = await fetch(`${baseUrl}${SendEnquiryEmail}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            to: 'rkumarsharma101@gmail.com',
            subject: 'Collaboration Request',
            userId: Item?.UserId,
            templateId: 43,
            senderName: name.trim(),
            senderPhoneNumber: mobile.trim(),
            senderEmail: email.trim(),
            senderMsg: message.trim(),
          }),
        });
        const emailResponseText = await emailResponse.text();
        if (!emailResponse.ok) {
          showError('Failed to send email');
          setLoading(false);
          return;
        }
        try {
          const emailData = JSON.parse(emailResponseText);
          console.log('Email Sent Response:', emailData);
        } catch {
          console.error('Invalid Email API Response:', emailResponseText);
        }
        setModalVisible(false);
        setData(true);
        setName('');
        setEmail('');
        setMobile('');
        setMessage('');
      } else {
        showError('Something went wrong');
      }
    } catch (error) {
      console.error('API Request Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}>
      <Header title="Guest Details" navigation={navigation} />
      <View style={{flex: 1}}>
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              margin: 10,
              marginTop: 20,
              borderBottomWidth: 3,
              paddingBottom: 20,
              borderColor: colors.textinputbordercolor,
            }}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <View style={{position: 'relative'}}>
                <Image
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 10,
                    borderWidth: 3,
                    borderColor: colors.textinputbordercolor,
                  }}
                  resizeMode="cover"
                  source={
                    Item.TalentProfilePhoto
                      ? {uri: Item.TalentProfilePhoto}
                      : require('../assets/noimageplaceholder.png')
                  }
                />
              </View>
            </View>

            <View
              style={{paddingLeft: 10, flexShrink: 1, marginTop: 10, flex: 1}}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '600',
                  color: colors.textColor,
                }}>
                {Item?.TalentName}
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  color: colors.placeholderTextColor,
                  paddingTop: 4,
                }}>
                {Item?.ShortDescription}
              </Text>
              {Item?.UserId == userData?.User?.userId ? null : (
                <TouchableOpacity
                  onPress={() => setModalVisible2(true)}
                  style={{
                    backgroundColor: '#359cd0',
                    alignSelf: 'flex-start',
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{color: colors.ButtonTextColor, fontWeight: '700'}}>
                    Send Enquiry
                  </Text>
                </TouchableOpacity>
              )}
              <Modal
                onRequestClose={() => setModalVisible2(false)}
                visible={modalVisible2}
                transparent
                animationType="slide">
                <View style={styles.modalContainer}>
                  <View
                    style={{
                      ...styles.modalContent,
                      backgroundColor: colors.modelBackground,
                    }}>
                    <Text style={{...styles.title, color: colors.textColor}}>
                      Send Enquiry
                    </Text>

                    <Text style={{color: colors.textColor}}>
                      Name<Text style={{color: 'red'}}> *</Text>
                    </Text>
                    <TextInput
                      style={{
                        ...styles.input,
                        borderColor: errorName
                          ? Colors.error
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}
                      placeholder=""
                      value={name}
                      // onChangeText={setName}
                      onChangeText={value => {
                        setName(value);
                        setErrorName(value.trim().length === 0);
                      }}
                    />
                    <Text style={{color: colors.textColor}}>
                      Mobile<Text style={{color: 'red'}}> *</Text>
                    </Text>
                    <TextInput
                      maxLength={10}
                      keyboardType="numeric"
                      style={{
                        ...styles.input,
                        borderColor: errorMobile
                          ? Colors.error
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}
                      placeholder=""
                      value={mobile}
                      // onChangeText={setMobile}
                      onChangeText={value => {
                        setMobile(value);
                        setErrorMobile(value.trim().length === 0);
                      }}
                    />
                    <Text style={{color: colors.textColor}}>
                      Email<Text style={{color: 'red'}}> *</Text>
                    </Text>
                    <TextInput
                      style={{
                        ...styles.input,
                        borderColor: errorEmail
                          ? Colors.error
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                        backgroundColor: colors.textinputBackgroundcolor,
                      }}
                      placeholder=""
                      value={email}
                      // onChangeText={setEmail}
                      onChangeText={value => {
                        setEmail(value);
                        setErrorEmail(value.trim().length === 0);
                      }}
                    />
                    <Text style={{color: colors.textColor}}>Message</Text>
                    <TextInput
                      style={{
                        ...styles.input,
                        height: 90,
                        borderColor: errorMessage
                          ? Colors.error
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                        backgroundColor: colors.textinputBackgroundcolor,
                        // textAlign: 'auto',
                      }}
                      placeholder=""
                      value={message}
                      // onChangeText={setMessage}
                      onChangeText={value => {
                        setMessage(value);
                        setErrorMessage(value.trim().length === 0);
                      }}
                    />

                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => setModalVisible2(false)}>
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          ...styles.button,
                          backgroundColor: colors.AppmainColor,
                        }}
                        onPress={handleSendEnquiry}>
                        <Text
                          style={{
                            ...styles.buttonText,
                            color: colors.ButtonTextColor,
                          }}>
                          Save
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>

            {Item?.UserId == userData?.User?.userId && (
              <View
                style={{
                  flex: 0.3,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <TouchableOpacity
                  style={{}}
                  onPress={() =>
                    navigation.navigate('AddTelentProfile', {
                      Item: Item,
                    })
                  }>
                  <Icon
                    name="pencil"
                    color={colors.backIconColor}
                    size={20}
                    type="Octicons"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteComment}>
                  <Icon
                    name="delete"
                    color={colors.backIconColor}
                    size={20}
                    type="MaterialCommunityIcons"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Section Tabs */}
          <View style={{flexDirection: 'row', padding: 10}}>
            {(Item?.UserId === userData?.User?.userId
              ? sections
              : sections1
            ).map(section => {
              const isBiography = section === 'Biography & Topics';
              const isSelected = selectedSection === section;
              const isDisabled = isBiography;

              return (
                <TouchableOpacity
                  key={section}
                  disabled={isDisabled}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: isSelected
                      ? colors.AppmainColor
                      : 'transparent',
                    borderRadius: 5,
                    //  opacity: isDisabled ? 0.5 : 1,
                  }}
                  onPress={() => {
                    if (!isDisabled) {
                      setSelectedSection(section);
                    }
                  }}>
                  <Text
                    style={{
                      color: isSelected ? 'white' : 'black',
                      fontWeight: '700',
                    }}>
                    {section}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* <View style={{flexDirection: 'row', padding: 10}}>
            {(Item?.UserId === userData?.User?.userId
              ? sections
              : sections1
            ).map(section => (
              <TouchableOpacity
                key={section}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  padding: 10,
                  backgroundColor:
                    selectedSection === section
                      ? Colors.secondGreen
                      : 'transparent',
                  borderRadius: 5,
                }}
                onPress={() => setSelectedSection(section)}>
                <Text
                  style={{
                    color: selectedSection === section ? 'white' : 'black',
                    fontWeight: '700',
                  }}>
                  {section}
                </Text>
              </TouchableOpacity>
            ))}
          </View> */}

          {/* Content based on selected section */}
          <View style={{padding: 20}}>
            {selectedSection === 'Biography & Topics' && (
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '600',
                      color: colors.textColor,
                    }}>
                    Biography
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      paddingTop: 10,
                      color: colors.textColor,
                      lineHeight: 22,
                      textAlign: 'justify',
                    }}>
                    {Item?.LongDescription}
                  </Text>
                </View>
                <View style={{marginTop: 30}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginBottom: 10,
                      color: colors.textColor,
                    }}>
                    Topics
                  </Text>
                </View>

                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {Item?.CategoryNames?.split(',').map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 15,
                        marginRight: 8,
                        marginBottom: 8,
                        justifyContent: 'center',
                        borderWidth: 1.5,
                        borderColor: colors.AppmainColor,
                      }}>
                      <Text style={{color: colors.textColor, fontSize: 14}}>
                        {item.trim()}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {selectedSection === 'Video' && (
              <View>
                <>
                  <TouchableOpacity
                    style={{
                      ...globalStyles.saveButton,
                      backgroundColor: colors.AppmainColor,
                    }}
                    onPress={() => setModalVisible(true)}>
                    <Text
                      style={{
                        ...globalStyles.saveButtonText,
                        color: colors.ButtonTextColor,
                      }}>
                      Add Video
                    </Text>
                  </TouchableOpacity>
                </>

                <Modal visible={modalVisible} transparent animationType="slide">
                  <View style={styles.modalContainer}>
                    <View
                      style={{
                        ...styles.modalContent,
                        backgroundColor: colors.modelBackground,
                      }}>
                      <Text style={{...styles.title, color: colors.textColor}}>
                        Add Video
                      </Text>

                      <TextInput
                        style={{
                          ...styles.input,
                          borderColor: colors.textinputbordercolor,
                          color: colors.textColor,
                          backgroundColor: colors.textinputBackgroundcolor,
                        }}
                        placeholder="Enter Video Name"
                        value={input1}
                        onChangeText={setInput1}
                        placeholderTextColor={colors.placeholderTextColor}
                      />
                      <TextInput
                        style={{
                          ...styles.input,
                          borderColor: colors.textinputbordercolor,
                          color: colors.textColor,
                          backgroundColor: colors.textinputBackgroundcolor,
                        }}
                        placeholder="Enter Video url"
                        value={input2}
                        onChangeText={setInput2}
                        placeholderTextColor={colors.placeholderTextColor}
                      />

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={[styles.button, styles.cancelButton]}
                          onPress={() => setModalVisible(false)}>
                          <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            ...styles.button,
                            backgroundColor: colors.AppmainColor,
                          }}
                          onPress={handleSave}>
                          <Text
                            style={{
                              ...styles.buttonText,
                              color: colors.ButtonTextColor,
                            }}>
                            Save
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>

                {loading ? (
                  <ActivityIndicator
                    size="large"
                    color={colors.AppmainColor}
                    style={{marginTop: 20}}
                  />
                ) : (
                  <FlatList
                    data={videoList}
                    keyExtractor={item => item?.Id?.toString}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        onPress={() => {
                          if (item?.talentVideoURL?.url) {
                            Linking.openURL(item.talentVideoURL.url);
                          }
                        }}>
                        <View
                          style={{
                            padding: 15,
                            borderWidth: 1,
                            borderColor: colors.textinputbordercolor,
                            marginTop: 10,
                            flexDirection: 'row',
                          }}>
                          <View style={{}}>
                            <Image
                              source={{uri: item.talentVideoURL.thumbnail}}
                              style={{
                                width: 100,
                                height: 90,
                                borderRadius: 8,
                              }}
                              resizeMode="cover"
                            />
                          </View>

                          <View
                            style={{
                              paddingLeft: 10,
                              flex: 1,
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: colors.textColor,
                              }}>
                              {item?.talentVideoTitle}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setValue(prev => ({
                                ...prev,
                                name: 'EditVideo',
                                item: item,
                              }));
                              setInput1(item?.talentVideoTitle),
                                setInput2(item?.talentVideoURL?.url),
                                setModalVisible(true);
                            }}
                            style={{flex: 0.1}}>
                            <Icon
                              name="pencil"
                              type="Octicons"
                              color={colors.backIconColor}
                              size={18}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              handleDeleteComment('DeleteVideo', item)
                            }
                            style={{flex: 0.1}}>
                            <Icon
                              name="cross"
                              size={20}
                              color={colors.placeholderTextColor}
                              type="Entypo"
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            )}

            {Item?.UserId == userData?.User?.userId &&
              selectedSection === 'Testimonials' && (
                <View>
                  <View
                    style={{
                      marginVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: colors.textColor,
                      }}>
                      Testimonials
                    </Text>
                    <TouchableOpacity
                      style={{...globalStyles.saveButton, padding: 10}}
                      onPress={() => setModalVisible1(true)}>
                      <Text
                        style={{
                          ...globalStyles.saveButtonText,
                          backgroundColor: colors.AppmainColor,
                        }}>
                        Add Testimonial
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{paddingVertical: 10}}>
                    <Text style={{color: colors.textColor}}>
                      I am Sakshi Chouhan I am an expert in providing healthcare
                      and lifestyle advice. if you need any type of advice
                      related to improving your healthcare or developing your
                      lifestyle, you can connect with me.
                    </Text>
                  </View>

                  <View>
                    {testmonial?.map(employee => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ProfileDetails', {
                            Item: employee,
                          })
                        }
                        key={employee.UserId}
                        style={{
                          padding: 10,
                          borderWidth: 1,
                          borderColor: colors.textinputbordercolor,
                          flexDirection: 'row',
                          // justifyContent:"space-around"
                          justifyContent: 'space-between',
                        }}>
                        <Icon
                          type="FontAwesome"
                          name="quote-left"
                          size={20}
                          color={colors.placeholderTextColor}
                        />
                        <View style={{alignItems: 'center'}}>
                          <Text
                            style={{
                              color: colors.textColor,
                              fontSize: 16,
                              fontWeight: '500',
                            }}>
                            {employee?.testimonialsName}
                          </Text>
                          <Text
                            style={{
                              color: colors.placeholderTextColor,
                              fontSize: 13,
                            }}>
                            {employee.testimonialsDetails}
                          </Text>
                        </View>

                        <Icon
                          type="FontAwesome"
                          name="quote-right"
                          size={20}
                          color={colors.placeholderTextColor}
                        />
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity
                            onPress={() =>
                              handleDeleteComment('Testimonial', employee)
                            }>
                            <Icon
                              name="cross"
                              size={20}
                              color={colors.placeholderTextColor}
                              type="Entypo"
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Modal
                    visible={modalVisible1}
                    transparent
                    animationType="slide">
                    <View style={styles.modalContainer}>
                      <View
                        style={{
                          ...styles.modalContent,
                          backgroundColor: colors.modelBackground,
                        }}>
                        <Text
                          style={{...styles.title, color: colors.textColor}}>
                          Add Testimonial
                        </Text>

                        <TextInput
                          style={{
                            ...styles.input,
                            borderColor: colors.textinputbordercolor,
                            color: colors.textColor,
                            backgroundColor: colors.textinputBackgroundcolor,
                          }}
                          placeholder="Enter Testimonial (max 500 characters)"
                          value={input11}
                          onChangeText={setInput11}
                          placeholderTextColor={colors.placeholderTextColor}
                        />
                        <TextInput
                          style={{
                            ...styles.input,
                            borderColor: colors.textinputbordercolor,
                            color: colors.textColor,
                            backgroundColor: colors.textinputBackgroundcolor,
                          }}
                          placeholder="Testimonial By"
                          value={input22}
                          onChangeText={setInput22}
                          placeholderTextColor={colors.placeholderTextColor}
                        />

                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => setModalVisible1(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              ...styles.button,
                              backgroundColor: colors.AppmainColor,
                            }}
                            onPress={handleTestimonial}>
                            <Text
                              style={{
                                ...styles.buttonText,
                                color: colors.ButtonTextColor,
                              }}>
                              Save
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 10,
    // margin: 10,
    backgroundColor: 'white',
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
    // color: Colors.secondGreen,
  },
  info: {
    color: '#444',
    fontSize: 12,
    marginTop: 2,
  },

  textInput: {
    paddingTop: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    height: 40,
  },
  headerView: {
    flex: 0.09,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
  },
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
  container: {flex: 1, padding: 10, backgroundColor: '#fff'},
  inputContainer: {flexDirection: 'row', marginTop: 20},
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    // borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: Colors.secondGreen,
    padding: 12,
    marginLeft: 10,
    borderRadius: 8,
  },
  addText: {color: '#fff', fontWeight: 'bold'},
  skillTag: {
    backgroundColor: Colors.secondGreen,
    padding: 8,
    margin: 5,
    borderRadius: 20,
  },
  skillText: {color: '#fff', fontWeight: 'bold'},
  modalContainer: {
    flex: 1,
    padding: 20,
    // backgroundColor: 'white',
  },
  bullet: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 5,
    color: Colors.main_primary,
  },
  itemText: {
    fontSize: 17,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    marginBottom: 10,
  },
  closeText: {
    color: 'blue',
    fontSize: 16,
  },
  jobItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    // backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    // backgroundColor: Colors.main_primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default GuestDetails;
