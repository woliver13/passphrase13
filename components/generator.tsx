"use client";

import { useState, useCallback } from "react";
import { generatePassword } from "@/lib/password";
import { generatePassphrase } from "@/lib/passphrase";

type Mode = "password" | "passphrase";

function generate(mode: Mode): string {
  return mode === "password" ? generatePassword() : generatePassphrase();
}

export function Generator() {
  const [mode, setMode] = useState<Mode>("password");
  const [output, setOutput] = useState(() => generate("password"));
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  function switchMode(next: Mode) {
    setMode(next);
    setOutput(generate(next));
  }

  return (
    <div>
      <div>
        <button onClick={() => switchMode("password")} aria-pressed={mode === "password"}>Password</button>
        <button onClick={() => switchMode("passphrase")} aria-pressed={mode === "passphrase"}>Passphrase</button>
      </div>
      <pre>{output}</pre>
      <button onClick={() => setOutput(generate(mode))}>Regenerate</button>
      <button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
    </div>
  );
}
