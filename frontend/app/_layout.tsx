import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Вход" }} />
      <Stack.Screen name="register" options={{ title: "Регистрация" }} />
      <Stack.Screen name="documents" options={{ title: "Мои документы" }} />
      <Stack.Screen name="create" options={{ title: "Создать документ" }} />
      <Stack.Screen name="edit" options={{ title: "Редактировать документ" }} />
      <Stack.Screen name="invite" options={{ title: "Пригласить коллаборатора" }} />
    </Stack>
  );
}