// src/screens/GalleryScreen.js - экран галереи изображений
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  useWindowDimensions // 🚀 Добавлен импорт
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av'; 
import useStorage from '../hooks/useStorage'; 
import { Ionicons } from '@expo/vector-icons'; // 🚀 Добавлен импорт

const GALLERY_STORAGE_KEY = 'gallery_images';
const PHOTO_COUNT_KEY = 'photo_count';       
const ADD_SOUND_URI = 'https://www.soundjay.com/button/beep-07a.wav';

const GalleryScreen = () => {
  // 🚀 Читаем настройки для определения темы
  const { value: appSettings } = useStorage('appSettings', { darkMode: false });
  const isDarkMode = appSettings?.darkMode ?? false;

  const { width } = useWindowDimensions();
  const columnSize = (width - 30 - 15) / 2; // (width - padding - marginBetween) / columns
  
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

  const themeStyles = getStyles(isDarkMode);

  // 💡 Функция для воспроизведения звука
  const playSoundEffect = async (uri) => { /* ... */ };

  const pickImage = async () => {
    // ... (логика выбора изображения)
    // ... после получения URI:
    /*
      if (!result.canceled && imageUri) {
          const newImage = { uri: imageUri, timestamp: new Date().toLocaleString() };
          setImages(prev => [newImage, ...prev]);
          setPhotoCount(prev => prev + 1);
          await playSoundEffect({ uri: ADD_SOUND_URI });
      }
    */
  };
  
  const deleteImage = (imageToDelete) => {
    Alert.alert(
      'Удалить изображение',
      'Вы уверены, что хотите удалить эту фотографию?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive', 
          onPress: () => {
            setImages(prev => prev.filter(img => img !== imageToDelete));
            setPhotoCount(prev => Math.max(0, prev - 1));
            setSelectedImage(null);
            setModalVisible(false);
          }
        },
      ]
    );
  };
  
  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };
  
  const renderImageItem = (image, index) => (
    <TouchableOpacity 
      key={index} 
      style={[themeStyles.imageContainer, { width: columnSize }]}
      onPress={() => openModal(image)}
      onLongPress={() => deleteImage(image)} // Добавлено долгое нажатие для удаления
    >
      <Image source={{ uri: image.uri }} style={styles.thumbnail} />
      <Text style={themeStyles.imageTimestamp}>{image.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={themeStyles.container}>
      
      <View style={styles.header}>
        <Text style={themeStyles.headerTitle}>Ваша Галерея ({photoCount})</Text>
        <Text style={themeStyles.headerSubtitle}>
          Хранилище выбранных фотографий. Нажмите, чтобы увеличить, или удерживайте для удаления.
        </Text>
        <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.pickButtonText}>Добавить Фото</Text>
        </TouchableOpacity>
      </View>

      {imagesLoading ? (
        <ActivityIndicator size="large" color={isDarkMode ? '#007AFF' : '#5856D6'} style={{ marginTop: 50 }} />
      ) : images.length === 0 ? (
        <Text style={themeStyles.emptyText}>Галерея пуста. Добавьте фотографии!</Text>
      ) : (
        <View style={styles.imagesGrid}>
          {images.map(renderImageItem)}
        </View>
      )}

      {/* Модальное окно для полного просмотра */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={themeStyles.modalContainer} onPress={() => setModalVisible(false)}>
          {selectedImage && (
            <View style={themeStyles.modalContent}>
              <Text style={themeStyles.modalTitle}>Изображение</Text>
              <Image source={{ uri: selectedImage.uri }} style={styles.fullImage} />
              <Text style={themeStyles.modalTimestamp}>Добавлено: {selectedImage.timestamp}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(selectedImage)}>
                <Ionicons name="trash" size={20} color="white" />
                <Text style={styles.deleteButtonText}>Удалить</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Modal>

    </ScrollView>
  );
};

// 🚀 Функция для динамических стилей
const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: isDarkMode ? '#eee' : '#1c1c1e',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: isDarkMode ? '#aaa' : '#6c757d',
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: isDarkMode ? '#888' : '#999',
    fontStyle: 'italic',
  },
  imageContainer: {
    marginBottom: 15,
    backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageTimestamp: {
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
    color: isDarkMode ? '#bbb' : '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: isDarkMode ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.9)',
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
    color: isDarkMode ? '#eee' : '#1c1c1e',
  },
  modalTimestamp: {
    fontSize: 12,
    marginBottom: 15,
    color: isDarkMode ? '#bbb' : '#999',
  },
});

// 🚀 Статические стили
const styles = StyleSheet.create({
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  pickButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default GalleryScreen;