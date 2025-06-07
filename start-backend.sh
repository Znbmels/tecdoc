#!/bin/bash

echo "🚀 Запуск TecDoc Backend..."

# Переходим в папку backend
cd "$(dirname "$0")/backend"

# Проверяем, существует ли виртуальное окружение
if [ ! -d "venv" ]; then
    echo "❌ Виртуальное окружение не найдено!"
    echo "Создаем новое виртуальное окружение..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    echo "✅ Виртуальное окружение найдено"
fi

# Активируем виртуальное окружение
echo "🔧 Активируем виртуальное окружение..."
source venv/bin/activate

# Проверяем зависимости
echo "📦 Проверяем зависимости..."
pip install -r requirements.txt

# Применяем миграции
echo "🗄️ Применяем миграции базы данных..."
python manage.py migrate

# Запускаем сервер
echo "🌟 Запускаем Django сервер на порту 8001..."
echo "Backend будет доступен по адресу: http://127.0.0.1:8001"
echo "Для остановки нажмите Ctrl+C"
echo ""
python manage.py runserver 8001
