import { describe, expect, it } from "vitest";

import { isNavigationItemActive } from "./navigation";

describe("isNavigationItemActive", () => {
  it("keeps dashboard active only on the dashboard route", () => {
    expect(isNavigationItemActive("/dashboard", "/dashboard")).toBe(true);
    expect(isNavigationItemActive("/dashboard/activity", "/dashboard")).toBe(false);
  });

  it("keeps a section active for its nested routes without matching lookalikes", () => {
    expect(isNavigationItemActive("/products/new", "/products")).toBe(true);
    expect(isNavigationItemActive("/products-archive", "/products")).toBe(false);
  });
});
