import { CustomButtonProps } from "@/types";
import cn from "clsx";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

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
    tertiary: "btn-tertiary",
  };

  const textVariants = {
    primary: "text-secondary",
    secondary: "text-background",
    tertiary: "text-background",
  };

  return (
    <TouchableOpacity
      onPress={ onPress }
      className={ cn(
        buttonVariants[ variant ],
        isLoading && "btn-disabled",
        customStyles
      ) }
      disabled={ isLoading }
      activeOpacity={ 0.7 }
    >
      {isLoading ? (
        <ActivityIndicator color={ variant === "primary" ? "#FC7942" : "#FFF9F7" } />
      ) : (
        <Text
          className={ cn(
            "font-bold text-base",
            textVariants[ variant ],
            textStyles
          ) }
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;