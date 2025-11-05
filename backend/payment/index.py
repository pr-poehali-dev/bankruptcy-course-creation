'''
Business: Payment API - create payments via YooKassa, handle webhooks
Args: event with httpMethod, body, headers; context with request_id
Returns: Payment creation response or webhook processing status
'''

import json
import os
import base64
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
from datetime import datetime, timedelta
import uuid

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
    
    headers_out = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        params = event.get('queryStringParameters') or {}
        action = params.get('action', 'create')
        
        if action == 'create':
            return create_payment(event, headers_out)
        elif action == 'webhook':
            return handle_webhook(event, headers_out)
        elif action == 'status':
            return check_payment_status(event, headers_out)
        
        return {
            'statusCode': 400,
            'headers': headers_out,
            'body': json.dumps({'error': 'Invalid action'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers_out,
            'body': json.dumps({'error': str(e)})
        }

def create_payment(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    user_id = body_data.get('user_id')
    amount = body_data.get('amount', 2999)
    email = body_data.get('email', '')
    return_url = body_data.get('return_url', '')
    
    if not user_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'user_id is required'})
        }
    
    shop_id = os.environ.get('YUKASSA_SHOP_ID')
    secret_key = os.environ.get('YUKASSA_SECRET_KEY')
    
    if not shop_id or not secret_key:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Payment credentials not configured'})
        }
    
    idempotence_key = str(uuid.uuid4())
    
    auth_string = f"{shop_id}:{secret_key}"
    auth_encoded = base64.b64encode(auth_string.encode()).decode()
    
    payment_data = {
        "amount": {
            "value": f"{amount:.2f}",
            "currency": "RUB"
        },
        "confirmation": {
            "type": "redirect",
            "return_url": return_url or "https://your-domain.com/payment/success"
        },
        "capture": True,
        "description": "Оплата курса 'Банкротство физических лиц'",
        "metadata": {
            "user_id": str(user_id)
        }
    }
    
    if email:
        payment_data["receipt"] = {
            "customer": {
                "email": email
            },
            "items": [{
                "description": "Онлайн-курс 'Банкротство физических лиц'",
                "quantity": "1.00",
                "amount": {
                    "value": f"{amount:.2f}",
                    "currency": "RUB"
                },
                "vat_code": 1
            }]
        }
    
    response = requests.post(
        'https://api.yookassa.ru/v3/payments',
        json=payment_data,
        headers={
            'Authorization': f'Basic {auth_encoded}',
            'Idempotence-Key': idempotence_key,
            'Content-Type': 'application/json'
        }
    )
    
    if response.status_code != 200:
        return {
            'statusCode': response.status_code,
            'headers': headers,
            'body': json.dumps({'error': 'Payment creation failed', 'details': response.text})
        }
    
    payment_response = response.json()
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "INSERT INTO user_purchases (user_id, amount, payment_status, payment_id, expires_at) VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP + INTERVAL '6 months') RETURNING id",
                (user_id, amount, 'pending', payment_response['id'])
            )
            purchase_id = cur.fetchone()['id']
            conn.commit()
    finally:
        conn.close()
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'payment_id': payment_response['id'],
            'purchase_id': purchase_id,
            'confirmation_url': payment_response['confirmation']['confirmation_url'],
            'status': payment_response['status']
        })
    }

