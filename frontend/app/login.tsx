import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import Header from "../components/Header";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Sending login request to http://127.0.0.1:8000//api/token/");
      const response = await axios.post("http://127.0.0.1:8000//api/token/", {
        email,
        password,
      });
      console.log("Login response:", response.data);
      await SecureStore.setItemAsync("token", response.data.access);
      Alert.alert("Успех", "Вы успешно вошли!");
      router.push("/documents");
    } catch (error) {
      console.log("Login error:", error.response?.data);
      Alert.alert("Ошибка", "Не удалось войти. Проверьте email и пароль.");
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
      />
      
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        placeholderTextColor="#9CA3AF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Войти</Text>
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
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
  link: { marginTop: 16, alignItems: "center" },
  linkText: { color: "#10B981", textAlign: "center", fontSize: 14 },
});