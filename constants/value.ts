import Constants from "expo-constants";

export const LIMITS = {
  MAX_TRAININGS: 6,
  MAX_GOALS: 4,
  MAX_CUSTOM_EXERCISES: 10,
} as const;

export const DAYS_TRANSLATION = [
  { label: "Lundi", value: "monday" },
  { label: "Mardi", value: "tuesday" },
  { label: "Mercredi", value: "wednesday" },
  { label: "Jeudi", value: "thursday" },
  { label: "Vendredi", value: "friday" },
  { label: "Samedi", value: "saturday" },
  { label: "Dimanche", value: "sunday" },
] as const;

export type DayValue = typeof DAYS_TRANSLATION[number]["value"];

export const APP_VERSION = Constants.expoConfig?.version || "1.0.0";
export const LEGAL_CONTENT_UPDATED_AT = "14 août 2025";