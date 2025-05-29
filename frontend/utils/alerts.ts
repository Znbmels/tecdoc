import { Platform, Alert } from 'react-native';

/**
 * Кросс-платформенная функция для отображения оповещений.
 * Использует нативный Alert на мобильных устройствах и window.alert на вебе.
 */
export const showAlert = (title: string, message: string, onPress?: () => void) => {
  if (Platform.OS === 'web') {
    // В веб-версии используем обычный alert
    window.alert(`${title}\n${message}`);
    if (onPress) {
      onPress();
    }
  } else {
    // Для нативных платформ используем компонент Alert
    Alert.alert(
      title,
      message,
      [
        { text: 'OK', onPress: onPress },
      ],
      { cancelable: false }
    );
  }
};

/**
 * Кросс-платформенная функция для отображения диалога подтверждения
 */
export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  if (Platform.OS === 'web') {
    // В веб-версии используем window.confirm
    const result = window.confirm(`${title}\n${message}`);
    if (result) {
      onConfirm();
    } else if (onCancel) {
      onCancel();
    }
  } else {
    // Для нативных платформ используем компонент Alert с двумя кнопками
    Alert.alert(
      title,
      message,
      [
        { text: 'Отмена', onPress: onCancel, style: 'cancel' },
        { text: 'OK', onPress: onConfirm },
      ],
      { cancelable: false }
    );
  }
}; 