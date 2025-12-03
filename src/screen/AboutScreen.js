import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React from 'react';
import Header from './Header/Header';
import {useTheme} from '../theme/ThemeContext';

const AboutScreen = ({navigation}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const styles = createStyles(colors);
  return (
    <SafeAreaView style={styles.container}>
      <Header title="About" navigation={navigation} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>
          VECOSPACE is an education eco-space of Jamia, it started with the sole
          purpose as an opportunity to learn from your classmates and your
          professors. So that a person who's always been shy in the real-time
          class feels free to ask questions and can have a discussion with
          his/her fellow classmates. We want VECOSPACE to be the remedy for
          students not given the intellectual space, freedom, or support to
          fulfill their educational potential and desire for learning. And we
          want Vecospace to empower instructors to have a positive, personal
          impact on more students. Vecospace is designed to connect students,
          TAs, and professors so every student can get help when she needs it —
          even at 2 AM. And given the unprecedented times, we are in, we hope
          VECOSPACE enhances your experience as a student, as a TA, and as a
          Professor.
        </Text>
        <View style={{marginTop: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
};
export default AboutScreen;

const createStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      marginTop: 20,
      color: colors.textColor,
    },
    text: {
      fontSize: 14,
      lineHeight: 26,
      marginBottom: 10,
      color: colors.textColor,
      // color: '#333',
    },
  });
