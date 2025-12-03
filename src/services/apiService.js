// src/services/apiService.js - сервис для работы с внешним API
const API_BASE = 'https://jsonplaceholder.typicode.com';

export const apiService = {
  async getUsers() {
    try {
      const response = await fetch(`${API_BASE}/users`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async getPosts() {
    try {
      const response = await fetch(`${API_BASE}/posts`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async createPost(postData) {
    try {
      const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};