import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  Modal,
  Switch,
  InteractionManager,
  TouchableWithoutFeedback,
  Button,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import Pusher from 'pusher-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../color';
import moment from 'moment';
import Icon from '../Icons/Icons';
import {
  baseUrl,
  BlockUnblockGroup,
  DeleteGroup,
  deletegroupchat,
  GetGroupChat,
  SendGroupChat,
  UpdateGroup,
  UserBlockUnblockGroup,
  invitegroupchat,
} from '../baseURL/api';
import ImagePicker from 'react-native-image-crop-picker';
import globalStyles from '../GlobalCSS';
import ImageViewer from 'react-native-image-zoom-viewer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {showError, showSuccess} from '../components/Toast';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import {useTheme} from '../../theme/ThemeContext';

const SCROLL_THRESHOLD = 100;
const ChatDetails = ({navigation, route}) => {
  const {Item = {}} = route.params || {};
  const a = Item?.memberList?.map(item => item?.IsUserBlocked);
  const {isDark, colors, toggleTheme} = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalVisibledelete, setIsModalVisibledelete] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const handleLongPress = id => {
    setSelectedMessageId(id);
    setIsModalVisibledelete(true);
  };

  const handleCancel = () => {
    setIsModalVisibledelete(false);
    setSelectedMessageId(null);
  };

  const handleDeleteMessage = id => {
    deleteGroupMessages(id);
    setIsModalVisibledelete(false);
    setSelectedMessageId(null);
  };

  const openImageModal = (imageUrl, index = 0) => {
    setModalImages([{url: imageUrl}]);
    setModalIndex(index);
    setModalVisible(true);
  };

  const flatListRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    });
  }, [sortedMessages]);
  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({animated: true});
  };

  const onScroll = event => {
    const distanceFromTop = event.nativeEvent.contentOffset.y;
    setShowScrollToBottom(distanceFromTop > 100);
  };
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [senderId, setSenderId] = useState(null);
  const [images, setImages] = useState('');
  const [imagesName, setImagesName] = useState('');
  const [base64, setBase64] = useState([]);
  const [UpdateGroupbase64, setUpdateGroupBase64] = useState('');
  const [UpdateGroupimages, setUpdateGroupImages] = useState([]);
  const [selectedValue1, setSelectedValue1] = useState('Share with Public');
  const [isOpen2, setIsOpen2] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const options2 = [
    'Invite By Email',
    'Change Group Image',
    'Block/UnBlock User',
    Item?.isGroupBlock === 'Yes' ? 'UnBlock Group' : 'Block Group',
    'Delete Group',
  ];
  const toggleDropdown2 = () => setIsOpen2(!isOpen2);

  const selectOption2 = option => {
    console.log('Selected Option:', option);
    if (option === 'Delete Group') {
      handleDeleteGroup(Item);
    } else if (option === 'Change Group Image') {
      setIsModalVisible(true);
    } else if (option === 'Block Group' || option === 'UnBlock Group') {
      handleBlockUnblockGroup(Item);
    } else if (option === 'Block/UnBlock User') {
      setSelectedMembers(Item?.memberList || []);
      setIsMemberModalVisible(true);
    } else if (option === 'Invite By Email') {
      setEmailModalVisible(true);
    }

    setSelectedValue1(option);
    setIsOpen2(false);
  };
  useEffect(() => {
    const fetchUser = async () => {
      const userDta = await AsyncStorage.getItem('userData');
      const parsedData = JSON.parse(userDta);
      setSenderId(parsedData?.User?.userId);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (senderId && Item?.id) {
      fetchChatGroups();
      const pusher = new Pusher('6840a502dc1ebc6a81f5', {
        cluster: 'ap2',
        encrypted: true,
      });

      const channel = pusher.subscribe(`group-chat.${Item.id}`);
      channel.bind('new-group-message', data => {
        if (data?.message) {
          fetchChatGroups();
          // setMessages(prev => [data.message, ...prev]);
        }
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect();
      };
    }
  }, [senderId, Item?.id]);

  const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const inviteByEmail = async () => {
    if (!validateEmail(email)) {
      showError('Please enter a valid email address.');
      setEmail('');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');

    try {
      const payload = JSON.stringify({
        to: email,
        userId: Item.groupModerator.UserId,
        templateId: 122,
        groupId: Item?.id,
        setting_id: 2,
      });
      const response = await fetch(`${baseUrl}${invitegroupchat}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.message, 'messagemessagemessage');

        setErrorMessage(errorData.message || 'Something went wrong!');
        setEmail('');
      } else {
        const responseData = await response.json();

        showSuccess('Invitation sent successfully!');
        setEmail('');
        setEmailModalVisible(false);
      }
    } catch (error) {
      setErrorMessage('There was an error sending the invitation.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteGroupMessages = async id => {
    setLoading(true);
    try {
      const url = `${baseUrl}${deletegroupchat}`;
      const payload = JSON.stringify({id});
      console.log(payload, 'payloadpayloadpayload');

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: payload,
      });

      const data = await response.json();
      console.log('Response Data:', data);

      if (response.ok) {
        if (data.status === 1) {
          showSuccess(data.message);
          await fetchChatGroups();
        } else {
          showError(data.message || 'Failed to delete the message.');
          console.error('Error:', data.message);
        }
      } else {
        showError(data.message || 'Failed to delete the message.');
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Delete Message Error Group Messages:', error);
      showError('Something went wrong while deleting the message.');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatGroups = async () => {
    try {
      const response = await fetch(`${baseUrl}${GetGroupChat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({groupId: Item?.id}),
      });
      const data = await response.json();
      setMessages(data?.Messages);
    } catch (error) {
      console.error('Error fetching chat groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedMessages = messages.reduce((acc, message) => {
    const messageDate = moment(message.dateAdded, 'YYYY-MM-DD HH:mm:ss').format(
      'DD MMM YYYY',
    );

    if (!acc[messageDate]) {
      acc[messageDate] = [];
    }
    acc[messageDate].push(message);
    return acc;
  }, {});

  Object.keys(groupedMessages).forEach(date => {
    groupedMessages[date] = groupedMessages[date].sort(
      (a, b) =>
        moment(a.dateAdded, 'YYYY-MM-DD HH:mm:ss').valueOf() -
        moment(b.dateAdded, 'YYYY-MM-DD HH:mm:ss').valueOf(),
    );
  });

  const sortedMessages = Object.entries(groupedMessages)
    .map(([date, messages]) => ({date, messages}))
    .sort(
      (a, b) =>
        moment(a.date, 'DD MMM YYYY').valueOf() -
        moment(b.date, 'DD MMM YYYY').valueOf(),
    );

  const renderItem = ({item}) => {
    return (
      <View>
        <View style={styles.dateSection}>
          <Text
            style={{
              ...styles.dateText,
              backgroundColor: colors.textinputBackgroundcolor,
              color: colors.placeholderTextColor,
            }}>
            {moment().format('DD MMM YYYY') === item.date ? 'Today' : item.date}
          </Text>
        </View>
        {item.messages.map((msg, index) => {
          // const isSentByUser = msg.userId === senderId;
          const isSentByUser = msg.userId === senderId;
          const messageTime = moment(
            msg.dateAdded,
            'YYYY-MM-DD HH:mm:ss',
          ).format('hh:mm A');

          const hasText = msg.chatText && msg.chatText.trim().length > 0;
          const hasImage = msg.fileName;
          if (!hasText && !hasImage) return null;

          return (
            <View key={msg.id} style={{marginBottom: 8}}>
              <View
                style={{flexDirection: isSentByUser ? 'row-reverse' : 'row'}}>
                {!isSentByUser && (
                  <TouchableOpacity
                    onLongPress={() => handleLongPress(msg.id)}
                    delayLongPress={500}
                    onPress={() => openImageModal(msg.userImage)}>
                    <Image
                      source={{uri: msg?.userImage}}
                      style={[
                        styles.firstImage,
                        isSentByUser
                          ? {
                              ...styles.receivedMeta,
                              backgroundColor: colors.AppmainColor,
                            }
                          : {
                              ...styles.sentMeta,
                              //backgroundColor: colors.AppmainColor,
                            },
                      ]}
                    />
                  </TouchableOpacity>
                )}

                {hasText && (
                  <TouchableOpacity
                    onLongPress={() => handleLongPress(msg.id)}
                    delayLongPress={500}
                    style={[
                      styles.messageBubble,
                      isSentByUser
                        ? {
                            ...styles.receivedMeta,
                            backgroundColor: colors.AppmainColor,
                          }
                        : {
                            ...styles.sent,
                          },
                    ]}>
                    <Text
                      style={{
                        ...styles.messageText,
                        color: isSentByUser ? 'white' : 'black',
                      }}>
                      {msg.chatText}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View
                style={[
                  styles.messageMeta,
                  isSentByUser
                    ? {
                        ...styles.receivedMeta,
                      }
                    : {
                        ...styles.sentMeta,
                      },
                ]}>
                {!isSentByUser && (
                  <Text
                    style={{
                      ...styles.timeText,
                      paddingRight: 2,
                      color: colors.placeholderTextColor,
                    }}>
                    {msg?.userName}
                  </Text>
                )}
                <Text
                  style={{
                    ...styles.timeText,
                    color: colors.placeholderTextColor,
                  }}>
                  {messageTime}
                </Text>
              </View>

              {hasImage && (
                <View style={styles.row}>
                  <TouchableOpacity
                    onLongPress={() => handleLongPress(msg.id)}
                    delayLongPress={500}
                    onPress={() => openImageModal(msg.fileName)}>
                    <Image
                      source={{uri: msg?.fileName}}
                      style={[
                        styles.firstImage1,
                        isSentByUser
                          ? {
                              ...styles.receivedMeta,
                              backgroundColor: colors.AppmainColor,
                            }
                          : {
                              ...styles.sentMeta,
                            },
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const selectUpdateGroupImage = () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
      compressImageQuality: 0.8,
      includeBase64: true,
      cropperCircleOverlay: true,
      cropping: true,
    })
      .then(image => {
        if (!image?.data) {
          showError('No base64 data found in image.');
          return;
        }

        const base64WithoutPrefix = image.data;

        setUpdateGroupBase64(base64WithoutPrefix);
        const previewImage = `data:${image.mime};base64,${base64WithoutPrefix}`;
        setUpdateGroupImages([previewImage]);
      })
      .catch(error => {
        console.error('Image selection cancelled or failed:', error);
      });
  };

  const selectImages = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      includeBase64: false,
      compressImageQuality: 0.8,
    }).then(image => {
      const imageName = image.path.substring(image.path.lastIndexOf('/') + 1);
      const imageUri = image.path;
      sendMessage('', imageName, imageUri);
    });
  };

  const sendMessage = async (chatText = '', imageName = '', imageUri = '') => {
    if (!chatText && !imageUri) {
      console.log('Empty message and no image, skipping API call');
      return;
    }

    const formData = new FormData();
    formData.append('senderId', senderId.toString());
    formData.append('groupId', Item?.id?.toString());
    formData.append('chatText', chatText || '');
    if (imageUri) {
      const attachments = [
        {
          uri: imageUri,
          name: imageName || 'image.jpg',
          type: 'image/jpeg',
        },
      ];

      attachments.forEach(file => {
        formData.append('attachment[]', file);
      });
    }
    try {
      const response = await fetch(`${baseUrl}${SendGroupChat}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await response.json();
      console.log('response', data);

      if (response.ok) {
        setText('');
        setImages([]);
        setImagesName('');
        setBase64([]);
        fetchChatGroups();
      } else {
        console.warn('Server responded with error:', data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteGroup = item => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this Group?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const payload = JSON.stringify({
                id: item?.id,
              });
              const response = await fetch(`${baseUrl}${DeleteGroup}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: payload,
              });

              const data = await response.json();
              console.log('datadatadatadatadatadatadatadata', data);

              if (response.ok) {
                navigation.goBack();
              }
            } catch (error) {
              console.error('Delete Error:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };
  const handleUpdateValue = async () => {
    if (!UpdateGroupbase64) {
      showError('Please select the Image');
      return;
    }

    const payload = JSON.stringify({
      groupId: Item?.id,
      userGroupStatus: isActive ? 0 : 1,
      groupThumb: UpdateGroupbase64,
    });
    try {
      const response = await fetch(`${baseUrl}${UpdateGroup}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });
      const data = await response.json();
      console.log(data, 'datadatadatadata99');

      if (response.ok) {
        showSuccess(data.Message);
        navigation.goBack();
      } else {
        console.error('Update failed:', data);
        showError(data?.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleBlockUnblockGroup = async group => {
    try {
      const newBlockStatus = Item?.isGroupBlock === 'No' ? 1 : 0;

      const response = await fetch(`${baseUrl}${BlockUnblockGroup}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockStatus: newBlockStatus,
          groupId: Item?.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Success:', data);

        alert(
          `Group "${Item.groupName}" has been ${
            newBlockStatus === 1 ? 'Blocked' : 'Unblocked'
          } Successfully`,
        );
        navigation.goBack();
      } else {
        console.log('Error:', data);
        showError('Failed to update group status');
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const toggleBlockStatus = async user => {
    const newStatus = user.IsUserBlocked ? 0 : 1;

    try {
      const response = await fetch(`${baseUrl}${UserBlockUnblockGroup}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.UserId,
          groupId: Item?.id,
          blockStatus: newStatus,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Updated Block Status:', result);
        showSuccess(result.Message);
        setSelectedMembers(prevMembers =>
          prevMembers.map(member =>
            member.UserId === user.UserId
              ? {...member, IsUserBlocked: !user.IsUserBlocked}
              : member,
          ),
        );
      } else {
        console.error('Failed to update block status:', result);
      }
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        if (isOpen2) toggleDropdown2();
      }}>
      <SafeAreaView
        style={{...styles.container, backgroundColor: colors.background}}>
        <KeyboardAvoidingWrapper offset={40}>
          <View style={{flex: 1, marginHorizontal: 20}}>
            <View style={globalStyles.GroupsChatView}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{paddingRight: 10}}>
                <Icon
                  name="left"
                  type="AntDesign"
                  size={22}
                  color={colors.backIconColor}
                />
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'relative',
                }}>
                <View>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      marginRight: 10,
                      borderRadius: 40,
                      backgroundColor: Colors.lite_gray,
                    }}
                    source={{uri: Item?.groupImage}}
                  />
                </View>

                <View style={{flex: 0.95}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: colors.textColor,
                    }}>
                    {Item?.groupName || 'User Name'}
                  </Text>
                </View>
                <TouchableOpacity onPress={toggleDropdown2}>
                  <Icon
                    type="Entypo"
                    name="dots-three-vertical"
                    size={20}
                    color={colors.backIconColor}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    position: 'absolute',
                    left: 160,
                    top: 0,
                  }}>
                  {isOpen2 && (
                    <View
                      style={{
                        backgroundColor: colors.modelBackground,
                        borderRadius: 5,
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.2,
                        padding: 5,
                        zIndex: 999,
                      }}>
                      {options2.map((option, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{
                            ...globalStyles.dropdownItemShare,
                            borderColor: colors.textinputbordercolor,
                          }}
                          onPress={() => selectOption2(option)}>
                          <Text
                            style={{...styles.text, color: colors.textColor}}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                backgroundColor: colors.AppmainColor,
                width: '100%',
                height: 1,
              }}
            />
            <FlatList
              inverted
              ref={flatListRef}
              data={[...sortedMessages].reverse()}
              keyExtractor={item => item.date}
              renderItem={renderItem}
              onScroll={onScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{paddingBottom: 100}}
              showsVerticalScrollIndicator={false}
            />

            {showScrollToBottom && (
              <TouchableOpacity
                onPress={scrollToBottom}
                style={{
                  ...styles.scrollToBottomButton,
                  backgroundColor: colors.background,
                }}>
                <Text
                  style={{
                    ...styles.scrollToBottomText,
                    color: colors.AppmainColor,
                  }}>
                  ↓
                </Text>
              </TouchableOpacity>
            )}

            {Item?.isGroupBlock === 'Yes' ? (
              <>
                <View
                  style={{
                    backgroundColor: colors.placeholderTextColor,
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}>
                  <Text style={{fontSize: 20, color: 'black'}}>
                    This Group is Block
                  </Text>
                </View>
              </>
            ) : (
              <View
                style={{
                  ...globalStyles.inputContainerChat,
                  borderColor: colors.textinputbordercolor,
                }}>
                <TouchableOpacity
                  onPress={selectImages}
                  style={{paddingRight: 8}}>
                  <Icon
                    name="paperclip"
                    size={20}
                    color={colors.textColor}
                    type="FontAwesome"
                  />
                </TouchableOpacity>
                <TextInput
                  style={{
                    ...styles.input,
                    backgroundColor: colors.textinputBackgroundcolor,
                    color: colors.textColor,
                  }}
                  value={text}
                  onChangeText={setText}
                  placeholder="Type a message..."
                  placeholderTextColor={colors.placeholderTextColor}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => sendMessage(text)}
                  //onPress={sendMessage}
                >
                  <Text style={styles.sendText}>➤</Text>
                </TouchableOpacity>
              </View>
            )}

            <Modal
              visible={emailModalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setEmailModalVisible(false)}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{flex: 1}}>
                <View style={styles.emailoverlay}>
                  <View
                    style={{
                      ...styles.emailmodalContainer,
                      backgroundColor: colors.modelBackground,
                    }}>
                    <TouchableOpacity
                      onPress={() => setEmailModalVisible(false)}
                      style={styles.emailcloseIcon}>
                      <MaterialIcons
                        name="close"
                        size={24}
                        color={colors.backIconColor}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{...styles.emailtitle, color: colors.textColor}}>
                      Invite by Email
                    </Text>

                    <View style={{flex: 1}}>
                      <TextInput
                        style={{
                          ...styles.emailinput,
                          color: colors.textColor,
                          borderColor: colors.textinputbordercolor,
                          backgroundColor: colors.textinputBackgroundcolor,
                        }}
                        placeholder="Enter Your Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={colors.placeholderTextColor}
                      />
                    </View>

                    {errorMessage ? (
                      <Text style={styles.emailerrorText}>{errorMessage}</Text>
                    ) : null}
                    <View style={{}}>
                      <TouchableOpacity
                        style={{
                          ...styles.emailsendButton,
                          backgroundColor: colors.AppmainColor,
                        }}
                        onPress={inviteByEmail}
                        disabled={isLoading}>
                        <Text
                          style={{
                            ...styles.emailsendButtonText,
                            color: colors.ButtonTextColor,
                          }}>
                          {isLoading ? 'Sending...' : 'Send Invitation'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {isLoading && (
                      <ActivityIndicator size="small" color="#0000ff" />
                    )}
                  </View>
                </View>
              </KeyboardAvoidingView>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => setIsModalVisible(false)}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: colors.modelBackground,
                    margin: 20,
                    borderRadius: 10,
                    padding: 20,
                  }}>
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: 10,
                      zIndex: 1,
                    }}
                    onPress={() => setIsModalVisible(false)}>
                    <Icon name="cross" size={24} color={colors.backIconColor} />
                  </TouchableOpacity>

                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginBottom: 10,
                      color: colors.textColor,
                    }}>
                    Group Setting
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 10,
                    }}>
                    <Text style={{color: colors.textColor}}>
                      Change Group Photo
                    </Text>
                    <TouchableOpacity
                      onPress={selectUpdateGroupImage}
                      style={{
                        backgroundColor: colors.AppmainColor,
                        padding: 6,
                        borderRadius: 5,
                      }}>
                      <Text
                        style={{
                          color: colors.ButtonTextColor,
                          fontWeight: 'bold',
                        }}>
                        Select Photo
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {UpdateGroupimages.length > 0 && (
                    <View style={{alignItems: 'center', marginVertical: 10}}>
                      <Image
                        source={{uri: UpdateGroupimages[0]}}
                        style={{width: 100, height: 100, borderRadius: 10}}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setUpdateGroupImages([]);
                          setUpdateGroupBase64('');
                        }}>
                        <Icon
                          name="cross"
                          size={20}
                          color={colors.backIconColor}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 20,
                    }}>
                    <Text style={{color: colors.textColor}}>Group status:</Text>
                    <Switch
                      trackColor={{false: '#767577', true: colors.AppmainColor}}
                      thumbColor={isActive ? colors.AppmainColor : '#f4f3f4'}
                      onValueChange={setIsActive}
                      value={isActive}
                    />
                  </View>

                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.AppmainColor,
                      padding: 10,
                      marginTop: 20,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={handleUpdateValue}>
                    <Text
                      style={{
                        color: colors.ButtonTextColor,
                        fontWeight: 'bold',
                      }}>
                      Update
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Modal
              visible={isMemberModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsMemberModalVisible(false)}>
              <View style={styles.modalContainer}>
                <View
                  style={{
                    ...styles.modalContent,
                    backgroundColor: colors.modelBackground,
                  }}>
                  <Text style={{...styles.modalTitle, color: colors.textColor}}>
                    Block/Unblock Users
                  </Text>
                  <FlatList
                    data={selectedMembers}
                    keyExtractor={item => item.UserId.toString()}
                    renderItem={({item}) => (
                      <View
                        style={{
                          ...styles.memberItem,
                          borderBottomColor: colors.textinputbordercolor,
                        }}>
                        <Image
                          source={
                            item.ProfilePhoto
                              ? {uri: item.ProfilePhoto}
                              : require('../../assets/placeholderprofileimage.png')
                          }
                          style={styles.memberImage}
                        />
                        <Text
                          style={{
                            ...styles.memberName,
                            color: colors.textColor,
                          }}>
                          {item.UserName}
                        </Text>

                        <TouchableOpacity
                          style={[
                            styles.blockButton,
                            {
                              backgroundColor: item.IsUserBlocked
                                ? 'red'
                                : colors.AppmainColor,
                              marginLeft: 5,
                              borderRadius: 5,
                            },
                          ]}
                          onPress={() => toggleBlockStatus(item)}>
                          <Text
                            style={{
                              color: colors.ButtonTextColor,
                              fontSize: 14,
                              padding: 5,
                            }}>
                            {item.IsUserBlocked ? 'Unblock' : 'Block'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />

                  <TouchableOpacity
                    hitSlop={20}
                    style={styles.cross}
                    onPress={() => setIsMemberModalVisible(false)}>
                    <Icon
                      name="cross"
                      size={25}
                      color={colors.backIconColor}
                      type="Entypo"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              visible={modalVisible}
              transparent={true}
              onRequestClose={() => setModalVisible(false)}>
              <ImageViewer
                imageUrls={modalImages}
                index={modalIndex}
                onCancel={() => setModalVisible(false)}
                enableSwipeDown={true}
                onSwipeDown={() => setModalVisible(false)}
                renderIndicator={() => null}
                renderHeader={() => (
                  <TouchableOpacity
                    hitSlop={10}
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}>
                    <MaterialIcons name="close" size={14} color="black" />
                  </TouchableOpacity>
                )}
              />
            </Modal>
            <ConfirmDeleteModal
              isVisible={isModalVisibledelete}
              onCancel={handleCancel}
              onConfirm={() => handleDeleteMessage(selectedMessageId)}
              title="Delete Message"
              message="Are you sure you want to delete this message?"
            />
          </View>
        </KeyboardAvoidingWrapper>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageBubble: {
    paddingHorizontal: 15,
    marginHorizontal: 10,
    padding: 12,
    marginVertical: 6,
    borderRadius: 20,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sent: {
    alignSelf: 'flex-end',
    borderTopRightRadius: 5,
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#bfc3c4',
    borderTopLeftRadius: 5,
  },
  messageText: {
    fontSize: 15,
    color: '#fff',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    borderRadius: 25,
    backgroundColor: '#F1F1F1',
    marginRight: 10,
    color: 'black',
  },
  sendButton: {
    width: 45,
    height: 45,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    fontSize: 22,
    color: '#fff',
  },
  messageBubble: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 6,
    borderRadius: 20,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sent: {
    alignSelf: 'flex-start',
    backgroundColor: '#bfc3c4',
    borderTopLeftRadius: 5,
  },
  received: {
    alignSelf: 'flex-end',
    backgroundColor: Colors?.secondGreen,
    borderTopRightRadius: 5,
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 2,
  },
  sentMeta: {
    alignSelf: 'flex-start',
  },
  receivedMeta: {
    alignSelf: 'flex-end',
  },
  timeText: {
    fontSize: 12,
  },
  readStatus: {
    fontSize: 12,
    marginLeft: 5,
    color: '#007AFF',
  },
  dateSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    backgroundColor: '#e0e0e0',
    padding: 5,
    borderRadius: 10,
    fontSize: 12,
    color: '#555',
  },

  text: {
    fontSize: 14,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // row: {
  //   flexDirection: 'row',
  //   alignItems: 'flex-end', // Align items at the top
  // },
  firstImage: {
    width: 40,
    height: 40,
    marginRight: 10, // Spacing between big and small images
    borderRadius: 30,
    backgroundColor: Colors?.lite_gray,
  },
  smallImage: {
    width: 93,
    height: 93,
    marginBottom: 10, // Spacing between small images
    borderRadius: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-start',
  },

  sentImageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6', // Light green background for sent images
    borderRadius: 10,
    padding: 5,
  },

  receivedImageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0', // Light gray background for received images
    borderRadius: 10,
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    // backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  statusText: {
    fontSize: 16,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
  },
  firstImage1: {
    width: '50%',
    height: 205,
    marginRight: 10, // Spacing between big and small images
    borderRadius: 8,
    backgroundColor: Colors?.lite_gray,
  },
  scrollToBottomButton: {
    position: 'absolute',
    bottom: 80,
    // right: 20,
    borderRadius: 20,
    padding: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scrollToBottomText: {
    fontSize: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 4,
    backgroundColor: 'grey',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  // email model Ui
  emailoverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  emailmodalContainer: {
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: '40%',
    alignItems: 'stretch',
  },
  emailcloseIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  emailtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  emailinput: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    // borderColor: '#ccc',
    // color: 'black',
    // marginBottom: 10,
  },
  emailsendButton: {
    backgroundColor: Colors.main_primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    //marginTop: 60,
  },
  emailsendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  emailerrorText: {
    color: 'red',
    marginBottom: 5,
    textAlign: 'center',
  },
  cross: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 4,
    borderRadius: 14,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    // elevation: 5,
  },
});

export default ChatDetails;
