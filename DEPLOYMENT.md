# Підготовка до продакшену

## 1. Змінні середовища

Скопіюйте `.env.example` в `.env.local` та заповніть значеннями. Для продакшену (Vercel, Railway тощо) додайте змінні в панелі хостингу.

**Обовʼязково:**
- `NEXT_PUBLIC_SITE_URL` — URL сайту (наприклад `https://frozen-market.ua`)
- `NEXT_PUBLIC_PAYMENT_IBAN`, `NEXT_PUBLIC_PAYMENT_RECIPIENT`, `NEXT_PUBLIC_PAYMENT_EDRPOU` — реальні реквізити для оплати

## 2. Telegram Webhook

Якщо використовуєте webhook для підтвердження замовлень:

1. Додайте `TELEGRAM_WEBHOOK_SECRET` у .env
2. При налаштуванні webhook передайте `secret_token`:
   ```
   https://api.telegram.org/bot<TOKEN>/setWebhook?url=<YOUR_URL>/api/webhooks/telegram&secret_token=<YOUR_SECRET>
   ```

## 3. Monobank Webhook

Вкажіть URL webhook у кабінеті Monobank:
```
https://your-domain.com/api/webhooks/mono
```

## 4. Перевірка перед запуском

- [ ] Реальні реквізити в `NEXT_PUBLIC_PAYMENT_*`
- [ ] `NEXT_PUBLIC_SITE_URL` вказує на продакшен-домен
- [ ] Supabase: налаштовані URL redirect для auth
- [ ] Telegram: webhook secret (опційно, але рекомендовано)
