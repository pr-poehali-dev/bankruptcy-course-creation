'''
Business: Resend course credentials email to user
Args: event with user_email in query params
Returns: Success message
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid
import bcrypt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        params = event.get('queryStringParameters') or {}
        user_email = params.get('email', '').strip()
        
        if not user_email:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'email parameter required'})
            }
        
        conn = get_db_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "SELECT id, email, full_name FROM users WHERE email = %s",
                    (user_email,)
                )
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'User not found'})
                    }
                
                temp_password = str(uuid.uuid4())[:8]
                temp_password_hash = bcrypt.hashpw(temp_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                
                cur.execute(
                    "UPDATE users SET password_hash = %s WHERE id = %s",
                    (temp_password_hash, user['id'])
                )
                conn.commit()
                
                send_course_credentials_email(
                    user_email=user['email'],
                    user_name=user['full_name'],
                    password=temp_password
                )
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'message': 'Credentials email sent successfully',
                        'email': user_email,
                        'password_sent': True
                    })
                }
        finally:
            conn.close()
    
    except Exception as e:
        import traceback
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'error': str(e),
                'traceback': traceback.format_exc()
            })
        }

def send_course_credentials_email(user_email: str, user_name: str, password: str):
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', 465))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    print(f"Sending email to {user_email} from {smtp_user}")
    print(f"SMTP: {smtp_host}:{smtp_port}")
    
    if not all([smtp_host, smtp_user, smtp_password]):
        print("SMTP credentials missing!")
        raise Exception("SMTP not configured")
    
    subject = 'Доступ к курсу "Банкротство физических лиц"'
    
    html_body = f'''
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Добро пожаловать на курс!</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Здравствуйте, <strong>{user_name}</strong>!</p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">Спасибо за покупку! Ваш доступ к курсу <strong>"Банкротство физических лиц - самостоятельно"</strong> активирован на <strong>6 месяцев</strong>.</p>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
            <h2 style="margin-top: 0; color: #667eea; font-size: 20px;">📝 Ваши данные для входа:</h2>
            
            <p style="margin: 15px 0;"><strong>Сайт:</strong> <a href="https://bankrot-kurs.ru/login" style="color: #667eea; text-decoration: none;">bankrot-kurs.ru/login</a></p>
            
            <p style="margin: 15px 0;"><strong>Email:</strong> <span style="background: #f0f0f0; padding: 5px 10px; border-radius: 4px; font-family: monospace;">{user_email}</span></p>
            
            <p style="margin: 15px 0;"><strong>Пароль:</strong> <span style="background: #fff3cd; padding: 5px 10px; border-radius: 4px; font-family: monospace; font-weight: bold;">{password}</span></p>
        </div>
        
        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #0066cc; font-size: 18px;">📚 Что вас ждёт в курсе:</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li style="margin: 8px 0;">7 подробных видеомодулей</li>
                <li style="margin: 8px 0;">Все шаблоны документов для подачи</li>
                <li style="margin: 8px 0;">Пошаговые инструкции</li>
                <li style="margin: 8px 0;">Доступ на 6 месяцев</li>
            </ul>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <strong>Важно:</strong> Сохраните это письмо — в нём содержится пароль для входа в личный кабинет.
        </p>
        
        <p style="font-size: 14px; color: #666; margin-top: 15px;">
            Если у вас возникнут вопросы, просто ответьте на это письмо.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://bankrot-kurs.ru/login" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Начать обучение</a>
        </div>
        
        <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #999;">
            С уважением,<br>
            <strong>Валентина Голосова</strong><br>
            Арбитражный управляющий
        </p>
    </div>
</body>
</html>
    '''
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = smtp_user
    msg['To'] = user_email
    
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))
    
    with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        print(f"Email sent successfully to {user_email}")
