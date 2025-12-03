import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import globalStyles from "../GlobalCSS";
import Header from "../Header/Header";
import Colors from "../color";
import { baseUrl, EventsList } from "../baseURL/api";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommonLoader from "../components/CommonLoader";
import { useTheme } from "../../theme/ThemeContext";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { eventimage } from "../constants";

const EventCalcander = ({ navigation, route }) => {
  const { GlobalSearch = {} } = route.params || {};
  const isFocused = useIsFocused();
  const { isDark, colors, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState("event1");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isFocused) {
      UserValue();
    }
  }, [isFocused]);

  const UserValue = async () => {
    try {
      const userDta = await AsyncStorage.getItem("userData");
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    } catch (error) {
      console.log("Error :", error);
    }
  };

  useEffect(() => {
    if (userData) {
      setSearchPerformed(true);
      setPage(1);
      setHasMore(true);
      fetchEvents(1, true);
    }
  }, [selected, isFocused, userData]);
  const fetchEvents = async (pageToFetch = 1, reset = false) => {
    if (!userData?.User?.userId || (!hasMore && !reset) || isFetchingMore)
      return;

    if (reset) {
      setIsRefreshing(true);
      setHasMore(true); // Reset hasMore when refreshing
      pageToFetch = 1;
    } else if (pageToFetch === 1) {
      setInitialLoading(true);
    } else {
      setIsFetchingMore(true);
    }

    const Dta = {
      userId: userData?.User?.userId,
      entityName: selected === "event2" ? "self" : "",
      search: searchQuery || GlobalSearch?.eventName,
      suffle: selected === "event1" ? "yes" : "",
      contactEvent: selected === "Your contacts events" ? "yes" : "",
      per_page: 20,
      page: pageToFetch,
    };

    try {
      const response = await fetch(`${baseUrl}${EventsList}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Dta),
      });

      const data = await response.json();
      const newEvents = data?.Data || [];

      setEvents((prev) => {
        if (reset) return newEvents;

        const existingIds = new Set(prev.map((item) => item.id));
        const filteredNewEvents = newEvents.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prev, ...filteredNewEvents];
      });

      setPage(pageToFetch);

      if (newEvents.length < 20) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }

    setInitialLoading(false);
    setIsFetchingMore(false);
    setIsRefreshing(false);
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EventDetails", {
            Item: item,
          })
        }
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderColor: colors.textinputbordercolor,
          flexDirection: "row",
        }}
      >
        <View>
          <Image
            source={
              item?.Images?.[0]?.imageName
                ? { uri: item.Images[0].imageName }
                : require("../../assets/noimageplaceholder.png")
            }
            style={{
              backgroundColor: Colors?.lite_gray,
              width: 90,
              height: 90,
              marginRight: 10,
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: colors.AppmainColor,
            }}
          >
            {item.eventName}
          </Text>
          <Text style={{ color: colors.textColor }}>{item.eventDate}</Text>
          <Text style={{ color: colors.textColor }}>{item.eventCountry}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  if (initialLoading) {
    return <CommonLoader visible={true} />;
  }
  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}
    >
      <Header title="Event & Exhibitions" navigation={navigation} />
      <KeyboardAvoidingWrapper offset={40}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            onEndReached={() => {
              if (!isFetchingMore && hasMore) {
                fetchEvents(page + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            refreshing={isRefreshing}
            onRefresh={() => fetchEvents(1, true)}
            ListHeaderComponent={
              <>
                <View
                  style={{
                    flexDirection: "row",
                    padding: 10,
                  }}
                >
                  <TextInput
                    placeholder={`Search`}
                    placeholderTextColor={colors.placeholderTextColor}
                    style={{
                      ...globalStyles.SerachInput,
                      color: colors.textColor,
                      borderColor: colors.textinputbordercolor,
                    }}
                    value={searchQuery}
                    onChangeText={(text) => {
                      setSearchQuery(text);
                      if (text.trim() === "") {
                        setSearchPerformed(false);
                      }
                    }}
                    // onChangeText={setSearchQuery}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setSearchPerformed(true);
                      setPage(1);
                      setHasMore(true);
                      fetchEvents(1, true);
                    }}
                    // onPress={fetchEvents}
                    style={{
                      backgroundColor: colors.AppmainColor,
                      padding: 10,
                      marginLeft: 5,
                      borderRadius: 4,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: colors.ButtonTextColor,
                        fontWeight: "bold",
                      }}
                    >
                      Search
                    </Text>
                  </TouchableOpacity>
                </View>

                <Image
                  source={eventimage}
                  style={{ width: "100%", height: 220, resizeMode: "cover" }}
                />
                <TouchableOpacity
                  style={{
                    ...globalStyles.saveButton,
                    marginHorizontal: 10,
                    paddingVertical: 10,
                    marginTop: 10,
                    backgroundColor: colors.AppmainColor,
                  }}
                  onPress={() => navigation.navigate("AddEvent")}
                >
                  <Text
                    style={{
                      ...globalStyles.saveButtonText,
                      color: colors.ButtonTextColor,
                    }}
                  >
                    + Post an event
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    margin: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setSelected("event1")}
                    style={{
                      backgroundColor:
                        selected === "event1"
                          ? colors.AppmainColor
                          : colors.textinputBackgroundcolor,
                      padding: 10,
                      flex: 1,
                      alignItems: "center",
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          selected === "event1"
                            ? colors.ButtonTextColor
                            : colors.textColor,
                      }}
                    >
                      All Events
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSelected("event2")}
                    style={{
                      backgroundColor:
                        selected === "event2"
                          ? colors.AppmainColor
                          : colors.textinputBackgroundcolor,
                      padding: 10,
                      flex: 1,
                      alignItems: "center",
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          selected === "event2"
                            ? colors.ButtonTextColor
                            : colors.textColor,
                      }}
                    >
                      My Events
                    </Text>
                  </TouchableOpacity>
                </View>
                {selected === "event2" ? null : (
                  <>
                    <TouchableOpacity
                      onPress={() => setSelected("Recommendations")}
                      style={{
                        backgroundColor:
                          selected === "Recommendations"
                            ? colors.AppmainColor
                            : colors.textinputBackgroundcolor,
                        padding: 10,
                        flex: 1,
                        alignItems: "center",
                        borderRadius: 5,
                        margin: 5,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            selected === "Recommendations"
                              ? colors.ButtonTextColor
                              : colors.textColor,
                        }}
                      >
                        Recommendations
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setSelected("Your contacts events")}
                      style={{
                        backgroundColor:
                          selected === "Your contacts events"
                            ? colors.AppmainColor
                            : colors.textinputBackgroundcolor,
                        padding: 10,
                        flex: 1,
                        alignItems: "center",
                        borderRadius: 5,
                        margin: 5,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            selected === "Your contacts events"
                              ? colors.ButtonTextColor
                              : colors.textColor,
                        }}
                      >
                        Your contact's events
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                <View
                  style={{
                    ...globalStyles.ViewINter1,
                    borderWidth: 1,
                    borderColor: colors.textinputbordercolor,
                  }}
                >
                  {selected === "event1" ? (
                    <Text
                      style={{
                        ...globalStyles.headlineText,
                        color: colors.textColor,
                      }}
                    >
                      Featured Events
                    </Text>
                  ) : null}
                </View>
              </>
            }
            ListEmptyComponent={
              !initialLoading && searchPerformed ? (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    color: colors.textColor,
                  }}
                >
                  No events found.
                </Text>
              ) : null
            }
            ListFooterComponent={
              isFetchingMore ? (
                <ActivityIndicator color={colors.AppmainColor} size="small" />
              ) : null
            }
          />
        </View>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default EventCalcander;
