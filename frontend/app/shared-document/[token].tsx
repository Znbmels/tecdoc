import { View, Text, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import Header from "../../components/Header";
import { showAlert } from "../../utils/alerts";
import { API_BASE_URL } from "../../utils/apiConfig";

interface Document {
  id: number;
  title: string;
  content: string;
}

export default function SharedDocument() {
  const { token } = useLocalSearchParams();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedDocument = async () => {
      if (!token) {
        setError("Токен не найден.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/shared-document/${token}/`);
        setDocument(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Не удалось загрузить документ.");
        showAlert("Ошибка", "Не удалось загрузить документ. Возможно, ссылка недействительна.");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedDocument();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Загрузка документа...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      {document ? (
        <View style={styles.documentContainer}>
          <Text style={styles.title}>{document.title}</Text>
          <Text style={styles.content}>{document.content}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>Документ не найден.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2937",
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F2937",
  },
  documentContainer: {
    backgroundColor: "#374151",
    padding: 16,
    borderRadius: 8,
  },
  title: {
    color: "#D1D5DB",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    color: "#D1D5DB",
    fontSize: 16,
    lineHeight: 24,
  },
  loadingText: {
    marginTop: 10,
    color: "#D1D5DB",
    fontSize: 16,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 18,
    textAlign: "center",
  },
}); 