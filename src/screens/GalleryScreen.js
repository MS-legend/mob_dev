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
  Modal 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av'; // ✅ КОРРЕКТНЫЙ ИМПОРТ
import useStorage from '../hooks/useStorage'; 

const GALLERY_STORAGE_KEY = 'gallery_images';
const PHOTO_COUNT_KEY = 'photo_count';       
const ADD_SOUND_URI = 'https://www.soundjay.com/button/beep-07a.wav';

const GalleryScreen = () => {
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

  // 💡 Функция для воспроизведения звука
  const playSoundEffect = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Ошибка воспроизведения звука:', error);
    }
  };

  // Добавление изображения
  const addImage = async (useCamera = false) => {
    let permissionResult;
    let pickerResult;

    try {
      if (useCamera) {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert('Разрешение необходимо', 'Для использования камеры необходимо разрешение.');
          return;
        }
        pickerResult = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert('Разрешение необходимо', 'Для доступа к галерее необходимо разрешение.');
          return;
        }
        pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!pickerResult.canceled) {
        // Унификация результата для одиночного или множественного выбора
        const assets = pickerResult.assets || [pickerResult];
        
        const newImages = assets.map(asset => ({
          id: Date.now() + Math.random(),
          uri: asset.uri,
          timestamp: new Date().toLocaleString()
        }));
        
        setImages(prev => [...prev, ...newImages]);
        setPhotoCount(prevCount => prevCount + newImages.length);

        playSoundEffect(ADD_SOUND_URI);
      }
    } catch (error) {
      Alert.alert('Ошибка', `Не удалось добавить изображения: ${error.message}`);
    }
  };

  // Удаление изображения
  const deleteImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setPhotoCount(prevCount => Math.max(0, prevCount - 1)); 
    setModalVisible(false);
  };

  // Просмотр изображения
  const viewImage = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };
  
  const renderImage = (img) => (
    <TouchableOpacity 
      key={img.id} 
      style={styles.imageContainer} 
      onPress={() => viewImage(img)}
    >
      <Image source={{ uri: img.uri }} style={styles.thumbnail} />
      <Text style={styles.imageTimestamp}>{img.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>
        📸 Всего фотографий: {photoCount} 
      </Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => addImage(false)}>
          <Text style={styles.buttonText}>Выбрать из галереи</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={() => addImage(true)}>
          <Text style={styles.buttonText}>Сделать фото</Text>
        </TouchableOpacity>
      </View>
      
      {imagesLoading ? (
        <Text style={styles.loadingText}>Загрузка галереи...</Text>
      ) : images.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Галерея пуста</Text>
          <Text style={styles.emptyStateSubtext}>Добавьте свои первые фотографии!</Text>
        </View>
      ) : (
        <View style={styles.imageGrid}>
          {images.map(renderImage)}
        </View>
      )}

      {/* Модальное окно для полноразмерного просмотра */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Изображение</Text>
            {selectedImage && (
              <>
                <Image source={{ uri: selectedImage.uri }} style={styles.fullImage} />
                <Text style={styles.modalTimestamp}>Добавлено: {selectedImage.timestamp}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(selectedImage.id)}>
                  <Text style={styles.deleteButtonText}>Удалить</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cameraButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '48%',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 6,
  },
  imageTimestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fullImage: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalTimestamp: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default GalleryScreen;