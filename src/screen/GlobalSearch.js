import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import Colors from './color';
import Icon from './Icons/Icons';
import {baseUrl, GlobalSearchList} from './baseURL/api';
import {showError} from './components/Toast';
import {useTheme} from '../theme/ThemeContext';

const GlobalSearch = ({navigation}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);

  let searchTimeout;
  const inputRef = useRef(null);
  const flatListRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleSearchLive = text => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchQuery(text);

    if (text.trim().length < 3) {
      setResults([]);
      return;
    }

    searchTimeout = setTimeout(() => {
      searchDebounced(text.trim());
    }, 300);
  };

  const searchDebounced = async query => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}${GlobalSearchList}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query}),
      });

      const data = await response.json();
      const sections = Object.entries(data)
        .filter(([key, value]) => Array.isArray(value) && value.length > 0)
        .map(([key, items]) => ({
          title: key,
          data: items,
        }));

      setResults(sections);
    } catch (error) {
      console.error('Search Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (sectionType, item) => {
    switch (sectionType) {
      case 'groups':
        navigation.navigate('Groups', {GroupData: item});
        setSearchQuery('');
        setResults([]);
        break;
      case 'jobUsers':
        navigation.navigate('JobDetail', {jobId: item.id});
        break;
      case 'professionalExperiences':
        navigation.navigate('ExperienceDetail', {experienceId: item.id});
        break;
      case 'projects':
        navigation.navigate('IntershipProject', {GlobalSearch: item});
        break;
      case 'users':
        navigation.navigate('ProfileDetails', {Item: item});
        break;
      case 'business':
        navigation.navigate('CareerEnhancers', {Item: item});
        break;
      case 'company':
        navigation.navigate('CompanyProfiles', {Item: item});
        break;
      case 'jobs':
        navigation.navigate('JobOpportunities', {GlobalSearch: item});
        break;
      case 'vaults':
        navigation.navigate('KnowledgeHub', {GlobalSearch: item});
        break;
      case 'talents':
        navigation.navigate('GuestSpeakersTrainers', {GlobalSearch: item});
        break;
      case 'EventCalender':
        navigation.navigate('EventCalcander', {GlobalSearch: item});
        break;
      case 'Articles':
        navigation.navigate('Articles', {GlobalSearch: item});
        break;

      default:
        navigation.navigate('Home', {Item: item});
    }
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          ...styles.sectionContainer,
          borderBottomColor: colors.textinputbordercolor,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SectionListScreen', {
              sectionType: item.title,
              items: item.data,
            });
          }}>
          <Text style={{...styles.sectionTitle, color: colors.textColor}}>
            {item.title.replace(/([A-Z])/g, ' $1').toUpperCase()}
          </Text>
        </TouchableOpacity>

        {item.data.map((entry, index) => {
          return (
            <View
              style={{
                ...styles.cardContainer,
                backgroundColor: colors.background,
              }}>
              <TouchableOpacity
                key={`${item.title}-${index}`}
                onPress={() => handleItemPress(item.title, entry)}
                style={styles.cardTouchable}>
                <View style={styles.cardContent}>
                  {entry.image_url && (
                    <Image
                      source={{uri: entry.image_url}}
                      style={styles.entryImage}
                      resizeMode="cover"
                    />
                  )}

                  <View style={styles.textContainer}>
                    {Object.entries(entry)
                      .filter(
                        ([field]) =>
                          field !== 'id' &&
                          field !== 'postType' &&
                          field !== 'image_url',
                      )
                      .map(([field, value]) => (
                        <Text
                          key={field}
                          style={{...styles.itemText, color: colors.textColor}}>
                          <Text
                            style={{
                              ...styles.fieldName,
                              color: colors.placeholderTextColor,
                            }}>
                            {field.replace(/([A-Z])/g, ' $1')}:
                          </Text>{' '}
                          {value?.toString() || 'N/A'}
                        </Text>
                      ))}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-back"
              size={24}
              color={colors.placeholderTextColor}
              style={{margin: 10}}
              type="MaterialIcons"
            />
          </TouchableOpacity>

          <View
            style={{
              ...styles.inputContainer,
              borderColor: colors.textinputbordercolor,
              backgroundColor: colors.textinputBackgroundcolor,
            }}>
            <TextInput
              ref={inputRef}
              style={{
                ...styles.input,
                color: colors.textColor,
                // borderColor: colors.textinputbordercolor,
              }}
              onChangeText={handleSearchLive}
              value={searchQuery}
              placeholder="Search"
              keyboardType="default"
              placeholderTextColor={colors.placeholderTextColor}
            />

            <TouchableOpacity
              onPress={() => {
                if (searchQuery.trim().length >= 3) {
                  handleSearchLive(searchQuery.trim());
                } else {
                  showError('Please enter at least 3 characters.');
                }
              }}>
              <Icon
                name="search"
                size={20}
                color={colors.placeholderTextColor}
                type="MaterialIcons"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{}}>
          {results.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 10,
                // marginTop: 10,
                marginVertical: 10,
              }}>
              <TouchableOpacity
                key="ALL"
                style={[
                  styles.tabButton,
                  {backgroundColor: colors.textinputBackgroundcolor},
                  !selectedTitle && {backgroundColor: colors.AppmainColor},
                ]}
                onPress={() => setSelectedTitle(null)}>
                <Text
                  style={[
                    styles.tabText,
                    {color: colors.textColor},
                    !selectedTitle && {color: colors.ButtonTextColor},
                  ]}>
                  ALL
                </Text>
              </TouchableOpacity>

              {results.map(section => (
                <TouchableOpacity
                  key={section.title}
                  style={[
                    styles.tabButton,
                    {backgroundColor: colors.textinputBackgroundcolor},
                    selectedTitle === section.title && {
                      backgroundColor: colors.AppmainColor,
                    },
                  ]}
                  onPress={() => setSelectedTitle(section.title)}>
                  <Text
                    style={[
                      styles.tabText,
                      {color: colors.textColor},
                      selectedTitle === section.title && {
                        color: colors.ButtonTextColor,
                      },
                    ]}>
                    {section.title.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
        {/* {!results?.length == 0 && ( */}
        {(loading || results.length > 0 || searchQuery.trim().length >= 3) && (
          <View
            style={{
              ...styles.modalContent,
              backgroundColor: colors.textinputBackgroundcolor,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{...styles.modalTitle, color: colors.textColor}}>
                Search Results
              </Text>
              <TouchableOpacity
                onPress={() => {
                  // setResults(''),
                  setResults([]), setSearchQuery('');
                }}>
                <Icon
                  name="cross"
                  size={20}
                  color={colors.backIconColor}
                  type="Entypo"
                />
              </TouchableOpacity>
            </View>
            {loading ? (
              <ActivityIndicator size="large" color={colors.AppmainColor} />
            ) : (
              <FlatList
                ref={flatListRef}
                data={
                  selectedTitle
                    ? results.filter(section => section.title === selectedTitle)
                    : results
                }
                keyExtractor={item => item.title}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                  <Text style={{...styles.noResults, color: colors.textColor}}>
                    No results found
                  </Text>
                }
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 8,
    width: '80%',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 30,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  itemText: {
    fontSize: 14,
    //color: 'black',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#f9f9f9',
  },
  text: {
    fontSize: 14,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  modalContent: {
    // backgroundColor: 'white',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    // color: Colors.primary,
  },
  listContent: {
    paddingBottom: 20,
  },
  noResults: {
    textAlign: 'center',
    // color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    alignSelf: 'flex-end',
  },
  closeText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    //  borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    // color: Colors.black,
    marginBottom: 10,
    //backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    //   backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 10,
  },

  tabText: {
    // color: '#333',
    fontWeight: '500',
  },
  cardContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    // backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardTouchable: {
    padding: 10,
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  entryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },

  textContainer: {
    flex: 1,
    flexShrink: 1,
  },

  itemText: {
    fontSize: 14,
    //color: '#333',
    marginBottom: 4,
  },

  fieldName: {
    fontWeight: 'bold',
  },
});

export default GlobalSearch;
