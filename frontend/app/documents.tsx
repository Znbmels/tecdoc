import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import Header from "../components/Header";

export default function Documents() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) {
          Alert.alert("Ошибка", "Не авторизован. Пожалуйста, войдите снова.");
          router.push("/login");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/documents/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Fetch documents response:", response.data);
        setDocuments(response.data);
      } catch (error) {
        console.log("Fetch documents error:", error.response?.data);
        Alert.alert("Ошибка", "Не удалось загрузить документы.");
      }
    };

    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Ошибка", "Не авторизован. Пожалуйста, войдите снова.");
        router.push("/login");
        return;
      }

      await axios.delete(`http://localhost:8000/api/documents/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setDocuments(documents.filter((doc) => doc.id !== id));
      Alert.alert("Успех", "Документ удалён!");
    } catch (error) {
      console.log("Delete document error:", error.response?.data);
      Alert.alert("Ошибка", "Не удалось удалить документ.");
    }
  };

  const renderDocument = ({ item }) => (
    <View style={styles.documentItem}>
      <TouchableOpacity onPress={() => router.push({ pathname: "/edit", params: { id: item.id } })}>
        <Text style={styles.documentTitle}>{item.title}</Text>
        <Text style={styles.documentContent}>{item.content.slice(0, 50)}...</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteButtonText}>Удалить</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Мои документы</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/create")}>
        <Text style={styles.buttonText}>Создать документ</Text>
      </TouchableOpacity>
      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Документов пока нет.</Text>}
      />
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
  documentItem: {
    backgroundColor: "#374151",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentTitle: {
    color: "#D1D5DB",
    fontSize: 16,
    fontWeight: "bold",
  },
  documentContent: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
  },
});