import json
import base64
import uuid
import os
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
import boto3
from botocore.exceptions import ClientError

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Upload files (PDF, videos, documents) to S3 storage and save metadata to database
    Args: event with httpMethod, body, headers; context with request_id
    Returns: HTTP response with file URL and metadata
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    auth_token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not auth_token or auth_token != 'admin-secret-2024':
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        file_name = body_data.get('fileName')
        file_content = body_data.get('fileContent')
        file_type = body_data.get('fileType', 'application/pdf')
        title = body_data.get('title', file_name)
        description = body_data.get('description', '')
        
        if not file_name or not file_content:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'fileName and fileContent are required'})
            }
        
        file_data = base64.b64decode(file_content)
        
        s3_client = boto3.client('s3')
        bucket_name = 'poehalidev-user-files'
        file_key = f'files/{uuid.uuid4()}-{file_name}'
        
        s3_client.put_object(
            Bucket=bucket_name,
            Key=file_key,
            Body=file_data,
            ContentType=file_type
        )
        
        file_url = f'https://storage.yandexcloud.net/{bucket_name}/{file_key}'
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute(
            "INSERT INTO course_files (title, description, file_name, file_url, file_type, file_size, uploaded_at) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id, title, file_url, uploaded_at",
            (title, description, file_name, file_url, file_type, len(file_data), datetime.utcnow())
        )
        
        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'id': result['id'],
                'title': result['title'],
                'url': result['file_url'],
                'uploadedAt': result['uploaded_at'].isoformat()
            })
        }
    
    if method == 'GET':
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute(
            "SELECT id, title, description, file_name, file_url, file_type, file_size, uploaded_at FROM course_files ORDER BY uploaded_at DESC"
        )
        
        files = cur.fetchall()
        cur.close()
        conn.close()
        
        files_list = []
        for f in files:
            files_list.append({
                'id': f['id'],
                'title': f['title'],
                'description': f['description'],
                'fileName': f['file_name'],
                'fileUrl': f['file_url'],
                'fileType': f['file_type'],
                'fileSize': f['file_size'],
                'uploadedAt': f['uploaded_at'].isoformat()
            })
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'files': files_list})
        }
    
    if method == 'DELETE':
        query_params = event.get('queryStringParameters', {})
        file_id = query_params.get('id')
        
        if not file_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'id parameter is required'})
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("DELETE FROM course_files WHERE id = %s RETURNING id", (file_id,))
        result = cur.fetchone()
        
        conn.commit()
        cur.close()
        conn.close()
        
        if not result:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'File not found'})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
