function sanitizeEnvValue(value) {
  if (value == null) return '';
  let v = String(value).trim();

  // Снимаем обрамляющие кавычки (в т.ч. "dst...";)
  let prev = '';
  while (prev !== v && (/^["']/.test(v) || /["']$/.test(v))) {
    prev = v;
    v = v.replace(/^["']+/, '').replace(/["']+$/, '').trim();
  }

  // Хвостовой мусор из .env: ; " '
  v = v.replace(/["';]+$/g, '').replace(/^["';]+/g, '').trim();

  return v;
}

function requireEnv(name) {
  const raw = process.env[name];
  const value = sanitizeEnvValue(raw);
  if (!value) {
    throw new Error(`Переменная ${name} не задана в .env`);
  }
  if (raw && sanitizeEnvValue(raw) !== String(raw).trim() && String(raw).trim() !== value) {
    console.warn(
      `⚠ ${name}: в .env лишние кавычки или "; — исправлено автоматически. Пишите без кавычек: ${name}=${value}`
    );
  }
  return value;
}

function normalizeTablesApiUrl(raw) {
  let url = sanitizeEnvValue(raw);

  // Убираем мусор внутри пути (например datasheets/";)
  url = url.replace(/\/["';]+/g, '/').replace(/["';]+/g, '');

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  url = url.replace(/\/+$/, '');

  url = url.replace('://api.vika.cn', '://vika.cn');
  url = url.replace('://api.apitable.com', '://apitable.com');

  if (!/\/fusion\/v\d+\/datasheets$/i.test(url)) {
    if (/\/fusion\/v\d+$/i.test(url)) {
      url = `${url}/datasheets`;
    } else if (!url.includes('/fusion/')) {
      url = `${url}/fusion/v1/datasheets`;
    }
  }

  return url;
}

function validateTableId(name, value) {
  if (!/^dst[a-zA-Z0-9]+$/i.test(value)) {
    console.warn(
      `⚠ ${name} должен быть ID таблицы (datasheet), обычно начинается с dst..., сейчас: ${value}`
    );
  }
}

function validateEnv() {
  const token = requireEnv('TOKEN');
  const tablesApiUrl = normalizeTablesApiUrl(requireEnv('TABLES_API_URL'));
  const loginTableId = requireEnv('LOGIN_TABLE_ID');
  const userTableId = requireEnv('USER_TABLE_ID');

  validateTableId('LOGIN_TABLE_ID', loginTableId);
  validateTableId('USER_TABLE_ID', userTableId);

  try {
    // eslint-disable-next-line no-new
    new URL(`${tablesApiUrl}/${encodeURIComponent(loginTableId)}/records`);
  } catch {
    throw new Error(
      `TABLES_API_URL некорректен. Пример: https://tables.mws.ru/fusion/v1/datasheets (сейчас: ${tablesApiUrl})`
    );
  }

  // Подменяем process.env очищенными значениями для всего приложения
  process.env.TOKEN = token;
  process.env.TABLES_API_URL = tablesApiUrl;
  process.env.LOGIN_TABLE_ID = loginTableId;
  process.env.USER_TABLE_ID = userTableId;

  return { token, tablesApiUrl, loginTableId, userTableId };
}

module.exports = {
  sanitizeEnvValue,
  requireEnv,
  normalizeTablesApiUrl,
  validateEnv,
};