def handle_webhook(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    
    if body_data.get('event') != 'payment.succeeded':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'status': 'ignored'})
        }
    
    payment = body_data.get('object', {})
    payment_id = payment.get('id')
    user_id = payment.get('metadata', {}).get('user_id')
    
    if not payment_id or not user_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Invalid webhook data'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT id, expires_at FROM user_purchases WHERE user_id = %s AND payment_status = 'completed' AND product_type = 'course' ORDER BY expires_at DESC LIMIT 1",
                (int(user_id),)
            )
            existing_purchase = cur.fetchone()
            
            if existing_purchase and existing_purchase['expires_at']:
                if existing_purchase['expires_at'] > datetime.now():
                    new_expires_at = existing_purchase['expires_at'] + timedelta(days=180)
                else:
                    new_expires_at = datetime.now() + timedelta(days=180)
                
                cur.execute(
                    "UPDATE user_purchases SET payment_status = %s, expires_at = %s WHERE payment_id = %s AND user_id = %s",
                    ('completed', new_expires_at, payment_id, int(user_id))
                )
            else:
                cur.execute(
                    "UPDATE user_purchases SET payment_status = %s WHERE payment_id = %s AND user_id = %s",
                    ('completed', payment_id, int(user_id))
                )
            
            conn.commit()
            
            cur.execute(
                "SELECT u.email, u.full_name FROM users u WHERE u.id = %s",
                (int(user_id),)
            )
            user = cur.fetchone()
    finally:
        conn.close()
    
    if user:
        send_admin_notification(
            user_email=user['email'],
            user_name=user['full_name'],
            amount=float(payment.get('amount', {}).get('value', 0)),
            payment_id=payment_id
        )
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'status': 'processed'})
    }

def check_payment_status(event: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    params = event.get('queryStringParameters') or {}
    payment_id = params.get('payment_id')
    
    if not payment_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'payment_id is required'})
        }
    
    shop_id = os.environ.get('YUKASSA_SHOP_ID')
    secret_key = os.environ.get('YUKASSA_SECRET_KEY')
    
    auth_string = f"{shop_id}:{secret_key}"
    auth_encoded = base64.b64encode(auth_string.encode()).decode()
    
    response = requests.get(
        f'https://api.yookassa.ru/v3/payments/{payment_id}',
        headers={
            'Authorization': f'Basic {auth_encoded}',
            'Content-Type': 'application/json'
        }
    )
    
    if response.status_code != 200:
        return {
            'statusCode': response.status_code,
            'headers': headers,
            'body': json.dumps({'error': 'Failed to check payment status'})
        }
    
    payment_data = response.json()
    
    if payment_data.get('status') == 'succeeded':
        user_id = payment_data.get('metadata', {}).get('user_id')
        if user_id:
            conn = get_db_connection()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        "SELECT id, expires_at FROM user_purchases WHERE user_id = %s AND payment_status = 'completed' AND product_type = 'course' ORDER BY expires_at DESC LIMIT 1",
                        (int(user_id),)
                    )
                    existing_purchase = cur.fetchone()
                    
                    if existing_purchase and existing_purchase['expires_at']:
                        if existing_purchase['expires_at'] > datetime.now():
                            new_expires_at = existing_purchase['expires_at'] + timedelta(days=180)
                        else:
                            new_expires_at = datetime.now() + timedelta(days=180)
                        
                        cur.execute(
                            "UPDATE user_purchases SET payment_status = %s, expires_at = %s WHERE payment_id = %s AND user_id = %s",
                            ('completed', new_expires_at, payment_id, int(user_id))
                        )
                    else:
                        cur.execute(
                            "UPDATE user_purchases SET payment_status = %s WHERE payment_id = %s AND user_id = %s",
                            ('completed', payment_id, int(user_id))
                        )
                    
                    conn.commit()
                    
                    cur.execute(
                        "SELECT u.email, u.full_name FROM users u WHERE u.id = %s",
                        (int(user_id),)
                    )
                    user = cur.fetchone()
            finally:
                conn.close()
            
            if user:
                send_admin_notification(
                    user_email=user['email'],
                    user_name=user['full_name'],
                    amount=float(payment_data.get('amount', {}).get('value', 0)),
                    payment_id=payment_id
                )
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'payment_id': payment_id,
            'status': payment_data.get('status'),
            'paid': payment_data.get('paid', False)
        })
    }

def send_admin_notification(user_email: str, user_name: str, amount: float, payment_id: str):
    admin_notify_url = 'https://functions.poehali.dev/d7308d73-82be-4249-9c4d-bd4ea5a81921'
    
    try:
        requests.post(
            admin_notify_url,
            json={
                'type': 'payment',
                'subject': 'Новая оплата курса',
                'message': f'Клиент {user_name} успешно оплатил курс',
                'data': {
                    'email': user_email,
                    'name': user_name,
                    'amount': amount,
                    'payment_id': payment_id,
                    'timestamp': datetime.now().isoformat()
                }
            },
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
    except Exception as e:
        pass