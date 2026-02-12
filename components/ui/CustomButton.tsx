import { CustomButtonProps } from "@/types";
import cn from "clsx";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const CustomButton = ( {
  title,
  onPress,
  customStyles,
  textStyles,
  variant = "primary",
  isLoading = false,
}: CustomButtonProps ) => {
  const buttonVariants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
  };

  const textVariants = {
    primary: "text-secondary",
    secondary: "text-background",
  };

  return (
    <TouchableOpacity
      onPress={ onPress }
      className={ cn(
        "custom-btn",
        buttonVariants[ variant ],
        isLoading ? "opacity-50" : "",
        customStyles
      ) }
      disabled={ isLoading }
    >
      <Text
        className={ cn(
          "text text-lg font-bold",
          textVariants[ variant ],
          textStyles
        ) }
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
export default CustomButton;