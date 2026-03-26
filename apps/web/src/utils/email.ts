export function isGmailAddress(email: string): boolean {
  return email.trim().toLowerCase().endsWith("@gmail.com");
}
