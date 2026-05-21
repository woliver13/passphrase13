// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Generator } from "./generator";

vi.mock("@/lib/password", () => ({
  generatePassword: vi.fn(() => "mock-password-output"),
}));

vi.mock("@/lib/passphrase", () => ({
  generatePassphrase: vi.fn(() => "mock-passphrase-output"),
}));

describe("Generator", () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { cleanup(); });

  it("displays generated output on mount", () => {
    render(<Generator />);
    expect(screen.getByText("mock-password-output")).toBeInTheDocument();
  });

  it("mode toggle switches to Passphrase mode", async () => {
    render(<Generator />);
    await userEvent.click(screen.getByRole("button", { name: /passphrase/i }));
    expect(screen.getByText("mock-passphrase-output")).toBeInTheDocument();
  });

  it("switching back to Password mode generates fresh password output", async () => {
    render(<Generator />);
    await userEvent.click(screen.getByRole("button", { name: /passphrase/i }));
    expect(screen.getByText("mock-passphrase-output")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /^password$/i }));
    expect(screen.getByText("mock-password-output")).toBeInTheDocument();
  });

  it("Regenerate button produces fresh output on click", async () => {
    const { generatePassword } = await import("@/lib/password");
    const mock = vi.mocked(generatePassword);
    mock.mockReturnValueOnce("first-output").mockReturnValueOnce("second-output");

    render(<Generator />);
    expect(screen.getByText("first-output")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /regenerate/i }));
    expect(screen.getByText("second-output")).toBeInTheDocument();
  });
});
