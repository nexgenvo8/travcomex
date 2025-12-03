import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import globalStyles from '../GlobalCSS';
import Header from '../Header/Header';
import {baseUrl, ListCompany} from '../baseURL/api';
import {showError} from '../components/Toast';

const ViewAllCompany = ({navigation, route}) => {
  const {userData} = route.params;
  const [companyList, setCompanyList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCompanyList();
  }, [page]);

  const fetchCompanyList = async (isRefresh = false) => {
    if ((loading && !isRefresh) || (!hasMore && !isRefresh)) return;

    if (isRefresh) {
      setRefreshing(true);
      setPage(1); // Reset page to 1
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch(`${baseUrl}${ListCompany}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          userId: userData?.User?.userId,
          per_page: 10,
          page: isRefresh ? 1 : page,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (isRefresh) {
          setCompanyList(data?.Data || []);
          setHasMore(data?.Data?.length === 10);
        } else {
          if (data?.Data?.length > 0) {
            setCompanyList(prev => [...prev, ...data.Data]);
          } else {
            setHasMore(false);
          }
        }
      } else {
        showError(data.message || 'Failed to fetch Company List');
      }
    } catch (error) {
      console.error('Fetch Company List Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setHasMore(true);
    fetchCompanyList(true); // true = isRefresh
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && !refreshing) {
      setPage(prev => prev + 1);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
      }}
      onPress={() => navigation.navigate('CompanyDetails', {Item: item})}>
      <Image
        source={
          item?.companyLogo
            ? {
                uri: item?.companyLogo,
              }
            : require('../../assets/noimageplaceholder.png')
        }
        style={{width: 80, height: 80, borderRadius: 5}}
        resizeMode="contain"
      />
      <View style={{flex: 1, marginLeft: 10}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          {item.companyName}
        </Text>
        <Text numberOfLines={2} style={{fontSize: 13, marginTop: 5}}>
          {item.aboutCompany}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.SafeAreaView}>
      <Header title="All Companies" navigation={navigation} />

      <FlatList
        data={companyList}
        keyExtractor={(item, index) =>
          item.companyId?.toString() || index.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={{padding: 10}}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator
              size="small"
              color="blue"
              style={{marginVertical: 10}}
            />
          ) : null
        }
        ListEmptyComponent={
          !loading && !refreshing ? (
            <Text style={{textAlign: 'center', marginTop: 20}}>
              No Companies Found
            </Text>
          ) : null
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

export default ViewAllCompany;
