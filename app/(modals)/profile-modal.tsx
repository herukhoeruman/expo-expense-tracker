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
import { UserDataType } from "@/types";
import Button from "@/components/button";
import { useAuth } from "@/context/authContext";
import { updateUser } from "@/services/user-service";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const ProfileModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });

  const { user, updateUserData } = useAuth();

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        image: user.image || null,
      });
    }
  }, [user]);

  const onPickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setUserData({
        ...userData,
        image: result.assets[0], // Assuming the first asset is the selected image});
      });
    }
  };

  const onSubmit = async () => {
    let { name, image } = userData;
    if (!name.trim()) {
      return Alert.alert("User", "Name cannot be empty");
    }

    setIsLoading(true);
    const res = await updateUser(user?.uid as string, userData);
    setIsLoading(false);

    if (res.success) {
      // update user data in context
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("User", res.msg);
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Edit Profile"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarContainer}>
            <Image
              source={getProfileImage(userData.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />

            <TouchableOpacity style={styles.editIcon} onPress={onPickImage}>
              <Icons.Pencil
                size={verticalScale(20)}
                color={colors.neutral800}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Name</Typo>
            <Input
              placeholder="Enter your name"
              value={userData.name}
              onChangeText={(value) => {
                setUserData({ ...userData, name: value });
              }}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button onPress={onSubmit} style={{ flex: 1 }} loading={isLoading}>
          <Typo color="black" fontWeight="700">
            Update
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

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
