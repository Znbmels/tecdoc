import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useState } from "react";
import axios from "axios";
import { router } from "expo-router";
import Header from "../components/Header";
import { showAlert } from "../utils/alerts";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Проверка на пустые поля
    if (!email.trim()) {
      showAlert("Ошибка", "Пожалуйста, введите email");
      return;
    }
    
    if (!username.trim()) {
      showAlert("Ошибка", "Пожалуйста, введите имя пользователя");
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
    
    // Проверка длины пароля
    if (password.length < 6) {
      showAlert("Ошибка", "Пароль должен содержать не менее 6 символов");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Sending register request to http://127.0.0.1:8000/api/register/");
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        email,
        username,
        password,
      });
      console.log("Register response:", response.data);
      if (response.status === 201) {
        showAlert("Успех", "Регистрация прошла успешно! Теперь войдите.", () => {
          router.push("/login");
        });
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error: any) {
      console.error("Register error:", error.response?.data || error.message);
      
      // Определяем конкретную ошибку на основе ответа сервера
      let errorMessage = "Не удалось зарегистрироваться. Проверьте соединение или обратитесь к администратору.";
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          if (data.email) {
            if (data.email.includes("already exists")) {
              errorMessage = "Пользователь с таким email уже существует.";
            } else {
              errorMessage = `Ошибка email: ${data.email}`;
            }
          } else if (data.username) {
            if (data.username.includes("already exists")) {
              errorMessage = "Пользователь с таким именем уже существует.";
            } else {
              errorMessage = `Ошибка имени пользователя: ${data.username}`;
            }
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

  const handleLoginRedirect = () => {
    console.log("Navigating to /login from register page");
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Регистрация</Text>
      
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
        placeholder="Имя пользователя"
        placeholderTextColor="#9CA3AF"
        value={username}
        onChangeText={setUsername}
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
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={handleLoginRedirect}>
        <Text style={styles.linkText}>Уже есть аккаунт? Войдите</Text>
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