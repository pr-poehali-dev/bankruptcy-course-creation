// Temporary script to send test email
fetch('https://functions.poehali.dev/44b67bea-4c0b-4f2d-833a-f5adc60d9567', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'melni-v@yandex.ru',
    name: 'Владимир',
    password: '123456'
  })
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
