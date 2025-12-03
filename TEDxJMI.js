import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {baseUrl, tedexlist} from './src/screen/baseURL/api';
import Header from './src/screen/Header/Header';
import CommonLoader from './src/screen/components/CommonLoader';
import {useTheme} from './src/theme/ThemeContext';

const TEDxJMI = ({navigation}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const [tedxList, setTedxList] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchTedxList();
  }, []);

  const fetchTedxList = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch(`${baseUrl}${tedexlist}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '',
      });

      const data = await response.json();
      setTedxList(data);
    } catch (error) {
      console.error('Error fetching TEDx data:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const firstEvent = tedxList[0];

  return (
    <SafeAreaView
      style={{...styles.container, backgroundColor: colors.background}}>
      <Header title="TEDx JMI" navigation={navigation} />
      <View style={{flex: 1}}>
        {initialLoading ? (
          <CommonLoader visible={true} />
        ) : firstEvent ? (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Image source={{uri: firstEvent.image_url}} style={styles.image} />
            <Text style={{...styles.title, color: colors.textColor}}>
              {firstEvent.title}
            </Text>
            <Text style={{...styles.description, color: colors.textColor}}>
              {firstEvent.details}
            </Text>
          </ScrollView>
        ) : (
          <View style={styles.noData}>
            <Text>No TEDx event found.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TEDxJMI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'justify',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
