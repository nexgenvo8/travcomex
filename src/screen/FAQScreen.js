import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Header from "./Header/Header";
import Colors from "./color";
import { useTheme } from "../theme/ThemeContext";
import { emailId } from "./constants";

const faqData = [
  {
    question: "Who can join TRAVCOMEX?",
    answer:
      "Travel Management Companies, DMCs, Tourism Boards, Hoteliers, Airlines, Travel Tech providers, MICE professionals, media, consultants, and other travel industry stakeholders can join.",
  },
  {
    question: "Are events and knowledge sessions part of TRAVCOMEX?",
    answer:
      "Yes. TRAVCOMEX facilitates curated networking sessions, workshops, discussions, and knowledge-sharing initiatives.",
  },
  {
    question: "Is TRAVCOMEX only for large organizations?",
    answer:
      "No. TRAVCOMEX welcomes professionals and organizations of all sizes, from startups to established industry leaders.",
  },
  {
    question: "How does networking work on TRAVCOMEX?",
    answer:
      "Members can connect through curated networking sessions, discussions, events, and direct engagement opportunities.",
  },
  {
    question: "I still have questions!",
    answer:
      "We don’t claim to have gotten it all right! If you have any questions or suggestions on how we can improve this additional offering, please don’t hesitate to drop us a note at " +
      emailId +
      ", We would love to hear from you.",
  },
];

const FAQScreen = ({ navigation }) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const styles = createStyles(colors);
  const [visibleIndexes, setVisibleIndexes] = useState([]);

  const toggleAnswer = (index) => {
    setVisibleIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
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
                style={styles.questionRow}
              >
                <Text style={styles.title}>{item.question}</Text>
                <Text style={styles.toggleSign}>{isVisible ? "−" : "+"}</Text>
              </TouchableOpacity>
              {isVisible && <Text style={styles.text}>{item.answer}</Text>}
            </View>
          );
        })}
        <View style={{ marginTop: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQScreen;

const createStyles = (colors) =>
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "500",
      flex: 1,
      marginRight: 10,
      color: colors.textColor,
    },
    toggleSign: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.AppmainColor || "#333",
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
