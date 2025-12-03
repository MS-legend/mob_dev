// HomeScreen.js - главный экран приложения
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator,
  Alert 
} from 'react-native';
import useStorage from '../hooks/useStorage';
import useApi from '../hooks/useApi';
import { apiService } from '../services/apiService';

const HomeScreen = ({ navigation }) => {
  const { value: count, setValue: setCount, loading: storageLoading } = useStorage('counter', 0);
  const { data: users, loading: apiLoading, error: apiError, refetch } = useApi(
    'https://jsonplaceholder.typicode.com/users'
  );

  const [localData, setLocalData] = useState([]);
  const [postLoading, setPostLoading] = useState(false);

  const addLocalItem = () => {
    const newItem = {
      id: Date.now(),
      title: `Элемент ${localData.length + 1}`,
      timestamp: new Date().toLocaleTimeString()
    };
    setLocalData(prev => [newItem, ...prev]);
  };

  const createPost = async () => {
    setPostLoading(true);
    try {
      const newPost = {
        title: 'Новый пост',
        body: 'Это тестовый пост',
        userId: 1
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = await apiService.createPost(newPost);
      
      Alert.alert('Успех', 'Пост создан!');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать пост');
    } finally {
      setPostLoading(false);
    }
  };

  const resetAll = () => {
    setCount(0);
    setLocalData([]);
  };

  if (storageLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Навигационные кнопки */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Навигация</Text>
        <View style={styles.navRow}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Media')}
          >
            <Text style={styles.navButtonText}>Мультимедиа</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Gallery')}
          >
            <Text style={styles.navButtonText}>Галерея</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.navRow}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Text style={styles.navButtonText}>Аналитика</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.navButtonText}>Настройки</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Секция счетчика */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Счетчик</Text>
        <Text style={styles.counter}>Текущее значение: {count}</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => setCount(count + 1)}>
            <Text style={styles.buttonText}>+1</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={() => setCount(0)}>
            <Text style={styles.buttonText}>Сбросить</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Секция локальных данных */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Локальные данные</Text>
        
        <TouchableOpacity style={styles.button} onPress={addLocalItem}>
          <Text style={styles.buttonText}>Добавить элемент</Text>
        </TouchableOpacity>

        {localData.map(item => (
          <View key={item.id} style={styles.item}>
            <Text>{item.title}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        ))}
      </View>

      {/* Секция API данных */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Данные из API</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={refetch}>
            <Text style={styles.buttonText}>Обновить</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.apiButton]} 
            onPress={createPost}
            disabled={postLoading}
          >
            {postLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Создать пост</Text>
            )}
          </TouchableOpacity>
        </View>

        {apiLoading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          users?.slice(0, 3).map(user => (
            <View key={user.id} style={styles.item}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          ))
        )}
      </View>

      {/* Кнопка сброса всего */}
      <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={resetAll}>
        <Text style={styles.buttonText}>Сбросить всё</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 10,
    color: '#333',
  },
  counter: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  navButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#FF3B30',
  },
  apiButton: {
    backgroundColor: '#34C759',
  },
  dangerButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userEmail: {
    color: '#666',
    fontSize: 14,
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
  },
});

export default HomeScreen;