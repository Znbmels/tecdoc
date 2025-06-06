import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams, router } from "expo-router";
import Header from "../components/Header";
import { showAlert } from "../utils/alerts";

// Вспомогательная функция для получения токена с учетом платформы
const getToken = async () => {
  if (Platform.OS === 'web') {
    // Для веб-версии используем localStorage
    return localStorage.getItem('accessToken');
  } else {
    // Для нативных платформ используем SecureStore
    return await SecureStore.getItemAsync('accessToken');
  }
};

export default function ShareDocument() {
  const params = useLocalSearchParams();
  console.log('All params received:', params);
  
  // Попробуем получить documentId разными способами
  let documentId = params.documentId || params.id;
  if (Array.isArray(documentId)) {
    documentId = documentId[0];
  }
  
  console.log('Final documentId:', documentId);
  const [email, setEmail] = useState("");

  const handleShare = async () => {
    console.log('Sharing document with ID:', documentId);
    if (!documentId) {
      showAlert("Ошибка", "ID документа не найден. Попробуйте снова.");
      return;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showAlert("Ошибка", "Пожалуйста, введите корректный email");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        showAlert("Ошибка", "Не авторизован. Пожалуйста, войдите снова.", () => {
          router.push("/login");
        });
        return;
      }

      console.log('Sending share request with data:', { document_id: Number(documentId), email });

      const response = await axios.post(
        `http://127.0.0.1:8000/api/share/`,
        { document_id: Number(documentId), email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log('Share response:', response.data);
      showAlert("Успех", "Ссылка для доступа к документу успешно создана и готова к отправке!", () => {
        router.push("/documents");
      });
    } catch (error: any) {
      console.error('Share error:', error.response?.data || error.message);
      let errorMessage = "Не удалось поделиться документом.";
      if (error.response) {
        if (error.response.status === 404) {
          if (error.response.data.error === "User not found") {
            errorMessage = "Пользователь с таким email не найден.";
          } else if (error.response.data.error === "Document not found or you are not the owner") {
            errorMessage = "Документ не найден или вы не являетесь его владельцем.";
          }
        } else if (error.response.status === 401) {
          errorMessage = "Ваша сессия истекла. Пожалуйста, войдите снова.";
          showAlert("Ошибка", errorMessage, () => router.push("/login"));
          return;
        }
      }
      showAlert("Ошибка", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Поделиться документом</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email пользователя"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Text style={styles.buttonText}>Отправить ссылку</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => router.push("/documents")}
      >
        <Text style={styles.linkText}>Назад к документам</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1F2937",
  },
  title: {
    color: "#D1D5DB",
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#374151",
    color: "#D1D5DB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    color: "#10B981",
    textAlign: "center",
    fontSize: 14,
  },
});