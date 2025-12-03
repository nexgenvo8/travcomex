import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, Image, FlatList} from 'react-native';
import Colors from '../color';
import {baseUrl, listLike} from '../baseURL/api';
import Header from '../Header/Header';
import globalStyles from '../GlobalCSS';
import {useTheme} from '../../theme/ThemeContext';

const ListLike = ({navigation, route}) => {
  const {postId, postType} = route.params;
  const {isDark, colors, toggleTheme} = useTheme();
  const [loading, setLoading] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [likeList1, setLikeList1] = useState([]);

  const fetchPosts = async page => {
    setLoading(true);
    const Dta = {
      postId: postId,
      postType: postType,
    };
    console.log('Dta--->>>', Dta);
    try {
      const response = await fetch(`${baseUrl}${listLike}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Dta),
      });

      const data = await response.json();

      if (response.ok) {
        setLikeList1(data);
        setLikeList(data.Data);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const renderItem = item => {
    console.log('item', JSON.stringify(item));
    return (
      <View
        style={{
          ...globalStyles?.LikeView,
          borderColor: colors.textinputbordercolor,
        }}>
        <View style={globalStyles?.PR_10}>
          <Image
            style={globalStyles?.LikeImg}
            source={{
              uri: item.item.ProfilePhoto
                ? item.item.ProfilePhoto
                : require('../../assets/placeholderprofileimage.png'),
            }}
          />
        </View>
        <View>
          <Text style={{...globalStyles?.LikeTitle, color: colors.textColor}}>
            {item.item.UserName}
          </Text>
          <Text
            style={{
              ...globalStyles?.LikeTitle2,
              color: colors.placeholderTextColor,
            }}>
            at {item.item.CompanyName}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles?.SafeAreaView,
        backgroundColor: colors.background,
      }}>
      <Header title="Like List" navigation={navigation} />
      <View style={{}}>
        <View style={globalStyles?.LikeListView}>
          <Text
            style={{...globalStyles?.FS_18_FW_600, color: colors.textColor}}>
            All Likes : {likeList1.TotalRecord}
          </Text>
        </View>
      </View>

      <FlatList
        data={likeList}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
      />
    </SafeAreaView>
  );
};

export default ListLike;
