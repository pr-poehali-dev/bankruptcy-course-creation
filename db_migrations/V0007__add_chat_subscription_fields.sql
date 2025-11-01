-- Добавляем поля для связи покупки с доступом к чату
ALTER TABLE t_p19166386_bankruptcy_course_cr.user_purchases 
ADD COLUMN IF NOT EXISTS product_type VARCHAR(50) DEFAULT 'course',
ADD COLUMN IF NOT EXISTS chat_access_id INTEGER REFERENCES t_p19166386_bankruptcy_course_cr.chat_access(id);

-- Добавляем индекс для быстрого поиска активных подписок с чатом
CREATE INDEX IF NOT EXISTS idx_user_purchases_chat_access 
ON t_p19166386_bankruptcy_course_cr.user_purchases(user_id, product_type, payment_status) 
WHERE product_type IN ('chat', 'combo');

-- Добавляем поле user_id в chat_access для связи с пользователем
ALTER TABLE t_p19166386_bankruptcy_course_cr.chat_access
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES t_p19166386_bankruptcy_course_cr.users(id);

-- Создаём индекс для быстрой проверки активного доступа
CREATE INDEX IF NOT EXISTS idx_chat_access_active 
ON t_p19166386_bankruptcy_course_cr.chat_access(user_id, is_active, access_end) 
WHERE is_active = true;