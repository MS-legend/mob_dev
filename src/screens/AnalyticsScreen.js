// AnalyticsScreen.js - экран аналитики и статистики
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStorage from '../hooks/useStorage';

const { width } = Dimensions.get('window');

const AnalyticsScreen = () => {
  // 🚀 Читаем настройки для определения темы
  const { value: appSettings } = useStorage('appSettings', { darkMode: false });
  const isDarkMode = appSettings?.darkMode ?? false;

  const { value: photoCount } = useStorage('photo_count', 0);
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 700, easing: Easing.elastic(1), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  const stats = [
    { title: 'Всего фотографий в галерее', value: photoCount, icon: 'image', color: '#34C759', unit: 'шт.', },
    { title: 'Проведено аудиозаписей', value: 3, icon: 'mic', color: '#5856D6', unit: 'раз', },
  ];

  const themeStyles = getStyles(isDarkMode);

  const renderStatItem = ({ title, value, icon, color, unit }) => {
    return (
      <Animated.View 
        style={[
          themeStyles.statCard, 
          { 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
          }
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: color + '30' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.statContent}>
          <Text style={themeStyles.statTitle}>{title}</Text>
          <Text style={themeStyles.statValue}>
            {value} <Text style={themeStyles.statUnit}>{unit}</Text>
          </Text>
        </View>
      </Animated.View>
    );
  };
  
  return (
    <View style={{ flex: 1, aspectRatio: 9 / 16, alignSelf: 'center', width: '100%' }}>
      <ScrollView style={themeStyles.container} contentContainerStyle={styles.contentContainer}>
        
        <Text style={themeStyles.header}>Аналитика использования</Text>
        <Text style={themeStyles.subheader}>
          Сводка по ключевым действиям пользователя и статистике.
        </Text>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItemWrapper}>
              {renderStatItem(stat)}
            </View>
          ))}
        </View>
        
        <View style={themeStyles.section}>
          <Text style={themeStyles.sectionTitle}>Достижения (на основе статистики)</Text>
          
          <View style={[styles.achievement, { borderBottomColor: isDarkMode ? '#333' : '#f0f0f0' }]}>
            <View style={styles.achievementInfo}>
              <Ionicons name="trophy-outline" size={24} color="#FFD700" />
              <Text style={themeStyles.achievementText}>Первый снимок</Text>
            </View>
            <Text style={themeStyles.achievementProgress}>{photoCount >= 1 ? 'Получено' : '—'}</Text>
          </View>

          <View style={[styles.achievement, { borderBottomColor: 'transparent' }]}>
            <View style={styles.achievementInfo}>
              <Ionicons name="star-outline" size={24} color="#FF9500" />
              <Text style={themeStyles.achievementText}>Галерея 10+</Text>
            </View>
            <Text style={themeStyles.achievementProgress}>{photoCount}/10</Text>
          </View>
          
        </View>

      </ScrollView>
    </View>
  );
};

// 🚀 Функция для динамических стилей
const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: '900',
    color: isDarkMode ? '#fff' : '#1c1c1e',
    textAlign: 'center',
    marginTop: 10,
  },
  subheader: {
    fontSize: 16,
    color: isDarkMode ? '#aaa' : '#8e8e93',
    textAlign: 'center',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statTitle: {
    fontSize: 14,
    color: isDarkMode ? '#bbb' : '#8e8e93',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#1c1c1e',
    marginTop: 2,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: isDarkMode ? '#bbb' : '#8e8e93',
  },
  section: {
    backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
    margin: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#eee' : '#1c1c1e',
    marginBottom: 15,
  },
  achievementText: {
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#1c1c1e',
    marginLeft: 10,
  },
  achievementProgress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

// 🚀 Статические стили
const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 50,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItemWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statContent: {
    flex: 1,
  },
  achievement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  achievementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AnalyticsScreen;