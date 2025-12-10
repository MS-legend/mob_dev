// src/screens/HomeScreen.js - главный экран приложения
import React from 'react'; // Удален useState, так как локальные данные убраны
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  // ActivityIndicator, Alert, Image - удалены, т.к. API-секция убрана
} from 'react-native';
// Удалены неиспользуемые импорты: useStorage, useApi, apiService
import { Ionicons } from '@expo/vector-icons';

// API_URL удален, так как не используется

const HomeScreen = ({ navigation }) => {
  // УДАЛЕНЫ: useStorage, useApi, localData, postLoading, все функции API и локальных данных
  
  // --- Компонент навигационной кнопки ---
  // Изменен для более крупного и заметного стиля
  const NavigationButton = ({ screen, title, icon, color }) => (
    <TouchableOpacity
      style={[styles.navButton, { backgroundColor: color }]}
      onPress={() => navigation.navigate(screen)}
    >
      <Ionicons name={icon} size={30} color="white" style={{ marginBottom: 8 }} />
      <Text style={styles.navButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    // Используем View вместо ScrollView, т.к. контента мало
    <View style={styles.container}> 
      
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Главная Панель</Text>
        <Text style={styles.subtitle}>Выберите раздел для продолжения работы.</Text>
      </View>

      {/* Секция Навигация (теперь главный элемент) */}
      <View style={styles.navigationSection}>
        
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

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0ffef', // Сделаем фон чуть светлее и свежее
    padding: 20,
    justifyContent: 'center', // Центрируем контент
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  navigationSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  navButton: {
    // Увеличены размеры и внутренние отступы для лучшего дизайна
    paddingHorizontal: 15,
    paddingVertical: 25, 
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
    minHeight: 120, // Фиксированная высота для единообразия
    justifyContent: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  // Все остальные стили (counter, apiList, localList и т.д.) удалены
});

export default HomeScreen;