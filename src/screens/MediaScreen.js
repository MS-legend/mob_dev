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
  // 💡 Импортируем Platform, чтобы лучше отлаживать
  Platform 
} from 'react-native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

const MediaScreen = () => {
  const [sound, setSound] = useState();
  const [recording, setRecording] = useState();
  const [recordedURI, setRecordedURI] = useState();
  const [image, setImage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Ссылка на аудио
  const soundRef = useRef();
  
  // 🚀 АУДИО: Использование локального файла WAV 
  // Убедитесь, что 'mixkit-modern-technology-select-3124.wav' находится в корневой папке 'assets/'
  const LOCAL_SOUND_URI = require('../../assets/mixkit-modern-technology-select-3124.wav');

  // Общий эффект для воспроизведения короткого звука
  const playSoundEffect = async (uri) => {
    try {
        const { sound } = await Audio.Sound.createAsync(uri, { shouldPlay: true });
        
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    } catch (error) {
        console.warn('Ошибка воспроизведения звукового эффекта:', error);
    }
  };


  // Воспроизведение тестового аудио
  const playSound = async () => {
    if (soundRef.current) {
        try {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
        } catch (e) {
            console.warn('Ошибка выгрузки предыдущего звука:', e);
        }
    }
    
    try {
      // Используем локальный источник для звука
      const { sound } = await Audio.Sound.createAsync(LOCAL_SOUND_URI);
      soundRef.current = sound;
      await sound.playAsync();
      setIsPlaying(true);
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          sound.unloadAsync();
          soundRef.current = null;
        }
      });
    } catch (error) {
      console.error('Ошибка воспроизведения аудио:', error);
      Alert.alert('Ошибка', 'Не удалось воспроизвести тестовый аудиофайл');
      setIsPlaying(false);
      soundRef.current = null;
    }
  };

  // Остановка воспроизведения (дополнительная функция, может быть полезна)
  const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setIsPlaying(false);
    }
  };

  // Запись аудио
  const startRecording = async () => {
    try {
      if (soundRef.current) {
        await stopSound(); // Остановка любого текущего звука перед записью
      }
      
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentModeIOS: true,
        android: {
            allowsRecording: true,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: false,
            shouldDuckAndroid: false, 
            interruptionModeAndroid: 1, 
        },
        interruptionModeIOS: 2,
      });
      
      const { recording } = await Audio.Recording.createAsync(
         Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Ошибка старта записи:', err);
      Alert.alert('Ошибка', 'Не удалось начать запись');
    }
  };

  // Остановка записи
  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecordedURI(uri);
        setRecording(undefined);
        
        // Воспроизводим звук успеха (тот же локальный файл)
        playSoundEffect(LOCAL_SOUND_URI);
        
        Alert.alert('Запись завершена', `Аудио сохранено по URI: ${uri}`);
        
        // Устанавливаем режим воспроизведения обратно
        await Audio.setAudioModeAsync({
          allowsRecording: false,
        });
      }
    } catch (error) {
      console.error('Ошибка остановки записи:', error);
      Alert.alert('Ошибка', 'Не удалось остановить запись');
    }
  };
  
  // Воспроизведение записанного аудио
  const playRecordedSound = async () => {
    if (recordedURI) {
        if (soundRef.current) {
            await stopSound(); 
        }

        try {
            const { sound } = await Audio.Sound.createAsync({ uri: recordedURI });
            soundRef.current = sound;
            await sound.playAsync();
            
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    sound.unloadAsync();
                    soundRef.current = null;
                }
            });
        } catch (error) {
            console.error('Ошибка воспроизведения записи:', error);
            Alert.alert('Ошибка', 'Не удалось воспроизвести записанный аудиофайл');
            soundRef.current = null;
        }
    } else {
        Alert.alert('Нет записи', 'Сначала сделайте аудиозапись.');
    }
  };
  
  // Выбор изображения
  const pickImage = async (fromCamera = false) => {
    try {
      let result;
      
      if (fromCamera) {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      // 🚀 ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ 3: Самое надежное получение URI
      if (!result.canceled) {
        // Приоритет: 1. assets[0].uri (для новых Expo/Android), 2. result.uri (для старых Expo/Web)
        const imageUri = (result.assets && result.assets.length > 0 
                         ? result.assets[0].uri 
                         : result.uri); 
        
        // 💡 ОЧЕНЬ ВАЖНО: Выведите это в консоль (Terminal или DevTools)
        console.log(`ImagePicker: Выбранный URI на платформе ${Platform.OS}:`, imageUri);

        if (imageUri) {
            setImage(imageUri);
        } else {
             Alert.alert('Ошибка', 'Не удалось получить URI изображения. Выберите другой файл.');
             console.error("ImagePicker: Не удалось извлечь imageUri из результата:", result);
        }
      }
    } catch (error) {
      Alert.alert('Ошибка', `Не удалось выбрать изображение: ${error.message}`);
      console.error("ImagePicker Error:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* Описание модуля */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Цель модуля "Мультимедиа"</Text>
        <Text style={styles.description}>
          Этот модуль демонстрирует взаимодействие приложения с нативными функциями устройства. Используйте его для проверки доступа к камере, галерее и микрофону, а также корректной работы Expo API.
        </Text>
        <Text style={styles.list}>
          • Проверка ImagePicker: Сделайте фото или выберите его из галереи.{'\n'}
          • Проверка Audio API: Запишите голосовое сообщение (со звуковым оповещением о завершении) и воспроизведите тестовый сигнал.
        </Text>
      </View>

      {/* Секция Изображения */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Изображения (ImagePicker)</Text>
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Аудио (Expo-AV)</Text>
        
        {/* Воспроизведение тестового звука */}
        <TouchableOpacity 
          onPress={playSound} 
          disabled={isPlaying} 
          style={[styles.button, styles.audioButton]}
        >
          <Text style={styles.buttonText}>
            {isPlaying ? 'Воспроизведение...' : 'Воспроизвести Тест. Звук'}
          </Text>
        </TouchableOpacity>
        
        {/* Запись аудио */}
        <TouchableOpacity 
          onPress={recording ? stopRecording : startRecording} 
          style={[styles.button, recording ? styles.stopButton : styles.recordButton]}
        >
          <Text style={styles.buttonText}>
            {recording ? 'Остановить Запись' : 'Начать Запись Голоса'}
          </Text>
        </TouchableOpacity>
        
        {/* Воспроизведение записанного аудио */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  list: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    paddingVertical: 5,
  },
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