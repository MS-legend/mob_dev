// src/components/PlatformSpecificButton.js - платформо-специфичная кнопка
import React from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  View,
  StyleSheet,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { PlatformUtils, PlatformConstants } from '../utils/platformUtils';

const PlatformSpecificButton = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle
}) => {
  // Обработчик нажатия с платформо-специфичной тактильной отдачей
  const handlePress = async () => {
    if (disabled) return;
    
    // Тактильная отдача для iOS
    if (PlatformUtils.isIOS) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Вибрация для Android
    else if (PlatformUtils.isAndroid) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    onPress?.();
  };

  // Разные стили для разных платформ
  const getButtonStyle = () => {
    const baseStyle = [
      styles.button,
      styles[`${variant}Button`],
      styles[`${size}Button`],
      disabled && styles.disabledButton,
    ];
    
    // iOS-специфичные стили
    if (PlatformUtils.isIOS) {
      baseStyle.push(styles.iosButton);
    }
    // Android-специфичные стили
    else if (PlatformUtils.isAndroid) {
      baseStyle.push(styles.androidButton);
    }
    
    return baseStyle;
  };

  // Разные компоненты для разных платформ
  const renderButtonContent = () => (
    <View style={styles.buttonContent}>
      {icon && (
        <Ionicons 
          name={icon} 
          size={PlatformConstants.iconSize} 
          color={getTextColor()} 
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
        {title}
      </Text>
    </View>
  );

  const getTextColor = () => {
    if (disabled) return '#999';
    return variant === 'secondary' ? '#007AFF' : '#FFFFFF';
  };

  // Используем разные компоненты для разных платформ
  if (PlatformUtils.isAndroid && variant !== 'secondary') {
    return (
      <TouchableNativeFeedback
        onPress={handlePress}
        disabled={disabled}
        background={TouchableNativeFeedback.Ripple('#FFFFFF30', false)}
      >
        <View style={[getButtonStyle(), style]}>
          {renderButtonContent()}
        </View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[getButtonStyle(), style]}
      activeOpacity={0.7}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Размеры
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  mediumButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
  },
  largeButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },
  // Варианты
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  successButton: {
    backgroundColor: '#34C759',
  },
  // Платформо-специфичные стили
  iosButton: {
    ...PlatformConstants.shadow,
  },
  androidButton: {
    ...PlatformConstants.shadow,
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
    borderColor: '#C7C7CC',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PlatformSpecificButton;