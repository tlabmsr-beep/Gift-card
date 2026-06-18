// tinkoff.js — интеграция с Тинькофф Касса (T-Bank Acquiring)
// Документация: https://www.tinkoff.ru/kassa/develop/api/
const crypto = require('crypto');
const https = require('https');

const API_HOST = 'securepay.tinkoff.ru';
const API_PATH = '/v2/';

const TERMINAL_KEY = process.env.TERMINAL_KEY || '';
const SECRET_KEY = process.env.SECRET_KEY || '';

/**
 * Генерация Token (подписи) по правилам Тинькофф:
 * 1. Берём все корневые параметры запроса (кроме объектов/массивов: Receipt, DATA).
 * 2. Добавляем пару Password = SecretKey.
 * 3. Сортируем по ключу в алфавитном порядке.
 * 4. Конкатенируем только значения.
 * 5. SHA-256 от полученной строки.
 */
function generateToken(params, secretKey = SECRET_KEY) {
  const data = { ...params, Password: secretKey };
  // исключаем вложенные структуры и сам Token
  const flat = {};
  for (const [k, v] of Object.entries(data)) {
    if (k === 'Token' || k === 'Receipt' || k === 'DATA' || k === 'Shops') continue;
    if (v === undefined || v === null) continue;
    if (typeof v === 'object') continue;
    flat[k] = typeof v === 'boolean' ? String(v) : v;
  }
  const concatenated = Object.keys(flat)
    .sort()
    .map((k) => flat[k])
    .join('');
  return crypto.createHash('sha256').update(concatenated).digest('hex');
}

/** Низкоуровневый POST к API Тинькофф */
function apiRequest(method, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request(
      {
        host: API_HOST,
        path: API_PATH + method,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let chunks = '';
        res.on('data', (c) => (chunks += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(chunks));
          } catch (e) {
            reject(new Error('Tinkoff: невалидный ответ — ' + chunks));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Init — создание платежа.
 * amountRubles — сумма в рублях (целое), orderId — наш номер заказа.
 * Возвращает { PaymentURL, PaymentId } при успехе.
 */
async function initPayment({ amountRubles, orderId, description, customerPhone, successUrl, failUrl, notificationUrl }) {
  const params = {
    TerminalKey: TERMINAL_KEY,
    Amount: Math.round(amountRubles * 100), // в копейках
    OrderId: orderId,
    Description: description || 'Подарочная карта KASHEMIR',
    SuccessURL: successUrl,
    FailURL: failUrl,
    NotificationURL: notificationUrl,
  };
  params.Token = generateToken(params);

  // Чек (54-ФЗ). DATA/Receipt не участвуют в Token.
  params.DATA = customerPhone ? { Phone: customerPhone } : undefined;
  params.Receipt = {
    Taxation: 'usn_income',
    Phone: customerPhone || undefined,
    Items: [
      {
        Name: 'Подарочная карта KASHEMIR',
        Price: Math.round(amountRubles * 100),
        Quantity: 1,
        Amount: Math.round(amountRubles * 100),
        Tax: 'none',
        PaymentObject: 'payment',
        PaymentMethod: 'full_payment',
      },
    ],
  };

  return apiRequest('Init', params);
}

/** Проверка подписи входящего webhook от Тинькофф */
function verifyNotification(body) {
  const incomingToken = body.Token;
  const calc = generateToken(body);
  return incomingToken === calc;
}

/** Проверка статуса платежа */
async function getState(paymentId) {
  const params = { TerminalKey: TERMINAL_KEY, PaymentId: paymentId };
  params.Token = generateToken(params);
  return apiRequest('GetState', params);
}

module.exports = { generateToken, initPayment, verifyNotification, getState, isConfigured: () => !!(TERMINAL_KEY && SECRET_KEY) };
