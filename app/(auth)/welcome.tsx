import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import ScreenWrapper from "@/components/screen-wrapper";
import Typo from "@/components/typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Button from "@/components/button";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";

const Welcome = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* login button*/}
        <View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")}
          >
            <Typo size={16} fontWeight="500">
              Sign In
            </Typo>
          </TouchableOpacity>

          <Animated.Image
            entering={FadeIn.duration(1000)}
            style={styles.welcomeImage}
            resizeMode="contain"
            source={require("@/assets/images/welcome.png")}
          />
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(12)}
            style={{ alignItems: "center" }}
          >
            <Typo size={30} fontWeight="800">
              Always take control
            </Typo>
            <Typo size={30} fontWeight="800">
              of your finances
            </Typo>
          </Animated.View>

          <Animated.View
            style={{ alignItems: "center", gap: 2 }}
            entering={FadeInDown.duration(1000)
              .delay(100)
              .springify()
              .damping(12)}
          >
            <Typo size={17} color={colors.textLight}>
              Finance must be arraged to set a better
            </Typo>
            <Typo size={17} color={colors.textLight}>
              life style in future
            </Typo>
          </Animated.View>

          <Animated.View
            style={styles.buttonContainer}
            entering={FadeInDown.duration(1000)
              .delay(200)
              .springify()
              .damping(12)}
          >
            <Button onPress={() => router.push("/register")}>
              <Typo size={22} color={colors.neutral900} fontWeight="600">
                Get Started
              </Typo>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    // elevation: 10,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});
