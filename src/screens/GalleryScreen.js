// src/screens/GalleryScreen.js - экран галереи изображений
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av'; 
import useStorage from '../hooks/useStorage'; 
import { playClickSound } from '../utils/soundUtils'; // ✅ КОРРЕКТНЫЙ ИМПОРТ

const GALLERY_STORAGE_KEY = 'gallery_images';
const PHOTO_COUNT_KEY = 'photo_count';       

const GalleryScreen = () => {
  const { value: appSettings } = useStorage('appSettings', { darkMode: false });
  const isDarkMode = appSettings?.darkMode ?? false;
    
  const { 
    value: images, 
    setValue: setImages, 
    loading: imagesLoading, 
    clearData: clearImages 
  } = useStorage(GALLERY_STORAGE_KEY, []);
  
  const { 
    value: photoCount, 
    setValue: setPhotoCount, 
  } = useStorage(PHOTO_COUNT_KEY, 0);

  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const pickAndSaveImage = async (fromCamera = false) => {
    playClickSound(); // 🚀 ЗВУК ПРИ НАЖАТИИ
    let permissionResult = await (fromCamera ? ImagePicker.requestCameraPermissionsAsync() : ImagePicker.requestMediaLibraryPermissionsAsync());
    
    if (permissionResult.granted === false) {
      Alert.alert('Разрешение', `Необходимо разрешение на доступ к ${fromCamera ? 'камере' : 'галерее'}.`);
      return;
    }
    
    let pickerResult = await (fromCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync)({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5,
    });

    if (!pickerResult.canceled) {
      const imageUri = pickerResult.assets && pickerResult.assets.length > 0 ? pickerResult.assets[0].uri : null;
      if (imageUri) {
        const newImage = { 
          id: Date.now().toString(), 
          uri: imageUri, 
          timestamp: new Date().toLocaleString()
        };
        setImages(prev => [newImage, ...prev]);
        setPhotoCount(prev => prev + 1);
        Alert.alert("Сохранено", "Изображение успешно добавлено в галерею!");
      }
    }
  };

  const handleThumbnailPress = (image) => {
    playClickSound(); // 🚀 ЗВУК ПРИ ОТКРЫТИИ
    setSelectedImage(image);
    setModalVisible(true);
  };
  
  const closeModal = () => {
    playClickSound(); // 🚀 ЗВУК ПРИ ЗАКРЫТИИ
    setModalVisible(false);
    setSelectedImage(null);
  };

  const handleClearGallery = () => {
    playClickSound(); // 🚀 ЗВУК ПРИ ОЧИСТКЕ
    Alert.alert(
      "Очистка Галереи",
      "Вы уверены, что хотите удалить все изображения из галереи?",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Удалить", style: "destructive", onPress: () => {
            clearImages();
            setPhotoCount(0); // Сбрасываем счетчик
            Alert.alert("Готово", "Галерея очищена.");
        }}
      ]
    );
  };
  
  // 🚀 Динамические стили для темной темы
  const getStyles = (isDarkMode) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
      padding: 20,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDarkMode ? '#fff' : '#1c1c1e',
    },
    imagesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    imageContainer: {
      width: '48%',
      marginBottom: 15,
      backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
      borderRadius: 8,
      padding: 8,
      shadowColor: isDarkMode ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.4 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    imageTimestamp: {
      fontSize: 10,
      marginTop: 5,
      textAlign: 'center',
      color: isDarkMode ? '#aaa' : '#999',
    },
    // Стили для модального окна
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
      borderRadius: 10,
      padding: 20,
      margin: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDarkMode ? '#fff' : '#1c1c1e',
    },
    modalTimestamp: {
      fontSize: 12,
      color: isDarkMode ? '#aaa' : '#888',
      marginTop: 5,
    },
    modalCloseButton: {
      marginTop: 20,
      backgroundColor: '#007AFF',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    modalCloseButtonText: {
      color: 'white',
      fontWeight: 'bold',
    }
  });

  const themeStyles = getStyles(isDarkMode);

  return (
    <ScrollView style={themeStyles.container}>
      <View style={styles.header}>
        <Text style={themeStyles.headerTitle}>Галерея ({images.length})</Text>
      </View>
      
      {/* Кнопки действий */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.cameraButton]} onPress={() => pickAndSaveImage(true)}>
          <Text style={styles.actionButtonText}>Сделать Фото</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.galleryButton]} onPress={() => pickAndSaveImage(false)}>
          <Text style={styles.actionButtonText}>Выбрать из Галереи</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.clearButton]} onPress={handleClearGallery}>
          <Text style={[styles.actionButtonText, { color: '#FF3B30' }]}>Очистить</Text>
        </TouchableOpacity>
      </View>

      <View style={themeStyles.imagesGrid}>
        {imagesLoading ? (
            <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>Загрузка изображений...</Text>
        ) : images.length === 0 ? (
            <Text style={{ color: isDarkMode ? '#aaa' : '#666', width: '100%', textAlign: 'center', marginTop: 20 }}>
                Галерея пуста. Добавьте первое изображение!
            </Text>
        ) : (
          images.map((image) => (
            <TouchableOpacity 
              key={image.id} 
              style={themeStyles.imageContainer} 
              onPress={() => handleThumbnailPress(image)}
            >
              <Image source={{ uri: image.uri }} style={styles.thumbnail} />
              <Text style={themeStyles.imageTimestamp}>{image.timestamp}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
      
      {/* Модальное окно для полного просмотра */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={themeStyles.modalContainer}>
          <View style={themeStyles.modalContent}>
            <Text style={themeStyles.modalTitle}>Изображение</Text>
            {selectedImage && (
              <>
                <Image source={{ uri: selectedImage.uri }} style={styles.fullImage} />
                <Text style={themeStyles.modalTimestamp}>Добавлено: {selectedImage.timestamp}</Text>
              </>
            )}
            <TouchableOpacity 
              style={themeStyles.modalCloseButton} 
              onPress={closeModal}
            >
              <Text style={themeStyles.modalCloseButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

// 🚀 Статические стили
const styles = StyleSheet.create({
  header: {
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  cameraButton: {
    backgroundColor: '#34C759',
  },
  galleryButton: {
    backgroundColor: '#FF9500',
  },
  clearButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 6,
  },
  fullImage: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default GalleryScreen;