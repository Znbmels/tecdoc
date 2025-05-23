
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-!xnn5pl0t$(rh%=kqe*7hp1(6jwkwvh_jd5%l+o!-9%-7y62xa'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition
# Основные настройки
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  # CORS для фронтенда
    'rest_framework',  # Если используешь DRF
    'rest_framework.authtoken',  # Для токенов
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Добавляем CORS первым
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Настройки базы данных PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': 'localhost',
        'NAME': 'document',
        'USER': 'postgres',
        'PASSWORD': 'admin',
        'PORT': '5432',
    }
}

# Настройки REST Framework и JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',  # Разрешаем доступ всем по умолчанию
    ),
}

# Настройки CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",  # Порт Expo для фронтенда
]

# Настройки SimpleJWT
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# Настройки для отправки email (заглушка, нужно настроить SMTP для реальной отправки)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # Для тестов в консоль
EMAIL_HOST_USER = 'znbmels@gmail.com'

# Кастомная модель пользователя
AUTH_USER_MODEL = 'api.User'

# Локализация (для дат и времени)
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # можно добавить путь к шаблонам
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

STATIC_URL = '/static/'
ROOT_URLCONF = 'backend.urls'
