import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchForm } from "./SearchForm";

describe("SearchForm", () => {
  it("renders the form and validates on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<SearchForm onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Search");
    const button = screen.getByRole("button", { name: "Search" });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter a search term.",
    );
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(input, "react");
    await user.click(button);

    expect(onSubmit).toHaveBeenCalledWith("react");
  });

  it("removes the validation message after successful submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<SearchForm onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Search");
    const button = screen.getByRole("button", { name: "Search" });

    await user.type(input, "   ");
    await user.click(button);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter a search term.",
    );

    await user.clear(input);
    await user.type(input, "vitest");
    await user.click(button);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
