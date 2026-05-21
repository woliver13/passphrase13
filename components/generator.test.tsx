// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
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

describe("Copy button", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });
  });
  afterEach(() => { cleanup(); });

  it("Copy button is present", () => {
    render(<Generator />);
    expect(screen.getByRole("button", { name: /^copy$/i })).toBeInTheDocument();
  });

  it("clicking Copy writes the current output to the clipboard", async () => {
    render(<Generator />);
    await userEvent.click(screen.getByRole("button", { name: /^copy$/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("mock-password-output");
  });

  it("button label changes to 'Copied!' immediately after clicking", async () => {
    vi.useFakeTimers();
    render(<Generator />);
    fireEvent.click(screen.getByRole("button", { name: /^copy$/i }));
    expect(screen.getByRole("button", { name: /copied!/i })).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("label resets to 'Copy' after 2 seconds", () => {
    vi.useFakeTimers();
    render(<Generator />);
    fireEvent.click(screen.getByRole("button", { name: /^copy$/i }));
    expect(screen.getByRole("button", { name: /copied!/i })).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(2000); });
    expect(screen.getByRole("button", { name: /^copy$/i })).toBeInTheDocument();
    vi.useRealTimers();
  });
});
