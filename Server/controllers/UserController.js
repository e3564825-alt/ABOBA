require('dotenv').config();
const tableService = require('../services/TableService');
const express = require('express');
const router = express.Router();
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tableService.get(
      process.env.USER_TABLE_ID,
      `?recordIds[]=${id}&fieldKey=name`
    );
    const data = result.data;
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
    res.json(result.data);
  } catch (error) {
    console.error('Ошибка получения пользователей:', error.response?.data || error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});
module.exports = router;
