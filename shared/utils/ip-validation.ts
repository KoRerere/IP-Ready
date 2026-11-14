/** The same address validation runs before client submission and on the server. */
export function isValidIp(value: string): boolean {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) {
    return value.split('.').every((part) => Number(part) <= 255)
  }
  if (!value.includes(':') || !/^[\da-f:.]+$/i.test(value)) return false
  try {
    return new URL(`http://[${value}]/`).hostname.startsWith('[')
  } catch {
    return false
  }
}
