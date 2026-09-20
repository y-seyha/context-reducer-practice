import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { SearchDemo } from "./SearchDemo";

describe("SearchDemo", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("updates the raw value immediately and debounces the delayed value", async () => {
    const user = userEvent.setup();
    render(<SearchDemo />);

    const input = screen.getByLabelText("Search");

    await user.type(input, "react");

    expect(screen.getByText("Raw value: react")).toBeInTheDocument();
    expect(screen.getByText("Debounced value:")).toBeInTheDocument();

    await screen.findByText("Debounced value: react", {}, { timeout: 1200 });
  });

  it("persists the selected theme in localStorage", async () => {
    const user = userEvent.setup();
    render(<SearchDemo />);

    const toggle = screen.getByRole("button", { name: /Toggle theme/i });

    expect(window.localStorage.getItem("theme")).toBe('"light"');

    await user.click(toggle);

    expect(window.localStorage.getItem("theme")).toBe('"dark"');
  });
});
