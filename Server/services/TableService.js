require('dotenv').config();
const axios = require('axios');

function sanitizeEnvValue(value) {
  if (value == null) return '';
  let v = String(value).trim();
  let prev = '';
  while (prev !== v && (/^["']/.test(v) || /["']$/.test(v))) {
    prev = v;
    v = v.replace(/^["']+/, '').replace(/["']+$/, '').trim();
  }
  return v.replace(/["';]+$/g, '').replace(/^["';]+/g, '').trim();
}

class TablesService {
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

  buildRecordsPath(tableId, query = '') {
    const id = encodeURIComponent(sanitizeEnvValue(tableId));
    const suffix = query.startsWith('?') || query === '' ? query : `?${query}`;
    return `/${id}/records${suffix}`;
  }

  async get(tableId, url) {
    const path = this.buildRecordsPath(tableId, url);
    try {
      const response = await this.client.get(path);
      const body = response.data;
      if (body && body.success === false) {
        const err = new Error(body.message || 'Ошибка API таблицы');
        err.response = { data: body };
        throw err;
      }
      return body;
    } catch (error) {
      const apiData = error.response && error.response.data;
      const apiMessage =
        apiData &&
        (typeof apiData === 'string' ? apiData : apiData.message || apiData.msg);
      console.error('Ошибка при получении записей:', {
        url: `${this.baseURL}${path}`,
        detail: apiData || error.message,
      });
      if (apiMessage) {
        const wrapped = new Error(apiMessage);
        wrapped.response = error.response;
        throw wrapped;
      }
      throw error;
    }
  }

  async post(tableId, url, data) {
    const response = await this.client.post(this.buildRecordsPath(tableId, url), data);
    return response.data;
  }

  async put(tableId, recordId, data) {
    const id = encodeURIComponent(sanitizeEnvValue(tableId));
    const response = await this.client.put(`/${id}/records/${encodeURIComponent(recordId)}`, data);
    return response.data;
  }

  async delete(tableId, recordId) {
    const id = encodeURIComponent(sanitizeEnvValue(tableId));
    const response = await this.client.delete(`/${id}/records/${encodeURIComponent(recordId)}`);
    return response.data;
  }
}

module.exports = new TablesService();
