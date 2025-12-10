// src/hooks/useApi.js - хук для работы с API
import { useState, useEffect } from 'react';

const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (fetchUrl) => {
    if (!fetchUrl) return;

    // 💡 DEBUG: Лог начала запроса
    console.log(`[useApi] Начинаем GET-запрос: ${fetchUrl}`);
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
        const errorText = `HTTP error! Status: ${response.status} (${response.statusText})`;
        // 💡 DEBUG: Лог ошибки HTTP
        console.error(`[useApi] Ошибка HTTP: ${errorText}`);
        throw new Error(errorText);
      }
      
      const result = await response.json();
      setData(result);
      // 💡 DEBUG: Лог успеха
      console.log(`[useApi] GET-запрос успешен. Получено данных: ${Array.isArray(result) ? result.length : '1'} элемент(ов).`);
      
    } catch (err) {
      setError(err.message);
      // 💡 DEBUG: Лог общей ошибки
      console.error('[useApi] Общая ошибка запроса:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(url);
  }, [url]);

  // Функция для принудительного обновления (используется кнопкой)
  const refetch = () => {
    fetchData(url);
  };

  return { data, loading, error, refetch };
};

export default useApi;