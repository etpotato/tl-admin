export function getParsedDate(date: string) {
  const dateObj = new Date(date);
  return `${dateObj.getDate()}.${dateObj.getMonth()}.${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}`
}