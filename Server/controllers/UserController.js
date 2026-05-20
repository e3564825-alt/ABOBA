require('dotenv').config();
const tableService = require('../services/TableService');
const express = require('express');
const router = express.Router();

function normalizeRecordsPayload(result) {
  return result && result.data != null ? result.data : result;
}

function isRecordId(value) {
  return typeof value === 'string' && /^rec[a-zA-Z0-9]+/.test(value);
}

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = isRecordId(id)
      ? `?recordIds=${encodeURIComponent(id)}&fieldKey=name`
      : `?filterByFormula=${encodeURIComponent(`{UserId}=${id}`)}&fieldKey=name`;
    const result = await tableService.get(process.env.USER_TABLE_ID, query);
    const data = normalizeRecordsPayload(result);
    if (!data.records || data.records.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(data.records[0]);
  } catch (error) {
    console.error('Ошибка получения пользователя:', error.response?.data || error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await tableService.get(process.env.USER_TABLE_ID, '?fieldKey=name');
    res.json(normalizeRecordsPayload(result));
  } catch (error) {
    console.error('Ошибка получения пользователей:', error.response?.data || error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
