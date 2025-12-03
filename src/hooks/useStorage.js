// src/hooks/useStorage.js - хук для работы с AsyncStorage
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStorage = (key, defaultValue) => {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveData();
    }
  }, [value]);

  const loadData = async () => {
    try {
      const storedValue = await AsyncStorage.getItem(key);
      if (storedValue !== null) {
        setValue(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setValue(defaultValue);
    } catch (error) {
      console.error('Ошибка очистки:', error);
    }
  };

  return { value, setValue, loading, clearData };
};

export default useStorage;