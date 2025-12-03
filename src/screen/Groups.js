import React, {useEffect, useState, useRef, useCallback} from 'react';
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
  Alert,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {AddGroup, baseUrl, DeleteGroup, ListGroup} from './baseURL/api';
import Colors from './color';
import GroupIcon from 'react-native-vector-icons/FontAwesome';
import CrossIcon from 'react-native-vector-icons/Entypo';
import CheckIcon from 'react-native-vector-icons/Ionicons';
import DownIcon from 'react-native-vector-icons/AntDesign';
import globalStyles from './GlobalCSS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from './Icons/Icons';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Header from './Header/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {showError, showSuccess} from './components/Toast';
import CommonLoader from './components/CommonLoader';
import {useTheme} from '../theme/ThemeContext';
import {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {universityFullName} from './constants';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const Groups = ({navigation, route, tabBarVisible}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const isFocused = useIsFocused();
  const {GroupData = {}} = route.params || {};
  const debounceTimer = useRef(null);
  const abortControllerRef = useRef(null);
  const [number, onChangeNumber] = useState('');
  const [myGroups, setMyGroups] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [discover, setDiscover] = useState(true);
  console.log('discover', discover);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const options = ['Public', 'Private'];
  const [selectedValue, setSelectedValue] = useState('Public');
  const [GName, setGName] = useState('');
  const [shortGDesciption, setShortGDesciption] = useState('');
  const [userData, setUserData] = useState([]);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const [groups, setGroups] = useState([]);
  const [myGroupsPrivte, setMYGroupsPrivte] = useState([]);
  const [checked, setChecked] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [gNameError, setGNameError] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const perPage = 4;
  const [refreshing, setRefreshing] = useState(false);
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
  const handleRefresh = async () => {
    console.log('🔄 Pull-to-refresh triggered');
    setRefreshing(true);
    await fetchGroups('', 1, false);
    setRefreshing(false);
  };
  const UserValue = async () => {
    const userDta = await AsyncStorage.getItem('userData');
    const parsedData = JSON.parse(userDta);
    setUserData(parsedData);
  };

  useEffect(() => {
    UserValue();
  }, []);
  // useEffect(() => {
  //   if (!userData) return;

  //   fetchGroups('', 1, true);
  //   myGroupsPrivateList();
  // }, [userData]);
  useFocusEffect(
    useCallback(() => {
      if (!userData) return;

      fetchGroups('', 1, true);
      myGroupsPrivateList();
    }, [userData]),
  );
  const loadMoreGroups = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    fetchGroups('', nextPage);
  };

  const fetchGroups = async (
    searchValue = '',
    currentPage = 1,
    showInitialLoader = false,
  ) => {
    console.log('📥 fetchGroups called with page:', currentPage);

    if (!userData) {
      console.log('❗ No userData — exiting early');
      if (currentPage === 1 && showInitialLoader) setInitialLoading(false);
      return;
    }

    if (loading && currentPage !== 1) {
      console.log('⏳ Already loading — skipping');
      return;
    }

    if (currentPage === 1 && showInitialLoader) {
      setInitialLoading(true);
      console.log('🚀 Setting initial loading');
    }

    setLoading(true);
    console.log('🔄 Fetching from server...');

    try {
      const response = await fetch(`${baseUrl}${ListGroup}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          groupType: 0,
          search: searchValue || '',
          per_page: 10,
          page: currentPage,
        }),
      });
      const result = await response.json();
      console.log('✅ API response:', result);

      if (response.ok) {
        const newData = result?.Data || [];
        setGroups(prev =>
          currentPage === 1 ? newData : [...prev, ...newData],
        );
        setHasMore(newData.length === 10);
        setPage(currentPage);
      } else {
        console.error('❌ Server error:', result.message);
      }
    } catch (error) {
      console.error('🔥 Fetch failed:', error);
    } finally {
      console.log('🏁 Finished fetch — resetting loaders');
      setLoading(false);
      if (currentPage === 1 && showInitialLoader) setInitialLoading(false);
    }
  };
  const myGroupsPrivateList = async (
    searchValue = '',
    pageNum = 1,
    isLoadMore = false,
  ) => {
    if (!userData || (!hasMore && isLoadMore)) return;

    if (isLoadMore) {
      setIsFetchingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch(`${baseUrl}${ListGroup}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          groupType: 1,
          search: searchValue,
          per_page: perPage,
          page: pageNum,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        const newData = result.Data || [];
        if (isLoadMore) {
          setMYGroupsPrivte(prev => [...prev, ...newData]);
        } else {
          setMYGroupsPrivte(newData);
        }
        setHasMore(newData.length === perPage);
      } else {
        console.error('Error fetching groups:', result.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };
  const handleLoadMore = () => {
    if (!isFetchingMore && hasMore) {
      const nextPage = page + 1;
      myGroupsPrivateList('', nextPage, true);
      setPage(nextPage);
    }
  };
  const renderFooter = () => {
    if (!myGroupsPrivte || myGroupsPrivte.length === 0) {
      return null;
    }

    if (!hasMore) return null;

    if (isFetchingMore) {
      return (
        <ActivityIndicator
          size="small"
          color={colors.AppmainColor}
          style={{margin: 10}}
        />
      );
    }

    return (
      <TouchableOpacity
        onPress={handleLoadMore}
        style={{padding: 10, alignItems: 'center'}}>
        <Text style={{color: Colors.main_primary}}>View More</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    myGroupsPrivateList('', 1, false);
  }, []);

  const selectOption = option => {
    setSelectedValue(option);
    setIsOpen(false);
  };
  useEffect(() => {
    if (modalVisible2) {
      setSelectedValue('Public');
    }
  }, [modalVisible2]);
  const handleSaveKeySkill = async () => {
    if (GName.trim().length === 0) {
      setGNameError(true);
      return;
    }
    try {
      const requestBody = {
        userId: userData?.User?.userId,
        groupName: GName,
        groupDetails: shortGDesciption,
        groupType: selectedValue === 'Public' ? 0 : 1,
      };
      const response = await fetch(`${baseUrl}${AddGroup}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // const data = await response.json();
      // console.log(data, 'responseresponseresponseresponse');
      const text = await response.text(); // Read the raw response
      console.log('Raw response text:', text);
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        return;
      }

      if (response.ok) {
        showSuccess(data.Message);
        setModalVisible2(false);
        fetchGroups();
        setGName('');
        setShortGDesciption('');
        // setSelectedValue('');
        setChecked(false);
        setIsOpen(false);
      } else {
        showError(data.message || 'Failed to create group.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleSearch = value => {
    onChangeNumber(value);
    clearTimeout(debounceTimer.current);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    debounceTimer.current = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      setGroups([]);
      fetchGroups(value, 1, false);
    }, 300);
  };

  const handleDeleteComment = item => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this Group?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await fetch(`${baseUrl}${DeleteGroup}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: item?.id,
                }),
              });

              const data = await response.json();

              if (response.ok) {
                fetchGroups();
              } else {
                showError('Failed to delete the item. Please try again later.');
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
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          ...globalStyles.GroupsListView,
          position: 'relative',
          backgroundColor: colors.textinputBackgroundcolor,
          borderWidth: 0.2,
          borderColor: colors.textinputbordercolor,
          elevation: 4, // For shadow on Android
          shadowColor: colors.backIconColor, // For shadow on iOS
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.2,
        }}
        onPress={() =>
          navigation.navigate('GroupDetails', {
            Item: item,
          })
        }>
        {item?.isEdit === true && (
          <>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('GroupDetails', {
                  Item: item,
                })
              }
              style={{
                position: 'absolute',
                right: 45,
                top: 0,
                padding: 10,
              }}>
              <Icon
                type="Octicons"
                size={20}
                color={colors.textColor}
                name="pencil"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteComment(item)}
              style={{
                position: 'absolute',
                right: 10,
                top: 0,
                padding: 10,
              }}>
              <Icon
                type="MaterialCommunityIcons"
                size={20}
                color={colors.textColor}
                name="delete"
              />
            </TouchableOpacity>
          </>
        )}

        <View style={globalStyles.SecMainView}>
          <View
            style={{
              ...globalStyles.IConView,
              backgroundColor: colors.placeholderTextColor,
            }}>
            {item?.groupImage ? (
              <Image
                source={
                  item?.groupImage
                    ? {uri: item?.groupImage}
                    : require('../assets/noimageplaceholder.png')
                }
                style={{width: 60, height: 60, borderRadius: 30}}
              />
            ) : (
              <GroupIcon
                name="group"
                size={45}
                color={colors.lightbackground}
              />
            )}
          </View>
        </View>

        <Text style={{...globalStyles.TextGroupList, color: colors.textColor}}>
          {item?.groupName}
        </Text>
        <Text style={{...globalStyles.TextGroupList2, color: colors.textColor}}>
          {item?.totalMembers} Members in this group
        </Text>

        <View style={globalStyles.flexRow}>
          {item?.memberList.slice(0, 5).map((member, index) => (
            <Image
              key={index}
              source={
                member.ProfilePhoto
                  ? {uri: member.ProfilePhoto}
                  : require('../assets/placeholderprofileimage.png')
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 5,
                backgroundColor: colors.placeholderTextColor,
              }}
            />
          ))}
        </View>

        <View style={{flexDirection: 'row', marginTop: 10}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('GroupDetails', {
                Item: item,
              })
            }
            style={{
              padding: 15,
              backgroundColor: '#f67700',
              borderRadius: 40,
              marginRight: 20,
            }}>
            <Icon
              name="plus"
              size={35}
              color={colors.ButtonTextColor}
              type="Entypo"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('GroupDetails', {
                Item: item,
              })
            }
            style={{
              padding: 15,
              backgroundColor: colors.AppmainColor,
              borderRadius: 80,
            }}>
            <GroupIcon
              name="eye"
              size={35}
              color={colors.ButtonTextColor}
              type="AntDesign"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  const renderItem1 = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChatGroups', {
            Item: item,
          })
        }
        style={{
          padding: 10,
          alignItems: 'flex-start',
          marginHorizontal: 20,
          marginVertical: 10,
          borderRadius: 10,
          flexDirection: 'row',
          backgroundColor: colors.textinputBackgroundcolor,
          borderWidth: 0.2,
          borderColor: colors.textinputbordercolor,
          elevation: 2,
          shadowColor: colors.backIconColor,
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.2,
        }}>
        <View
          style={{
            backgroundColor: Colors.lite_gray,
            padding: 15,
            borderRadius: 80,
            marginRight: 10,
          }}>
          <View
            style={{
              backgroundColor: colors.placeholderTextColor,
              padding: 5,
              borderRadius: 80,
            }}>
            {item?.groupImage ? (
              <Image
                source={
                  item?.groupImage
                    ? {uri: item?.groupImage}
                    : require('../assets/noimageplaceholder.png')
                }
                style={{width: 60, height: 60, borderRadius: 30}}
              />
            ) : (
              <GroupIcon
                name="group"
                size={45}
                color={colors.lightbackground}
              />
            )}
          </View>
        </View>
        <View>
          <Text
            style={{...globalStyles.TextGroupList, color: colors.textColor}}>
            {item?.groupName}
          </Text>
          <Text
            style={{...globalStyles.TextGroupList2, color: colors.textColor}}>
            {item?.totalMembers} Members in this group
          </Text>
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
        backgroundColor: colors.cardBackground,
      }}>
      <FlatList
        // onScroll={scrollHandler}
        // scrollEventThrottle={16}
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        onEndReached={loadMoreGroups}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={() => {
          if (loading && hasMore) {
            return (
              <ActivityIndicator size="small" style={{marginVertical: 16}} />
            );
          }

          if (!hasMore && groups.length > 0) {
            return (
              <Text
                style={{
                  textAlign: 'center',
                  paddingVertical: 20,
                  fontSize: 14,
                  color: colors.placeholderTextColor,
                }}>
                No more groups found
              </Text>
            );
          }

          return null;
        }}
        ListHeaderComponent={
          <>
            {GroupData?.postText ? (
              <Header title="Groups" navigation={navigation} />
            ) : null}
            <View style={globalStyles.FX_1_BG_LiteGray}>
              <ImageBackground
                source={require('../assets/Group_Image12.png')}
                style={{
                  width: screenWidth,
                  height: screenHeight * 0.32,
                  backgroundColor: colors.placeholderTextColor,
                }}>
                <View
                  style={{
                    marginTop: 30,
                    marginHorizontal: 40,
                  }}>
                  <Text style={globalStyles.FS_18_CW}>
                    Productive discussions and networking
                  </Text>
                  <Text style={globalStyles.FS_18_CW}>
                    amongst like minded people.
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}>
                    <Text
                      style={{
                        fontSize: 21,
                        fontWeight: '800',
                        color: Colors.white,
                        marginRight: 10,
                      }}>
                      Join a Group
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        color: Colors.white,
                        marginRight: 10,
                      }}>
                      Or
                    </Text>
                    <Text
                      style={{
                        fontSize: 21,
                        fontWeight: '800',
                        color: Colors.white,
                      }}>
                      Create your own Group
                    </Text>
                  </View>
                </View>

                <View style={globalStyles?.MH_30}>
                  <TextInput
                    style={{
                      ...styles.textInput,
                      borderColor: colors.textinputbordercolor,
                      color: colors.textColor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}
                    onChangeText={handleSearch}
                    value={number}
                    placeholder="Enter Name or email address"
                    keyboardType="default"
                    multiline
                    placeholderTextColor={colors.placeholderTextColor}
                  />
                </View>
              </ImageBackground>
              <View
                style={{
                  ...styles.groupsMain,
                  borderColor: colors.textinputbordercolor,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setMyGroups(true), setDiscover(false);
                  }}
                  style={{
                    ...styles.groupsSecond,
                    borderColor: colors.textinputbordercolor,
                  }}>
                  <Text
                    style={{...styles.groupsText, color: colors.AppmainColor}}>
                    My Group{' '}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setModalVisible2()}
                  style={{
                    ...styles.groupsSecond,
                    borderColor: colors.textinputbordercolor,
                  }}>
                  <Text
                    style={{...styles.groupsText, color: colors.AppmainColor}}>
                    Create New Group
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setDiscover(true)}
                  style={{
                    ...styles.groupsSecond,
                    borderColor: colors.textinputbordercolor,
                  }}>
                  <Text
                    style={{...styles.groupsText, color: colors.AppmainColor}}>
                    Discover Group
                  </Text>
                </TouchableOpacity>
              </View>
              {!discover == false ? null : (
                <>
                  <View style={{padding: 15}}>
                    <Text
                      style={{
                        ...globalStyles?.FS_20_FW_500,
                        color: colors.textColor,
                      }}>
                      Your Private Group
                    </Text>
                  </View>
                  <FlatList
                    data={myGroupsPrivte}
                    renderItem={renderItem1}
                    keyExtractor={item => item.id.toString()}
                    // onEndReached={handleLoadMore}
                    // onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={
                      <Text
                        style={{
                          textAlign: 'center',
                          marginTop: 20,
                          color: colors.textColor,
                        }}>
                        No groups found.
                      </Text>
                    }
                  />
                  {/* <FlatList
                data={myGroupsPrivte}
                renderItem={renderItem1}
                keyExtractor={item => item.id.toString()}
              /> */}
                </>
              )}
              <View style={{padding: 15}}>
                {myGroups || discover ? (
                  <Text
                    style={{
                      ...globalStyles?.FS_20_FW_500,
                      color: colors.textColor,
                    }}>
                    {discover ? 'Public groups' : 'Your public groups'}
                  </Text>
                ) : (
                  <Text
                    style={{
                      ...globalStyles?.FS_20_FW_500,
                      color: colors.textColor,
                    }}>
                    Currently Trending On {universityFullName}
                  </Text>
                )}
              </View>
            </View>
          </>
        }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(false);
        }}>
        <View style={styles.centeredView}>
          <View
            style={{
              ...globalStyles.modalView,
              flex: 0.7,
              padding: 20,
              backgroundColor: colors.modelBackground,
            }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible2(false);
              }}
              style={{alignSelf: 'flex-end'}}>
              <CrossIcon name="cross" size={25} color={colors.backIconColor} />
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: colors.textinputbordercolor,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  padding: 15,
                  fontWeight: '700',
                  color: colors.textColor,
                }}>
                Create Group
              </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    paddingVertical: 5,
                    color: colors.textColor,
                  }}>
                  Group type
                </Text>

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    borderWidth: 0.5,
                    borderRadius: 8,
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderColor: colors.textinputbordercolor,
                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                  onPress={toggleDropdown}>
                  <Text style={{...styles.text, color: colors.textColor}}>
                    {selectedValue || 'Public'}
                  </Text>
                  <DownIcon
                    name="down"
                    size={15}
                    color={colors.backIconColor}
                  />
                </TouchableOpacity>

                {isOpen && (
                  <View
                    style={{
                      ...globalStyles.dropdownList,
                      borderColor: colors.textinputbordercolor,
                      backgroundColor: colors.textinputBackgroundcolor,
                    }}>
                    {options.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={globalStyles.dropdownItem}
                        onPress={() => selectOption(option)}>
                        <Text style={{...styles.text, color: colors.textColor}}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={globalStyles.MT_20}>
                <Text
                  style={{
                    ...globalStyles.FS_18_FW_600,
                    paddingVertical: 8,
                    color: colors.textColor,
                  }}>
                  Group name<Text style={{color: 'red'}}> *</Text>
                </Text>
                <TextInput
                  placeholder={`Group name`}
                  placeholderTextColor={colors.placeholderTextColor}
                  style={{
                    ...styles.textInput,
                    height: 40,
                    marginTop: 0,
                    paddingVertical: 0,
                    borderColor: gNameError
                      ? 'red'
                      : colors.textinputbordercolor,
                    color: colors.textColor,

                    backgroundColor: colors.textinputBackgroundcolor,
                  }}
                  value={GName}
                  // onChangeText={value => {
                  //   setGName(value);
                  // }}
                  onChangeText={value => {
                    setGName(value);
                    if (gNameError && value.trim().length > 0) {
                      setGNameError(false);
                    }
                  }}
                />
                {gNameError && (
                  <Text style={{color: 'red', fontSize: 12}}>
                    Group name is required
                  </Text>
                )}
              </View>

              <View
                style={{
                  flex: 1,
                  marginTop: 40,
                }}>
                <Text
                  style={{
                    ...globalStyles.FS_18_FW_600,
                    paddingVertical: 5,
                    color: colors.textColor,
                  }}>
                  Short group description
                </Text>
                <TextInput
                  placeholder={`Group description`}
                  placeholderTextColor={colors.placeholderTextColor}
                  style={{
                    ...styles.textInput,
                    height: 120,
                    marginBottom: 10,
                    textAlignVertical: 'top',
                    borderColor: colors.textinputbordercolor,
                    color: colors.textColor,
                    backgroundColor: colors.textinputBackgroundcolor,
                    // opacity: isChecked ? 1 : 0.5,
                  }}
                  value={shortGDesciption}
                  onChangeText={setShortGDesciption}
                  multiline={true}
                  maxLength={150}
                />
                <Text style={{...globalStyles.FS_15, color: colors.textColor}}>
                  Max {shortGDesciption.length}/150 Characters
                </Text>
              </View>

              <View style={{...globalStyles.flexRow, ...globalStyles?.MT_20}}>
                <TouchableOpacity
                  onPress={() => {
                    if (GName.trim().length === 0) {
                      setGNameError(true);
                      return;
                    }
                    setChecked(prev => {
                      const newValue = !prev;
                      if (newValue) {
                        setCheckboxError(false);
                      }
                      return newValue;
                    });
                    // setChecked(prev => !prev);
                  }}>
                  <MaterialCommunityIcons
                    name={
                      checked ? 'checkbox-marked' : 'checkbox-blank-outline'
                    }
                    size={24}
                    color={colors.AppmainColor}
                    style={{marginRight: 10}}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    width: '90%',
                    color: checkboxError ? 'red' : colors.textColor,
                  }}>
                  Yes, I agree to and accept the code of conduct for moderators.
                </Text>
              </View>
            </ScrollView>

            <View>
              <TouchableOpacity
                style={{
                  ...globalStyles.saveButton,
                  ...globalStyles.MV_10,
                  opacity: checked ? 1 : 0.5,
                  backgroundColor: colors.AppmainColor,
                }}
                //  onPress={() => handleSaveKeySkill()}
                onPress={() => {
                  if (!checked) {
                    setCheckboxError(true);
                    showError('Please accept the code of conduct to proceed.');
                    return;
                  }
                  handleSaveKeySkill();
                }}>
                <Text
                  style={{
                    ...globalStyles.saveButtonText,
                    color: colors.ButtonTextColor,
                  }}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  textInput: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    // backgroundColor: 'white',
    fontSize: 14,
    borderWidth: 1,
    // borderColor: Colors?.borderColor,
    borderRadius: 5,
    // color: 'black',
  },
  groupsText: {fontSize: 15, fontWeight: '500'},
  groupsSecond: {
    borderRightWidth: 0.5,
    flex: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupsMain: {
    flexDirection: 'row',
    // backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default Groups;
