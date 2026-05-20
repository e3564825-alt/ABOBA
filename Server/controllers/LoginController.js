require('dotenv').config();
const tableService = require('../services/TableService');
const express = require('express');
const router = express.Router();

function normalizeRecordsPayload(result) {
  return result && result.data != null ? result.data : result;
}

function resolveFieldValue(value) {
  if (value == null) return null;
  const item = Array.isArray(value) ? value[0] : value;
  if (item == null) return null;
  if (typeof item === 'object') {
    return item.id || item.recordId || item.record_id || null;
  }
  return item;
}

function escapeFormulaString(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function fieldToString(value) {
  if (value == null) return '';
  if (typeof value === 'object') {
    const text = value.text != null ? value.text : value.name != null ? value.name : value.title;
    return String(text != null ? text : '');
  }
  return String(value);
}

function credentialsMatch(fields, email, password) {
  const rowEmail = fieldToString(fields.Email).trim().toLowerCase();
  const rowPassword = fieldToString(fields.Password);
  return rowEmail === email.trim().toLowerCase() && rowPassword === password;
}

async function findLoginByCredentials(tableId, email, password) {
  const formula = `AND({Email}="${escapeFormulaString(email)}",{Password}="${escapeFormulaString(password)}")`;

  try {
    const filtered = await tableService.get(
      tableId,
      `?filterByFormula=${encodeURIComponent(formula)}&fieldKey=name&pageSize=10`
    );
    const data = normalizeRecordsPayload(filtered);
    if (data.records && data.records.length) return data.records[0];
  } catch (error) {
    console.warn(
      'filterByFormula не сработал, пробуем локальный поиск:',
      error.response?.data || error.message
    );
  }

  const all = await tableService.get(tableId, '?fieldKey=name&pageSize=100');
  const data = normalizeRecordsPayload(all);
  return (data.records || []).find((record) => credentialsMatch(record.fields || {}, email, password)) || null;
}

router.get('/auth', (_req, res) => {
  res.status(405).json({ message: 'Используйте POST /api/login/auth' });
});

router.post('/auth', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Не заполнены обязательные поля' });
  }
  if (!process.env.LOGIN_TABLE_ID) {
    return res.status(500).json({ message: 'Не задан LOGIN_TABLE_ID в .env' });
  }
  try {
    const loginRecord = await findLoginByCredentials(process.env.LOGIN_TABLE_ID, email, password);

    if (!loginRecord) {
      return res.status(400).json({ message: 'Пользователь не найден', userId: 0 });
    }
    const userId = resolveFieldValue(loginRecord.fields && loginRecord.fields.UserId);
    if (userId == null || userId === '') {
      return res.status(500).json({ message: 'Некорректные данные пользователя' });
    }
    res.status(200).json({ message: 'Успешная авторизация', userId });
  } catch (error) {
    console.error('Ошибка авторизации:', error.response?.data || error.message);
    const data = error.response && error.response.data;
    let detail =
      typeof data === 'string' ? data : (data && (data.message || data.msg)) || error.message;
    if (detail === 'Invalid URL') {
      detail = 'Некорректный TABLES_API_URL в .env';
    }
    if (String(detail).includes('API does not exist')) {
      detail = 'Неверный TABLES_API_URL или ID таблицы (dst...) в .env';
    }
    res.status(500).json({ message: 'Ошибка сервера', detail });
  }
});

module.exports = router;
