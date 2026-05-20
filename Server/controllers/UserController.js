require('dotenv').config();
const tableService = require('../services/TableService');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tableId = process.env.USER_TABLE_ID;
    const result = await tableService._get(tableId);
    const records = result?.data?.records ?? result?.records ?? [];
    return res.json(records);
  } catch (error) {
    console.error('Ошибка получения пользователей:', error.message);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
