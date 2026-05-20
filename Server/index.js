require('dotenv').config();

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

function normalizeTablesApiUrl(raw) {
  let url = sanitizeEnvValue(raw);
  url = url.replace(/\/["';]+/g, '/').replace(/["';]+/g, '');
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  url = url.replace(/\/+$/, '');
  if (!/\/fusion\/v\d+\/datasheets$/i.test(url)) {
    if (/\/fusion\/v\d+$/i.test(url)) url = `${url}/datasheets`;
    else if (!url.includes('/fusion/')) url = `${url}/fusion/v1/datasheets`;
  }
  return url;
}

function validateEnv() {
  const keys = ['TOKEN', 'TABLES_API_URL', 'LOGIN_TABLE_ID', 'USER_TABLE_ID'];
  for (const key of keys) {
    const value = sanitizeEnvValue(process.env[key]);
    if (!value) throw new Error(`Переменная ${key} не задана в .env`);
    process.env[key] = key === 'TABLES_API_URL' ? normalizeTablesApiUrl(value) : value;
  }
  return {
    tablesApiUrl: process.env.TABLES_API_URL,
    loginTableId: process.env.LOGIN_TABLE_ID,
    userTableId: process.env.USER_TABLE_ID,
  };
}

let env;
try {
  env = validateEnv();
} catch (error) {
  console.error('Ошибка конфигурации .env:', error.message);
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const UserController = require('./controllers/UserController');
const LoginController = require('./controllers/LoginController');

const app = express();
const port = 3011;

app.use(cors());
app.use(express.json());
app.use('/api/users', UserController);
app.use('/api/login', LoginController);

app.listen(port, () => {
  console.log(`Сервер: http://localhost:${port}`);
  console.log(`API таблиц: ${env.tablesApiUrl}`);
  console.log(`Login table: ${env.loginTableId}`);
  console.log(`Users table: ${env.userTableId}`);
});
