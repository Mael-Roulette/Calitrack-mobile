export const DAY_INDEX_MAP: Record<number, string> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

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

export const DAY_LABELS: Record<string, string> = {
  monday: "Lun",
  tuesday: "Mar",
  wednesday: "Mer",
  thursday: "Jeu",
  friday: "Ven",
  saturday: "Sam",
  sunday: "Dim",
};