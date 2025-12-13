import React from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useStorage from '../hooks/useStorage';
import { playClickSound } from '../utils/soundUtils'; 
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const { value: appSettings } = useStorage('appSettings', { darkMode: false });
  const isDarkMode = appSettings?.darkMode ?? false;
  const themeStyles = getStyles(isDarkMode);

  const handleNavigation = (screen) => {
      playClickSound(); 
      navigation.navigate(screen);
  };

  const NavigationButton = ({ screen, title, icon, color }) => (
    <TouchableOpacity
      style={[styles.navButton, { backgroundColor: color }]}
      onPress={() => handleNavigation(screen)}
    >
      <Ionicons name={icon} size={30} color="white" style={{ marginBottom: 8 }} />
      <Text style={styles.navButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={themeStyles.container}> 
      <View style={styles.header}>
        <Text style={themeStyles.mainTitle}>Главная Панель</Text>
        <Text style={themeStyles.subtitle}>Выберите раздел для продолжения работы.</Text>
      </View>

      <View style={themeStyles.navigationSection}>
        <View style={styles.navRow}>
          <NavigationButton screen="Media" title="Мультимедиа" icon="camera-outline" color="#34C759" />
          <NavigationButton screen="Gallery" title="Галерея" icon="images-outline" color="#FF9500" />
        </View>
        <View style={styles.navRow}>
          <NavigationButton screen="Analytics" title="Аналитика" icon="stats-chart-outline" color="#5856D6" />
          <NavigationButton screen="Settings" title="Настройки" icon="settings-outline" color="#FF3B30" />
        </View>
      </View>
    </View>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#f0ffef', 
    padding: 20,
    justifyContent: 'center', 
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: isDarkMode ? '#fff' : '#1c1c1e',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: isDarkMode ? '#aaa' : '#6c757d',
  },
  navigationSection: {
    backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.4 : 0.1, 
    shadowRadius: 10,
    elevation: 5,
  },
});

const styles = StyleSheet.create({
  header: { marginBottom: 40, alignItems: 'center' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  navButton: { paddingHorizontal: 15, paddingVertical: 25, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 8, minHeight: 120, justifyContent: 'center' },
  navButtonText: { color: 'white', fontSize: 15, fontWeight: '700', textAlign: 'center' },
});

export default HomeScreen;