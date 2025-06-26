import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "@/components/button";
import Typo from "@/components/typo";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuth } from "@/context/authContext";

const Home = () => {
  const { user } = useAuth();
  console.log("User:", user);
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <View>
      <Button onPress={handleLogout}>
        <Typo color="black">Logout</Typo>
      </Button>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
