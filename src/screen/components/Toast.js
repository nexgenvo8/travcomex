import Toast from 'react-native-toast-message';

export function showError(message = '') {
  Toast.show({
    type: 'error',
    text1: message,
    position: 'top',
    visibilityTime: 3000,
  });
}

export function showSuccess(message = '') {
  Toast.show({
    type: 'success',
    text1: message,
    position: 'top',
    visibilityTime: 3000,
  });
}
