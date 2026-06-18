// server.js — KASHEMIR · Подарочные карты
try { require('dotenv').config(); } catch (_) { /* dotenv опционален */ }
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const tinkoff = require('./tinkoff');

const app = express();
const PORT = process.env.PORT || 3000;
const DEMO_MODE = process.env.DEMO_MODE === 'true' || !tinkoff.isConfigured();
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// In-memory хранилище заказов (для прод — заменить на БД)
const orders = new Map();

function newOrderId() {
  return 'KSH-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex');
}

// Создание платежа
app.post('/api/create-payment', async (req, res) => {
  try {
    const { amount, design, color, message, sender, recipient, phone, sendTime, sendPdf } = req.body;
    const amt = Number(amount);
    if (!amt || amt < 300 || amt > 150000) {
      return res.status(400).json({ ok: false, error: 'Некорректный номинал' });
    }
    const orderId = newOrderId();
    const order = {
      orderId, amount: amt, design, color, message, sender, recipient,
      phone, sendTime, sendPdf, status: 'NEW', createdAt: new Date().toISOString(),
    };
    orders.set(orderId, order);

    if (DEMO_MODE) {
      // Демо: эмулируем платёжную страницу
      order.status = 'DEMO';
      return res.json({ ok: true, demo: true, orderId, paymentUrl: `/demo-pay.html?order=${orderId}&amount=${amt}` });
    }

    const result = await tinkoff.initPayment({
      amountRubles: amt,
      orderId,
      description: `Подарочная карта KASHEMIR на ${amt} ₽`,
      customerPhone: phone,
      successUrl: `${BASE_URL}/success.html?order=${orderId}`,
      failUrl: `${BASE_URL}/?fail=1`,
      notificationUrl: `${BASE_URL}/api/tinkoff-webhook`,
    });

    if (result.Success && result.PaymentURL) {
      order.paymentId = result.PaymentId;
      order.status = 'PENDING';
      return res.json({ ok: true, demo: false, orderId, paymentUrl: result.PaymentURL });
    }
    return res.status(502).json({ ok: false, error: result.Message || result.Details || 'Ошибка Тинькофф' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'Внутренняя ошибка сервера' });
  }
});

// Webhook от Тинькофф
app.post('/api/tinkoff-webhook', (req, res) => {
  const body = req.body;
  if (!tinkoff.verifyNotification(body)) {
    return res.status(403).send('Bad token');
  }
  const order = orders.get(body.OrderId);
  if (order) {
    order.status = body.Status; // CONFIRMED, REJECTED, ...
    order.tinkoffStatus = body.Status;
    if (body.Status === 'CONFIRMED') {
      order.paidAt = new Date().toISOString();
      // TODO: здесь выпустить карту: отправить СМС / PDF на почту
      console.log(`✅ Заказ ${order.orderId} оплачен на ${order.amount} ₽`);
    }
  }
  res.send('OK'); // Тинькофф ожидает строку OK
});

// Демо: «подтвердить оплату»
app.post('/api/demo-confirm', (req, res) => {
  const order = orders.get(req.body.orderId);
  if (!order) return res.status(404).json({ ok: false });
  order.status = 'CONFIRMED';
  order.paidAt = new Date().toISOString();
  res.json({ ok: true });
});

// Статус заказа (для страницы success)
app.get('/api/order/:id', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ ok: false });
  res.json({ ok: true, order });
});

app.get('/api/config', (req, res) => res.json({ demo: DEMO_MODE }));

app.listen(PORT, () => {
  console.log(`\n  KASHEMIR · Подарочные карты`);
  console.log(`  → ${BASE_URL}`);
  console.log(`  → Режим: ${DEMO_MODE ? 'DEMO (тестовый, без реальных платежей)' : 'PRODUCTION (Тинькофф)'}\n`);
});
