import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import Header from "./Header/Header";
import { useTheme } from "../theme/ThemeContext";

const AboutScreen = ({ navigation }) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const styles = createStyles(colors);
  return (
    <SafeAreaView style={styles.container}>
      <Header title="About" navigation={navigation} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>
          TRAVCOMEX – the Travel Community X-change is a unified digital
          ecosystem connecting the entire travel and tourism industry. From
          Travel Management Companies, DMCs, Tourism Boards, and Airlines to
          Hoteliers, Travel Tech innovators, MICE professionals, media, and
          consultants, TRAVCOMEX brings all stakeholders together on one
          collaborative platform. Designed to foster meaningful connections,
          strategic partnerships, and knowledge exchange, TRAVCOMEX empowers
          industry leaders to innovate, collaborate, and collectively shape the
          future of travel.
        </Text>
        <View style={{ marginTop: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};
export default AboutScreen;

const createStyles = (colors) =>
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
