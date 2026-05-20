require('dotenv').config();
const tableService = require('../services/TableService');
const express = require('express');
const router = express.Router();

function getRecords(payload) {
  return payload?.data?.records ?? payload?.records ?? [];
}

function getField(fields, ...names) {
  for (const name of names) {
    if (fields[name] !== undefined && fields[name] !== null) {
      return String(fields[name]);
    }
  }
  return '';
}

router.get('/auth', async (req, res) => {
  const { email, password } = req.query;
  if (!email || !password) {
    return res.status(400).json({ message: 'Не заполнены обязательные поля' });
  }

  try {
    const tableId = process.env.LOGIN_TABLE_ID;
    const result = await tableService._get(tableId);
    const records = getRecords(result);

    const user = records.find((record) => {
      const fields = record.fields ?? record;
      const recordEmail = getField(fields, 'email', 'Email', 'E-mail', 'Почта');
      const recordPassword = getField(
        fields,
        'password',
        'Password',
        'Пароль',
        'pass'
      );
      return (
        recordEmail === String(email) && recordPassword === String(password)
      );
    });

    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Ошибка авторизации:', error.message);
    return res.status(500).json({ message: 'Ошибка сервера при авторизации' });
  }
});

module.exports = router;
