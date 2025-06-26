import { View, Platform, TouchableOpacity, StyleSheet } from "react-native";
import { ChartBar, House, User, Wallet } from "phosphor-react-native";
import { Text } from "@react-navigation/elements";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { colors, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

export default function CutomTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const tabbarIcons: any = {
    index: (isFocus: boolean) => (
      <House
        size={verticalScale(30)}
        weight={isFocus ? "fill" : "regular"}
        color={isFocus ? colors.primary : colors.neutral400}
      />
    ),
    statistics: (isFocus: boolean) => (
      <ChartBar
        size={verticalScale(30)}
        weight={isFocus ? "fill" : "regular"}
        color={isFocus ? colors.primary : colors.neutral400}
      />
    ),
    wallet: (isFocus: boolean) => (
      <Wallet
        size={verticalScale(30)}
        weight={isFocus ? "fill" : "regular"}
        color={isFocus ? colors.primary : colors.neutral400}
      />
    ),
    profile: (isFocus: boolean) => (
      <User
        size={verticalScale(30)}
        weight={isFocus ? "fill" : "regular"}
        color={isFocus ? colors.primary : colors.neutral400}
      />
    ),
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            // href={buildHref(route.name, route.params)}
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            <Text style={{ color: isFocused ? colors.primary : colors.white }}>
              {/* label */}
              {tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    width: "100%",
    height: Platform.OS === "ios" ? verticalScale(73) : verticalScale(55),
    backgroundColor: colors.neutral800,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
  },
  tabbarItem: {
    marginBottom: Platform.OS === "ios" ? spacingY._10 : spacingY._5,
    alignItems: "center",
    justifyContent: "center",
  },
});
