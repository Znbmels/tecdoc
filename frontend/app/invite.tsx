import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams, router } from "expo-router";
import Header from "../components/Header";

export default function InviteCollaborator() {
  const { id } = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("view");

  const handleInvite = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Ошибка", "Не авторизован. Пожалуйста, войдите снова.");
        router.push("/index");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/documents/${id}/collaborators/`,
        { email, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Invite response:", response.data);
      Alert.alert("Успех", "Коллаборатор приглашён!");
      router.push({ pathname: "/edit", params: { id } });
    } catch (error) {
      console.log("Invite error:", error.response?.data);
      Alert.alert("Ошибка", "Не удалось пригласить коллаборатора.");
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Пригласить коллаборатора</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email коллаборатора"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Роль</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setRole("view")}
        >
          <View style={[styles.radioCircle, role === "view" && styles.radioSelected]}>
            {role === "view" && <View style={styles.radioInnerCircle} />}
          </View>
          <Text style={styles.radioText}>Просмотр</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setRole("edit")}
        >
          <View style={[styles.radioCircle, role === "edit" && styles.radioSelected]}>
            {role === "edit" && <View style={styles.radioInnerCircle} />}
          </View>
          <Text style={styles.radioText}>Редактирование</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleInvite}>
        <Text style={styles.buttonText}>Пригласить</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => router.push({ pathname: "/edit", params: { id } })}
      >
        <Text style={styles.linkText}>Назад к редактированию</Text>
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
  label: {
    color: "#D1D5DB",
    fontSize: 16,
    marginBottom: 8,
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