import React, { useState } from 'react';
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
import useStorage from '../hooks/useStorage'; 
import { playClickSound } from '../utils/soundUtils'; 

const MediaScreen = () => {
  const { value: appSettings } = useStorage('appSettings', { darkMode: false });
  const isDarkMode = appSettings?.darkMode ?? false;

  const [recording, setRecording] = useState();
  const [recordedURI, setRecordedURI] = useState();
  const [image, setImage] = useState(null);
  
  const pickImage = async (fromCamera = false) => {
    playClickSound(); 
    let permissionResult;
    if (fromCamera) {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.granted === false) {
      Alert.alert('Требуется разрешение', 'Разрешение отклонено.');
      return;
    }
    let pickerResult = await (fromCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync)({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets) {
      setImage(pickerResult.assets[0].uri);
    }
  };
  
  const startRecording = async () => {
    playClickSound(); 
    try {
      if (Platform.OS !== 'web') {
          const permission = await Audio.requestPermissionsAsync();
          if (permission.status !== "granted") return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setRecordedURI(null);
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось начать запись.');
    }
  };

  const stopRecording = async () => {
    playClickSound(); 
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    setRecordedURI(recording.getURI());
  };
  
  const playRecordedSound = async () => {
    playClickSound(); 
    if (!recordedURI) return;
    try {
        const { sound } = await Audio.Sound.createAsync({ uri: recordedURI }, { shouldPlay: true });
    } catch (error) {
        Alert.alert('Ошибка', 'Не удалось воспроизвести.');
    }
  };

  const themeStyles = getStyles(isDarkMode);

  return (
    <ScrollView style={themeStyles.container}>
      <View style={themeStyles.section}>
        <Text style={themeStyles.sectionTitle}>Изображения</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.photoButton]} onPress={() => pickImage(false)}>
            <Text style={styles.buttonText}>Выбрать из Галереи</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.photoButton]} onPress={() => pickImage(true)}>
            <Text style={styles.buttonText}>Сделать Фото</Text>
          </TouchableOpacity>
        </View>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>

      <View style={themeStyles.section}>
        <Text style={themeStyles.sectionTitle}>Аудио</Text>
        <TouchableOpacity 
          onPress={recording ? stopRecording : startRecording} 
          style={[styles.button, recording ? styles.stopButton : styles.recordButton]}
        >
          <Text style={styles.buttonText}>{recording ? 'Остановить Запись' : 'Начать Запись Голоса'}</Text>
        </TouchableOpacity>
        
        {recordedURI && (
            <TouchableOpacity onPress={playRecordedSound} style={[styles.button, styles.playRecordedButton]}>
                <Text style={styles.buttonText}>Воспроизвести Запись</Text>
            </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#f5f5f5', padding: 20 },
  section: { backgroundColor: isDarkMode ? '#1e1e1e' : 'white', padding: 15, borderRadius: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: isDarkMode ? '#eee' : '#333' },
});

const styles = StyleSheet.create({
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  button: { paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginVertical: 5, flex: 1, marginHorizontal: 5 },
  photoButton: { backgroundColor: '#34C759' },
  recordButton: { backgroundColor: '#FF3B30' },
  stopButton: { backgroundColor: '#FFCC00' },
  playRecordedButton: { backgroundColor: '#007AFF', marginHorizontal: 5 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  image: { width: '100%', height: 200, borderRadius: 8, marginTop: 15, resizeMode: 'cover', borderWidth: 1, borderColor: '#eee' },
});

export default MediaScreen;