// SettingsScreen.js - экран настроек приложения
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import useStorage from '../hooks/useStorage'; // <-- ИМПОРТ ДЛЯ РАБОТЫ СО СБРОСОМ

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true,
    analytics: true,
    vibration: false
  });

  // ИНИЦИАЛИЗАЦИЯ ХУКОВ ДЛЯ СБРОСА ДАННЫХ
  const { clearData: clearCounter } = useStorage('counter', 0);
  const { clearData: clearGallery } = useStorage('gallery_images', []);

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const copyAppInfo = async () => {
    const appInfo = `Simple Counter App\nВерсия: 1.0.0\nРазработчик: Ваше Имя`;
    await Clipboard.setStringAsync(appInfo);
    Alert.alert('Скопировано', 'Информация о приложении скопирована в буфер обмена');
  };

  // ИСПРАВЛЕНИЕ: Реализация логики сброса данных
  const resetData = () => {
    Alert.alert(
      'Сброс данных',
      'Вы уверены, что хотите сбросить все данные приложения (счетчик, изображения и т.д.)? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Сбросить', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearCounter();
              await clearGallery();
              Alert.alert('Успех', 'Данные приложения были сброшены.');
            } catch (e) {
              Alert.alert('Ошибка', 'Не удалось сбросить данные: ' + e.message);
            }
          }
        },
      ]
    );
  };
  // Конец ИСПРАВЛЕНИЯ

  // Вспомогательный компонент для строки настройки
  const SettingItem = ({ title, description, iconName, value, onToggle }) => (
    <View style={styles.settingItem}>
      <View style={[styles.settingIcon, { backgroundColor: iconName === 'notifications-outline' ? '#FF950020' : '#007AFF20' }]}>
        <Ionicons 
          name={iconName} 
          size={24} 
          color={iconName === 'notifications-outline' ? '#FF9500' : '#007AFF'} 
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        onValueChange={onToggle}
        value={value}
        trackColor={{ false: '#767577', true: '#34C759' }}
        thumbColor={value ? 'white' : 'white'}
      />
    </View>
  );


  // Вспомогательный компонент для кнопки-действия
  const ActionButton = ({ title, iconName, onPress, isDanger = false }) => (
    <TouchableOpacity
      style={[styles.actionButton, isDanger && styles.dangerButton]}
      onPress={onPress}
    >
      <Ionicons 
        name={iconName} 
        size={20} 
        color={isDanger ? '#FF3B30' : '#007AFF'} 
      />
      <Text style={[styles.actionButtonText, isDanger && styles.dangerText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Основные настройки</Text>
      </View>

      <SettingItem
        title="Уведомления"
        description="Получать оповещения о важных событиях."
        iconName="notifications-outline"
        value={settings.notifications}
        onToggle={() => toggleSetting('notifications')}
      />
      <SettingItem
        title="Темная тема"
        description="Использовать темную цветовую схему."
        iconName="moon-outline"
        value={settings.darkMode}
        onToggle={() => toggleSetting('darkMode')}
      />
      <SettingItem
        title="Автосохранение"
        description="Автоматически сохранять прогресс счетчика."
        iconName="save-outline"
        value={settings.autoSave}
        onToggle={() => toggleSetting('autoSave')}
      />
      <SettingItem
        title="Отправка аналитики"
        description="Разрешить сбор анонимных данных об использовании."
        iconName="analytics-outline"
        value={settings.analytics}
        onToggle={() => toggleSetting('analytics')}
      />
      <SettingItem
        title="Вибрация при нажатии"
        description="Включить тактильную отдачу (Haptics) для кнопок."
        iconName="hardware-chip-outline"
        value={settings.vibration}
        onToggle={() => toggleSetting('vibration')}
      />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Действия и информация</Text>
      </View>

      <View style={styles.actionsRow}>
        <ActionButton 
          title="Сброс данных" 
          iconName="reload-circle-outline" 
          onPress={resetData}
          isDanger={true}
        />
        <ActionButton 
          title="О приложении" 
          iconName="information-circle-outline" 
          onPress={copyAppInfo}
        />
      </View>
      
      <View style={[styles.actionsRow, { paddingBottom: 30 }]}>
        <ActionButton 
          title="Оценить приложение" 
          iconName="star-outline" 
          onPress={() => Alert.alert('Оценка', 'Функция оценки в разработке')}
        />
        <ActionButton 
          title="Поддержка" 
          iconName="mail-outline" 
          onPress={() => Alert.alert('Поддержка', 'Функция поддержки в разработке')}
        />
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 0,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8e8e93',
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#8e8e93',
  },
  actionsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'white',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#FF3B3010',
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  dangerText: {
    color: '#FF3B30',
  },
});

export default SettingsScreen;