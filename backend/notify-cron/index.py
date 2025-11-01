'''
Business: Автоматическая отправка уведомлений клиентам с истекающим доступом (cron задача)
Args: event - dict с httpMethod, context - объект с request_id
Returns: HTTP response dict
'''
import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'TELEGRAM_BOT_TOKEN not configured'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    tomorrow = datetime.now() + timedelta(days=1)
    day_after = tomorrow + timedelta(days=1)
    
    cursor.execute(f"""
        SELECT id, client_name, telegram_username, access_end
        FROM chat_access
        WHERE is_active = true 
        AND access_end >= '{tomorrow.strftime('%Y-%m-%d %H:%M:%S')}' 
        AND access_end < '{day_after.strftime('%Y-%m-%d %H:%M:%S')}'
        AND telegram_username IS NOT NULL
        AND telegram_username != ''
    """)
    
    clients = cursor.fetchall()
    cursor.close()
    conn.close()
    
    notifications_sent = 0
    notifications_failed = 0
    
    for client in clients:
        username = client['telegram_username'].lstrip('@')
        client_name = client['client_name']
        access_date = client['access_end'].strftime('%d.%m.%Y')
        
        message = f"🔔 <b>Напоминание о продлении доступа</b>\n\n"
        message += f"Здравствуйте, {client_name}!\n\n"
        message += f"Ваш доступ к чату юристов истекает <b>{access_date}</b>.\n\n"
        message += f"Пожалуйста, свяжитесь с нами для продления доступа."
        
        telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            'chat_id': f"@{username}",
            'text': message,
            'parse_mode': 'HTML'
        }
        
        response = requests.post(telegram_url, json=payload, timeout=10)
        
        if response.status_code == 200:
            notifications_sent += 1
        else:
            notifications_failed += 1
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'message': 'Notifications processed',
            'notifications_sent': notifications_sent,
            'notifications_failed': notifications_failed,
            'clients_checked': len(clients),
            'executed_at': datetime.now().isoformat()
        })
    }