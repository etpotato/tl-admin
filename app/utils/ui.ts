export function getParsedDate(date: string) {
  const dateObj = new Date(date);
  return `${dateObj.toLocaleTimeString()} ${dateObj.toLocaleDateString()}`
}