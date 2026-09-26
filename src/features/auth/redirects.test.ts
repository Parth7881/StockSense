import { describe, expect, it } from "vitest";

import { safeNextPath } from "./redirects";

describe("safeNextPath", () => {
  it("keeps a local application path", () => {
    expect(safeNextPath("/products?status=low-stock")).toBe(
      "/products?status=low-stock",
    );
  });

  it.each([null, "", "https://attacker.example", "//attacker.example"])(
    "falls back to the dashboard for unsafe value %s",
    (value) => {
      expect(safeNextPath(value)).toBe("/");
    },
  );
});
