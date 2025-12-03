// MediaScreen.js - экран для работы с мультимедиа
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Image,
  Alert 
} from 'react-native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const MediaScreen = () => {
  const [sound, setSound] = useState();
  const [recording, setRecording] = useState();
  const [recordedURI, setRecordedURI] = useState();
  const [image, setImage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Ссылка на аудио
  const soundRef = useRef();

  // ИСПРАВЛЕНИЕ: Очистка ресурсов при размонтировании
  useEffect(() => {
    return () => {
      // Освобождаем ресурсы звука, если он был загружен
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);
  // Конец ИСПРАВЛЕНИЯ

  // Воспроизведение аудио
  const playSound = async () => {
    try {
      // Используем онлайн источник для звука
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/button/beep-07.wav' }
      );
      soundRef.current = sound;
      await sound.playAsync();
      setIsPlaying(true);
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          sound.unloadAsync(); // Очистка после завершения
        }
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось воспроизвести аудио');
    }
  };

  // Запись аудио
  const startRecording = async () => {
    try {
      // ИСПРАВЛЕНИЕ: Запрос разрешений на запись
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
          Alert.alert('Ошибка доступа', 'Требуется разрешение на использование микрофона.');
          return;
      }
      // Конец ИСПРАВЛЕНИЯ

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);

    } catch (error) {
      Alert.alert('Ошибка', `Не удалось начать запись: ${error.message}`);
    }
  };

  // Остановка записи
  const stopRecording = async () => {
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordedURI(uri);
    setRecording(undefined);
    Alert.alert('Запись завершена', `Аудио сохранено по URI: ${uri}`);
    
    // Сброс режима аудио после записи
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });
  };

  // Воспроизведение записанного аудио
  const playRecordedSound = async () => {
    if (!recordedURI) {
      Alert.alert('Ошибка', 'Нет записанного аудио для воспроизведения.');
      return;
    }
    
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordedURI }
      );
      soundRef.current = sound;
      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось воспроизвести записанное аудио');
    }
  };


  // Выбор из галереи
  const pickImageFromGallery = async () => {
    try {
      // ИСПРАВЛЕНИЕ: Запрос разрешений для галереи
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка доступа', 'Требуется разрешение на доступ к галерее.');
        return;
      }
      // Конец ИСПРАВЛЕНИЯ

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось выбрать изображение');
    }
  };

  // Сделать фото
  const takePhoto = async () => {
    try {
      // ИСПРАВЛЕНИЕ: Запрос разрешений для камеры
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка доступа', 'Требуется разрешение на использование камеры.');
        return;
      }
      // Конец ИСПРАВЛЕНИЯ

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сделать фото');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Работа с изображениями</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.photoButton]} 
            onPress={takePhoto}
          >
            <Ionicons name="camera-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Сделать фото</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={pickImageFromGallery}
          >
            <Ionicons name="image-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Выбрать из галереи</Text>
          </TouchableOpacity>
        </View>
        {image && (
          <Image source={{ uri: image }} style={styles.image} />
        )}
      </View>

      {/* Секция аудио */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Работа с аудио</Text>
        <TouchableOpacity 
          style={[styles.button, styles.audioButton, { marginBottom: 10 }]} 
          onPress={playSound}
          disabled={isPlaying}
        >
          <Ionicons name={isPlaying ? "volume-high" : "volume-medium-outline"} size={24} color="white" />
          <Text style={styles.buttonText}>{isPlaying ? "Воспроизводится..." : "Воспроизвести сигнал"}</Text>
        </TouchableOpacity>

        <Text style={styles.subsectionTitle}>Запись голоса</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.recordButton]}
            onPress={recording ? stopRecording : startRecording}
            disabled={isPlaying}
          >
            <Ionicons name={isRecording ? "stop-circle-outline" : "mic-outline"} size={24} color="white" />
            <Text style={styles.buttonText}>{isRecording ? "Остановить запись" : "Начать запись"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.playRecordButton, { opacity: recordedURI ? 1 : 0.5 }]}
            onPress={playRecordedSound}
            disabled={!recordedURI || isRecording || isPlaying}
          >
            <Ionicons name="play-circle-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Слушать запись</Text>
          </TouchableOpacity>
        </View>
        {isRecording && <Text style={styles.recordingStatus}>Идет запись...</Text>}
        {recordedURI && !isRecording && <Text style={styles.recordingStatus}>Записано: {recordedURI.substring(0, 30)}...</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Описание</Text>
        <Text style={styles.descriptionText}>
          Демонстрация работы с функциями мультимедиа Expo:
          {'\n'}• Выберите изображение из галереи или сделайте фото
          {'\n'}• Воспроизведите звуковой сигнал
          {'\n'}• Запишите и воспроизведите свой голос
        </Text>
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    flex: 1,
    flexDirection: 'row',
    gap: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  photoButton: {
    backgroundColor: '#34C759',
  },
  audioButton: {
    backgroundColor: '#5856D6',
    flex: 1,
    marginHorizontal: 0,
  },
  recordButton: {
    backgroundColor: '#FF3B30',
  },
  playRecordButton: {
    backgroundColor: '#FF9500',
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
  recordingStatus: {
    marginTop: 10,
    textAlign: 'center',
    color: '#007AFF',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  }
});

export default MediaScreen;