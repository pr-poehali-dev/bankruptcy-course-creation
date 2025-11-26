'''
Business: Password reset functionality - request reset link and confirm new password
Args: event with httpMethod (POST), body with email or token+password
Returns: Success message or error
'''

import json
import os
import psycopg2
import bcrypt
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'request':
            return request_reset(body)
        elif action == 'confirm':
            return confirm_reset(body)
        else:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def request_reset(body: Dict[str, Any]) -> Dict[str, Any]:
    email = body.get('email', '').strip().lower()
    
    if not email:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email обязателен'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id, full_name FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if not user:
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Если email существует, письмо отправлено'})
            }
        
        user_id, full_name = user
        reset_token = secrets.token_urlsafe(32)
        expires_at = datetime.now() + timedelta(hours=1)
        
        cursor.execute(
            "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user_id, reset_token, expires_at)
        )
        conn.commit()
        
        send_reset_email(email, full_name, reset_token)
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Письмо с инструкциями отправлено'})
        }
    finally:
        cursor.close()
        conn.close()

def confirm_reset(body: Dict[str, Any]) -> Dict[str, Any]:
    token = body.get('token', '').strip()
    new_password = body.get('password', '').strip()
    
    if not token or not new_password:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Токен и пароль обязательны'})
        }
    
    if len(new_password) < 6:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Пароль должен быть не менее 6 символов'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "SELECT user_id, expires_at FROM password_reset_tokens WHERE token = %s AND used = false",
            (token,)
        )
        result = cursor.fetchone()
        
        if not result:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверный или использованный токен'})
            }
        
        user_id, expires_at = result
        
        if datetime.now() > expires_at:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Токен истек'})
            }
        
        password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        cursor.execute(
            "UPDATE users SET password_hash = %s WHERE id = %s",
            (password_hash, user_id)
        )
        
        cursor.execute(
            "UPDATE password_reset_tokens SET used = true WHERE token = %s",
            (token,)
        )
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Пароль успешно изменен'})
        }
    finally:
        cursor.close()
        conn.close()

def send_reset_email(email: str, name: str, token: str) -> None:
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', 465))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    print(f'SMTP config: host={smtp_host}, port={smtp_port}, user={smtp_user}, password={"*" * len(smtp_password) if smtp_password else None}')
    
    if not all([smtp_host, smtp_user, smtp_password]):
        print('SMTP credentials not configured')
        return
    
    reset_url = f"https://bankrot-kurs.ru/reset-password?token={token}"
    
    html_content = f'''
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Восстановление пароля</h2>
        <p>Здравствуйте, {name}!</p>
        <p>Вы запросили восстановление пароля для вашего аккаунта.</p>
        <p>Перейдите по ссылке ниже, чтобы создать новый пароль:</p>
        <p><a href="{reset_url}" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Восстановить пароль</a></p>
        <p>Ссылка действительна в течение 1 часа.</p>
        <p>Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
        <br>
        <p>С уважением,<br>Команда платформы обучения</p>
      </body>
    </html>
    '''
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Восстановление пароля'
    msg['From'] = smtp_user
    msg['To'] = email
    
    msg.attach(MIMEText(html_content, 'html', 'utf-8'))
    
    try:
        with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
    except Exception as e:
        print(f'Failed to send email: {e}')