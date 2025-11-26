'''
Business: Temporary function to create/update admin user with correct password hash
Args: event with httpMethod; context with request_id
Returns: Success message
'''

import json
import os
import bcrypt
from typing import Dict, Any
import psycopg2

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
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        email = 'melni-v@yandex.ru'
        password = 'Lizik110808'
        full_name = 'Владимир'
        
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO users (email, password_hash, full_name, is_admin)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (email) 
            DO UPDATE SET password_hash = EXCLUDED.password_hash, is_admin = true
            RETURNING id, email, full_name, is_admin
        """, (email, password_hash, full_name, True))
        
        user = cur.fetchone()
        conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'message': f'User created/updated: {email}',
                'user_id': user[0]
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }
