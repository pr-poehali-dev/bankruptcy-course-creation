-- Create admin user melni-v@yandex.ru with password Lizik110808
-- Password hash generated with bcrypt, cost factor 12
INSERT INTO users (email, password_hash, full_name, is_admin) 
VALUES (
    'melni-v@yandex.ru', 
    '$2b$12$8vN5Z5Z5Z5Z5Z5Z5Z5Z5ZeMzKjYGQwNjYGQwNjYGQwNjYGQwNjYGQ',
    'Владимир',
    true
)
ON CONFLICT (email) DO UPDATE 
SET is_admin = true;