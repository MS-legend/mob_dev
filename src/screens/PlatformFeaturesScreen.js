// src/screens/PlatformFeaturesScreen.js - экран с платформо-специфичными функциями
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Vibration
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import PlatformSpecificButton from '../components/PlatformSpecificButton';
import { PlatformUtils, PlatformConstants } from '../utils/platformUtils';

const PlatformFeaturesScreen = () => {
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    loadDeviceInfo();
    setupNotifications();
  }, []);

  const loadDeviceInfo = async () => {
    const info = {
      brand: Device.brand,
      modelName: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion,
      deviceType: Device.DeviceType[Device.deviceType],
      isDevice: Device.isDevice,
      totalMemory: Device.totalMemory,
      supportedCpuArchitectures: Device.supportedCpuArchitectures,
    };
    setDeviceInfo(info);
  };

  const setupNotifications = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationsEnabled(status === 'granted');
  };

  // Платформо-специфичные тактильные эффекты
  const testHaptics = async (type) => {
    if (!hapticsEnabled) return;

    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'selection':
          await Haptics.selectionAsync();
          break;
      }
    } catch (error) {
      console.log('Haptics not supported:', error);
    }
  };

  // Платформо-специфичные уведомления
  const testNotification = async () => {
    if (!notificationsEnabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotificationsEnabled(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Уведомления отключены',
          'Включите уведомления в настройках устройства'
        );
        return;
      }
    }

    // Разные уведомления для разных платформ
    const notificationContent = {
      title: 'Платформо-специфичное уведомление',
      body: PlatformUtils.isIOS 
        ? 'Это уведомление оптимизировано для iOS' 
        : PlatformUtils.isAndroid 
        ? 'Это уведомление оптимизировано для Android'
        : 'Это веб-уведомление',
      data: { test: 'data' },
    };

    // iOS-специфичные настройки
    if (PlatformUtils.isIOS) {
      notificationContent.sound = 'default';
    }

    // Android-специфичные настройки
    if (PlatformUtils.isAndroid) {
      notificationContent.vibrate = [0, 250, 250, 250];
    }

    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: { seconds: 1 },
    });

    Alert.alert('Уведомление отправлено', 'Проверьте ваши уведомления');
  };

  // Платформо-специфичная вибрация (только Android)
  const testVibration = () => {
    if (PlatformUtils.isAndroid) {
      Vibration.vibrate([0, 500, 200, 500]);
    } else {
      Alert.alert(
        'Вибрация',
        PlatformUtils.isIOS 
          ? 'На iOS используйте Haptics для тактильной обратной связи'
          : 'Вибрация доступна только на Android устройствах'
      );
    }
  };

  const showPlatformAlert = () => {
    // Разные алерты для разных платформ
    if (PlatformUtils.isIOS) {
      Alert.alert(
        'iOS Специфичный Alert',
        'Этот алерт использует стиль iOS с четкими кнопками и закругленными углами.',
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'OK', style: 'default' }
        ]
      );
    } else if (PlatformUtils.isAndroid) {
      Alert.alert(
        'Android Специфичный Alert',
        'Этот алерт использует Material Design стиль для Android.',
        [
          { text: 'НЕТ', style: 'cancel' },
          { text: 'ДА', style: 'destructive' }
        ]
      );
    } else {
      Alert.alert(
        'Web Уведомление',
        'Это стандартное браузерное уведомление.'
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок с платформо-специфичным стилем */}
      <View style={[styles.header, PlatformUtils.getPlatformStyles(
        styles.iosHeader,
        styles.androidHeader,
        styles.webHeader
      )]}>
        <Ionicons 
          name={PlatformUtils.isIOS ? 'logo-apple' : PlatformUtils.isAndroid ? 'logo-android' : 'globe'} 
          size={32} 
          color="white" 
        />
        <Text style={styles.headerTitle}>
          {PlatformUtils.isIOS ? 'iOS Функции' : 
           PlatformUtils.isAndroid ? 'Android Функции' : 
           'Web Функции'}
        </Text>
        <Text style={styles.headerSubtitle}>
          Платформо-специфичные возможности
        </Text>
      </View>

      {/* Информация об устройстве */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Информация об устройстве</Text>
        {deviceInfo && (
          <View style={styles.infoGrid}>
            <InfoItem label="Платформа" value={Platform.OS} />
            <InfoItem label="Бренд" value={deviceInfo.brand || 'Неизвестно'} />
            <InfoItem label="Модель" value={deviceInfo.modelName} />
            <InfoItem label="ОС" value={`${deviceInfo.osName} ${deviceInfo.osVersion}`} />
            <InfoItem label="Тип устройства" value={deviceInfo.deviceType} />
            <InfoItem label="Это устройство?" value={deviceInfo.isDevice ? 'Да' : 'Нет'} />
          </View>
        )}
      </View>

      {/* Тактильная обратная связь */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Тактильная обратная связь</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Включить Haptics</Text>
          <Switch
            value={hapticsEnabled}
            onValueChange={setHapticsEnabled}
            trackColor={{ false: '#f0f0f0', true: PlatformUtils.isIOS ? '#007AFF' : '#34C759' }}
          />
        </View>

        <View style={styles.buttonGrid}>
          <PlatformSpecificButton
            title="Легкий"
            variant="secondary"
            size="small"
            onPress={() => testHaptics('light')}
          />
          <PlatformSpecificButton
            title="Средний"
            variant="secondary"
            size="small"
            onPress={() => testHaptics('medium')}
          />
          <PlatformSpecificButton
            title="Сильный"
            variant="secondary"
            size="small"
            onPress={() => testHaptics('heavy')}
          />
          <PlatformSpecificButton
            title="Успех"
            variant="success"
            size="small"
            onPress={() => testHaptics('success')}
          />
          <PlatformSpecificButton
            title="Ошибка"
            variant="danger"
            size="small"
            onPress={() => testHaptics('error')}
          />
          <PlatformSpecificButton
            title="Выбор"
            variant="secondary"
            size="small"
            onPress={() => testHaptics('selection')}
          />
        </View>
      </View>

      {/* Уведомления и вибрация */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Уведомления</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>
            {notificationsEnabled ? 'Уведомления включены' : 'Включить уведомления'}
          </Text>
          <PlatformSpecificButton
            title={notificationsEnabled ? "Тест" : "Включить"}
            size="small"
            onPress={testNotification}
          />
        </View>

        <View style={styles.buttonRow}>
          <PlatformSpecificButton
            title="Тест вибрации"
            variant="secondary"
            icon="phone-portrait"
            onPress={testVibration}
          />
          <PlatformSpecificButton
            title="Платформенный Alert"
            variant="primary"
            icon="notifications"
            onPress={showPlatformAlert}
          />
        </View>
      </View>

      {/* Платформо-специфичные компоненты */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Платформо-специфичные кнопки</Text>
        
        <View style={styles.demoButtons}>
          <PlatformSpecificButton
            title="Основная кнопка"
            variant="primary"
            icon="star"
            onPress={() => testHaptics('light')}
          />
          <PlatformSpecificButton
            title="Вторичная кнопка"
            variant="secondary"
            icon="heart"
            onPress={() => testHaptics('medium')}
          />
          <PlatformSpecificButton
            title="Опасное действие"
            variant="danger"
            icon="warning"
            onPress={() => testHaptics('error')}
          />
        </View>
      </View>

      {/* Информация о поддержке функций */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Поддержка функций</Text>
        
        <View style={styles.featureList}>
          <FeatureItem 
            feature="Haptics" 
            supported={PlatformUtils.isIOS || PlatformUtils.isAndroid} 
          />
          <FeatureItem 
            feature="Push Notifications" 
            supported={PlatformUtils.isIOS || PlatformUtils.isAndroid} 
          />
          <FeatureItem 
            feature="Native Vibration" 
            supported={PlatformUtils.isAndroid} 
          />
          <FeatureItem 
            feature="Touchable Ripple (Android)" 
            supported={PlatformUtils.isAndroid} 
          />
          <FeatureItem 
            feature="iOS-style Alerts" 
            supported={PlatformUtils.isIOS} 
          />
        </View>
      </View>
    </ScrollView>
  );
};

// Вспомогательные компоненты
const InfoItem = ({ label, value }) => (
  <View style={infoStyles.item}>
    <Text style={infoStyles.label}>{label}</Text>
    <Text style={infoStyles.value}>{value}</Text>
  </View>
);

const FeatureItem = ({ feature, supported }) => (
  <View style={featureStyles.item}>
    <Ionicons 
      name={supported ? 'checkmark-circle' : 'close-circle'} 
      size={20} 
      color={supported ? '#34C759' : '#FF3B30'} 
    />
    <Text style={[featureStyles.text, !supported && featureStyles.unsupported]}>
      {feature}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  iosHeader: {
    backgroundColor: '#007AFF',
  },
  androidHeader: {
    backgroundColor: '#34C759',
  },
  webHeader: {
    backgroundColor: '#5856D6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    ...PlatformConstants.shadow,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 16,
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
  settingLabel: {
    fontSize: 16,
    color: '#1c1c1e',
    flex: 1,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  demoButtons: {
    gap: 12,
  },
  featureList: {
    gap: 12,
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
  label: {
    fontSize: 14,
    color: '#8e8e93',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1c1e',
  },
});

const featureStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 16,
    color: '#1c1c1e',
  },
  unsupported: {
    color: '#8e8e93',
    textDecorationLine: 'line-through',
  },
});

export default PlatformFeaturesScreen;