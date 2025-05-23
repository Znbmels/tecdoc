import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import axios from "axios";
import { router } from "expo-router";
import Header from "../components/Header";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      console.log("Sending register request to http://192.168.6.169:8000/api/register/");
      const response = await axios.post("http://192.168.6.169:8000/api/register/", {
        email,
        username,
        password,
      });
      console.log("Register response:", response.data);
      if (response.status === 201) {
        Alert.alert("Успех", "Регистрация прошла успешно! Теперь войдите.");
        router.push("/login");
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      Alert.alert("Ошибка", "Не удалось зарегистрироваться. Проверьте соединение или обратитесь к администратору.");
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
      />
      
      <TextInput
        style={styles.input}
        placeholder="Имя пользователя"
        placeholderTextColor="#9CA3AF"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        placeholderTextColor="#9CA3AF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Зарегистрироваться</Text>
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
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
  link: { marginTop: 16, alignItems: "center" },
  linkText: { color: "#10B981", textAlign: "center", fontSize: 14 },
});