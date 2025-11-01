'''
Business: Автоматическая проверка и деактивация клиентов с истекшим доступом
Args: event - dict с httpMethod
      context - object с attributes: request_id, function_name
Returns: HTTP response dict с количеством деактивированных клиентов
'''

import json
import os
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

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
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, client_name, telegram_username, access_end
            FROM chat_access
            WHERE is_active = true AND access_end <= NOW()
        """)
        
        expired_clients = cur.fetchall()
        expired_count = len(expired_clients)
        
        if expired_count > 0:
            cur.execute("""
                UPDATE chat_access
                SET is_active = false, updated_at = NOW()
                WHERE is_active = true AND access_end <= NOW()
            """)
            conn.commit()
        
        cur.close()
        conn.close()
        
        expired_list = []
        for client in expired_clients:
            expired_list.append({
                'id': client['id'],
                'client_name': client['client_name'],
                'telegram_username': client['telegram_username'],
                'access_end': client['access_end'].isoformat()
            })
        
        return {
            'statusCode': 200,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'deactivated_count': expired_count,
                'deactivated_clients': expired_list,
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
