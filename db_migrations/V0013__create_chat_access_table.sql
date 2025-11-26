-- Таблица для отслеживания клиентов с доступом к чату с юристами
CREATE TABLE IF NOT EXISTS chat_access (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    telegram_username VARCHAR(255),
    access_start TIMESTAMP NOT NULL DEFAULT NOW(),
    access_end TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    payment_amount DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Индекс для быстрого поиска активных подписок
CREATE INDEX IF NOT EXISTS idx_chat_access_active ON chat_access(is_active, access_end);

-- Индекс для поиска по email и telegram
CREATE INDEX IF NOT EXISTS idx_chat_access_contacts ON chat_access(client_email, telegram_username);