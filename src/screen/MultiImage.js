
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const ImageSelecter = () => {
  const [images, setImages] = useState([]); // Updated to handle multiple images

  const selectImages = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      compressImageQuality: 0.8,
    })
      .then((pickedImages) => {
        setImages(pickedImages.map((image) => image.path)); // Map to paths
      })
      .catch((error) => {
        console.error('Image selection cancelled:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Image Picker</Text>

      {images.length > 0 ? (
        <ScrollView horizontal style={styles.imageContainer}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.placeholder}>No Images Selected</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={selectImages}>
        <Text style={styles.buttonText}>Select Images</Text>
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
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
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
});

export default ImageSelecter;

