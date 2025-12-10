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
  // Загрузка счетчика фотографий
  const { value: photoCount } = useStorage('photo_count', 0);
  
  // Анимации
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Запускаем анимации при монтировании
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  const stats = [
    {
      title: 'Всего фотографий в галерее',
      value: photoCount,
      icon: 'image',
      color: '#34C759',
      unit: 'шт.',
    },
    {
      title: 'Проведено аудиозаписей',
      value: 3, // Статическое значение для демонстрации
      icon: 'mic',
      color: '#5856D6',
      unit: 'раз',
    },
    {
      title: 'API-запросы (с начала сессии)',
      value: 12, // Статическое значение для демонстрации
      icon: 'cloud-download',
      color: '#FF9500',
      unit: 'шт.',
    },
  ];

  const renderStatItem = ({ title, value, icon, color, unit }) => {
    // Анимированный компонент для карточки
    return (
      <Animated.View 
        style={[
          styles.statCard, 
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
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>
            {value} <Text style={styles.statUnit}>{unit}</Text>
          </Text>
        </View>
      </Animated.View>
    );
  };
  
  // Установка фиксированного соотношения 9:16 (если нужно)
  return (
    <View style={{ flex: 1, aspectRatio: 9 / 16, alignSelf: 'center', width: '100%' }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        <Text style={styles.header}>Аналитика использования</Text>
        <Text style={styles.subheader}>
          Сводка по ключевым действиям пользователя и статистике.
        </Text>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItemWrapper}>
              {renderStatItem(stat)}
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Достижения (на основе статистики)</Text>
          
          <View style={styles.achievement}>
            <View style={styles.achievementInfo}>
              <Ionicons name="trophy-outline" size={24} color="#FFD700" />
              <Text style={styles.achievementText}>Первый снимок</Text>
            </View>
            <Text style={styles.achievementProgress}>{photoCount >= 1 ? 'Получено' : '—'}</Text>
          </View>

          <View style={styles.achievement}>
            <View style={styles.achievementInfo}>
              <Ionicons name="star-outline" size={24} color="#FF9500" />
              <Text style={styles.achievementText}>Галерея 10+</Text>
            </View>
            <Text style={styles.achievementProgress}>{photoCount}/10</Text>
          </View>
          
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1c1c1e',
    textAlign: 'center',
    marginTop: 10,
  },
  subheader: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 20,
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
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
  statTitle: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginTop: 2,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#8e8e93',
  },
  section: {
    backgroundColor: 'white',
    margin: 0, // Убрал внешний отступ, так как он есть в contentContainer
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 15,
  },
  achievement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  achievementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 16,
    color: '#1c1c1e',
    marginLeft: 10,
  },
  achievementProgress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default AnalyticsScreen;