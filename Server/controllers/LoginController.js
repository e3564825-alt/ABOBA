require('dotenv').config();
const tableService = require('../services/TableService');
const express = require('express');
const router = express.Router();
router.post('/auth', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Не заполнены обязательные поля' });
  }
  try {
    const formula = `AND({Email}="${email}",{Password}="${password}")`;
    const result = await tableService.get(
      process.env.LOGIN_TABLE_ID,
      `?filterByFormula=${encodeURIComponent(formula)}&fieldKey=name`
    );
    const data = result.data ?? result;

    if (!data.records || data.records.length === 0) {
      return res.status(400).json({ message: 'Пользователь не найден', userId: 0 });
    }
    const userIdField = data.records[0].fields.UserId;
    const userId = Array.isArray(userIdField) ? userIdField[0] : userIdField;
    if (!userId) {
      return res.status(500).json({ message: 'Некорректные данные пользователя' });
    }
    res.status(200).json({ message: 'Успешная авторизация', userId });
  } catch (error) {
    console.error('Ошибка авторизации:', error.response?.data || error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});
module.exports = router;
