'''
Business: Send test email with chat credentials
Args: event with httpMethod, body; context with request_id
Returns: Status of email sending
'''

import json
import os
from typing import Dict, Any
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
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
    
    headers_out = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': headers_out,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_str = event.get('body', '{}')
    if not body_str or body_str.strip() == '':
        body_str = '{}'
    body_data = json.loads(body_str)
    user_email = body_data.get('email')
    user_name = body_data.get('name', 'Пользователь')
    password = body_data.get('password', '123456')
    
    if not user_email:
        return {
            'statusCode': 400,
            'headers': headers_out,
            'body': json.dumps({'error': 'Email required'})
        }
    
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', 465))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    if not all([smtp_host, smtp_user, smtp_password]):
        return {
            'statusCode': 500,
            'headers': headers_out,
            'body': json.dumps({'error': 'SMTP not configured'})
        }
    
    subject = 'Доступ к чату с юристами — bankrot-kurs.online'
    
    html_body = f'''
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Добро пожаловать!</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Здравствуйте, <strong>{user_name}</strong>!</p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">Спасибо за оплату! Ваш доступ к чату с юристами активирован на <strong>30 дней</strong>.</p>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
            <h2 style="margin-top: 0; color: #667eea; font-size: 20px;">📝 Ваши данные для входа:</h2>
            
            <p style="margin: 15px 0;"><strong>Сайт:</strong> <a href="https://bankrot-kurs.online" style="color: #667eea; text-decoration: none;">bankrot-kurs.online</a></p>
            
            <p style="margin: 15px 0;"><strong>Email:</strong> <span style="background: #f0f0f0; padding: 5px 10px; border-radius: 4px; font-family: monospace;">{user_email}</span></p>
            
            <p style="margin: 15px 0;"><strong>Пароль:</strong> <span style="background: #fff3cd; padding: 5px 10px; border-radius: 4px; font-family: monospace; font-weight: bold;">{password}</span></p>
        </div>
        
        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #0066cc; font-size: 18px;">💬 Как начать:</h3>
            <ol style="margin: 10px 0; padding-left: 20px;">
                <li style="margin: 8px 0;">Перейдите на сайт <a href="https://bankrot-kurs.online" style="color: #0066cc;">bankrot-kurs.online</a></li>
                <li style="margin: 8px 0;">Войдите используя ваш email и пароль</li>
                <li style="margin: 8px 0;">Задавайте вопросы юристам в чате</li>
            </ol>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <strong>Важно:</strong> Сохраните это письмо — в нём содержится пароль для входа в систему.
        </p>
        
        <p style="font-size: 14px; color: #666; margin-top: 15px;">
            Если у вас возникнут вопросы, просто ответьте на это письмо.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://bankrot-kurs.online" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Войти в чат</a>
        </div>
        
        <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #999;">
            С уважением,<br>
            <strong>Команда bankrot-kurs.online</strong>
        </p>
    </div>
</body>
</html>
    '''
    
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = smtp_user
        msg['To'] = user_email
        
        msg.attach(MIMEText(html_body, 'html', 'utf-8'))
        
        with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        return {
            'statusCode': 200,
            'headers': headers_out,
            'body': json.dumps({'status': 'sent', 'email': user_email})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers_out,
            'body': json.dumps({'error': str(e)})
        }