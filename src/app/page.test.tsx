import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("StockSense foundation page", () => {
  it("identifies the project and its current implementation stage", async () => {
    render(<Home />);

    expect(
      await screen.findByRole("heading", { level: 1, name: "StockSense" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Stage 2 data and authentication foundation is ready."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open authentication" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
