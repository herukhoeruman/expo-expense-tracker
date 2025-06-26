import { Image, StatusBar, StyleSheet, View } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";

import { colors } from "@/constants/theme";

const Index = () => {
  // useEffect(() => {
  //   setTimeout(() => {
  //     router.push("/(auth)/welcome");
  //   }, 2000);
  // }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.neutral900,
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral900} />

      <Image
        style={{
          height: "20%",
          aspectRatio: 1,
        }}
        resizeMode="contain"
        source={require("@/assets/images/splashImage.png")}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
