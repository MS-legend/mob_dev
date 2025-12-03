// src/screens/GalleryScreen.js - экран галереи изображений
import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

const GalleryScreen = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Добавление изображения
  const addImage = async () => {
    try {
      // ИСПРАВЛЕНИЕ: Запрос разрешений
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка доступа', 'Требуется разрешение на доступ к медиатеке.');
        return;
      }
      // Конец ИСПРАВЛЕНИЯ

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => ({
          id: Date.now() + Math.random(),
          uri: asset.uri,
          timestamp: new Date().toLocaleString()
        }));
        setImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить изображения');
    }
  };

  // Удаление изображения
  const deleteImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setModalVisible(false);
  };

  // Просмотр изображения
  const viewImage = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const renderImageGrid = () => {
    if (images.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={50} color="#999" />
          <Text style={styles.emptyStateText}>Галерея пуста</Text>
          <Text style={styles.emptyStateSubtext}>Добавьте свои первые изображения, чтобы начать.</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.imageGrid}>
        {images.map(img => (
          <TouchableOpacity 
            key={img.id} 
            style={styles.imageContainer} 
            onPress={() => viewImage(img)}
            onLongPress={() => Alert.alert('Удалить?', 'Вы уверены, что хотите удалить это изображение?', [
              { text: 'Отмена', style: 'cancel' },
              { text: 'Удалить', style: 'destructive', onPress: () => deleteImage(img.id) }
            ])}
          >
            <Image source={{ uri: img.uri }} style={styles.thumbnail} />
            <Text style={styles.imageTimestamp}>{img.timestamp}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Моя Галерея</Text>
        <TouchableOpacity style={styles.addButton} onPress={addImage}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Добавить фото</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderImageGrid()}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedImage && (
              <>
                <Image source={{ uri: selectedImage.uri }} style={styles.fullImage} resizeMode="contain" />
                <Text style={styles.imageTimestamp}>{selectedImage.timestamp}</Text>
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Закрыть</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.closeButton, styles.deleteButton]} 
                  onPress={() => deleteImage(selectedImage.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="white" />
                  <Text style={styles.deleteButtonText}>Удалить</Text>
                </TouchableOpacity>
              </>
            )}
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
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    gap: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
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
  fullImage: {
    width: 300,
    height: 300,
    borderRadius: 8,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    gap: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default GalleryScreen;