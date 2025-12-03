// src/hooks/useApi.js - хук для работы с API
import { useState, useEffect } from 'react';

const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        // Устанавливаем сообщение об ошибке
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  const refetch = () => {
    if (url) {
      setLoading(true);
      setError(null);
      
      fetch(url)
        .then(response => {
          // ИСПРАВЛЕНИЕ: Добавляем проверку response.ok для refetch
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(setData)
        .catch(err => setError(err.message)) // Обрабатываем ошибку
        .finally(() => setLoading(false));
    }
  };

  return { data, loading, error, refetch };
};

export default useApi;