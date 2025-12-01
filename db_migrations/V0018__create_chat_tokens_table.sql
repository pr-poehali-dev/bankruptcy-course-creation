-- Create chat_tokens table for storing chat access tokens
CREATE TABLE IF NOT EXISTS t_p19166386_bankruptcy_course_cr.chat_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(100) UNIQUE NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP
);

CREATE INDEX idx_chat_tokens_token ON t_p19166386_bankruptcy_course_cr.chat_tokens(token);
CREATE INDEX idx_chat_tokens_user_id ON t_p19166386_bankruptcy_course_cr.chat_tokens(user_id);
CREATE INDEX idx_chat_tokens_email ON t_p19166386_bankruptcy_course_cr.chat_tokens(email);
CREATE INDEX idx_chat_tokens_expires_at ON t_p19166386_bankruptcy_course_cr.chat_tokens(expires_at);