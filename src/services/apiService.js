// src/services/apiService.js - сервис для работы с внешним API
const API_BASE = 'https://jsonplaceholder.typicode.com';

export const apiService = {
  // Функции getUsers и getPosts опущены для краткости, поскольку не используются
  // ...

  async createPost(postData) {
    // 💡 DEBUG: Лог начала POST-запроса
    console.log(`[apiService] Начинаем POST-запрос на ${API_BASE}/posts с данными:`, postData);

    try {
      const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        const errorText = `Network response was not ok. Status: ${response.status} (${response.statusText})`;
        // 💡 DEBUG: Лог ошибки HTTP
        console.error(`[apiService] Ошибка HTTP POST: ${errorText}`);
        throw new Error(errorText);
      }
      
      const result = await response.json();
      // 💡 DEBUG: Лог успеха POST
      console.log(`[apiService] POST-запрос успешен. Полученный ID: ${result.id}`);
      return result;
      
    } catch (error) {
      // 💡 DEBUG: Лог общей ошибки
      console.error('[apiService] Общая ошибка POST-запроса:', error.message);
      throw error;
    }
  }
};