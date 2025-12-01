-- Добавляем токен от внешнего чата для пользователя melni-v@yandex.ru
INSERT INTO chat_tokens (user_id, email, token, product_type, expires_at, created_at) 
VALUES (1, 'melni-v@yandex.ru', 'aPPUz-Z1mkmqHNQYwJBtz3oozYCDYV5i2uTnlWJl68I', 'combo', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP)
ON CONFLICT (token) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    email = EXCLUDED.email,
    product_type = EXCLUDED.product_type,
    expires_at = EXCLUDED.expires_at;