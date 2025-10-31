'''
Business: User authentication API - registration, login, token validation
Args: event with httpMethod, body, headers; context with request_id
Returns: JWT tokens for authenticated users or error messages
'''

import json
import os
import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

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
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'register':
                return register_user(body_data, headers)
            elif action == 'login':
                return login_user(body_data, headers)
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid action'})
                }
        
        elif method == 'GET':
            auth_token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
            if not auth_token:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'No token provided'})
                }
            
            return validate_token(auth_token, headers)
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def register_user(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')
    
    if not email or not password or not full_name:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Email, password and full_name are required'})
        }
    
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "INSERT INTO users (email, password_hash, full_name) VALUES (%s, %s, %s) RETURNING id, email, full_name, is_admin, created_at",
                (email, password_hash, full_name)
            )
            user = cur.fetchone()
            conn.commit()
            
            token = generate_token(dict(user))
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'full_name': user['full_name'],
                        'is_admin': user['is_admin']
                    }
                }, default=str)
            }
    except psycopg2.IntegrityError:
        conn.rollback()
        return {
            'statusCode': 409,
            'headers': headers,
            'body': json.dumps({'error': 'User with this email already exists'})
        }
    finally:
        conn.close()

def login_user(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Email and password are required'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT id, email, password_hash, full_name, is_admin FROM users WHERE email = %s",
                (email,)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid credentials'})
                }
            
            if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid credentials'})
                }
            
            token = generate_token(dict(user))
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'full_name': user['full_name'],
                        'is_admin': user['is_admin']
                    }
                })
            }
    finally:
        conn.close()

def validate_token(token: str, headers: Dict[str, str]) -> Dict[str, Any]:
    try:
        jwt_secret = os.environ.get('JWT_SECRET')
        if not jwt_secret:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'JWT_SECRET not configured'})
            }
        
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'valid': True,
                'user': {
                    'id': payload['id'],
                    'email': payload['email'],
                    'full_name': payload['full_name'],
                    'is_admin': payload['is_admin']
                }
            })
        }
    except jwt.ExpiredSignatureError:
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({'error': 'Token expired'})
        }
    except jwt.InvalidTokenError:
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({'error': 'Invalid token'})
        }

def generate_token(user: Dict[str, Any]) -> str:
    jwt_secret = os.environ['JWT_SECRET']
    
    payload = {
        'id': user['id'],
        'email': user['email'],
        'full_name': user['full_name'],
        'is_admin': user.get('is_admin', False),
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    
    return jwt.encode(payload, jwt_secret, algorithm='HS256')
