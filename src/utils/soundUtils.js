import { Audio } from 'expo-av';

// ИСПОЛЬЗУЕМ ЛОКАЛЬНЫЙ РЕСУРС
// Путь: src/utils -> .. -> .. -> assets -> файл
const CLICK_SOUND_URI = require('../../assets/mixkit-modern-technology-select-3124.wav');

let clickSoundInstance = null;

export const playClickSound = async () => {
    try {
        if (!clickSoundInstance) {
            // Используем локальный ресурс через require()
            const { sound } = await Audio.Sound.createAsync(
                CLICK_SOUND_URI, // Передаем результат require()
                { shouldPlay: true }
            );
            clickSoundInstance = sound;
            clickSoundInstance.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    // Перематываем на начало, чтобы можно было быстро проиграть снова
                    clickSoundInstance.setPositionAsync(0);
                }
            });
        } else {
            // Если инстанс уже есть, просто перезапускаем
            await clickSoundInstance.replayAsync();
        }
    } catch (error) {
        // Ошибка может возникнуть, если файл отсутствует или неверный путь
        console.error('Sound error (check file path and format):', error);
    }
};