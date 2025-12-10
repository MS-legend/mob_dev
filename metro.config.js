// metro.config.js - конфигурация сборщика
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 🚀 ИСПРАВЛЕНИЕ: Явно добавляем расширения для аудиофайлов (.wav, .mp3, .m4a)
// Это необходимо, чтобы Metro (и Webpack) могли найти и обработать локальные require()
config.resolver.assetExts.push('wav', 'mp3', 'm4a');
config.resolver.sourceExts.push('wav', 'mp3', 'm4a');


module.exports = config;