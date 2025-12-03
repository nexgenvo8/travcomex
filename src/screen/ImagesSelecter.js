import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const ImageSelecter = () => {
  const [image, setImage] = useState(null);
  const [base64, setBase64] = useState(null);

  const selectImage = async () => {
    try {
      const pickedImage = await ImagePicker.openPicker({
        width: 300, // Desired width
        height: 300, // Desired height
        cropping: true, // Enable cropping
        cropperCircleOverlay: true, // Circular cropping overlay
        includeBase64: true, // Include Base64 in the response
      });
      setImage(pickedImage.path); // Set the selected image path
      setBase64(pickedImage.data); // Set the Base64 string
      console.log("Base64 Image Data:", pickedImage.data); // Log Base64 string
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Image Cropper</Text>

      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.placeholder}>No Image Selected</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={selectImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  base64Container: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 100,
  },
  base64Text: {
    fontSize: 12,
    color: '#333',
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
});

export default ImageSelecter;


