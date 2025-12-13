import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import useStorage from '../hooks/useStorage'; 
import { playClickSound } from '../utils/soundUtils'; 

const SettingsScreen = ({ navigation }) => {
  const { value: settings, setValue: setSettings } = useStorage('appSettings', {
    notifications: true,
    darkMode: false,
    autoSave: true,
    analytics: true,
    vibration: false
  });
  
  const { clearData: clearCounter } = useStorage('counter', 0);
  const { clearData: clearGalleryImages } = useStorage('gallery_images', []);
  const { clearData: clearPhotoCount } = useStorage('photo_count', 0);

  const toggleSetting = (key) => {
    playClickSound(); 
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const clearAllData = () => {
    playClickSound(); 
    Alert.alert(
      "Сброс данных",
      "Вы уверены, что хотите сбросить все данные?",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Сбросить", style: "destructive", onPress: () => {
            clearCounter();
            clearGalleryImages();
            clearPhotoCount();
            Alert.alert("Готово", "Все локальные данные очищены.");
        }}
      ]
    );
  };
  
  const copyAppInfo = async () => {
    playClickSound(); 
    const appInfo = `SnapNote App\nВерсия: 1.0.0\nНастройки: ${JSON.stringify(settings, null, 2)}`;
    await Clipboard.setStringAsync(appInfo);
    Alert.alert("Скопировано", "Информация о приложении скопирована в буфер обмена.");
  };

  const isDarkMode = settings?.darkMode ?? false;
  const themeStyles = getStyles(isDarkMode);

  const SettingItem = ({ icon, color, title, description, value, onToggle }) => (
    <View style={themeStyles.settingItem}>
      <View style={[themeStyles.settingIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <View style={themeStyles.settingContent}>
        <Text style={themeStyles.settingTitle}>{title}</Text>
        <Text style={themeStyles.settingDescription}>{description}</Text>
      </View>
      <Switch 
        trackColor={{ false: isDarkMode ? '#444' : '#767577', true: '#007AFF' }}
        thumbColor={'#fff'}
        ios_backgroundColor={isDarkMode ? '#444' : '#767577'}
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  return (
    <ScrollView style={themeStyles.container}>
      <View style={styles.sectionHeader}>
        <Text style={themeStyles.sectionTitle}>Общие</Text>
      </View>
      <View style={themeStyles.settingsList}>
        <SettingItem icon="moon-outline" color="#8E8E93" title="Темная Тема" description="Переключить интерфейс в ночной режим." value={settings.darkMode} onToggle={() => toggleSetting('darkMode')} />
        <SettingItem icon="notifications-outline" color="#FF9500" title="Уведомления" description="Получать уведомления о новых событиях." value={settings.notifications} onToggle={() => toggleSetting('notifications')} />
        <SettingItem icon="save-outline" color="#34C759" title="Автосохранение" description="Включить автоматическое сохранение данных." value={settings.autoSave} onToggle={() => toggleSetting('autoSave')} />
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={themeStyles.sectionTitle}>Действия</Text>
      </View>
      <View style={themeStyles.actionsList}>
        <TouchableOpacity style={themeStyles.actionButton} onPress={copyAppInfo}>
          <Text style={themeStyles.actionButtonText}>Скопировать информацию</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[themeStyles.actionButton, styles.clearButton]} onPress={clearAllData}>
          <Text style={[themeStyles.actionButtonText, { color: '#FF3B30' }]}>Сбросить все данные</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDarkMode ? '#000' : '#f5f5f5' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: isDarkMode ? '#aaa' : '#6c757d', textTransform: 'uppercase' },
  settingsList: { backgroundColor: isDarkMode ? '#1c1c1e' : 'white', borderTopWidth: 1, borderBottomWidth: 1, borderColor: isDarkMode ? '#333' : '#e0e0e0' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#333' : '#f0f0f0' },
  settingTitle: { fontSize: 16, fontWeight: '600', color: isDarkMode ? '#fff' : '#1c1c1e', marginBottom: 2 },
  settingDescription: { fontSize: 14, color: isDarkMode ? '#aaa' : '#8e8e93' },
  settingIcon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingContent: { flex: 1 },
  actionsList: { padding: 20, marginTop: 10, gap: 10 },
  actionButton: { backgroundColor: isDarkMode ? '#1c1c1e' : 'white', padding: 16, borderRadius: 10, alignItems: 'center', borderWidth: isDarkMode ? 1 : 0, borderColor: isDarkMode ? '#333' : 'transparent' },
  actionButtonText: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
});

const styles = StyleSheet.create({
  sectionHeader: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  clearButton: { borderWidth: 1, borderColor: '#FF3B30' },
});

export default SettingsScreen;