import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import Header from "./screen/Header/Header";
import { baseUrl, noticeboardlist } from "./screen/baseURL/api";
import CommonLoader from "./screen/components/CommonLoader";
import { useTheme } from "./theme/ThemeContext";

const NoticeBoard = ({ navigation }) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const [noticeboardList, setnoticeboardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchnoticeboardList();
  }, []);

  const fetchnoticeboardList = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch(`${baseUrl}${noticeboardlist}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "",
      });

      const data = await response.json();
      setnoticeboardList(data);
    } catch (error) {
      console.error("Error fetching Notice Board data:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const renderItem = ({ item, index }) => {
    const backgroundColor = colors.textinputBackgroundcolor;
    //const backgroundColor = '#f2f2f2'
    //index % 2 === 0 ? '#e0f7fa' : '#fce4ec';

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("NoticeBoardDetails", { notice: item })
        }
      >
        <View style={[styles.card, { backgroundColor }]}>
          <Text style={{ ...styles.cardTitle, color: colors.textColor }}>
            {item.title}
          </Text>
          <Text
            numberOfLines={3}
            style={{ ...styles.cardDetail, color: colors.placeholderTextColor }}
          >
            {item.details}
          </Text>
          <Text
            style={{ ...styles.cardDate, color: colors.placeholderTextColor }}
          >
            Added: {item.addeddate}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: colors.background }}
    >
      <Header title="News & Updates" navigation={navigation} />
      <View style={{ flex: 1, padding: 10 }}>
        {initialLoading ? (
          <CommonLoader visible={true} />
        ) : noticeboardList.length > 0 ? (
          <FlatList
            data={noticeboardList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.noData}>
            <Text style={{ color: colors.placeholderTextColor }}>
              No news & updates available.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default NoticeBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  cardDetail: {
    fontSize: 15,
    // color: '#555',
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 13,
    color: "#888",
    textAlign: "right",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noData: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
