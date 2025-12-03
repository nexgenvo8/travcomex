import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {baseUrl, ConfirmEmailSendOTP} from '../baseURL/api';
import globalStyles from '../GlobalCSS';
import Header from '../Header/Header';
import Colors from '../color';
import {showError} from '../components/Toast';
import {useTheme} from '../../theme/ThemeContext';

const ForgetPassword = ({navigation}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  // const styles = globalStyles(colors);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const otpInputs = useRef([]);
  const timerRef = useRef(null);

  const startTimer = () => {
    setCanResend(false);
    setTimer(120); // 2 minutes
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSend = async () => {
    if (!email) {
      showError('Please enter your email');
      return;
    }
    if (!validateEmail(email)) {
      showError('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}${ConfirmEmailSendOTP}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      });

      const data = await response.json();

      if (response.ok) {
        setOtp(data?.OTP);
        setOtpSent(true);
        setOtpDigits(['', '', '', '', '', '']);
        startTimer();
      } else {
        showError(data?.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      showError('Something went wrong.');
    }
  };

  const handleSave = () => {
    const ConvertString = otpDigits?.join('');
    // Check for valid 6-digit OTP input
    if (!ConvertString || ConvertString.length !== 6) {
      showError('Enter a valid 6-digit OTP');
      return;
    }

    // Compare OTPs
    if (ConvertString == otp) {
      showError('OTP verified!');
      navigation.navigate('ChangePassword', {
        Item: 'Forget',
        Email: email,
      });
    } else {
      showError('OTP is not valid');
    }
  };

  const handleOtpChange = (text, index) => {
    if (text && !/^\d+$/.test(text)) return;
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = text;
    setOtpDigits(newOtpDigits);

    if (text && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = ({nativeEvent}, index) => {
    if (nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index - 1] = '';
      setOtpDigits(newOtpDigits);
      otpInputs.current[index - 1].focus();
    }
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles?.SafeAreaView,
        backgroundColor: colors.background,
      }}>
      <Header title="Forget Password" navigation={navigation} />
      <View
        style={{
          ...globalStyles?.FX_1_BG_White,
          paddingHorizontal: 10,
          backgroundColor: colors.background,
          marginTop: 20,
        }}>
        <View style={{justifyContent: 'center', margin: 10}}>
          <TextInput
            style={{
              ...styles.input,
              borderColor: colors.textinputbordercolor,
              backgroundColor: colors.textinputBackgroundcolor,
              color: colors.textColor,
            }}
            placeholder="Enter your email"
            placeholderTextColor={colors.placeholderTextColor}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {(!otpSent || canResend) && (
            <TouchableOpacity
              style={{...styles.button, backgroundColor: colors.AppmainColor}}
              onPress={handleSend}>
              <Text
                style={{...styles.buttonText, color: colors.ButtonTextColor}}>
                {otpSent ? 'Resend OTP' : 'Send'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {otpSent && (
          <>
            <Text style={styles.title}>Enter OTP</Text>
            <View style={styles.otpContainer}>
              {[...Array(6)].map((_, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={otpDigits[index]}
                  onChangeText={text => handleOtpChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  ref={ref => (otpInputs.current[index] = ref)}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            {!canResend && (
              <Text style={{textAlign: 'center', color: Colors.primary}}>
                Resend OTP in {Math.floor(timer / 60)}:
                {(timer % 60).toString().padStart(2, '0')}
              </Text>
            )}
            {!canResend && (
              <TouchableOpacity
                style={{...styles.button, backgroundColor: colors.AppmainColor}}
                onPress={handleSave}>
                <Text
                  style={{...styles.buttonText, color: colors.ButtonTextColor}}>
                  Save
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: '#ccc',
    width: 40,
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
  },
});

export default ForgetPassword;
