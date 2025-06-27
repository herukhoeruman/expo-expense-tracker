import { AuthProvider } from "@/context/authContext";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(modals)/profile-modal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default function Layout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}
