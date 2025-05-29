import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import Header from "../components/Header";
import { showAlert } from "../utils/alerts";

// Интерфейс для ответа от API
interface TokenResponse {
  refresh: string;
  access: string;
}

// Константа для API URL (можно вынести в api.js)
const API_URLS = {
  TOKEN: "http://127.0.0.1:8000/api/token/",
};

// Вспомогательная функция для сохранения токенов с учетом платформы
const saveTokens = async (accessToken: string, refreshToken: string) => {
  if (Platform.OS === 'web') {
    // Для веб используем localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  } else {
    // Для нативных платформ используем SecureStore
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  }
};

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    // Проверка на пустые поля
    if (!email.trim()) {
      showAlert("Ошибка", "Пожалуйста, введите email");
      return;
    }
    
    if (!password.trim()) {
      showAlert("Ошибка", "Пожалуйста, введите пароль");
      return;
    }
    
    // Проверка формата email
    if (!/\S+@\S+\.\S+/.test(email)) {
      showAlert("Ошибка", "Пожалуйста, введите корректный email");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Sending login request to", API_URLS.TOKEN);
      const response = await axios.post<TokenResponse>(API_URLS.TOKEN, {
        email,
        password,
      });
      console.log("Login response:", response.data);
      
      // Сохраняем токены с учетом платформы
      await saveTokens(response.data.access, response.data.refresh);
      
      showAlert("Успех", "Вы успешно вошли!", () => {
        router.push("/documents");
      });
    } catch (error: any) {
      console.error("Login error:", error.response?.data?.detail || error.message);
      
      // Определяем конкретную ошибку на основе ответа сервера
      let errorMessage = "Не удалось войти. Проверьте email и пароль.";
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          if (data.detail === "No active account found with the given credentials") {
            errorMessage = "Неверный email или пароль.";
          }
        } else if (status === 400) {
          if (data.email) {
            errorMessage = `Ошибка email: ${data.email}`;
          } else if (data.password) {
            errorMessage = `Ошибка пароля: ${data.password}`;
          }
        }
      }
      
      showAlert("Ошибка", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Вход</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        placeholderTextColor="#9CA3AF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Вход..." : "Войти"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => router.push("/register")}>
        <Text style={styles.linkText}>Нет аккаунта? Зарегистрируйтесь</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#1F2937" },
  title: { color: "#D1D5DB", fontSize: 18, marginBottom: 16, textAlign: "center" },
  input: { backgroundColor: "#374151", color: "#D1D5DB", padding: 12, borderRadius: 8, marginBottom: 16 },
  button: { backgroundColor: "#10B981", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 16 },
  buttonDisabled: { backgroundColor: "#6B7280", opacity: 0.7 },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
  link: { marginTop: 16, alignItems: "center" },
  linkText: { color: "#10B981", textAlign: "center", fontSize: 14 },
});