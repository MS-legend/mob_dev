// src/screens/MediaScreen.js - экран для работы с мультимедиа
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Image,
  Alert,
  Platform 
} from 'react-native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import useStorage from '../hooks/useStorage'; // 🚀 Импорт для чтения темы

const MediaScreen = () => {
  // 🚀 Читаем настройки для определения темы
  const { value: appSettings } = useStorage('appSettings', { darkMode: false });
  const isDarkMode = appSettings?.darkMode ?? false;

  const [sound, setSound] = useState();
  const [recording, setRecording] = useState();
  const [recordedURI, setRecordedURI] = useState();
  const [image, setImage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const soundRef = useRef(null);
  
  const LOCAL_SOUND_URI = require('../../assets/mixkit-modern-technology-select-3124.wav');

  // Общий эффект для воспроизведения короткого звука (для обратной связи)
  const playSoundEffect = async (uri) => { 
    try {
        // Предполагаем, что uri может быть объектом { uri: string } или require(local_path)
        const source = typeof uri === 'string' ? { uri } : uri;
        const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });
        
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    } catch (error) {
        console.warn('Ошибка воспроизведения звукового эффекта:', error);
    }
  };

  // 1. Воспроизведение тестового звука (LOCAL_SOUND_URI)
  const playSound = async () => {
    // Останавливаем и выгружаем предыдущий звук, если есть
    if (soundRef.current) {
        try {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
        } catch (e) {
            console.log('Error stopping sound:', e);
        }
    }
    
    try {
        setIsPlaying(true);
        const { sound } = await Audio.Sound.createAsync(
            LOCAL_SOUND_URI,
            { shouldPlay: true },
            (status) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                    sound.unloadAsync();
                    soundRef.current = null;
                }
            }
        );
        soundRef.current = sound;
        setSound(sound);
    } catch (e) {
        Alert.alert('Ошибка аудио', 'Не удалось воспроизвести звук.');
        console.error(e);
        setIsPlaying(false);
    }
  };

  // 2. Съемка фото / Выбор из галереи
  const pickImage = async (fromCamera = false) => {
    // Запрос разрешений
    let permissionResult;
    if (fromCamera) {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.granted === false) {
      Alert.alert('Требуется разрешение', `Разрешение на доступ к ${fromCamera ? 'камере' : 'галерее'} отклонено.`);
      return;
    }

    // Параметры выбора
    let pickerResult = await (fromCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync)({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const imageUri = pickerResult.assets && pickerResult.assets.length > 0 ? pickerResult.assets[0].uri : null;
      if (imageUri) {
          setImage(imageUri);
          Alert.alert('Успех', `Изображение ${fromCamera ? 'снято' : 'выбрано'}!`);
      }
    }
  };
  
  // 3. Запись звука
  const startRecording = async () => {
    try {
      if (Platform.OS !== 'web') {
          const permission = await Audio.requestPermissionsAsync();
          if (permission.status !== "granted") {
              Alert.alert('Требуется разрешение', 'Разрешение на запись аудио отклонено.');
              return;
          }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setRecordedURI(null);
      Alert.alert('Запись', 'Начата запись...');

    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Ошибка', 'Не удалось начать запись аудио.');
    }
  };

  // 4. Остановка записи
  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    setRecordedURI(uri);
    Alert.alert('Запись', `Запись остановлена. URI: ${uri ? uri.substring(0, 30) + '...' : 'N/A'}`);
    // Звуковой эффект по завершении записи
    await playSoundEffect('https://www.soundjay.com/button/beep-07a.wav'); 
  };
  
  // 5. Воспроизведение записанного звука
  const playRecordedSound = async () => {
    if (!recordedURI) return;
    try {
        const { sound } = await Audio.Sound.createAsync(
            { uri: recordedURI },
            { shouldPlay: true }
        );
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    } catch (error) {
        Alert.alert('Ошибка воспроизведения', 'Не удалось воспроизвести записанный звук.');
        console.error(error);
    }
  };

  const themeStyles = getStyles(isDarkMode);

  return (
    <ScrollView style={themeStyles.container}>
      
      {/* Секция Изображения */}
      <View style={themeStyles.section}>
        <Text style={themeStyles.sectionTitle}>Изображения</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.photoButton]} 
            onPress={() => pickImage(false)}
          >
            <Text style={styles.buttonText}>Выбрать из Галереи</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.photoButton]} 
            onPress={() => pickImage(true)}
          >
            <Text style={styles.buttonText}>Сделать Фото</Text>
          </TouchableOpacity>
        </View>
        {/* Отображение изображения */}
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>

      {/* Секция Аудио */}
      <View style={themeStyles.section}>
        <Text style={themeStyles.sectionTitle}>Аудио</Text>
        
        <TouchableOpacity 
          onPress={playSound} 
          disabled={isPlaying || recording} // Нельзя играть звук во время записи
          style={[styles.button, styles.audioButton, { opacity: (isPlaying || recording) ? 0.6 : 1 }]}
        >
          <Text style={styles.buttonText}>
            {isPlaying ? 'Воспроизведение...' : 'Воспроизвести Тест. Звук'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={recording ? stopRecording : startRecording} 
          style={[styles.button, recording ? styles.stopButton : styles.recordButton]}
        >
          <Text style={styles.buttonText}>
            {recording ? 'Остановить Запись' : 'Начать Запись Голоса'}
          </Text>
        </TouchableOpacity>
        
        {recordedURI && (
            <TouchableOpacity 
                onPress={playRecordedSound} 
                style={[styles.button, styles.playRecordedButton]}
            >
                <Text style={styles.buttonText}>
                    Воспроизвести Запись
                </Text>
            </TouchableOpacity>
        )}
      </View>

    </ScrollView>
  );
};

// 🚀 Функция для динамических стилей
const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    padding: 20,
  },
  section: {
    backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: isDarkMode ? '#eee' : '#333',
  },
});

// 🚀 Статические стили
const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  photoButton: {
    backgroundColor: '#34C759',
  },
  audioButton: {
    backgroundColor: '#5856D6',
  },
  recordButton: {
    backgroundColor: '#FF3B30',
  },
  stopButton: {
    backgroundColor: '#FFCC00',
  },
  playRecordedButton: {
      backgroundColor: '#007AFF',
      marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 15,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#eee',
  },
});

export default MediaScreen;