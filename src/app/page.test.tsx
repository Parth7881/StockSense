import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("lucide-react", () => {
  const Icon = () => <span aria-hidden="true" />;
  return {
    AlertTriangle: Icon,
    ArrowRight: Icon,
    Bell: Icon,
    BellRing: Icon,
    Boxes: Icon,
    Check: Icon,
    ChevronDown: Icon,
    CircleDollarSign: Icon,
    CirclePlay: Icon,
    FileSpreadsheet: Icon,
    Filter: Icon,
    LockKeyhole: Icon,
    PackageOpen: Icon,
    ScrollText: Icon,
    Search: Icon,
    ShieldCheck: Icon,
    Truck: Icon,
    Warehouse: Icon,
    X: Icon,
    Zap: Icon,
  };
});

import Home from "./page";

describe("StockSense entry page", () => {
  it("presents the reference landing value proposition and primary actions", async () => {
    render(<Home />);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Real-time inventory control for modern warehouses",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Manage stock, track movements, and keep every warehouse in sync from one centralized system.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(screen.getByRole("link", { name: "View dashboard demo" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
  });
});
