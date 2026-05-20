require('dotenv').config();

const axios = require('axios');

class TableService {
  constructor() {
    this.apiKey = process.env.TOKEN;
    this.baseURL = process.env.TABLES_API_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async _get(tableId, url = '') {
    try {
      const response = await this.client.get(`${tableId}/records${url}`);
      return response.data;
    } catch (error) {
      console.error(
        'Ошибка при получении записей',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async _post(tableId, url = '', data) {
    try {
      const response = await this.client.post(`${tableId}/records${url}`, data);
      return response.data;
    } catch (error) {
      console.error(
        'Ошибка при создании записи:',
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

module.exports = new TableService();
