export function truncate(str: string, maxLength = 10) {
  if (typeof str !== 'string') return str; // Skip numbers or non-strings
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}
