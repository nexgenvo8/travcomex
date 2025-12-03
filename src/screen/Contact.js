import {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import Colors from './color';
import Icon1 from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  baseUrl,
  contactList,
  PendingContactRequest,
  sendRequestapi,
  knownPeople,
  declinerequest,
  acceptrequest,
  removecontact,
  cancelContactRequest,
} from './baseURL/api';
import globalStyles from './GlobalCSS';
import CommonLoader from './components/CommonLoader';
import {showError, showSuccess} from './components/Toast';
import {useTheme} from '../theme/ThemeContext';
import {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import Header from './Header/Header';

const Contacts = ({navigation, tabBarVisible, route}) => {
  const {ContactsScreen} = route.params;
  const {isDark, colors, toggleTheme} = useTheme();
  const debounceTimer = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  // const [number, onChangeNumber] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [userData, setUserData] = useState(null);
  const [knownPeopleData, setknownPeopleData] = useState([]);
  const [pendingRequestList, setPendingRequestList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [number, setNumber] = useState('');
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
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, []);
  const onChangeNumber = value => {
    setNumber(value);
  };
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
      PendingRequestList();
      InterestsList();
    }
  }, [refresh, userData?.User?.userId]);

  const InterestsList = async (searchValue, pageNumber) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (loading) return;
    setLoading(true);
    // setInitialLoading(true);
    try {
      const response = await fetch(`${baseUrl}${knownPeople}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          userId: userData?.User?.userId,
          search: searchValue,
          per_page: 20,
          page: pageNumber || page,
        }),
        signal: controller.signal,
      });

      const data = await response.json();
      if (response.ok) {
        setknownPeopleData(prev =>
          pageNumber === 1 ? data?.Users : [...prev, ...data?.Users],
        );
        setPage(prev => (pageNumber ? pageNumber + 1 : prev + 1));
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        showError('Error', 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
      //   setInitialLoading(false);
    }
  };
  const handleSearch = value => {
    setNumber(value);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setknownPeopleData([]);
      setPage(1);
      InterestsList(value, 1);
    }, 300);
  };
  const PendingRequestList = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch(`${baseUrl}${PendingContactRequest}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId?.toString(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        //setInitialLoading(false);
        setPendingRequestList(data);
      }
    } catch (error) {
      showError('Failed to fetch Pending Request');
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };
  const accecptRequest = async ({item}) => {
    try {
      const url = `${baseUrl}${acceptrequest}`;
      console.log('Final URL:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderUserId: item?.SenderUserDetail?.UserId,
          receiverUserId: userData?.User?.userId?.toString(),
        }),
      });
      console.log('Response Status:', response.status);
      const data = await response.json();
      console.log('API Response Data:', data);

      if (response.ok) {
        setRefresh(!refresh);
        console.log('Accecpt Request Success ----->>>', JSON.stringify(data));
      } else {
        console.error('API Error:', data);
      }
    } catch (error) {
      console.error('Fetch Error:', error.message);
    }
  };
  const cancelContactRequestApi = async ({item}) => {
    try {
      const payload = JSON.stringify({
        id: item.id,
      });
      const url = `${baseUrl}${cancelContactRequest}`;
      console.log('Final URL:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });

      console.log('Response Status:', response.status);

      const data = await response.json();

      console.log('API Response Data:', data);

      if (response.ok) {
        setRefresh(!refresh);
        showSuccess(data.Message);
        console.log('Delete Request Success ----->>>', JSON.stringify(data));
      } else {
        console.error('API Error:', data);
      }
    } catch (error) {
      console.error('Fetch Error:', error.message);
    }
  };
  const deleteRequest = async ({item}) => {
    try {
      const payload = JSON.stringify({
        id: item.id,
      });
      const url = `${baseUrl}${declinerequest}`;
      console.log('Final URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });

      console.log('Response Status:', response.status);
      const data = await response.json();
      console.log('API Response Data:', data);

      if (response.ok) {
        setRefresh(!refresh);
        console.log('Delete Request Success ----->>>', JSON.stringify(data));
      } else {
        console.error('API Error:', data);
      }
    } catch (error) {
      console.error('Fetch Error:', error.message);
    }
  };
  const renderItem1 = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProfileDetails', {
            Item: item.SenderUserDetail,
          })
        }
        style={globalStyles.contantlistMainView}>
        <View>
          <Image
            style={globalStyles.contantlistImage}
            source={
              item?.SenderUserDetail?.ProfileUrl ||
              item?.SenderUserDetail?.ProfilePhoto
                ? {
                    uri:
                      item.SenderUserDetail.ProfileUrl ||
                      item.SenderUserDetail.ProfilePhoto,
                  }
                : require('../assets/placeholderprofileimage.png')
            }
          />
        </View>
        <View style={{padding: 10, flex: 1}}>
          <Text
            style={{fontSize: 16, fontWeight: '600', color: colors.textColor}}>
            {item?.SenderUserDetail?.UserName}
          </Text>
          <Text style={{color: colors.placeholderTextColor, marginBottom: 5}}>
            {item?.SenderUserDetail?.JobTitle} at{' '}
            {item?.SenderUserDetail?.CompanyName}
          </Text>
        </View>
        <View style={{flexDirection: 'row', flex: 0.4}}>
          <TouchableOpacity
            style={{
              ...globalStyles.PendingIcons,
              borderColor: colors.textinputbordercolor,
            }}
            onPress={() => {
              cancelContactRequestApi({item});
            }}>
            <Icon1 name="close" size={15} color={colors.backIconColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...globalStyles.PendingIcons,
              borderColor: colors.textinputbordercolor,
            }}
            onPress={() => {
              accecptRequest({item});
            }}>
            <Icon1 name="check" size={15} color={colors.backIconColor} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  const sendRequest = async ({item}) => {
    try {
      const payload = JSON.stringify({
        senderUserId: userData?.User?.userId,
        receiverUserId: item?.UserId,
      });
      const url = `${baseUrl}${sendRequestapi}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });

      const text = await response.text();
      console.log('Raw response:', text);
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON. Response was:', text);
        throw new Error('Invalid JSON response');
      }
      if (response.ok) {
        setknownPeopleData(prevData =>
          prevData.map(user =>
            user.UserId === item.UserId ? {...user, IsRequestSent: true} : user,
          ),
        );
        console.log('Send Request Success ----->>>', JSON.stringify(data));
        showSuccess(data.Message);
      } else {
        console.error('API Error:', data);
      }
    } catch (error) {
      console.error('Fetch Error:', error.message);
    }
  };
  const handleScroll = event => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    if (contentOffsetY + scrollViewHeight >= contentHeight - 20) {
      if (!loading) {
        InterestsList();
      }
    }
  };
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          ...globalStyles.contantlistMainView,
          borderColor: colors.textinputbordercolor,
          padding: 0,
        }}
        onPress={() =>
          navigation.navigate('ProfileDetails', {
            Item: item,
            groupId: item?.Id,
          })
        }>
        <Image
          style={globalStyles.contantlistImage}
          source={
            item?.ProfilePhoto
              ? {uri: item?.ProfilePhoto}
              : require('../assets/placeholderprofileimage.png')
          }
        />
        <View style={{padding: 10, flex: 1}}>
          <Text
            style={{...globalStyles?.FS_16_FW_400, color: colors.textColor}}>
            {item?.UserName}
          </Text>
          <Text style={{color: colors.placeholderTextColor, marginBottom: 5}}>
            at {item?.CompanyName || item?.title}
          </Text>

          {item?.IsRequestSent ? (
            <View
              style={{
                ...globalStyles?.SendBtn,
                borderColor: colors.textinputbordercolor,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  textAlign: 'center',
                  color: colors.textColor,
                }}>
                Already Send
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                ...globalStyles?.SendBtn,
                borderColor: colors.textinputbordercolor,
                alignItems: 'center',
                flexDirection: 'row',
              }}
              onPress={() => {
                sendRequest({item});
              }}>
              <Icon1
                name="plus"
                size={15}
                color={colors.backIconColor}
                style={{paddingHorizontal: 5}}
              />
              <Text style={{fontSize: 15, color: colors.textColor}}>
                Send Request
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  if (initialLoading) {
    return <CommonLoader visible={true} />;
  }
  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}>
      {ContactsScreen ? (
        <Header title="Contacts" navigation={navigation} />
      ) : null}
      <View style={globalStyles.FX_1_BG_LiteGray}>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 20,
            margin: 10,
          }}>
          <Text
            style={{
              fontSize: 17,
              color: colors.AppmainColor,
              paddingBottom: 10,
            }}>
            Search for Contacts
          </Text>
          <TextInput
            ref={inputRef}
            style={{
              ...globalStyles.textInput,
              borderColor: colors.textinputbordercolor,
              color: colors.textColor,
              backgroundColor: colors.textinputBackgroundcolor,
            }}
            onChangeText={handleSearch}
            value={number}
            placeholder="Enter Name or email address"
            keyboardType="default"
            placeholderTextColor={colors.placeholderTextColor}
            returnKeyType="done"
          />
        </View>

        <ScrollView
          // onScroll={scrollHandler}
          // scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          // onScroll={handleScroll}
          // scrollEventThrottle={400}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('ContactList')}
            style={{
              backgroundColor: colors.textinputBackgroundcolor,
              marginHorizontal: 10,
              marginBottom: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={globalStyles?.flexRow}>
              <Icon1
                name="contacts"
                size={18}
                color={colors.placeholderTextColor}
              />
              <View style={{paddingLeft: 3}}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '600',
                    color: colors.textColor,
                  }}>
                  My Contact List
                </Text>
              </View>
            </View>

            <Icon1 name="right" size={15} color={colors.backIconColor} />
          </TouchableOpacity>
          <FlatList
            data={pendingRequestList?.DataList}
            keyExtractor={item => item.id}
            renderItem={renderItem1}
          />
          <View>
            <View
              style={{
                marginHorizontal: 10,
                paddingLeft: 10,
                paddingBottom: 10,
                borderBottomWidth: 0.5,
                borderColor: colors.textinputbordercolor,
              }}>
              <Text style={{fontSize: 20, color: colors.AppmainColor}}>
                People you may know
              </Text>
            </View>

            <View style={{marginBottom: 40}}>
              {/* {knownPeopleData?.map((item, index) => renderItem({item: item}))} */}
              <FlatList
                data={knownPeopleData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => renderItem({item})}
              />
            </View>

            {loading && (
              <Text
                style={{
                  textAlign: 'center',
                  padding: 10,
                  color: colors.textColor,
                }}>
                Loading...
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Contacts;
