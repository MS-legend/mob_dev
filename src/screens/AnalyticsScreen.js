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
  const { value: count } = useStorage('counter', 0);
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
  }, []);

  const stats = [
    {
      title: 'Текущий счетчик',
      value: count,
      icon: 'trending-up',
      color: '#007AFF',
      description: 'Текущее значение вашего счетчика'
    },
    {
      title: 'Максимальное значение',
      value: Math.max(count, 10),
      icon: 'trophy',
      color: '#34C759',
      description: 'Самое высокое достигнутое значение'
    },
    {
      title: 'Всего нажатий',
      value: count * 2 + 15,
      icon: 'hand-right',
      color: '#FF9500',
      description: 'Общее количество взаимодействий'
    },
    {
      title: 'Активность',
      value: `${Math.min(count * 5, 100)}%`,
      icon: 'pulse',
      color: '#FF3B30',
      description: 'Уровень вашей активности в приложении'
    }
  ];

  const StatCard = ({ stat, index }) => (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
        <Ionicons name={stat.icon} size={24} color={stat.color} />
      </View>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statTitle}>{stat.title}</Text>
      <Text style={styles.statDescription}>{stat.description}</Text>
    </Animated.View>
  );

  const ProgressBar = ({ progress, color }) => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBackground}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: color,
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Аналитика</Text>
        <Text style={styles.headerSubtitle}>Статистика использования приложения</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard key={stat.title} stat={stat} index={index} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Прогресс достижений</Text>
        
        <View style={styles.achievement}>
          <View style={styles.achievementInfo}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.achievementText}>Новичок</Text>
          </View>
          <Text style={styles.achievementProgress}>100%</Text>
        </View>

        <View style={styles.achievement}>
          <View style={styles.achievementInfo}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.achievementText}>Активный пользователь</Text>
          </View>
          <Text style={styles.achievementProgress}>{Math.min(count * 2, 100)}%</Text>
        </View>

        <View style={styles.achievement}>
          <View style={styles.achievementInfo}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.achievementText}>Эксперт</Text>
          </View>
          <Text style={styles.achievementProgress}>{Math.min(count, 100)}%</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Рекомендации</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color="#FF9500" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Совет дня</Text>
            <Text style={styles.tipText}>
              Попробуйте использовать все функции приложения для получения полного опыта.
              Каждое взаимодействие улучшает вашу статистику!
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 40) / 2 - 5,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 5,
    textAlign: 'center',
  },
  statDescription: {
    fontSize: 12,
    color: '#8e8e93',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
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
  progressContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 5,
  },
  progressBackground: {
    flex: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9F0',
    borderRadius: 12,
    padding: 15,
    alignItems: 'flex-start',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 14,
    color: '#8D6E63',
    lineHeight: 20,
  },
});

export default AnalyticsScreen;