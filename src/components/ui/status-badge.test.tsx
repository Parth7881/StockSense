import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders the human status label while preserving a semantic data state", async () => {
    render(<StatusBadge status="waiting" />);

    expect(await screen.findByText("Waiting")).toHaveAttribute(
      "data-status",
      "waiting",
    );
  });
});
