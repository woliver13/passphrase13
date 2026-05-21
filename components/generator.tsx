"use client";

import { useState } from "react";
import { generatePassword } from "@/lib/password";
import { generatePassphrase } from "@/lib/passphrase";

type Mode = "password" | "passphrase";

function generate(mode: Mode): string {
  return mode === "password" ? generatePassword() : generatePassphrase();
}

export function Generator() {
  const [mode, setMode] = useState<Mode>("password");
  const [output, setOutput] = useState(() => generate("password"));

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
    </div>
  );
}
