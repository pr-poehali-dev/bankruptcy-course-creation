# Интеграция токенов чата для chat-bankrot.ru

## Описание системы

После покупки combo или chat на **bankrot-kurs.ru**, система автоматически:
1. Создает токен через API endpoint
2. Сохраняет токен в базе данных
3. Отправляет email с токеном пользователю

Токен имеет формат: `{random}_manual_combo_{date}_{email}`  
Пример: `XK9mP2vRnQ_manual_combo_Dec02_v8966`

---

## API Endpoint для генерации токенов

**URL:** `https://functions.poehali.dev/002375a1-91ef-4076-9822-c2342937fb42?action=register`

**Метод:** POST

**Заголовки:**
```
Content-Type: application/json
X-Api-Key: bankrot_combo_secret_2025
```

**Тело запроса:**
```json
{
  "email": "customer@example.com",
  "amount": 4999
}
```

**Ответ при успехе (200):**
```json
{
  "success": true,
  "token": "XK9mP2vRnQ_manual_combo_Dec02_v8966",
  "chat_url": "https://chat-bankrot.ru/?token=XK9mP2vRnQ_manual_combo_Dec02_v8966",
  "expires_at": "2026-01-01T11:20:00Z"
}
```

**Ответ при ошибке (401):**
```json
{
  "success": false,
  "error": "Invalid API key"
}
```

---

## Интеграция на сайте chat-bankrot.ru

### Вариант 1: Frontend интеграция (React/TypeScript)

Создайте компонент для обработки покупок:

```tsx
// src/services/tokenService.ts
export async function registerComboPurchase(email: string, amount: number) {
  const response = await fetch(
    'https://functions.poehali.dev/002375a1-91ef-4076-9822-c2342937fb42?action=register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': 'bankrot_combo_secret_2025'
      },
      body: JSON.stringify({ email, amount })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to register purchase');
  }

  const data = await response.json();
  return data;
}

// src/pages/PaymentSuccess.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { registerComboPurchase } from '@/services/tokenService';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = searchParams.get('email');
    const amount = parseInt(searchParams.get('amount') || '4999');

    if (email) {
      registerComboPurchase(email, amount)
        .then(data => {
          if (data.success) {
            setToken(data.token);
            // Сохраните токен в localStorage для автологина
            localStorage.setItem('chat_token', data.token);
          }
        })
        .catch(error => console.error('Token registration failed:', error))
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

  if (loading) {
    return <div>Активация доступа...</div>;
  }

  return (
    <div className="success-page">
      <h1>🎉 Оплата успешна!</h1>
      {token && (
        <div>
          <p>Ваш токен доступа: <code>{token}</code></p>
          <a href={`/?token=${token}`}>Войти в чат</a>
        </div>
      )}
    </div>
  );
}
```

---

### Вариант 2: Backend интеграция (Node.js)

Если у вас есть backend на **chat-bankrot.ru**:

```javascript
// backend/webhooks/payment.js
const fetch = require('node-fetch');

async function handlePaymentWebhook(req, res) {
  const { email, amount } = req.body;

  try {
    const response = await fetch(
      'https://functions.poehali.dev/002375a1-91ef-4076-9822-c2342937fb42?action=register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'bankrot_combo_secret_2025'
        },
        body: JSON.stringify({ email, amount })
      }
    );

    const data = await response.json();

    if (data.success) {
      // Токен создан успешно
      const { token, chat_url, expires_at } = data;

      // Отправьте email пользователю
      await sendTokenEmail(email, token, chat_url, expires_at);

      res.status(200).json({ success: true, token });
    } else {
      res.status(400).json({ success: false, error: data.error });
    }
  } catch (error) {
    console.error('Token registration error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

module.exports = { handlePaymentWebhook };
```

---

## Проверка токена на входе

После получения токена, пользователь может войти на **chat-bankrot.ru** используя токен.

### API для проверки токена

**URL:** `https://functions.poehali.dev/c499486b-a97c-4ff5-8905-0ccd7fddcf9d?chat_token={TOKEN}`

**Метод:** GET

**Ответ при валидном токене (200):**
```json
{
  "valid": true,
  "user_id": 5,
  "email": "customer@example.com",
  "full_name": "Иван Иванов",
  "product_type": "combo",
  "expires_at": "2026-01-01T11:20:00",
  "created_at": "2025-12-02T11:20:00"
}
```

**Ответ при невалидном токене (404):**
```json
{
  "error": "Token not found",
  "valid": false
}
```

---

### Пример компонента входа

```tsx
// src/pages/ChatLogin.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChatLogin() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://functions.poehali.dev/c499486b-a97c-4ff5-8905-0ccd7fddcf9d?chat_token=${encodeURIComponent(token)}`
      );

      const data = await response.json();

      if (data.valid) {
        // Сохраните данные в localStorage
        localStorage.setItem('chat_user', JSON.stringify(data));
        navigate('/chat');
      } else {
        alert('Неверный токен или срок действия истёк');
      }
    } catch (error) {
      alert('Ошибка при проверке токена');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Вход в чат</h1>
      <input
        type="text"
        placeholder="Введите ваш токен доступа"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Проверка...' : 'Войти'}
      </button>
    </div>
  );
}
```

---

## Автоматический вход по токену из URL

Если пользователь переходит по ссылке с токеном (`https://chat-bankrot.ru/?token=XK9mP2vRnQ...`):

```tsx
// src/App.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function App() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Проверяем токен
      fetch(`https://functions.poehali.dev/c499486b-a97c-4ff5-8905-0ccd7fddcf9d?chat_token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            localStorage.setItem('chat_user', JSON.stringify(data));
            localStorage.setItem('chat_token', token);
            navigate('/chat');
          }
        });
    }
  }, [searchParams, navigate]);

  return <div>...</div>;
}
```

---

## Тестирование

Используйте curl для тестирования API:

```bash
# Генерация токена
curl -X POST https://functions.poehali.dev/002375a1-91ef-4076-9822-c2342937fb42?action=register \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: bankrot_combo_secret_2025" \
  -d '{"email": "test@example.com", "amount": 4999}'

# Проверка токена
curl "https://functions.poehali.dev/c499486b-a97c-4ff5-8905-0ccd7fddcf9d?chat_token=YOUR_TOKEN_HERE"
```

---

## База данных токенов

Все токены сохраняются в таблице `chat_tokens`:

```sql
SELECT * FROM chat_tokens WHERE email = 'customer@example.com' ORDER BY created_at DESC;
```

Структура таблицы:
- `id` - ID записи
- `user_id` - ID пользователя
- `email` - Email пользователя
- `token` - Токен доступа
- `product_type` - Тип продукта (chat/combo)
- `created_at` - Дата создания
- `expires_at` - Дата истечения (30 дней)
- `is_active` - Статус активности
- `last_used_at` - Последнее использование

---

## Безопасность

⚠️ **ВАЖНО:**
1. API ключ `bankrot_combo_secret_2025` должен храниться в `.env` файле
2. Никогда не коммитьте API ключ в Git
3. Используйте HTTPS для всех запросов
4. Проверяйте `expires_at` при входе пользователя
5. Логируйте все попытки входа для безопасности

---

## Поддержка

По вопросам интеграции: @crashbusiness (Telegram)
