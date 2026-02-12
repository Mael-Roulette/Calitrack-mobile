export function getMonday(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function getWeekDays(startDate?: Date) {
  const monday = getMonday(startDate);
  const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];

  return dayLabels.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      label,
      date: date.getDate(),
      fullDate: date,
    };
  });
}