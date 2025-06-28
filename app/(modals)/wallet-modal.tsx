import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/modal-wrapper";
import Header from "@/components/header";
import BackButton from "@/components/back-button";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/get-profile-image";
import * as Icons from "phosphor-react-native";
import Typo from "@/components/typo";
import Input from "@/components/input";
import { UserDataType, WalletType } from "@/types";
import Button from "@/components/button";
import { useAuth } from "@/context/authContext";
import { updateUser } from "@/services/user-service";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ImageUpload from "@/components/image-upload";
import { createOrUpdateWallet } from "@/services/wallet-service";

const WalletModal = () => {
  const { user, updateUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });

  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      return Alert.alert("Wallet", "Please fill all the fields.");
    }

    const data: WalletType = {
      name,
      image,
      uid: user?.uid,
    };

    setIsLoading(true);
    const res = await createOrUpdateWallet(data);
    setIsLoading(false);

    // console.log("res :", res);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("User", res.msg);
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="New Wallet"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Name</Typo>
            <Input
              placeholder="Salary, Savings, etc."
              value={wallet.name}
              onChangeText={(value) => {
                setWallet({ ...wallet, name: value });
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            <ImageUpload
              placeholder="Upload Image"
              file={wallet.image}
              onClear={() => setWallet({ ...wallet, image: null })}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button onPress={onSubmit} style={{ flex: 1 }} loading={isLoading}>
          <Typo color="black" fontWeight="700">
            Add Wallet
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(20),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._15,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
    shadowRadius: 10,
    shadowOpacity: 0.25,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
