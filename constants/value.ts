import Constants from "expo-constants";

export const LIMITS = {
  MAX_TRAININGS: 6,
  MAX_GOALS: 4,
  MAX_CUSTOM_EXERCISES: 10,
  MAX_WEEKS: 4,
} as const;

export const APP_VERSION = Constants.expoConfig?.version || "1.0.0";
export const LEGAL_CONTENT_UPDATED_AT = "01 juin 2026";