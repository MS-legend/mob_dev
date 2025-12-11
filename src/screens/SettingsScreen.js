// SettingsScreen.js - экран настроек приложения
import React from 'react'; // Удален useState, так как настройки берутся из useStorage
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
import useStorage from '../hooks/useStorage';

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

  // 🚀 Определяем, включена ли темная тема
  const isDarkMode = settings?.darkMode ?? false;
  const themeStyles = getStyles(isDarkMode);

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const copyAppInfo = async () => {
    const appInfo = `Simple Counter App\nВерсия: 1.0.0\nРазработчик: Магомедсаид Гаджиагаев\nНастройки: ${JSON.stringify(settings, null, 2)}`;
    await Clipboard.setStringAsync(appInfo);
    Alert.alert('Скопировано', 'Информация о приложении скопирована в буфер обмена.');
  };
  
  const handleResetData = () => {
    Alert.alert(
      'Подтвердите сброс',
      'Вы уверены, что хотите сбросить все локальные данные (счетчики, галерею)? Это действие необратимо.',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Сбросить',
          style: 'destructive',
          onPress: () => {
            clearCounter();
            clearGalleryImages();
            clearPhotoCount();
            Alert.alert('Готово', 'Все локальные данные успешно сброшены.');
          },
        },
      ]
    );
  };

  const renderSettingItem = ({ key, title, description, icon, color, isSwitch = false }) => (
    <View style={themeStyles.settingItem}>
      <View style={[themeStyles.settingIcon, { backgroundColor: color + '30' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={themeStyles.settingContent}>
        <Text style={themeStyles.settingTitle}>{title}</Text>
        {description && <Text style={themeStyles.settingDescription}>{description}</Text>}
      </View>
      {isSwitch ? (
        <Switch
          onValueChange={() => toggleSetting(key)}
          value={settings[key]}
          trackColor={{ false: isDarkMode ? '#333' : '#767577', true: color }}
          thumbColor={settings[key] ? 'white' : (isDarkMode ? '#ddd' : '#f4f3f4')}
        />
      ) : (
        <Ionicons name="chevron-forward" size={24} color={isDarkMode ? '#666' : '#c7c7cc'} />
      )}
    </View>
  );

  return (
    <ScrollView style={themeStyles.container}>
      
      {/* 1. Настройки интерфейса */}
      <View style={themeStyles.sectionHeader}>
        <Text style={themeStyles.sectionTitle}>Интерфейс и Тема</Text>
      </View>
      <View style={themeStyles.settingsList}>
        {renderSettingItem({
          key: 'darkMode',
          title: 'Темная тема',
          description: 'Применить темное оформление ко всему приложению',
          icon: 'moon-outline',
          color: '#007AFF',
          isSwitch: true,
        })}
      </View>
      
      {/* 2. Настройки функционала */}
      <View style={themeStyles.sectionHeader}>
        <Text style={themeStyles.sectionTitle}>Функционал</Text>
      </View>
      <View style={themeStyles.settingsList}>
        {renderSettingItem({
          key: 'notifications',
          title: 'Уведомления',
          description: 'Получать оповещения о важных событиях',
          icon: 'notifications-outline',
          color: '#FF9500',
          isSwitch: true,
        })}
        {renderSettingItem({
          key: 'autoSave',
          title: 'Автосохранение',
          description: 'Автоматическое сохранение изменений (счетчик, данные)',
          icon: 'save-outline',
          color: '#34C759',
          isSwitch: true,
        })}
        {renderSettingItem({
          key: 'analytics',
          title: 'Сбор аналитики',
          description: 'Отправка анонимной статистики использования',
          icon: 'stats-chart-outline',
          color: '#5856D6',
          isSwitch: true,
        })}
        {renderSettingItem({
          key: 'vibration',
          title: 'Вибрация и тактильная отдача',
          description: 'Вибрационный отклик на нажатия',
          icon: 'hardware-chip-outline',
          color: '#FF3B30',
          isSwitch: true,
        })}
      </View>
      
      {/* 3. Действия */}
      <View style={themeStyles.sectionHeader}>
        <Text style={themeStyles.sectionTitle}>Данные и Информация</Text>
      </View>
      <View style={themeStyles.settingsList}>
        
        {/* Кнопка сброса */}
        <TouchableOpacity onPress={handleResetData}>
          <View style={[themeStyles.settingItem, { borderBottomColor: 'transparent' }]}>
            <View style={[themeStyles.settingIcon, { backgroundColor: '#FF3B3030' }]}>
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </View>
            <View style={themeStyles.settingContent}>
              <Text style={[themeStyles.settingTitle, { color: '#FF3B30' }]}>Сбросить все данные</Text>
              <Text style={themeStyles.settingDescription}>Удалить все счетчики и изображения</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Кнопка "О приложении" */}
        <TouchableOpacity onPress={copyAppInfo}>
          <View style={[themeStyles.settingItem, { borderBottomWidth: 0 }]}>
            <View style={[themeStyles.settingIcon, { backgroundColor: '#007AFF30' }]}>
              <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
            </View>
            <View style={themeStyles.settingContent}>
              <Text style={themeStyles.settingTitle}>О приложении</Text>
              <Text style={themeStyles.settingDescription}>Версия, разработчик и лицензии</Text>
            </View>
          </View>
        </TouchableOpacity>
        
      </View>

    </ScrollView>
  );
};

// 🚀 Функция для динамических стилей
const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#000' : '#f5f5f5',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: isDarkMode ? '#999' : '#6c757d',
    textTransform: 'uppercase',
  },
  settingsList: {
    backgroundColor: isDarkMode ? '#1c1c1e' : 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: isDarkMode ? '#333' : '#e0e0e0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#f0f0f0',
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
    color: isDarkMode ? '#fff' : '#1c1c1e',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: isDarkMode ? '#999' : '#8e8e93',
  },
  actionsRow: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;