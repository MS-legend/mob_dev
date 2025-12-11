// src/screens/PlatformFeaturesScreen.js - экран с платформо-специфичными функциями
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Vibration,
  // 🚀 Добавлен импорт для чтения темы
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import PlatformSpecificButton from '../components/PlatformSpecificButton';
import { PlatformUtils, PlatformConstants } from '../utils/platformUtils';
import useStorage from '../hooks/useStorage'; // 🚀 Добавлен импорт

const PlatformFeaturesScreen = () => {
  // 🚀 Читаем настройки для определения темы
  const { value: appSettings } = useStorage('appSettings', { darkMode: false });
  const isDarkMode = appSettings?.darkMode ?? false;

  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    loadDeviceInfo();
    setupNotifications();
  }, []);

  const loadDeviceInfo = async () => { /* ... */ };
  const setupNotifications = async () => { /* ... */ };

  const themeStyles = getStyles(isDarkMode);

  // --- Функции демонстрации ---
  const triggerHaptics = async (style) => {
    if (hapticsEnabled) {
      // ... (логика хаптиков)
    }
  };

  const triggerVibration = () => {
    // ... (логика вибрации)
  };

  const sendLocalNotification = async () => {
    // ... (логика уведомлений)
  };
  
  // --- Рендеры ---

  const renderInfoItem = (label, value) => (
    <View style={infoStyles.item}>
      <Text style={themeStyles.infoLabel}>{label}</Text>
      <Text style={themeStyles.infoValue}>{value || 'N/A'}</Text>
    </View>
  );

  const renderSettingRow = (label, isEnabled, onToggle, color) => (
    <View style={styles.settingRow}>
      <Text style={themeStyles.settingLabel}>{label}</Text>
      <Switch
        onValueChange={onToggle}
        value={isEnabled}
        trackColor={{ false: isDarkMode ? '#333' : '#767577', true: color }}
        thumbColor={isEnabled ? 'white' : (isDarkMode ? '#ddd' : '#f4f3f4')}
      />
    </View>
  );

  return (
    <ScrollView style={themeStyles.container}>
      
      {/* Шапка */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#333' : '#007AFF' }]}>
        <Text style={styles.headerTitle}>Платформенные Особенности</Text>
        <Text style={styles.headerSubtitle}>
          Демонстрация работы нативных API (Haptics, Notifications, Device)
        </Text>
      </View>

      {/* 1. Информация об устройстве */}
      <View style={themeStyles.section}>
        <Text style={themeStyles.sectionTitle}>1. Информация об устройстве</Text>
        <View style={styles.infoGrid}>
          {deviceInfo ? (
            <>
              {renderInfoItem('Бренд', deviceInfo.brand)}
              {renderInfoItem('Модель', deviceInfo.modelName)}
              {renderInfoItem('ОС', deviceInfo.osName)}
              {renderInfoItem('Версия ОС', deviceInfo.osVersion)}
              {renderInfoItem('Тип устройства', deviceInfo.deviceType)}
              {renderInfoItem('Физическое устройство', deviceInfo.isDevice ? 'Да' : 'Эмулятор/Web')}
            </>
          ) : (
            <Text style={themeStyles.infoLabel}>Загрузка информации...</Text>
          )}
        </View>
      </View>
      
      {/* 2. Настройки Нативных функций */}
      <View style={themeStyles.section}>
        <Text style={themeStyles.sectionTitle}>2. Настройки функций</Text>
        {renderSettingRow(
          'Тактильная отдача (Haptics)',
          hapticsEnabled,
          setHapticsEnabled,
          '#FF9500'
        )}
        {renderSettingRow(
          'Уведомления',
          notificationsEnabled,
          setNotificationsEnabled,
          '#34C759'
        )}
      </View>
      
      {/* 3. Демонстрация (Haptics & Vibration) */}
      <View style={themeStyles.section}>
        <Text style={themeStyles.sectionTitle}>3. Демонстрация (Haptics/Vibration)</Text>
        <View style={styles.demoButtons}>
          <Text style={themeStyles.infoLabel}>Haptics (iOS/Android):</Text>
          <View style={styles.buttonGrid}>
            <PlatformSpecificButton title="Light" onPress={() => triggerHaptics(Haptics.ImpactFeedbackStyle.Light)} color="#5856D6" isDarkMode={isDarkMode} />
            <PlatformSpecificButton title="Medium" onPress={() => triggerHaptics(Haptics.ImpactFeedbackStyle.Medium)} color="#007AFF" isDarkMode={isDarkMode} />
            <PlatformSpecificButton title="Heavy" onPress={() => triggerHaptics(Haptics.ImpactFeedbackStyle.Heavy)} color="#FF3B30" isDarkMode={isDarkMode} />
          </View>

          {Platform.OS !== 'web' && (
            <>
              <Text style={themeStyles.infoLabel}>Вибрация (Vibration API):</Text>
              <View style={styles.buttonRow}>
                <PlatformSpecificButton title="Вибрировать" onPress={triggerVibration} color="#34C759" isDarkMode={isDarkMode} />
              </View>
            </>
          )}
        </View>
      </View>
      
      {/* 4. Демонстрация Уведомлений */}
      <View style={themeStyles.section}>
        <Text style={themeStyles.sectionTitle}>4. Демонстрация Уведомлений</Text>
        <View style={styles.demoButtons}>
          <PlatformSpecificButton 
            title="Отправить Локальное Уведомление" 
            onPress={sendLocalNotification} 
            color="#FF9500" 
            isDarkMode={isDarkMode}
            disabled={!notificationsEnabled}
          />
          <Text style={themeStyles.infoLabel}>
            {notificationsEnabled ? 'Разрешение получено.' : 'Разрешение на уведомления не получено.'}
          </Text>
        </View>
      </View>

    </ScrollView>
  );
};

// 🚀 Функция для динамических стилей
const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
  },
  section: {
    backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    ...PlatformConstants.shadow,
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#eee' : '#1c1c1e',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#1c1c1e',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: isDarkMode ? '#bbb' : '#6c757d',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: isDarkMode ? '#fff' : '#1c1c1e',
  }
});

// 🚀 Статические стили
const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 50, // Для отступа от статус-бара
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  infoGrid: {
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  demoButtons: {
    gap: 12,
    marginTop: 10,
  },
});

const infoStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
});

export default PlatformFeaturesScreen;