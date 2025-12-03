import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Header from './Header/Header';
import Colors from './color';
import {showError, showSuccess} from './components/Toast';
import {AddContactUs, baseUrl} from './baseURL/api';
import {useTheme} from '../theme/ThemeContext';

const ContactUsScreen = ({navigation}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const styles = createStyles(colors);
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!contactName || !email || !message) {
      showError('Please fill all fields.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}${AddContactUs}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactName,
          email,
          message,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        navigation.goBack();
        showSuccess(data?.message);
        setContactName('');
        setEmail('');
        setMessage('');
      } else {
        showError(data?.message || 'Something went wrong!');
      }
    } catch (error) {
      console.log('Error handleSubmit', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Contact Us" navigation={navigation} />
      <KeyboardAvoidingView
        style={styles.flexGrow}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={{paddingBottom: 100}}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.text}>
            Thank you for reaching out. If you have any queries, please fill the
            details in the fields below and we shall get back with an answer
            soon. You can also write to us on{' '}
            <Text style={[styles.text, {color: Colors.main_primary}]}>
              info@vecospace.com
            </Text>
          </Text>

          <TextInput
            style={styles.inputText}
            value={contactName}
            onChangeText={setContactName}
            placeholder="Name"
            placeholderTextColor={Colors.placeholdercolor}
          />

          <TextInput
            style={styles.inputText}
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor={Colors.placeholdercolor}
          />

          <TextInput
            style={[
              styles.inputText,
              {height: 120, marginBottom: 10, textAlignVertical: 'top'},
            ]}
            value={message}
            onChangeText={setMessage}
            multiline={true}
            maxLength={150}
            placeholder="Kindly describe your query"
            placeholderTextColor={Colors.placeholdercolor}
          />
        </ScrollView>
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.button}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactUsScreen;

const createStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flexGrow: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      marginTop: 20,
    },
    text: {
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 10,
      color: colors.textColor,
    },
    inputText: {
      height: 40,
      marginTop: 20,
      borderWidth: 1,
      paddingHorizontal: 10,
      color: colors.textColor,
      borderRadius: 8,
      borderColor: colors.textinputbordercolor,
      flex: 1,
      backgroundColor: colors.textinputBackgroundcolor,
    },
    bottomButtonContainer: {
      padding: 10,
    },
    button: {
      backgroundColor: colors.AppmainColor,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 12,
    },
    buttonText: {
      fontSize: 18,
      color: colors.ButtonTextColor,
    },
  });
