import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { generatePassword } from "./password";

describe("generatePassword", () => {
  let originalRandom: () => number;

  beforeEach(() => {
    originalRandom = Math.random;
    Math.random = () => { throw new Error("Math.random must not be called"); };
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  it("returns a string of the default length (16)", () => {
    expect(generatePassword()).toHaveLength(16);
  });

  it("returns a string of the requested length", () => {
    expect(generatePassword({ length: 8 })).toHaveLength(8);
    expect(generatePassword({ length: 32 })).toHaveLength(32);
  });

  it("uses only lowercase when only lowercase is enabled", () => {
    const pw = generatePassword({ length: 50, lowercase: true, uppercase: false, numbers: false, symbols: false });
    expect(pw).toMatch(/^[a-z]+$/);
  });

  it("uses only uppercase when only uppercase is enabled", () => {
    const pw = generatePassword({ length: 50, uppercase: true, lowercase: false, numbers: false, symbols: false });
    expect(pw).toMatch(/^[A-Z]+$/);
  });

  it("uses only digits when only numbers is enabled", () => {
    const pw = generatePassword({ length: 50, numbers: true, uppercase: false, lowercase: false, symbols: false });
    expect(pw).toMatch(/^[0-9]+$/);
  });

  it("uses only symbols when only symbols is enabled", () => {
    const pw = generatePassword({ length: 50, symbols: true, uppercase: false, lowercase: false, numbers: false });
    expect(pw).toMatch(/^[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/);
  });

  it("guarantees at least one character from each enabled class", () => {
    // Run several times to rule out lucky draws
    for (let i = 0; i < 20; i++) {
      const pw = generatePassword({ length: 16 });
      expect(pw).toMatch(/[A-Z]/);
      expect(pw).toMatch(/[a-z]/);
      expect(pw).toMatch(/[0-9]/);
      expect(pw).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/);
    }
  });
});
