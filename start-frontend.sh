#!/bin/bash

echo "📱 Запуск TecDoc Frontend..."

# Переходим в папку frontend
cd "$(dirname "$0")/frontend"

# Проверяем, установлены ли зависимости
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm install
else
    echo "✅ Зависимости уже установлены"
fi

# Запускаем Expo
echo "🌟 Запускаем Expo..."
echo ""
echo "Доступные команды:"
echo "  i - запустить iOS симулятор"
echo "  a - запустить Android эмулятор"  
echo "  w - запустить веб-версию"
echo "  r - перезагрузить"
echo "  ? - показать все команды"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

npx expo start
