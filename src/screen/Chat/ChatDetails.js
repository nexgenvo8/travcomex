import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
  Vibration,
  Dimensions,
} from 'react-native';
import Pusher from 'pusher-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../color';
import moment from 'moment';
import Icon from '../Icons/Icons';
import {
  baseUrl,
  GetMentorChat,
  GetMessage,
  MarkAsRead,
  MarkAsReadMentor,
  MentorChatSend,
  SendMessage,
  deleteMentorChat,
  deleteChat,
  UserTyping,
} from '../baseURL/api';
import ImagePicker from 'react-native-image-crop-picker';
import globalStyles from '../GlobalCSS';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import ImageViewer from 'react-native-image-zoom-viewer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {showError, showSuccess} from '../components/Toast';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import CommonLoader from '../components/CommonLoader';
import {useTheme} from '../../theme/ThemeContext';
const screenWidth = Dimensions.get('window').width;
const ChatDetails = ({navigation, route}) => {
  const {Item = {}, Type = '', ShareVal = {}} = route.params || {};
  const {isDark, colors, toggleTheme} = useTheme();
  const [onlineUsers, setOnlineUsers] = useState({});
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [senderId, setSenderId] = useState(null);
  const [images, setImages] = useState('');
  const [imagesName, setImagesName] = useState('');
  const [base64, setBase64] = useState([]);
  const receiverId = Number(Item?.UserId);
  const [isSending, setIsSending] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isModalVisibledelete, setIsModalVisibledelete] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [isTypingReceiver, setIsTypingReceiver] = useState(false);
  const handleTyping = async inputText => {
    setText(inputText);
    await sendTypingStatus(inputText.length > 0);
  };

  const sendTypingStatus = async isTyping => {
    try {
      const response = await fetch(`${baseUrl}${UserTyping}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          senderId,
          receiverId,
          isTyping,
        }),
      });
      // const text = await response.text();
      // console.log(text, 'texttexttexttexttexttexttext');

      const data = await response.json();
    } catch (error) {
      console.error('❌ Error sending typing status:', error);
    }
  };
  const handleLongPress = id => {
    setSelectedMessageId(id);
    setIsModalVisibledelete(true);
  };

  const handleCancel = () => {
    setIsModalVisibledelete(false);
    setSelectedMessageId(null);
  };

  const handleDeleteMessage = id => {
    deleteMessages(id); // Your existing delete logic
    setIsModalVisibledelete(false);
    setSelectedMessageId(null);
  };

  useEffect(() => {
    const pusher = new Pusher('6840a502dc1ebc6a81f5', {
      cluster: 'ap2',
    });

    const channel = pusher.subscribe('user-typing');
    channel.bind('typing-message', data => {
      // console.log('📥 typingtypingtypingtyping:', data);
      const {
        senderId: typingSender,
        receiverId: typingReceiver,
        isTyping,
      } = data;
      if (typingSender === receiverId && typingReceiver === senderId) {
        setIsTypingReceiver(isTyping);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [senderId, receiverId]);
  useEffect(() => {
    if (senderId) fetchMessages();
    const pusher = new Pusher('6840a502dc1ebc6a81f5', {
      cluster: 'ap2',
      encrypted: true,
    });
    const channel = pusher.subscribe('chat-channel');
    channel.bind('new-message', data => {
      if (data?.message) fetchMessages();
      // console.log('📥 IncomingIncomingIncoming:', data);
      // Vibration.vibrate(1000);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [senderId]);
  useEffect(() => {
    if (senderId) fetchMessages();

    const pusher = new Pusher('6840a502dc1ebc6a81f5', {
      cluster: 'ap2',
      encrypted: true,
    });

    const channel = pusher.subscribe('mentor-chat');
    channel.bind('new-mentor-message', data => {
      // Vibration.vibrate(1000);
      if (data?.message) fetchMessages();
      //console.log('📥 IncomingIncomingIncoming:', data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [senderId]);
  useEffect(() => {
    const pusher = new Pusher('6840a502dc1ebc6a81f5', {
      cluster: 'ap2',
    });
    const channel = pusher.subscribe('marked-as-read');
    channel.bind('messages-marked-as-read', data => {
      //console.log('📩 Read event received:', data);
      const isSender =
        data.userId === senderId && data.contactId === receiverId;
      const isReceiver =
        data.userId === receiverId && data.contactId === senderId;
      if (isSender || isReceiver) {
        updateMessagesAsRead(data);
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [senderId, receiverId]);
  useEffect(() => {
    const pusher = new Pusher('6840a502dc1ebc6a81f5', {
      cluster: 'ap2',
    });
    const channel = pusher.subscribe('marked-as-mentor-read');
    channel.bind('mentor-messages-marked-as-read', data => {
      //  console.log('📩 Mentor Read event received:', data);
      const isSender =
        data.userId === senderId && data.contactId === receiverId;
      const isReceiver =
        data.userId === receiverId && data.contactId === senderId;
      if (isSender || isReceiver) {
        updateMessagesAsReadmentor(data);
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [senderId, receiverId]);
  useEffect(() => {
    const pusher = new Pusher('6840a502dc1ebc6a81f5', {cluster: 'ap2'});
    const channel = pusher.subscribe('user-status');

    channel.bind('user-status-changed', data => {
      console.log('Status update:', data);
      setOnlineUsers(prev => ({...prev, [data.userId]: data.isOnline}));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const openImageModal = (imageUrl, index = 0) => {
    setModalImages([{url: imageUrl}]);
    setModalIndex(index);
    setModalVisible(true);
  };

  useEffect(() => {
    if (images.length > 0 && imagesName.length > 0) {
      sendMessage();
    }
  }, [images, imagesName]);

  useEffect(() => {
    const fetchUser = async () => {
      const userDta = await AsyncStorage.getItem('userData');
      const parsedData = JSON.parse(userDta);
      setSenderId(Number(parsedData?.User?.userId));
      // setSenderId(parsedData?.User?.userId);
    };
    fetchUser();
  }, []);

  const deleteMessages = async id => {
    try {
      const response = await fetch(
        `${baseUrl}${Type == 'Mentor' ? deleteMentorChat : deleteChat}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-App-ID': '550e8400-e29b-41d4-a716-446655440000',
            'X-App-Secret': 's3cr3t!123456789',
          },
          body: JSON.stringify({id}),
        },
      );
      const responseText = await response.text();
      console.log('response error', responseText);

      const data = await response.json();

      if (data.success) {
        showSuccess(data.message);
        await fetchMessages();
        //showSuccess(data.message);
      } else {
        showError('Failed to delete message.');
      }
    } catch (error) {
      console.error('Delete message error:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${baseUrl}${
          Type == 'Mentor' ? GetMentorChat : GetMessage
        }/${senderId}/${receiverId}`,
      );
      const data = await response.json();
      setMessages(data?.messages);
      markAsRead();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  const updateMessagesAsRead = readData => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === readData.id ? {...msg, readDate: readData.readDate} : msg,
      ),
    );
  };

  const updateMessagesAsReadmentor = readData => {
    console.log('Updating message read status with:', readData);
    setMessages(prev =>
      prev.map(msg =>
        msg.id === readData.id ? {...msg, readDate: readData.readDate} : msg,
      ),
    );
  };

  const markAsRead = async () => {
    try {
      const response = await fetch(
        `${baseUrl}${Type == 'Mentor' ? MarkAsReadMentor : MarkAsRead}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},

          body: JSON.stringify({
            // senderId: senderId,
            // receiverId: receiverId,
            senderId: receiverId,
            receiverId: senderId,
          }),
        },
      );
      const data = await response.json();
      console.log();
      console.log('data ----', data, senderId, receiverId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
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

  const sortedMessages = Object.entries(groupedMessages)
    .map(([date, msgs]) => ({date, messages: msgs}))
    .sort(
      (a, b) =>
        moment(a.date, 'DD MMM YYYY').unix() -
        moment(b.date, 'DD MMM YYYY').unix(),
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
          const isSentByUser = msg.userId === senderId;

          const images = [
            {
              url: msg.chatFileName,
            },
          ];
          return (
            <View key={msg.id}>
              {(msg.chatText || msg.chatFileName) && (
                <TouchableOpacity
                  onLongPress={() => handleLongPress(msg.id)}
                  delayLongPress={500}>
                  <View
                    style={[
                      styles.messageBubble,
                      isSentByUser
                        ? {
                            ...styles.received,
                            backgroundColor:
                              msg?.chatFileName && msg.chatText
                                ? colors.AppmainColor
                                : colors.AppmainColor,
                          }
                        : styles.sent,
                    ]}>
                    {msg.chatText && (
                      <Text
                        style={{
                          ...styles.messageText,
                          color: isSentByUser ? 'white' : 'black',
                        }}>
                        {msg.chatText}
                      </Text>
                    )}
                    {msg.chatFileName && (
                      <TouchableOpacity
                        onLongPress={() => handleLongPress(msg.id)}
                        delayLongPress={500}
                        onPress={() => openImageModal(msg.chatFileName)}>
                        <Image
                          source={{uri: msg.chatFileName}}
                          style={[
                            styles.firstImage,
                            // {width: 220, height: 300},
                            {
                              width: screenWidth * 0.6,
                              height: screenWidth * 0.8, // adjust based on desired aspect
                            },
                            isSentByUser
                              ? styles.receivedMeta
                              : styles.sentMeta,
                          ]}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              <View
                style={[
                  styles.messageMeta,
                  isSentByUser ? styles.receivedMeta : styles.sentMeta,
                ]}>
                <Text style={styles.timeText}>
                  {msg.chatText || msg.chatFileName
                    ? moment(msg.dateAdded, 'YYYY-MM-DD h:mm:ss A').format(
                        'hh:mm A',
                      )
                    : null}
                </Text>

                {msg.userId === senderId &&
                  (msg.chatText || msg.chatFileName) && // make sure message is not empty
                  (msg.readDate ? (
                    <Icon
                      name="checkmark-done-outline"
                      size={17}
                      color="blue"
                      type="Ionicons"
                    />
                  ) : (
                    <Icon
                      name="checkmark"
                      size={17}
                      color="gray"
                      type="Ionicons"
                    />
                  ))}
              </View>
            </View>
          );
        })}
      </View>
    );
  };
  const selectImages = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      compressImageQuality: 0.8,
      includeBase64: false,
    })
      .then(selectedImages => {
        const imagePaths = [];
        const imageNames = [];

        selectedImages.forEach(image => {
          const imagePath = image.path;
          const imageName = imagePath.substring(imagePath.lastIndexOf('/') + 1);

          imagePaths.push(imagePath);
          imageNames.push(imageName);
        });

        setImages(imagePaths);
        setImagesName(imageNames);
      })
      .catch(error => {
        console.error('Image selection cancelled:', error);
      });
  };
  const sendMessage = async () => {
    if (isSending) return;

    const hasText = text.trim().length > 0;
    const hasImages = images.length > 0 && imagesName.length > 0;

    if (!hasText && !hasImages) return;

    setIsSending(true);

    try {
      const formData = new FormData();

      formData.append('senderId', senderId.toString());
      formData.append('receiverId', receiverId.toString());

      if (hasText) {
        formData.append('chatText', text.trim());
      }

      if (hasImages) {
        // Add all images
        images.forEach((uri, index) => {
          const cleanUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

          formData.append('attachmentName', imagesName[index]);
          formData.append('attachment', {
            uri: cleanUri,
            name: imagesName[index],
            type: 'image/jpeg',
          });
        });
      } else {
        formData.append('attachmentName', '');
      }
      const response = await fetch(
        `${baseUrl}${Type === 'Mentor' ? MentorChatSend : SendMessage}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        },
      );

      const responseText = await response.text();

      if (response.ok) {
        setText('');
        setImages([]);
        setImagesName([]);
        fetchMessages();
      } else {
        console.error('Server error:', response.status, responseText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView
      style={{...styles.container, backgroundColor: colors.background}}>
      <KeyboardAvoidingWrapper offset={40}>
        <View style={{flex: 1}}>
          <View
            style={{
              marginTop: 10,
              paddingVertical: 4,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={20}
              onPress={() => navigation.goBack()}
              style={{paddingRight: 10}}>
              <Icon
                name="left"
                type="AntDesign"
                size={22}
                color={colors.textColor}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProfileDetails', {
                  Item,
                })
              }
              style={{flexDirection: 'row'}}>
              <View>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: 10,
                    borderRadius: 40,
                    backgroundColor: colors.placeholderTextColor,
                  }}
                  source={
                    Item?.ProfilePhoto
                      ? {uri: Item?.ProfilePhoto}
                      : require('../../assets/placeholderprofileimage.png')
                  }
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: colors.textColor,
                  }}>
                  {Item?.UserName || 'User Name'}
                </Text>
                {Item?.JobTitle ? (
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.placeholderTextColor,
                    }}>
                    {Item?.JobTitle}
                  </Text>
                ) : null}
                {Item?.CompanyName ? (
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.placeholderTextColor,
                    }}>
                    {Item?.CompanyName}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: colors.AppmainColor,
              width: '100%',
              height: 1,
            }}
          />
          <FlatList
            data={[...sortedMessages].reverse()}
            keyExtractor={item => item.date}
            renderItem={renderItem}
            inverted
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
          />
          {isTypingReceiver ? (
            <Text
              style={{
                marginBottom: 8,
                marginHorizontal: 10,
                color: colors.AppmainColor,
              }}>
              Typing...
              {/* <CommonLoader size={20} color={Colors.main_primary} /> */}
            </Text>
          ) : null}
          <View
            style={{
              ...globalStyles.inputContainerChat,
              borderColor: colors.textinputbordercolor,
            }}>
            <TouchableOpacity onPress={selectImages} style={{paddingRight: 8}}>
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
              onChangeText={handleTyping}
              placeholderTextColor={colors.placeholderTextColor}
              placeholder="Type a message..."
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendText}>➤</Text>
            </TouchableOpacity>
          </View>
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
              saveToLocalByLongPress={false}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.secondGreen,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    borderRadius: 25,
    // backgroundColor: '#F1F1F1',
    marginRight: 10,
    height: 60,
    // color: 'black',
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
    alignSelf: 'flex-end', // Change to right
    backgroundColor: Colors?.secondGreen,
    borderTopRightRadius: 5,
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 2,
    //backgroundColor: 'red',
  },
  sentMeta: {
    alignSelf: 'flex-start',
  },
  receivedMeta: {
    alignSelf: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
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
    padding: 5,
    borderRadius: 10,
    fontSize: 12,
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
  //   // flexDirection: 'row',
  //   // alignItems: 'flex-end', // Align items at the top
  // },
  firstImage: {
    width: '50%',
    height: 205,
    marginRight: 10, // Spacing between big and small images
    borderRadius: 8,
    backgroundColor: Colors?.lite_gray,
    // padding:10
  },
  smallImage: {
    width: 93,
    height: 93,
    marginBottom: 10,
    borderRadius: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-start',
  },

  sentImageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderRadius: 10,
    padding: 5,
  },

  receivedImageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
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
  // closeButton: {
  //   position: 'absolute',
  //   top: 40,
  //   right: 20,
  //   zIndex: 10,
  //   padding: 5,
  // },
});

export default ChatDetails;
