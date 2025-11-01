'''
Business: Отправка уведомлений в Telegram клиентам с истекающим доступом
Args: event - dict с httpMethod
      context - object с attributes: request_id, function_name
Returns: HTTP response dict с количеством отправленных уведомлений
'''

import json
import os
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request
import urllib.parse

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def get_telegram_chat_id(username: str, bot_token: str) -> Optional[str]:
    username_clean = username.lstrip('@')
    try:
        url = f'https://api.telegram.org/bot{bot_token}/getUpdates'
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            if data.get('ok'):
                for update in data.get('result', []):
                    message = update.get('message', {})
                    from_user = message.get('from', {})
                    if from_user.get('username', '').lower() == username_clean.lower():
                        return str(from_user.get('id'))
    except Exception:
        pass
    return None

def send_telegram_message(chat_id: str, message: str, bot_token: str) -> bool:
    try:
        url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
        data = urllib.parse.urlencode({
            'chat_id': chat_id,
            'text': message,
            'parse_mode': 'HTML'
        }).encode()
        
        req = urllib.request.Request(url, data=data)
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            return result.get('ok', False)
    except Exception:
        return False

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
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return {
            'statusCode': 500,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'TELEGRAM_BOT_TOKEN not configured'})
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        tomorrow = datetime.now() + timedelta(days=1)
        day_after = tomorrow + timedelta(days=1)
        
        cur.execute("""
            SELECT id, client_name, telegram_username, access_end
            FROM chat_access
            WHERE is_active = true 
            AND access_end >= %s 
            AND access_end < %s
            AND telegram_username IS NOT NULL
            AND telegram_username != ''
        """, (tomorrow, day_after))
        
        expiring_clients = cur.fetchall()
        
        notifications_sent = []
        notifications_failed = []
        
        for client in expiring_clients:
            username = client['telegram_username']
            client_name = client['client_name']
            access_end = client['access_end']
            
            message = f"""
🔔 <b>Напоминание о доступе к чату</b>

Здравствуйте, {client_name}!

Ваш доступ к чату с юристами истекает завтра ({access_end.strftime('%d.%m.%Y')}).

Если хотите продлить доступ, свяжитесь с нами.

С уважением,
Валентина Голосова
            """.strip()
            
            chat_id = get_telegram_chat_id(username, bot_token)
            
            if chat_id:
                success = send_telegram_message(chat_id, message, bot_token)
                if success:
                    notifications_sent.append({
                        'id': client['id'],
                        'client_name': client_name,
                        'telegram_username': username
                    })
                else:
                    notifications_failed.append({
                        'id': client['id'],
                        'client_name': client_name,
                        'reason': 'Failed to send message'
                    })
            else:
                notifications_failed.append({
                    'id': client['id'],
                    'client_name': client_name,
                    'reason': 'Chat ID not found. User needs to start bot first'
                })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'total_expiring': len(expiring_clients),
                'notifications_sent': len(notifications_sent),
                'notifications_failed': len(notifications_failed),
                'sent_details': notifications_sent,
                'failed_details': notifications_failed,
                'checked_at': datetime.now().isoformat()
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }
