import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, StyleSheet, Modal, Platform } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams, router } from "expo-router";
import Header from "../components/Header";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { API_BASE_URL } from "../utils/apiConfig";

// Интерфейсы для типизации
interface Collaborator {
  id: number;
  user: string;
  role: string;
}

interface DocumentData {
  title: string;
  content: string;
  collaborators: Collaborator[];
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

export default function EditDocument() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const token = await getToken();
        if (!token) {
          Alert.alert("Ошибка", "Не авторизован. Пожалуйста, войдите снова.");
          router.push("/login");
          return;
        }

        const response = await axios.get<DocumentData>(`${API_BASE_URL}/api/documents/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Fetch document response:", response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
        setCollaborators(response.data.collaborators || []);
      } catch (error: any) {
        console.log("Fetch document error:", error.response?.data);
        Alert.alert("Ошибка", "Не удалось загрузить документ.");
      }
    };

    if (id) fetchDocument();
  }, [id]);

  const handleSave = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Ошибка", "Не авторизован. Пожалуйста, войдите снова.");
        router.push("/login");
        return;
      }

      await axios.put(
        `${API_BASE_URL}/api/documents/${id}/`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Save document response:", { title, content });
      Alert.alert("Успех", "Документ сохранён!");
      router.push("/documents");
    } catch (error: any) {
      console.log("Save document error:", error.response?.data);
      Alert.alert("Ошибка", "Не удалось сохранить документ.");
    }
  };

  const downloadDocument = async () => {
    try {
      if (Platform.OS === 'web') {
        // Для веб-версии создаем скачиваемый файл через Blob
        const fileName = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
        const contentToSave = `Заголовок: ${title}\n\n${content}`;
        
        // Создаем Blob
        const blob = new Blob([contentToSave], { type: 'text/plain' });
        
        // Создаем URL для скачивания
        const url = URL.createObjectURL(blob);
        
        // Создаем невидимую ссылку для скачивания
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        
        // Добавляем в DOM, запускаем скачивание и удаляем
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Освобождаем URL
        URL.revokeObjectURL(url);
        
        console.log("Файл скачан:", fileName);
      } else {
        // Для нативных приложений используем стандартную логику с FileSystem
        const fileName = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        const contentToSave = `Заголовок: ${title}\n\n${content}`;
        await FileSystem.writeAsStringAsync(fileUri, contentToSave, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
          Alert.alert("Ошибка", "Функция шаринга недоступна на этом устройстве.");
          return;
        }

        await Sharing.shareAsync(fileUri, {
          mimeType: "text/plain",
          dialogTitle: "Сохранить или поделиться документом",
        });

        console.log("Файл сохранён по пути:", fileUri);
      }
      
      Alert.alert("Успех", "Документ скачан!");
    } catch (error: any) {
      console.log("Download error:", error);
      Alert.alert("Ошибка", "Не удалось скачать документ.");
    }
  };

  const renderCollaborator = ({ item }: { item: Collaborator }) => (
    <View style={styles.collaboratorItem}>
      <Text style={styles.collaboratorText}>{item.user} ({item.role === "view" ? "Просмотр" : "Редактирование"})</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Редактировать документ</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Заголовок"
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="Содержимое"
        placeholderTextColor="#9CA3AF"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={10}
        scrollEnabled={true}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Сохранить документ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({ pathname: "/invite", params: { id } })}
      >
        <Text style={styles.buttonText}>Пригласить коллаборатора</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Коллабораторы</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={downloadDocument}>
        <Text style={styles.buttonText}>Скачать документ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => router.push("/documents")}>
        <Text style={styles.linkText}>Назад к документам</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Коллабораторы</Text>
            <FlatList
              data={collaborators}
              renderItem={renderCollaborator}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text style={styles.emptyText}>Коллабораторов пока нет.</Text>}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  contentInput: {
    height: 200,
    textAlignVertical: "top",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1F2937",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    maxHeight: "60%",
  },
  modalTitle: {
    color: "#D1D5DB",
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  collaboratorItem: {
    backgroundColor: "#374151",
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  collaboratorText: {
    color: "#D1D5DB",
    fontSize: 14,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});