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
import useStorage from '../hooks/useStorage'; // 🚀 Добавлен импорт useStorage для сброса данных

const SettingsScreen = ({ navigation }) => {
  // 🚀 Используем useStorage для демонстрации сохранения настроек
  const { value: settings, setValue: setSettings } = useStorage('appSettings', {
    notifications: true,
    darkMode: false,
    autoSave: true,
    analytics: true,
    vibration: false
  });
  
  // Дополнительно получаем доступ к функциям сброса данных
  const { clearData: clearCounter } = useStorage('counter', 0);
  const { clearData: clearGalleryImages } = useStorage('gallery_images', []);
  const { clearData: clearPhotoCount } = useStorage('photo_count', 0);

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const copyAppInfo = async () => {
    const appInfo = `Simple Counter App\nВерсия: 1.0.0\nРазработчик: Магомедсаид Гаджиагаев\nНастройки: ${JSON.stringify(settings, null, 2)}`;
    await Clipboard.setStringAsync(appInfo);
    Alert.alert('Скопировано', 'Информация о приложении скопирована в буфер обмена');
  };

  const resetData = () => {
    Alert.alert(
      'Сброс данных',
      'Вы уверены, что хотите сбросить все данные приложения (счетчик, галерея)? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Сбросить', 
          style: 'destructive',
          onPress: async () => {
            // Сбрасываем все данные
            await clearCounter();
            await clearGalleryImages();
            await clearPhotoCount();
            // Сбрасываем текущие настройки на дефолтные
            setSettings({
                notifications: true,
                darkMode: false,
                autoSave: true,
                analytics: true,
                vibration: false
            });
            Alert.alert('Успех', 'Все данные приложения были сброшены');
            // Перезагрузка экрана Home для обновления счетчика
            navigation.navigate('Home'); 
          }
        },
      ]
    );
  };
  
  const settingsList = [
    { key: 'notifications', title: 'Уведомления', description: 'Разрешить push-уведомления', icon: 'notifications', color: '#FF9500' },
    { key: 'darkMode', title: 'Темная тема', description: 'Активировать темный режим интерфейса', icon: 'moon', color: '#5856D6' },
    { key: 'autoSave', title: 'Автосохранение', description: 'Автоматически сохранять данные счетчика', icon: 'save', color: '#34C759' },
    { key: 'analytics', title: 'Аналитика', description: 'Отправлять анонимные данные об использовании', icon: 'analytics', color: '#FF2D55' },
    { key: 'vibration', title: 'Вибрация/Haptics', description: 'Включить тактильный отклик при нажатии', icon: 'ios-phone-portrait', color: '#007AFF' },
  ];

  // 🚀 FIX: Добавлена функция рендеринга элемента настроек
  const renderSettingItem = (item) => (
    <View key={item.key} style={styles.settingItem}>
      <View style={[styles.settingIcon, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingDescription}>{item.description}</Text>
      </View>
      <Switch
        trackColor={{ false: "#767577", true: item.color }}
        thumbColor={settings[item.key] ? '#fff' : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => toggleSetting(item.key)}
        value={settings[item.key]}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Основные настройки</Text>
      </View>

      <View style={styles.settingsList}>
        {/* Отображаем элементы списка, используя добавленную функцию */}
        {settingsList.map(renderSettingItem)}
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Действия</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.actionButton, {borderColor: '#007AFF'}]} onPress={copyAppInfo}>
          <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
          <Text style={[styles.actionButtonText, {color: '#007AFF'}]}>Инфо о Приложении</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, {borderColor: '#FF3B30'}]} onPress={resetData}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          <Text style={[styles.actionButtonText, {color: '#FF3B30'}]}>Сбросить Данные</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Simple Counter App v1.0.0</Text>
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
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6c757d',
    textTransform: 'uppercase',
  },
  settingsList: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#8e8e93',
  }
});

export default SettingsScreen;