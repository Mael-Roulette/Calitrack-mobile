import { ImageSourcePropType } from "react-native";

export const icons = {
  home: require( "@/assets/icons/home.png" ) as ImageSourcePropType,
  home_focus: require( "@/assets/icons/home_focus.png" ) as ImageSourcePropType,
  goals: require( "@/assets/icons/goals.png" ) as ImageSourcePropType,
  goals_focus: require( "@/assets/icons/goals_focus.png" ) as ImageSourcePropType,
  training: require( "@/assets/icons/training.png" ) as ImageSourcePropType,
  training_focus: require( "@/assets/icons/training_focus.png" ) as ImageSourcePropType,
  calendar: require( "@/assets/icons/calendar.png" ) as ImageSourcePropType,
  calendar_focus: require( "@/assets/icons/calendar_focus.png" ) as ImageSourcePropType,
  profile: require( "@/assets/icons/profile.png" ) as ImageSourcePropType,
  profile_focus: require( "@/assets/icons/profile_focus.png" ) as ImageSourcePropType,
  stats: require( "@/assets/icons/stats.png" ) as ImageSourcePropType,
} as const;

export type IconName = keyof typeof icons;