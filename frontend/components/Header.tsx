import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { debugAppState } from "../utils/debug";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (Platform.OS === 'web') {
        // Для веб-версии используем localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } else {
        // Для нативных платформ используем SecureStore
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
      router.replace("/login");
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось выйти. Попробуйте снова.");
    }
  };

  const handleDebug = () => {
    debugAppState();
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.logoText}>ТекДок</Text>
      <View style={styles.buttonContainer}>
        {__DEV__ && (
          <TouchableOpacity style={styles.debugButton} onPress={handleDebug}>
            <Text style={styles.debugText}>Debug</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  debugButton: {
    marginRight: 16,
  },
  debugText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
  },
  logoutText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "600",
  },
});
