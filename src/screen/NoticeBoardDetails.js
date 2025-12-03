import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useState} from 'react';
import Header from './Header/Header';
import {useTheme} from '../theme/ThemeContext';

const NoticeBoardDetails = ({route, navigation}) => {
  const {notice} = route.params;
  const {isDark, colors, toggleTheme} = useTheme();

  return (
    <SafeAreaView
      style={{...styles.container, backgroundColor: colors.background}}>
      <Header title="Notice Board Details" navigation={navigation} />
      <ScrollView style={styles.content}>
        <Text style={{...styles.title, color: colors.textColor}}>
          {notice.title}
        </Text>
        <Text style={{...styles.date, color: colors.placeholderTextColor}}>
          Added on: {notice.addeddate}
        </Text>
        <Text style={{...styles.details, color: colors.textColor}}>
          {notice.details}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NoticeBoardDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    // color: '#000',
  },
  date: {
    fontSize: 14,
    // color: '#666',
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'justify',
  },
});
