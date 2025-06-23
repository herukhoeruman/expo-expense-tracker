import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import ScreenWrapper from "@/components/screen-wrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/back-button";
import Typo from "@/components/typo";
import Input from "@/components/input";
import { At, Lock, User } from "phosphor-react-native";
import { useRef, useState } from "react";
import Button from "@/components/button";
import { router } from "expo-router";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");

  const handleSubmit = () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Login", "Please fill in all fields.");
      return;
    }

    console.log("Email:", emailRef.current);
    console.log("Password:", passwordRef.current);
    console.log("Name:", nameRef.current);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight="800">
            Let's
          </Typo>
          <Typo size={30} fontWeight="800">
            Get Started
          </Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Create account to track all your expenses
          </Typo>

          <Input
            onChangeText={(value) => (nameRef.current = value)}
            placeholder="Enter your name"
            icon={
              <User
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
          <Input
            onChangeText={(value) => (emailRef.current = value)}
            placeholder="Enter your email"
            icon={
              <At
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
          <Input
            onChangeText={(value) => (passwordRef.current = value)}
            placeholder="Enter your password"
            secureTextEntry
            icon={
              <Lock
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />

          <Button onPress={handleSubmit} loading={isLoading}>
            <Typo size={21} color={colors.black} fontWeight="700">
              Sign Up
            </Typo>
          </Button>
        </View>

        <View style={styles.footer}>
          <Typo size={15}>Already have an account?</Typo>
          <Pressable onPress={() => router.push("/login")}>
            <Typo size={15} fontWeight={"700"} color={colors.primary}>
              Login
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    color: colors.text,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: colors.text,
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
