import Constants from "expo-constants";

export const MAX_TRAININGS = 6;
export const MAX_GOALS = 4;

export const DAYS_TRANSLATION = [
  { label: "Lundi", value: "monday" },
  { label: "Mardi", value: "tuesday" },
  { label: "Mercredi", value: "wednesday" },
  { label: "Jeudi", value: "thursday" },
  { label: "Vendredi", value: "friday" },
  { label: "Samedi", value: "saturday" },
  { label: "Dimanche", value: "sunday" },
];
export const APP_VERSION = Constants.expoConfig?.version || "1.0.0";
export const LEGAL_CONTENT_UPDATED_AT = "14 août 2025";