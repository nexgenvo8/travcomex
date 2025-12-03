import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../color';
import {useTheme} from '../../theme/ThemeContext';

const ConfirmDeleteModal = ({
  isVisible,
  onCancel,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Delete',
}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View
          style={{
            ...styles.modalContent,
            backgroundColor: colors.modelBackground,
          }}>
          <Text style={{...styles.modalTitle, color: colors.textColor}}>
            {title}
          </Text>
          <Text style={{...styles.modalMessage, color: colors.textColor}}>
            {message}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={[
                styles.button,
                styles.deleteButton,
                {backgroundColor: colors.AppmainColor},
              ]}>
              <Text style={styles.buttonText}>{confirmButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ✅ Export the modal so it can be imported elsewhere
export default ConfirmDeleteModal;

// 💡 Include your styles below
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    // backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  deleteButton: {
    // backgroundColor: Colors.main_primary,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
