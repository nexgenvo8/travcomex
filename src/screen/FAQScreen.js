import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Header from './Header/Header';
import Colors from './color';
import {useTheme} from '../theme/ThemeContext';

const faqData = [
  {
    question: 'Are all the students default opted into the Vecospace Network?',
    answer:
      'No, students are not opted into the Vecospace Network by default. They need to go through a short registration first.',
  },
  {
    question: "Can companies ever see my students' posts?",
    answer:
      'No, companies can never see or interact with the Q&A content in your classes.',
  },
  {
    question:
      'Does Vecospace sell student data? Is student data harvested for ads?',
    answer:
      'Vecospace does not sell data to third parties and does not have an ad-supported model. Vecospace Network is like LinkedIn — enabling students and employers to connect with each other, if a student has opted into the Vecospace Network, employers can discover students using searches and contact them regarding job and internship opportunities. and other projects too',
  },
  {
    question: 'How can a student leave the Vecospace Network?',
    answer:
      'Students can visit their Account Settings page from the top-right menu to leave the VecospaceNetwork.\nThey can email us at any time at info@vecospace.com should they have any questions about what employers see, or about the Vecospace Network.',
  },
  {
    question: 'I still have questions!',
    answer:
      'We don’t claim to have gotten it all right! If you have any questions or suggestions on how we can improve this additional offering, please don’t hesitate to drop us a note at info@vecospace.com, We would love to hear from you.',
  },
];

const FAQScreen = ({navigation}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const styles = createStyles(colors);
  const [visibleIndexes, setVisibleIndexes] = useState([]);

  const toggleAnswer = index => {
    setVisibleIndexes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="FAQ's" navigation={navigation} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {faqData.map((item, index) => {
          const isVisible = visibleIndexes.includes(index);
          return (
            <View key={index}>
              <TouchableOpacity
                onPress={() => toggleAnswer(index)}
                style={styles.questionRow}>
                <Text style={styles.title}>{item.question}</Text>
                <Text style={styles.toggleSign}>{isVisible ? '−' : '+'}</Text>
              </TouchableOpacity>
              {isVisible && <Text style={styles.text}>{item.answer}</Text>}
            </View>
          );
        })}
        <View style={{marginTop: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQScreen;

const createStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    questionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '500',
      flex: 1,
      marginRight: 10,
      color: colors.textColor,
    },
    toggleSign: {
      fontSize: 22,
      fontWeight: '600',
      color: colors.AppmainColor || '#333',
    },
    text: {
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 16,
      color: colors.textColor,
      backgroundColor: colors.textinputBackgroundcolor,
      padding: 10,
      borderRadius: 4,
    },
  });
