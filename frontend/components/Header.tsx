import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      router.replace("/register");
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось выйти. Попробуйте снова.");
    }
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.logoText}>ТекДок</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutText}>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#1F2937",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1F2937",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 12,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F9FAFB",
  },
  logoutText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "600",
  },
});
