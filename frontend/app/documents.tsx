import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import Header from "../components/Header";
import { showAlert, showConfirm } from "../utils/alerts";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Интерфейс для документа
interface Document {
  id: number;
  title: string;
  content: string;
  collaborators: Collaborator[];
}

// Интерфейс для коллаборатора
interface Collaborator {
  id: number;
  user: string;
  role: string;
}

// Вспомогательная функция для получения токена с учетом платформы
const getToken = async () => {
  if (Platform.OS === 'web') {
    // Для веб используем localStorage
    return localStorage.getItem('accessToken');
  } else {
    // Для нативных платформ используем SecureStore
    return await SecureStore.getItemAsync('accessToken');
  }
};

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = await getToken();
        if (!token) {
          setError("Не авторизован");
          showAlert("Ошибка", "Не авторизован. Пожалуйста, войдите снова.", () => {
            router.push("/login");
          });
          return;
        }

        console.log("Fetching documents with token:", token.substring(0, 10) + "...");
        
        const response = await axios.get<Document[]>("http://127.0.0.1:8000/api/documents/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        console.log("Fetch documents response:", response.data);
        setDocuments(response.data);
      } catch (error: any) {
        console.error("Fetch documents error:", error.response?.data || error.message);
        setError(error.response?.data?.detail || "Не удалось загрузить документы");
        
        // Проверяем, не устарел ли токен
        if (error.response?.status === 401) {
          showAlert("Ошибка", "Сессия истекла. Пожалуйста, войдите снова.", () => {
            router.push("/login");
          });
        } else {
          showAlert("Ошибка", "Не удалось загрузить документы. Проверьте соединение с сервером.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDelete = async (id: number) => {
    showConfirm(
      "Подтверждение",
      "Вы уверены, что хотите удалить этот документ?",
      async () => {
        try {
          const token = await getToken();
          if (!token) {
            showAlert("Ошибка", "Не авторизован. Пожалуйста, войдите снова.", () => {
              router.push("/login");
            });
            return;
          }

          await axios.delete(`http://127.0.0.1:8000/api/documents/${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setDocuments(documents.filter((doc) => doc.id !== id));
          showAlert("Успех", "Документ удалён!");
        } catch (error: any) {
          console.error("Delete document error:", error.response?.data || error.message);
          showAlert("Ошибка", "Не удалось удалить документ.");
        }
      }
    );
  };

  const handleDownload = async (id: number, format: 'pdf' | 'docx') => {
    try {
      const token = await getToken();
      if (!token) {
        showAlert("Ошибка", "Не авторизован.");
        return;
      }

      const url = `http://127.0.0.1:8000/api/documents/${id}/download/?format=${format}`;
      console.log('Attempting to download from URL:', url);

      if (Platform.OS === 'web') {
        // Для веб-платформы используем fetch и blob API
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Download response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Download failed with status:', response.status, 'Error:', errorText);
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const blob = await response.blob();
        const fileURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', `document-${id}.${format}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        showAlert("Успех", "Файл скачан!");
      } else {
        // Для мобильных платформ используем expo-file-system
        const fileExtension = format;
        const fileName = `document-${id}.${fileExtension}`;
        const filePath = FileSystem.documentDirectory + fileName;

        const response = await FileSystem.downloadAsync(
          url,
          filePath,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Download response status:', response.status);
        
        if (response.status !== 200) {
          console.error('Download failed with status:', response.status);
          throw new Error('Не удалось скачать файл.');
        }

        await Sharing.shareAsync(filePath);
      }

    } catch (error) {
      console.error('Download error:', error);
      showAlert('Ошибка', 'Не удалось скачать документ.');
    }
  };

  const renderDocument = ({ item }: { item: Document }) => (
    <View style={styles.documentItem}>
      <TouchableOpacity onPress={() => router.push({ pathname: "/edit", params: { id: item.id } })}>
        <Text style={styles.documentTitle}>{item.title}</Text>
        <Text style={styles.documentContent}>
          {item.content.slice(0, 50)}{item.content.length > 50 ? "..." : ""}
        </Text>
        {item.collaborators && item.collaborators.length > 0 && (
          <Text style={styles.collaboratorsInfo}>
            Коллабораторов: {item.collaborators.length}
          </Text>
        )}
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => router.push({ pathname: "/invite", params: { documentId: String(item.id) } })}
        >
          <Text style={styles.actionButtonText}>Поделиться</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.actionButtonText}>Удалить</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.downloadContainer}>
        <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload(item.id, 'pdf')}>
          <Text style={styles.actionButtonText}>Скачать PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload(item.id, 'docx')}>
          <Text style={styles.actionButtonText}>Скачать DOCX</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Мои документы</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/create")}>
        <Text style={styles.buttonText}>Создать документ</Text>
      </TouchableOpacity>
      
      {loading && <Text style={styles.statusText}>Загрузка...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.emptyText}>Документов пока нет.</Text>
          ) : null
        }
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
    marginBottom: 4,
  },
  collaboratorsInfo: {
    color: "#10B981",
    fontSize: 12,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  shareButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  downloadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  downloadButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
  },
  statusText: {
    color: "#10B981",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
});