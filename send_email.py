import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Email credentials from environment
smtp_host = 'smtp.yandex.ru'
smtp_port = 465
smtp_user = 'melni-v@yandex.ru'

# You need to provide SMTP password
smtp_password = input('Введите пароль приложения для Яндекс почты: ')

user_email = 'melni-v@yandex.ru'
user_name = 'Владимир'
password = '123456'

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
    
    print(f'Отправка письма на {user_email}...')
    
    with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
    
    print('✅ Письмо успешно отправлено!')
    print(f'Проверьте почту {user_email}')
    
except Exception as e:
    print(f'❌ Ошибка при отправке: {e}')
