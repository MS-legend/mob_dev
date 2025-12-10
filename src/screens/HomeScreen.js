// src/screens/HomeScreen.js - главный экран приложения
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator,
  Alert,
  Image 
} from 'react-native';
// import useStorage from '../hooks/useStorage'; // УДАЛЕНО
import useApi from '../hooks/useApi';
import { apiService } from '../services/apiService';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'https://pixabay.com/api/?key=YOUR_API_KEY&q=nature&per_page=10&image_type=photo'; 

const HomeScreen = ({ navigation }) => {
  // Логика счетчика удалена
  
  // API для загрузки списка картинок
  const { data: images, loading: apiLoading, error: apiError, refetch } = useApi(API_URL);

  const [localData, setLocalData] = useState([]);
  const [postLoading, setPostLoading] = useState(false);

  // Функции счетчика удалены (increment, reset)
  
  // --- Функции локальных данных ---
  const addLocalItem = () => {
    const newItem = {
      id: Date.now(),
      title: `Элемент ${localData.length + 1}`,
      timestamp: new Date().toLocaleTimeString()
    };
    setLocalData(prev => [newItem, ...prev]);
  };
  
  // --- Функции API (теперь с улучшенным логгированием) ---

  const renderImage = (image) => (
    <View key={image.id} style={styles.apiItem}>
      <Image 
        source={{ uri: image.download_url }} 
        style={styles.apiImage} 
        resizeMode="cover"
      />
      <Text style={styles.apiName}>Author: {image.author}</Text>
      <Text style={styles.apiEmail}>ID: {image.id}</Text>
    </View>
  );

  const createPost = async () => {
    setPostLoading(true);
    
    // 💡 DEBUG: Лог перед вызовом сервиса
    console.log('[HomeScreen] Начинаем вызов createPost.');
    
    try {
      const newPost = {
        title: 'Новый пост',
        body: 'Это тестовый пост',
        userId: 1
      };
      
      // Имитация задержки перед отправкой для демонстрации лоадера
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      const result = await apiService.createPost(newPost);
      
      Alert.alert('Успех', `POST-запрос отправлен. ID нового поста: ${result.id}`);
    } catch (e) {
      // 💡 DEBUG: Лог ошибки
      console.error('[HomeScreen] Ошибка при выполнении POST-запроса:', e.message);
      Alert.alert('Ошибка', `Не удалось отправить POST-запрос: ${e.message}. Проверьте консоль.`);
    } finally {
      setPostLoading(false);
    }
  };
  
  // --- Рендер локальных данных ---
  const renderLocalItem = (item) => (
    <View key={item.id} style={styles.localItem}>
      <Ionicons name="bookmark-outline" size={16} color="#007AFF" />
      <Text style={styles.localText}>{item.title}</Text>
      <Text style={styles.localTimestamp}>{item.timestamp}</Text>
    </View>
  );
  
  // --- Компонент навигационной кнопки ---
  const NavigationButton = ({ screen, title, icon, color }) => (
    <TouchableOpacity
      style={[styles.navButton, { backgroundColor: color }]}
      onPress={() => navigation.navigate(screen)}
    >
      <Ionicons name={icon} size={20} color="white" style={{ marginBottom: 5 }} />
      <Text style={styles.navButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      
      {/* Секция Счетчика УДАЛЕНА ПОЛНОСТЬЮ */}
      
      {/* Секция API-данных */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Внешние API-Данные (Картинки)</Text>
        
        {/* Кнопка GET */}
        <TouchableOpacity 
          style={[styles.button, styles.apiButton]} 
          onPress={refetch}
          disabled={apiLoading}
        >
          <Text style={styles.navButtonText}>
            {apiLoading ? 'Загрузка...' : 'Обновить API-картинки (GET)'}
          </Text>
        </TouchableOpacity>
        
        {/* Кнопка POST */}
        <TouchableOpacity 
          style={[styles.button, styles.postButton, { opacity: postLoading ? 0.6 : 1 }]} 
          onPress={createPost}
          disabled={postLoading}
        >
          <Text style={styles.navButtonText}>
            {postLoading ? 'Отправка...' : 'Отправить Тестовый POST'}
          </Text>
        </TouchableOpacity>

        {/* Вывод ошибки GET-запроса */}
        {apiError && <Text style={styles.errorText}>Ошибка GET-запроса: {apiError}</Text>}

        {/* Отображаем картинки, если они загружены */}
        {(images && images.length > 0) && (
          <View style={styles.apiList}>
            <Text style={styles.listHeader}>Список загруженных картинок ({images.length} шт.):</Text>
            {images.slice(0, 4).map(renderImage)}
          </View>
        )}
      </View>
      
      {/* Секция Локальные данные */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Локальные данные (useState)</Text>
        <TouchableOpacity style={[styles.button, styles.localButton]} onPress={addLocalItem}>
          <Text style={styles.navButtonText}>Добавить локальный элемент</Text>
        </TouchableOpacity>
        
        <View style={styles.localList}>
          {localData.length === 0 ? (
            <Text style={styles.emptyList}>Список пуст. Добавьте элемент.</Text>
          ) : (
            localData.slice(0, 5).map(renderLocalItem)
          )}
        </View>
      </View>
      
      {/* Секция Навигация */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Навигация</Text>
        <View style={styles.navRow}>
          <NavigationButton 
            screen="Media" 
            title="Мультимедиа" 
            icon="camera-outline" 
            color="#34C759" 
          />
          <NavigationButton 
            screen="Gallery" 
            title="Галерея" 
            icon="images-outline" 
            color="#FF9500" 
          />
        </View>
        <View style={styles.navRow}>
          <NavigationButton 
            screen="Analytics" 
            title="Аналитика" 
            icon="stats-chart-outline" 
            color="#5856D6" 
          />
          <NavigationButton 
            screen="Settings" 
            title="Настройки" 
            icon="settings-outline" 
            color="#FF3B30" 
          />
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  // Стилевые правила, связанные со счетчиком, были оставлены, но не используются
  counter: { 
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 15,
    color: '#1c1c1e',
  },
  buttonRow: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  resetButton: { 
    backgroundColor: '#FF3B30',
  },
  
  // Общие стили
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#007AFF',
  },
  apiButton: {
    backgroundColor: '#007AFF',
  },
  postButton: {
    backgroundColor: '#34C759',
  },
  localButton: {
    backgroundColor: '#5856D6',
    marginBottom: 15,
  },
  navButton: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  // API-список
  apiList: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  listHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  apiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  apiImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  apiName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  apiEmail: {
    fontSize: 12,
    color: '#888',
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Локальный список
  localList: {
    marginTop: 10,
  },
  localItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  localText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    color: '#333',
  },
  localTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  emptyList: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    paddingVertical: 10,
  }
});

export default HomeScreen;