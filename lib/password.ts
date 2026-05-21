export type PasswordOptions = {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
};

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function randomIndex(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

export function generatePassword(options?: PasswordOptions): string {
  const length = options?.length ?? 16;
  const useUppercase = options?.uppercase ?? true;
  const useLowercase = options?.lowercase ?? true;
  const useNumbers = options?.numbers ?? true;
  const useSymbols = options?.symbols ?? true;

  const charsets: string[] = [];
  if (useUppercase) charsets.push(UPPERCASE);
  if (useLowercase) charsets.push(LOWERCASE);
  if (useNumbers) charsets.push(NUMBERS);
  if (useSymbols) charsets.push(SYMBOLS);

  if (charsets.length === 0) return "";

  const fullCharset = charsets.join("");
  const chars: string[] = [];

  // Guarantee one character from each enabled class
  for (const cs of charsets) {
    chars.push(cs[randomIndex(cs.length)]);
  }

  // Fill the remainder from the full charset
  while (chars.length < length) {
    chars.push(fullCharset[randomIndex(fullCharset.length)]);
  }

  // Fisher-Yates shuffle using crypto.getRandomValues
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.slice(0, length).join("");
}
