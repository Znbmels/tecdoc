import { Platform } from 'react-native';
import { API_BASE_URL } from './apiConfig';

/**
 * Вспомогательная функция для отладки текущего состояния приложения
 * Выводит в консоль информацию о токенах, платформе и других параметрах
 */
export const debugAppState = async () => {
  console.log('============ Отладочная информация ============');
  console.log('Платформа:', Platform.OS);
  
  if (Platform.OS === 'web') {
    // Выводим токены из localStorage для веб
    console.log('accessToken в localStorage:', localStorage.getItem('accessToken'));
    console.log('refreshToken в localStorage:', localStorage.getItem('refreshToken'));
  } else {
    console.log('Токены хранятся в SecureStore (не выводятся в консоль из соображений безопасности)');
  }
  
  // Информация о URL и окружении
  console.log('URL:', window.location.href);
  console.log('User Agent:', window.navigator.userAgent);
  
  // Собираем дополнительную информацию
  try {
    const response = await fetch(`${API_BASE_URL}/api/documents/`);
    console.log('Статус запроса к API /documents/:', response.status);
    console.log('Заголовки ответа:', response.headers);
  } catch (error) {
    console.log('Ошибка при попытке соединения с API:', error);
  }
  
  console.log('============================================');
}; 