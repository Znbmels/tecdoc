from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Админ-панель
    # Доступ: http://localhost:8000/admin/
    path('admin/', admin.site.urls),

    # Подключаем маршруты API из приложения api
    # Все маршруты будут начинаться с /api/
    path('api/', include('api.urls')),
]