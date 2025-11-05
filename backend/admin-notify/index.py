import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Отправка email уведомлений администратору о событиях на сайте
    Args: event - dict с httpMethod, body (type, subject, message, data)
          context - объект с request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'POST')
    
    # CORS OPTIONS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Получаем данные
    body_data = json.loads(event.get('body', '{}'))
    notification_type = body_data.get('type', 'general')
    subject = body_data.get('subject', 'Уведомление с сайта')
    message = body_data.get('message', '')
    data = body_data.get('data', {})
    
    # Получаем SMTP настройки из переменных окружения
    admin_email = os.environ.get('ADMIN_EMAIL')
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    if not all([admin_email, smtp_host, smtp_user, smtp_password]):
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'SMTP configuration missing'})
        }
    
    # Формируем HTML письмо
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                    {subject}
                </h2>
                <p style="font-size: 16px;">{message}</p>
                
                {f'<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;"><h3 style="margin-top: 0;">Детали:</h3><pre style="white-space: pre-wrap; word-wrap: break-word;">{json.dumps(data, indent=2, ensure_ascii=False)}</pre></div>' if data else ''}
                
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #666;">
                    Это автоматическое уведомление с сайта банкротства<br>
                    Тип события: {notification_type}
                </p>
            </div>
        </body>
    </html>
    """
    
    # Создаем письмо
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = smtp_user
    msg['To'] = admin_email
    
    html_part = MIMEText(html_body, 'html', 'utf-8')
    msg.attach(html_part)
    
    # Отправляем через SMTP
    try:
        if smtp_port == 465:
            # SSL
            server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10)
        else:
            # TLS (порт 587)
            server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
            server.ehlo()
            server.starttls()
            server.ehlo()
        
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'message': 'Email sent successfully'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Failed to send email: {str(e)}'})
        }