import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {baseUrl, NList, ReadNotification} from '../baseURL/api';
import globalStyles from '../GlobalCSS';
import Header from '../Header/Header';
import Colors from '../color';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showError} from '../components/Toast';
import {useTheme} from '../../theme/ThemeContext';

const NotificationsScreen = ({navigation}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const isFocused = useIsFocused();
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    if (isFocused) {
      UserValue();
    }
  }, [isFocused]);

  useEffect(() => {
    if (userData && userData.User?.userId) {
      resetAndFetchNotifications();
    }
  }, [userData]);
  const UserValue = async () => {
    try {
      const userDta = await AsyncStorage.getItem('userData');
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    } catch (error) {
      console.log('Error:', error);
    }
  };
  const resetAndFetchNotifications = async () => {
    setNotifications([]);
    setPage(1);
    setTotalPages(1);
    fetchNotifications(1, true);
  };
  const fetchNotifications = async (pageNumber, isRefresh = false) => {
    if (loading || (pageNumber > totalPages && !isRefresh)) return;

    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch(`${baseUrl}${NList}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          userId: userData?.User?.userId,
          per_page: 10,
          page: pageNumber,
        }),
      });

      const data = await response.json();
      if (response.ok && data.Status === 1) {
        setNotifications(prev =>
          isRefresh ? data.Data : [...prev, ...data.Data],
        );
        setTotalPages(data.TotalPages);
        setPage(pageNumber);
      } else {
        showError('Failed to fetch notifications');
      }
    } catch (error) {
      console.log('Error fetch notifications', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleNavigation = async item => {
    switch (item?.PostType) {
      case 16:
        navigation.navigate('Company');
        break;
      case 1:
      case 2:
        navigation.navigate('Home', {Item: item});
        break;
      case 3:
        navigation.navigate('Articles', {GlobalSearch: item});
        break;
      case 4:
        navigation.navigate('Groups', {GroupData: item});
        break;
      case 11:
        navigation.navigate('Contacts');
        break;
      case 12:
        navigation.navigate('ShareProfileScreen');
        break;
      case 13:
        navigation.navigate('ChangeJobScreen');
        break;
      case 14:
        navigation.navigate('ProjectScreen');
        break;
      case 155:
        navigation.navigate('JobOpportunities');
        break;
      case 20:
        navigation.navigate('KnowledgeHubScreen');
        break;
      default:
        showError('Unknown Post Type');
        return;
    }
    try {
      await fetch(`${baseUrl}${ReadNotification}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: item?.id,
          status: 1,
        }),
      });
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };
  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => handleNavigation(item)}
      style={{
        backgroundColor:
          item.status === 0
            ? colors.textinputBackgroundcolor
            : colors.background,
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={
            item.UserDetail?.ProfilePhoto
              ? {uri: item.UserDetail?.ProfilePhoto}
              : require('../../assets/placeholderprofileimage.png')
          }
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
            backgroundColor:
              item.status === 0
                ? colors.placeholderTextColor
                : colors.placeholderTextColor,
          }}
        />
        <View>
          <Text style={{fontWeight: 'bold', color: colors.textColor}}>
            {item.UserDetail?.UserName}
          </Text>
          <Text style={{color: colors.textColor}}>{item.notificationText}</Text>
          <Text style={{color: colors.placeholderTextColor}}>
            {item.dateAdded}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.SafeAreaView}>
      <Header title="Notifications" navigation={navigation} />
      <View style={{flex: 1, padding: 10, backgroundColor: colors.background}}>
        <FlatList
          data={notifications}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={renderItem}
          onEndReached={() => fetchNotifications(page + 1)}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={resetAndFetchNotifications}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                style={{marginVertical: 10}}
                size="small"
                color="#007bff"
              />
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
