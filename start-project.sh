#!/bin/bash

echo "🎯 TecDoc - Система управления документами"
echo "=========================================="
echo ""
echo "Выберите, что запустить:"
echo "1) Backend (Django API)"
echo "2) Frontend (React Native/Expo)"
echo "3) Оба сервиса одновременно"
echo "4) Только проверить статус"
echo ""
read -p "Введите номер (1-4): " choice

case $choice in
    1)
        echo "🚀 Запускаем только Backend..."
        ./start-backend.sh
        ;;
    2)
        echo "📱 Запускаем только Frontend..."
        ./start-frontend.sh
        ;;
    3)
        echo "🚀📱 Запускаем Backend и Frontend..."
        echo "Backend запустится в фоне, Frontend в текущем терминале"
        
        # Запускаем backend в фоне
        ./start-backend.sh &
        BACKEND_PID=$!
        
        # Ждем немного, чтобы backend запустился
        sleep 5
        
        # Запускаем frontend
        ./start-frontend.sh
        
        # Когда frontend остановится, останавливаем backend
        kill $BACKEND_PID 2>/dev/null
        ;;
    4)
        echo "📊 Проверяем статус сервисов..."
        echo ""
        
        # Проверяем backend
        if curl -s http://127.0.0.1:8001/api/documents/ > /dev/null 2>&1; then
            echo "✅ Backend работает (http://127.0.0.1:8001)"
        else
            echo "❌ Backend не запущен"
        fi
        
        # Проверяем frontend (проверяем процесс expo)
        if pgrep -f "expo start" > /dev/null; then
            echo "✅ Frontend (Expo) работает"
        else
            echo "❌ Frontend не запущен"
        fi
        ;;
    *)
        echo "❌ Неверный выбор. Используйте 1, 2, 3 или 4."
        ;;
esac
