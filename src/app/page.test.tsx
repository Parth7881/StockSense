import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("StockSense entry page", () => {
  it("routes the user into the protected workspace", async () => {
    render(<Home />);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Inventory work, without the guesswork.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Inventory work, without the guesswork."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
  });
});
