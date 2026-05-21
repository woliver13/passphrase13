import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { generatePassphrase } from "./passphrase";
import { EFF_WORDLIST } from "./eff-wordlist";

describe("generatePassphrase", () => {
  let originalRandom: () => number;

  beforeEach(() => {
    originalRandom = Math.random;
    Math.random = () => { throw new Error("Math.random must not be called"); };
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  it("returns 6 hyphen-separated words by default", () => {
    const phrase = generatePassphrase();
    const words = phrase.split("-");
    expect(words).toHaveLength(6);
    expect(words.every((w) => w.length > 0)).toBe(true);
  });

  it("returns the requested number of words", () => {
    expect(generatePassphrase({ wordCount: 3 }).split("-")).toHaveLength(3);
    expect(generatePassphrase({ wordCount: 10 }).split("-")).toHaveLength(10);
  });

  it("uses the specified separator", () => {
    const phrase = generatePassphrase({ wordCount: 4, separator: " " });
    expect(phrase.split(" ")).toHaveLength(4);

    const dotPhrase = generatePassphrase({ wordCount: 4, separator: "." });
    expect(dotPhrase.split(".")).toHaveLength(4);
  });

  it("draws every word from the EFF wordlist", () => {
    const wordSet = new Set(EFF_WORDLIST);
    for (let i = 0; i < 10; i++) {
      const words = generatePassphrase({ wordCount: 6 }).split("-");
      for (const word of words) {
        expect(wordSet.has(word)).toBe(true);
      }
    }
  });
});
