import { describe, expect, it } from "vitest";

import {
  getApplicationUrl,
  getSupabaseConfig,
  isSupabaseConfigured,
} from "./config";

describe("getSupabaseConfig", () => {
  it("returns the public project URL and publishable key", () => {
    expect(
      getSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://demo.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_demo",
      }),
    ).toEqual({
      url: "https://demo.supabase.co",
      publishableKey: "sb_publishable_demo",
    });
  });

  it("rejects a missing project URL before a client is created", () => {
    expect(() =>
      getSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_demo",
      }),
    ).toThrow("NEXT_PUBLIC_SUPABASE_URL");
  });

  it("rejects a missing publishable key before a client is created", () => {
    expect(() =>
      getSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://demo.supabase.co",
      }),
    ).toThrow("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  });
});

describe("getApplicationUrl", () => {
  it("normalizes a trusted HTTP application URL", () => {
    expect(
      getApplicationUrl({ NEXT_PUBLIC_APP_URL: "http://localhost:3000/" }),
    ).toBe("http://localhost:3000");
  });

  it("rejects non-HTTP redirect origins", () => {
    expect(() =>
      getApplicationUrl({ NEXT_PUBLIC_APP_URL: "javascript:alert(1)" }),
    ).toThrow("NEXT_PUBLIC_APP_URL");
  });
});

describe("isSupabaseConfigured", () => {
  it("requires both public Supabase values", () => {
    expect(
      isSupabaseConfigured({
        NEXT_PUBLIC_SUPABASE_URL: "https://demo.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_demo",
      }),
    ).toBe(true);
    expect(
      isSupabaseConfigured({
        NEXT_PUBLIC_SUPABASE_URL: "https://demo.supabase.co",
      }),
    ).toBe(false);
  });
});
