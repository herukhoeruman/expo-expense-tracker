import { Text } from "react-native";

import { colors } from "@/constants/theme";
import { TypoProps } from "@/types";
import { verticalScale } from "@/utils/styling";

const Typo = ({
  size,
  color = colors.text,
  fontWeight = 400,
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const textStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
    ...style,
  };
  return (
    <Text style={textStyle} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;
