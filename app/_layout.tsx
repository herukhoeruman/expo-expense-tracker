import { AuthProvider } from "@/context/authContext";
import { Stack } from "expo-router";

const StackLayout = () => {
  return <Stack screenOptions={{ headerShown: false }}></Stack>;
};

export default function Layout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}
