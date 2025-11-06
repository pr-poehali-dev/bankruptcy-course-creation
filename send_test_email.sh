#!/bin/bash
curl -X POST https://functions.poehali.dev/44b67bea-4c0b-4f2d-833a-f5adc60d9567 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "melni-v@yandex.ru",
    "name": "Владимир",
    "password": "12341234"
  }'
echo ""
echo "Письмо отправлено! Проверьте почту melni-v@yandex.ru"
