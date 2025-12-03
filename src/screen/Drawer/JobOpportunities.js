import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ImageBackground,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import globalStyles from '../GlobalCSS';
import Header from '../Header/Header';
import Colors from '../color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../Icons/Icons';
import {baseUrl, FeaturedJob, listoption} from '../baseURL/api';
import {showError} from '../components/Toast';
import {useTheme} from '../../theme/ThemeContext';
import {Jobbanner, universityFullName, universityName} from '../constants';

const JobOpportunities = ({navigation, route}) => {
  const {Item = {}, GlobalSearch = {}} = route.params || {};
  const {isDark, colors, toggleTheme} = useTheme();
  const [popularCate, setPopularCate] = useState([]);
  const [featuredList, setFeaturedList] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const PER_PAGE = 20;
  const [userData, setUserData] = useState(null);
  const {width} = Dimensions.get('window');
  useEffect(() => {
    UserValue();
    // getIndustryList();
    getFeaturedList(1, true);
  }, []);

  const UserValue = async () => {
    try {
      const userDta = await AsyncStorage.getItem('userData');
      const parsedData = JSON.parse(userDta);
      setUserData(parsedData);
    } catch (error) {
      console.log('Error', error);
    }
  };
  const getIndustryList = async () => {
    try {
      const response = await fetch(`${baseUrl}${listoption}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({optionType: 'industry'}),
      });

      const data = await response.json();
      if (response.ok) setPopularCate(data?.DataList || []);
      else showError(data.message || 'Failed to fetch Industry List');
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };
  const getFeaturedList = async (pageNumber = 1, refreshing = false) => {
    if (isLoading || (!hasMore && !refreshing)) return;

    try {
      if (refreshing) setRefreshing(true);
      else setIsLoading(true);

      const response = await fetch(`${baseUrl}${FeaturedJob}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          userId: Item?.jobTitle ? '' : userData?.User?.userId,
          search: Item?.jobTitle || '',
          jobTitle: Item?.jobTitle || GlobalSearch?.jobTitle || '',
          jobLocation: '',
          companyName: '',
          page: pageNumber,
          per_page: PER_PAGE,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newData = data?.Data || [];

        if (pageNumber === 1) {
          setFeaturedList(newData);
        } else {
          setFeaturedList(prev => [...prev, ...newData]);
        }

        setHasMore(newData.length === PER_PAGE);
        setPage(pageNumber);
      } else {
        showError(data.message || 'Failed to fetch Industry List');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      if (refreshing) setRefreshing(false);
      else setIsLoading(false);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          // onPress={() => handleCategoryPress(item.Id)}
          onPress={() =>
            navigation.navigate('JobListComponent', {
              CategoryPress: item.Id,
            })
          }
          style={{...globalStyles.flexRow, margin: 5, alignItems: 'center'}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              paddingLeft: 10,
              paddingRight: 5,
              color: Colors.main_primary,
            }}>
            •
          </Text>
          <Text style={{fontSize: 17}}>{item?.Name}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderItemFeatList = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          style={{
            ...styles.card,
            backgroundColor: colors.textinputBackgroundcolor,
          }}
          onPress={() =>
            navigation.navigate('JobDetails', {
              Item: item,
            })
          }>
          <View style={{flex: 1}}>
            <Text style={{...styles.title, color: colors.AppmainColor}}>
              {item.jobTitle}
            </Text>
            <Text style={{...styles.info, color: colors.textColor}}>
              {item.levelName}
            </Text>
            <Text style={{...styles.info, color: colors.textColor}}>
              Start Date: {item.dateAdded}
            </Text>
            <Text style={{...styles.info, color: colors.textColor}}>
              Company: {item.companyName}
            </Text>
          </View>
          <View style={globalStyles.FlatListIconView}>
            <Icon
              name="location"
              size={18}
              color={colors.backIconColor}
              type="Ionicons"
            />
            <Text
              style={{...styles.info, flexShrink: 1, color: colors.textColor}}>
              {item.jobLocation}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        ...globalStyles.SafeAreaView,
        backgroundColor: colors.background,
      }}>
      <Header title="Job Opportunities" navigation={navigation} />
      <View style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <ImageBackground
            source={require('../../assets/Jobbanner.png')}
            resizeMode="cover"
            style={{
              width: 'auto',
              height: 220,
              alignSelf: 'center',
            }}
          /> */}
          <ImageBackground
            source={Jobbanner}
            resizeMode="stretch"
            style={{
              width: '100%',
              height: 300,
              alignSelf: 'center',
            }}
          />

          <View
            style={{
              ...globalStyles.ViewINter1,
              // borderWidth: 1,
              // borderColor: colors.textinputbordercolor,
            }}>
            {/* <Text style={globalStyles.headlineText}>How It Works</Text> */}
          </View>
          <View style={globalStyles.ViewINter1}>
            <Text
              style={{
                ...globalStyles.headlineText,
                fontWeight: '300',
                marginTop: 10,
                color: colors.textColor,
              }}>
              Searching for Job opportunities through {universityFullName} is a
              first in its own setup to redesign the way job market shall be
              looked upon and catch hold of the best for oneself.
            </Text>
            <Text
              style={{
                ...globalStyles.headlineText,
                fontWeight: '300',
                marginTop: 10,
                color: colors.textColor,
              }}>
              Using this feature of {universityName} students will have ample
              opportunities for themselves to look for a job position and offer
              available on the portal.{' '}
            </Text>
            <Text
              style={{
                ...globalStyles.headlineText,
                fontWeight: '300',
                marginTop: 10,
                color: colors.textColor,
              }}>
              A well laid out page for Job description along with a Company
              profile and Contact Details such as -: Contact Person Name,
              Address, Contact No. and Email Address will be available regarding
              a given job position and offer.{' '}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                ...globalStyles.saveButton,
                flex: 1,
                margin: 4,
                paddingHorizontal: 16,
                backgroundColor: colors.AppmainColor,
                flexDirection: 'row',
                //padding: 4,
              }}
              onPress={() => navigation.navigate('AddJob')}>
              <Icon
                name="upload"
                size={18}
                color={colors.ButtonTextColor}
                type="Entypo"
                style={{paddingRight: 4}}
              />
              <Text
                style={{
                  ...globalStyles.saveButtonText,
                  color: colors.ButtonTextColor,
                }}>
                Recruiters Post a Job
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('JobListComponent')}
              style={{
                ...globalStyles.saveButton,
                flex: 1,
                margin: 4,
                backgroundColor: '#00a0af',
                flexDirection: 'row',
              }}>
              <Icon
                name="search"
                size={18}
                color={colors.ButtonTextColor}
                type="FontAwesome"
                style={{paddingRight: 20}}
              />
              <Text
                style={{
                  ...globalStyles.saveButtonText,
                  color: colors.ButtonTextColor,
                }}>
                {' '}
                Search Jobs
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              ...globalStyles.ViewINter,
              borderWidth: 1,
              borderColor: colors.textinputbordercolor,
            }}>
            <Text
              style={{...globalStyles.headlineText, color: colors.textColor}}>
              Jobs By Career Levels
            </Text>
          </View>

          <TouchableOpacity
            style={{
              ...globalStyles.jobLevelView,
              borderColor: colors.textinputbordercolor,
            }}
            onPress={() =>
              navigation.navigate('JobListComponent', {
                CareerLevel: '98',
              })
            }>
            <ImageBackground
              source={require('../../assets/Job_students.jpg')}
              style={{
                ...globalStyles.jobLevelImg,
                backgroundColor: 'rgba(0,0,0,0.9)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  ...globalStyles.jobLevelView2,
                  backgroundColor: Colors.black,
                  padding: 5,
                }}>
                <Text style={globalStyles.JobLevText}>Student/Intern</Text>
              </View>
            </ImageBackground>

            <Text
              style={{
                ...globalStyles.jobLevelText1,
                color: colors.AppmainColor,
              }}>
              View All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              ...globalStyles.jobLevelView,
              borderColor: colors.textinputbordercolor,
            }}
            onPress={() =>
              navigation.navigate('JobListComponent', {
                CareerLevel: '99',
              })
            }>
            <ImageBackground
              source={require('../../assets/JobLev2.jpg')}
              style={{
                ...globalStyles.jobLevelImg,
                backgroundColor: 'rgba(0,0,0,0.9)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  ...globalStyles.jobLevelView2,
                  backgroundColor: Colors.black,
                  padding: 5,
                }}>
                <Text style={globalStyles.JobLevText}>Entry Level</Text>
              </View>
            </ImageBackground>
            <View style={globalStyles.jobLevelView2}>
              <Text
                style={{
                  ...globalStyles.jobLevelText1,
                  color: colors.AppmainColor,
                }}>
                View All
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              ...globalStyles.jobLevelView,
              borderColor: colors.textinputbordercolor,
            }}
            onPress={() =>
              navigation.navigate('JobListComponent', {
                CareerLevel: '100',
              })
            }>
            <ImageBackground
              source={require('../../assets/JobLev3.jpg')}
              style={{
                ...globalStyles.jobLevelImg,
                backgroundColor: 'rgba(0,0,0,0.9)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  ...globalStyles.jobLevelView2,
                  backgroundColor: Colors.black,
                  padding: 5,
                }}>
                <Text style={globalStyles.JobLevText}>
                  Professional/Experienced
                </Text>
              </View>
            </ImageBackground>

            <View style={globalStyles.jobLevelView2}>
              <Text
                style={{
                  ...globalStyles.jobLevelText1,
                  color: colors.AppmainColor,
                }}>
                View All
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              ...globalStyles.jobLevelView,
              borderColor: colors.textinputbordercolor,
            }}
            onPress={() =>
              navigation.navigate('JobListComponent', {
                CareerLevel: '101',
              })
            }>
            <ImageBackground
              source={require('../../assets/JobLev4.jpg')}
              style={{
                ...globalStyles.jobLevelImg,
                backgroundColor: 'rgba(0,0,0,0.9)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  ...globalStyles.jobLevelView2,
                  backgroundColor: Colors.black,
                  padding: 5,
                }}>
                <Text style={globalStyles.JobLevText}>
                  Manager (Manager/Supervisor)
                </Text>
              </View>
            </ImageBackground>
            <View style={globalStyles.jobLevelView2}>
              <Text
                style={{
                  ...globalStyles.jobLevelText1,
                  color: colors.AppmainColor,
                }}>
                View All
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              ...globalStyles.jobLevelView,
              borderColor: colors.textinputbordercolor,
            }}
            onPress={() =>
              navigation.navigate('JobListComponent', {
                CareerLevel: '102',
              })
            }>
            <ImageBackground
              source={require('../../assets/JobLev5.jpg')}
              style={{
                ...globalStyles.jobLevelImg,
                backgroundColor: 'rgba(0,0,0,0.9)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  ...globalStyles.jobLevelView2,
                  backgroundColor: Colors.black,
                  padding: 5,
                }}>
                <Text style={globalStyles.JobLevText}>
                  Executive (VP, SVP, etc.)
                </Text>
              </View>
            </ImageBackground>

            <View style={globalStyles.jobLevelView2}>
              <Text
                style={{
                  ...globalStyles.jobLevelText1,
                  color: colors.AppmainColor,
                }}>
                View All
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...globalStyles.jobLevelView,
              borderColor: colors.textinputbordercolor,
            }}
            onPress={() =>
              navigation.navigate('JobListComponent', {
                CareerLevel: '103',
              })
            }>
            <ImageBackground
              source={require('../../assets/JobLev6.jpg')}
              style={{
                ...globalStyles.jobLevelImg,
                backgroundColor: 'rgba(0,0,0,0.9)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  ...globalStyles.jobLevelView2,
                  backgroundColor: Colors.black,
                  padding: 5,
                }}>
                <Text style={globalStyles.JobLevText}>
                  Senior Executive (CEO, CFO, President)
                </Text>
              </View>
            </ImageBackground>

            <View style={globalStyles.jobLevelView2}>
              <Text
                style={{
                  ...globalStyles.jobLevelText1,
                  color: colors.AppmainColor,
                }}>
                View All
              </Text>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={globalStyles.jobLevelView}
            onPress={() =>
              navigation.navigate('JobListComponent', {
                CareerLevel: '103',
              })
            }>
            <Image
              source={require('../../assets/JobLev6.jpg')}
              style={globalStyles.jobLevelImg}
            />
            <View style={globalStyles.jobLevelView2}>
              <Text style={globalStyles.jobLevelText}>
                Senior Executive (CEO, CFO, President)
              </Text>
              <Text style={globalStyles.jobLevelText1}>View All</Text>
            </View>
          </TouchableOpacity> */}

          {/* <View
            style={{
              ...globalStyles.ViewINter,
              borderWidth: 1,
              borderColor: Colors.borderColor,
            }}>
            <Text style={globalStyles.headlineText}>
              Most Popular Categories
            </Text>
          </View>

          <FlatList
            data={popularCate}
            renderItem={renderItem}
            keyExtractor={item => item?.Id?.toString()}
          /> */}

          <View
            style={{
              ...globalStyles.ViewINter,
              borderWidth: 1,
              borderColor: colors.textinputbordercolor,
            }}>
            <Text
              style={{...globalStyles.headlineText, color: colors.textColor}}>
              Featured Jobs
            </Text>
          </View>
          <FlatList
            data={featuredList}
            renderItem={renderItemFeatList}
            keyExtractor={item => item?.id?.toString()}
            onEndReached={() => {
              if (hasMore && !isLoading) getFeaturedList(page + 1);
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoading ? <ActivityIndicator size="small" /> : null
            }
            refreshing={refreshing}
            onRefresh={() => getFeaturedList(1, true)}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 10,
    margin: 10,
    // backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  info: {
    fontSize: 12,
    marginTop: 2,
  },

  textInput: {
    paddingTop: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    height: 40,
  },
  headerView: {
    flex: 0.09,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
  },
  JobfiledSection: {paddingTop: 10},
  textInput: {
    paddingTop: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    height: 40,
  },
  dobView: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dobText: {fontSize: 13},

  seconDOMView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '',
  },
  textInputDOM: {
    width: 60,
    height: 40,
    paddingTop: 5,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    marginRight: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  save: {
    borderRadius: 10,
    paddingVertical: 15,
    backgroundColor: Colors.main_primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveText: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: '700',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    flex: 0.44,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 35,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  seclectIndiaView: {
    marginTop: 5,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  inputIcon: {
    position: 'absolute',
    right: 10, // Place the icon at the right of the TextInput
  },

  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 14,
    color: 'black',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#f9f9f9',
  },
  dropdownList: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    fontSize: 14,
  },
  container: {flex: 1, padding: 10, backgroundColor: '#fff'},
  inputContainer: {flexDirection: 'row', marginTop: 20},
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: Colors.secondGreen,
    padding: 12,
    marginLeft: 10,
    borderRadius: 8,
  },
  addText: {color: '#fff', fontWeight: 'bold'},
  skillTag: {
    backgroundColor: Colors.secondGreen,
    padding: 8,
    margin: 5,
    borderRadius: 20,
  },
  skillText: {color: '#fff', fontWeight: 'bold'},
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  bullet: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 5,
    color: Colors.main_primary,
  },
  itemText: {
    fontSize: 17,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    marginBottom: 10,
  },
  closeText: {
    color: 'blue',
    fontSize: 16,
  },
  jobItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default JobOpportunities;
