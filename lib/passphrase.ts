import { EFF_WORDLIST } from "./eff-wordlist";

export type PassphraseOptions = {
  wordCount?: number;
  separator?: string;
};

export function generatePassphrase(options?: PassphraseOptions): string {
  const wordCount = options?.wordCount ?? 6;
  const separator = options?.separator ?? "-";

  const buf = crypto.getRandomValues(new Uint32Array(wordCount));
  const words = Array.from(buf, (n) => EFF_WORDLIST[n % EFF_WORDLIST.length]);
  return words.join(separator);
}
