-- Manual activation for payment 30bfbe3c-000f-5001-8000-19fefe48d483
-- User: v.golosova@ro.ru, Amount: 4999, Product: combo

-- Insert purchase record
INSERT INTO user_purchases (user_id, amount, payment_status, payment_id, product_type, expires_at, purchase_date)
VALUES (
    8, 
    4999, 
    'completed', 
    '30bfbe3c-000f-5001-8000-19fefe48d483', 
    'combo',
    CURRENT_TIMESTAMP + INTERVAL '6 months',
    CURRENT_TIMESTAMP
);

-- Create chat token for 30 days
INSERT INTO chat_tokens (user_id, email, token, product_type, expires_at, created_at)
VALUES (
    8,
    'v.golosova@ro.ru',
    'c7e9f1a3-' || substring(md5(random()::text) from 1 for 8) || '-' || 
    substring(md5(random()::text) from 1 for 4) || '-' || 
    substring(md5(random()::text) from 1 for 4) || '-' || 
    substring(md5(random()::text) from 1 for 12),
    'combo',
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    CURRENT_TIMESTAMP
);
