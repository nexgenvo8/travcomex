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
import {
  baseUrl,
  Featuredcompanies,
  FollowingCompanies,
  ListCompany,
} from "../baseURL/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import CommonLoader from "../components/CommonLoader";
import { showError } from "../components/Toast";
import { useTheme } from "../../theme/ThemeContext";
import { companyImage, universityFullName } from "../constants";

const CompanyProfiles = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const { Item = {}, ItemCompanyData = {} } = route.params || {};
  const { isDark, colors, toggleTheme } = useTheme();
  const [companyList, setCompanyList] = useState([]);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [followingCompanies, setFollowingCompanies] = useState([]);
  const [youCompaniesPage, setYouCompaniesPage] = useState([]);
  const [yourEmployes, setYourEmployes] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

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
      console.log("UserValue Error:", error);
    }
  };
  useEffect(() => {
    if (isFocused) {
      resetData();

      fetchFeaturedCompanies();
      fetchFollowingCompanies();
      fetchYouCompaniesPage();
      fetchYourEmployes();
    }
  }, [isFocused]);

  const resetData = () => {
    setCompanyList([]); // Reset list
    setPage(1); // Reset to first page
    setHasMore(true); // Reset "hasMore" flag
    setLoading(false); // Ensure loading state is reset
    getCompanyList(1); // Fetch first page
  };

  const getCompanyList = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setInitialLoading(true);
    try {
      console.log(`Fetching data for page: ${page}, search: ${searchQuery}`);
      const response = await fetch(`${baseUrl}${ListCompany}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          companyName: searchQuery || Item?.companyName,
          entityName: "",
          per_page: 5, // Fetch 5 items per page
          page: page,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data?.Data?.length > 0) {
          setCompanyList((prevList) => [...prevList, ...data.Data]);
        } else {
          setHasMore(false);
        }
      } else {
        showError(data.message || "Failed to fetch Company List");
      }
    } catch (error) {
      console.error("Fetch getCompanyList Error:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };
  const handleSearch = () => {
    setCompanyList([]); // Reset company list
    setPage(1); // Reset page to 1
    setHasMore(true);
    getCompanyList(1); // Fetch new data with updated search query
  };
  const fetchYourEmployes = async () => {
    try {
      const response = await fetch(`${baseUrl}${ListCompany}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          entityName: "self",
          per_page: 5,
          page: 1,
        }),
      });

      const data = await response.json();
      setYourEmployes(data?.Data?.slice(0, 3)); // Show only 3 items
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchFollowingCompanies = async () => {
    try {
      const response = await fetch(`${baseUrl}${FollowingCompanies}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          per_page: 10,
          page: 1,
        }),
      });

      const data = await response.json();
      setFollowingCompanies(data?.Data?.slice(0, 3)); // Show only 3 items
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchFeaturedCompanies = async () => {
    try {
      const response = await fetch(`${baseUrl}${Featuredcompanies}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          per_page: 10,
          page: 1,
        }),
      });

      const data = await response.json();
      setFeaturedCompanies(data?.Data?.slice(0, 3)); // Show only 3 items
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchYouCompaniesPage = async () => {
    try {
      const response = await fetch(`${baseUrl}${ListCompany}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.User?.userId,
          entityName: "self",
          per_page: 50,
          page: 1,
        }),
      });

      const data = await response.json();
      setYouCompaniesPage(data?.Data?.slice(0, 3)); // Show only 3 items
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
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
      <Header title="Company Profiles" navigation={navigation} />

      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          padding: 10,
        }}
      >
        <TextInput
          placeholder="Company search..."
          style={{
            ...globalStyles.SerachInput,
            borderColor: colors.textinputbordercolor,
            color: colors.textColor,
            backgroundColor: colors.textinputBackgroundcolor,
          }}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.placeholderTextColor}
        />
        <TouchableOpacity
          onPress={handleSearch}
          style={{
            ...globalStyles?.SerachBtn,
            backgroundColor: colors.AppmainColor,
          }}
        >
          <Text style={{ color: colors.ButtonTextColor, fontWeight: "bold" }}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <Image
          source={companyImage}
          style={{ width: "100%", height: 220, resizeMode: "stretch" }}
        />
        <TouchableOpacity
          style={{
            ...globalStyles.saveButton,
            marginHorizontal: 10,
            backgroundColor: colors.AppmainColor,
          }}
          onPress={() => navigation.navigate("AddCompany")}
        >
          <Text
            style={{
              ...globalStyles.saveButtonText,
              color: colors.ButtonTextColor,
            }}
          >
            + Create Company Profile
          </Text>
        </TouchableOpacity>

        <View style={{ padding: 10, paddingVertical: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              color: colors.textColor,
            }}
          >
            Company Profiles On {universityFullName}
          </Text>

          {/* Company List */}
          {companyList.length > 0 ? (
            companyList.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  const nextItems = companyList.slice(index + 1, index + 4);
                  navigation.navigate("CompanyDetails", {
                    Item: item,
                    index: index,
                    nextItems: nextItems,
                  });
                }}
                key={index}
                style={{
                  flexDirection: "row",
                  backgroundColor: colors.textinputBackgroundcolor,
                  padding: 10,
                  marginTop: 10,
                  marginBottom: 10,
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  elevation: 2,
                }}
              >
                {/* Company Logo */}
                <Image
                  source={
                    item?.companyLogo
                      ? {
                          uri: item?.companyLogo,
                        }
                      : require("../../assets/noimageplaceholder.png")
                  }
                  style={{ width: 80, height: 80, borderRadius: 5 }}
                  resizeMode="contain"
                />

                {/* Company Info */}
                <View style={{ flex: 1, marginLeft: 10, marginTop: 10 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: colors.AppmainColor,
                    }}
                  >
                    {item.companyName}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 13,
                      marginTop: 5,
                      color: colors.textColor,
                    }}
                  >
                    {item.aboutCompany}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text
              style={{
                textAlign: "center",
                marginTop: 20,
                color: colors.textColor,
              }}
            >
              No Companies Found
            </Text>
          )}

          {/* View More Section */}
          {hasMore && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ViewAllCompany", { userData })
              }
              style={{ marginTop: 10, alignItems: "center" }}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.AppmainColor} />
              ) : (
                <Text
                  style={{
                    color: colors.AppmainColor,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  View More
                </Text>
              )}
            </TouchableOpacity>
          )}
          <View style={{ padding: 10 }}>
            <View style={{ paddingVertical: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: colors.textColor,
                }}
              >
                Your Employers
              </Text>
              {loading ? (
                <ActivityIndicator size="large" color={colors.AppmainColor} />
              ) : (
                <FlatList
                  data={yourEmployes}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        const nextItems = companyList.slice(
                          index + 1,
                          index + 4
                        );
                        navigation.navigate("CompanyDetails", {
                          Item: item,
                          index: index,
                          nextItems: nextItems,
                        });
                      }}
                      style={{
                        flexDirection: "row",
                        backgroundColor: colors.textinputBackgroundcolor,
                        padding: 10,
                        marginTop: 10,
                        marginBottom: 10,
                        borderRadius: 8,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 2,
                      }}
                    >
                      {/* Company Logo */}
                      <Image
                        source={
                          item?.companyLogo
                            ? {
                                uri: item?.companyLogo,
                              }
                            : require("../../assets/noimageplaceholder.png")
                        }
                        style={{ width: 80, height: 80, borderRadius: 5 }}
                        resizeMode="contain"
                      />
                      {/* Company Info */}
                      <View style={{ flex: 1, marginLeft: 10, marginTop: 10 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: colors.AppmainColor,
                          }}
                        >
                          {item.companyName}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 13,
                            marginTop: 5,
                            color: colors.textColor,
                          }}
                        >
                          {item.aboutCompany}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>

            <View style={{ paddingVertical: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: colors.textColor,
                }}
              >
                Your Company Pages
              </Text>
              {loading ? (
                <ActivityIndicator size="large" color={colors.AppmainColor} />
              ) : (
                <FlatList
                  data={youCompaniesPage}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        const nextItems = companyList.slice(
                          index + 1,
                          index + 4
                        );
                        navigation.navigate("CompanyDetails", {
                          Item: item,
                          index: index,
                          nextItems: nextItems,
                        });
                      }}
                      style={{
                        flexDirection: "row",
                        backgroundColor: colors.textinputBackgroundcolor,
                        padding: 10,
                        marginTop: 10,
                        marginBottom: 10,
                        borderRadius: 8,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 2,
                      }}
                    >
                      <Image
                        source={
                          item?.companyLogo
                            ? {
                                uri: item?.companyLogo,
                              }
                            : require("../../assets/noimageplaceholder.png")
                        }
                        style={{ width: 80, height: 80, borderRadius: 5 }}
                        resizeMode="contain"
                      />

                      <View style={{ flex: 1, marginLeft: 10, marginTop: 10 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: colors.AppmainColor,
                          }}
                        >
                          {item.companyName}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 13,
                            marginTop: 5,
                            color: colors.textColor,
                          }}
                        >
                          {item.aboutCompany}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>

            <View style={{ paddingVertical: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: colors.textColor,
                }}
              >
                Companies You Are Following
              </Text>
              {loading ? (
                <ActivityIndicator size="large" color={colors.AppmainColor} />
              ) : (
                <FlatList
                  data={followingCompanies}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        const nextItems = companyList.slice(
                          index + 1,
                          index + 4
                        );
                        navigation.navigate("CompanyDetails", {
                          Item: item,
                          index: index,
                          nextItems: nextItems,
                        });
                      }}
                      style={{
                        flexDirection: "row",
                        backgroundColor: colors.textinputBackgroundcolor,
                        padding: 10,
                        marginTop: 10,
                        marginBottom: 10,
                        borderRadius: 8,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 2,
                      }}
                    >
                      {/* Company Logo */}
                      <Image
                        source={
                          item?.companyLogo
                            ? {
                                uri: item?.companyLogo,
                              }
                            : require("../../assets/noimageplaceholder.png")
                        }
                        style={{ width: 80, height: 80, borderRadius: 5 }}
                        resizeMode="contain"
                      />

                      {/* Company Info */}
                      <View style={{ flex: 1, marginLeft: 10, marginTop: 10 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: colors.AppmainColor,
                          }}
                        >
                          {item.companyName}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 13,
                            marginTop: 5,
                            color: colors.textColor,
                          }}
                        >
                          {item.aboutCompany}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>

            <View style={{ paddingVertical: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: colors.textColor,
                }}
              >
                Featured Companies
              </Text>
              {loading ? (
                <ActivityIndicator size="large" color={colors.AppmainColor} />
              ) : (
                <FlatList
                  data={featuredCompanies}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        const nextItems = companyList.slice(
                          index + 1,
                          index + 4
                        );
                        navigation.navigate("CompanyDetails", {
                          Item: item,
                          index: index,
                          nextItems: nextItems,
                        });
                      }}
                      style={{
                        flexDirection: "row",
                        backgroundColor: colors.textinputBackgroundcolor,
                        padding: 10,
                        marginTop: 10,
                        marginBottom: 10,
                        borderRadius: 8,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 2,
                      }}
                    >
                      {/* Company Logo */}
                      <Image
                        source={
                          item?.companyLogo
                            ? {
                                uri: item?.companyLogo,
                              }
                            : require("../../assets/noimageplaceholder.png")
                        }
                        style={{ width: 80, height: 80, borderRadius: 5 }}
                        resizeMode="contain"
                      />

                      {/* Company Info */}
                      <View style={{ flex: 1, marginLeft: 10, marginTop: 10 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: colors.AppmainColor,
                          }}
                        >
                          {item.companyName}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 13,
                            marginTop: 5,
                            color: colors.textColor,
                          }}
                        >
                          {item.aboutCompany}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompanyProfiles;
