// src/utils/platformUtils.js - утилиты для определения платформы
import { Platform, Dimensions } from 'react-native';
import * as Device from 'expo-device';

export const PlatformUtils = {
  // Определение текущей платформы
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isWeb: Platform.OS === 'web',
  
  // Определение типа устройства
  isPhone: Device.deviceType === Device.DeviceType.PHONE,
  isTablet: Device.deviceType === Device.DeviceType.TABLET,
  isDesktop: Device.deviceType === Device.DeviceType.DESKTOP,
  
  // Размеры экрана
  screenWidth: Dimensions.get('window').width,
  screenHeight: Dimensions.get('window').height,
  
  // Платформо-специфичные стили
  getPlatformStyles: (iosStyle, androidStyle, webStyle = {}) => {
    if (Platform.OS === 'ios') return iosStyle;
    if (Platform.OS === 'android') return androidStyle;
    return webStyle;
  },
  
  // Платформо-специфичные значения
  getPlatformValue: (iosValue, androidValue, webValue) => {
    if (Platform.OS === 'ios') return iosValue;
    if (Platform.OS === 'android') return androidValue;
    return webValue;
  }
};

// Платформо-специфичные константы
export const PlatformConstants = {
  // Отступы для разных платформ
  spacing: PlatformUtils.getPlatformValue(16, 12, 20),
  
  // Размеры иконок
  iconSize: PlatformUtils.getPlatformValue(24, 28, 20),
  
  // Высота статус бара
  statusBarHeight: PlatformUtils.getPlatformValue(44, 24, 0),
  
  // Стили теней
  shadow: PlatformUtils.getPlatformValue(
    {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    {
      elevation: 4,
    },
    {
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }
  )
};