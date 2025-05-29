import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, Platform } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import Header from "../components/Header";

// Интерфейс для задачи
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
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

export default function CreateDocument() {
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("text"); // Режим: "text" или "todo"
  const [content, setContent] = useState(""); // Для обычного текста
  const [todoItems, setTodoItems] = useState<TodoItem[]>([{ id: Date.now(), text: "", completed: false }]);
  const [category, setCategory] = useState("Работа"); // Значение по умолчанию

  // Добавление новой задачи
  const addTodoItem = () => {
    setTodoItems([...todoItems, { id: Date.now(), text: "", completed: false }]);
  };

  // Обновление текста задачи
  const updateTodoText = (id: number, text: string) => {
    setTodoItems(todoItems.map((item) => (item.id === id ? { ...item, text } : item)));
  };

  // Переключение состояния чекбокса
  const toggleTodoCompleted = (id: number) => {
    setTodoItems(todoItems.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  // Формирование содержимого документа для To-Do List
  useEffect(() => {
    if (mode === "todo") {
      const todoText = todoItems
        .map((item) => `${item.completed ? "[x]" : "[ ]"} ${item.text || "Новая задача"}`)
        .join("\n");
      setContent(`Категория: ${category}\n\nСписок задач:\n${todoText}`);
    }
  }, [todoItems, category, mode]);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Ошибка", "Заголовок обязателен!");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Ошибка", "Не авторизован. Пожалуйста, войдите снова.");
        router.push("/login");
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/documents/",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Create document response:", { title, content });
      Alert.alert("Успех", "Документ создан!");
      router.push("/documents");
    } catch (error: any) {
      console.log("Create document error:", error.response?.data);
      Alert.alert("Ошибка", "Не удалось создать документ.");
    }
  };

  const renderTodoItem = ({ item }: { item: TodoItem }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={() => toggleTodoCompleted(item.id)} style={styles.checkbox}>
        <Text style={styles.checkboxText}>{item.completed ? "✓" : "□"}</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.todoInput}
        placeholder="Введите задачу..."
        placeholderTextColor="#9CA3AF"
        value={item.text}
        onChangeText={(text) => updateTodoText(item.id, text)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Создать документ</Text>

      <TextInput
        style={styles.input}
        placeholder="Заголовок"
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
      />

      {/* Переключатель режимов */}
      <Text style={styles.label}>Тип документа</Text>
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeButton, mode === "text" && styles.modeButtonActive]}
          onPress={() => setMode("text")}
        >
          <Text style={styles.modeText}>Обычный текст</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === "todo" && styles.modeButtonActive]}
          onPress={() => setMode("todo")}
        >
          <Text style={styles.modeText}>Список задач</Text>
        </TouchableOpacity>
      </View>

      {/* Условное отображение в зависимости от режима */}
      {mode === "text" ? (
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
      ) : (
        <>
          {/* Выбор категории с радиокнопками */}
          <Text style={styles.label}>Выберите категорию</Text>
          <View style={styles.radioContainer}>
            {["Работа", "Личное", "Проект"].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.radioButton}
                onPress={() => setCategory(cat)}
              >
                <View style={[styles.radioCircle, category === cat && styles.radioSelected]}>
                  {category === cat && <View style={styles.radioInnerCircle} />}
                </View>
                <Text style={styles.radioText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Список задач */}
          <Text style={styles.label}>Список задач</Text>
          <FlatList
            data={todoItems}
            renderItem={renderTodoItem}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={
              <TouchableOpacity style={styles.addButton} onPress={addTodoItem}>
                <Text style={styles.addButtonText}>Добавить задачу</Text>
              </TouchableOpacity>
            }
          />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Создать документ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => router.push("/documents")}>
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
  contentInput: {
    height: 200,
    textAlignVertical: "top",
  },
  label: {
    color: "#D1D5DB",
    fontSize: 16,
    marginBottom: 8,
  },
  modeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#374151",
    alignItems: "center",
    marginHorizontal: 4,
  },
  modeButtonActive: {
    backgroundColor: "#10B981",
  },
  modeText: {
    color: "#D1D5DB",
    fontSize: 14,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: "#10B981",
  },
  radioInnerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  radioText: {
    color: "#D1D5DB",
    fontSize: 14,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#374151",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    color: "#D1D5DB",
    fontSize: 16,
  },
  todoInput: {
    flex: 1,
    color: "#D1D5DB",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#10B981",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
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