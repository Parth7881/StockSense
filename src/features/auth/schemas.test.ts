import { describe, expect, it } from "vitest";

import {
  forgotPasswordSchema,
  loginSchema,
  recoveryOtpSchema,
  signUpSchema,
  updatePasswordSchema,
} from "./schemas";

describe("loginSchema", () => {
  it("normalizes a valid email address", () => {
    expect(
      loginSchema.parse({ email: "  STAFF@EXAMPLE.COM ", password: "stockroom8" }),
    ).toEqual({ email: "staff@example.com", password: "stockroom8" });
  });

  it("rejects passwords shorter than eight characters", () => {
    expect(
      loginSchema.safeParse({ email: "staff@example.com", password: "short" })
        .success,
    ).toBe(false);
  });
});

describe("signUpSchema", () => {
  it("trims the display name and normalizes the email", () => {
    expect(
      signUpSchema.parse({
        fullName: "  Asha Singh  ",
        email: " ASHA@EXAMPLE.COM ",
        password: "warehouse8",
      }),
    ).toEqual({
      fullName: "Asha Singh",
      email: "asha@example.com",
      password: "warehouse8",
    });
  });
});

describe("forgotPasswordSchema", () => {
  it("rejects malformed email addresses", () => {
    expect(forgotPasswordSchema.safeParse({ email: "not-an-email" }).success).toBe(
      false,
    );
  });
});

describe("updatePasswordSchema", () => {
  it("rejects password confirmation mismatches", () => {
    const result = updatePasswordSchema.safeParse({
      password: "warehouse-strong",
      confirmPassword: "warehouse-wrong",
    });

    expect(result.success).toBe(false);
  });
});

describe("recoveryOtpSchema", () => {
  it("accepts a normalized email and six-digit recovery code", () => {
    expect(
      recoveryOtpSchema.parse({
        email: " STAFF@EXAMPLE.COM ",
        token: "123456",
      }),
    ).toEqual({ email: "staff@example.com", token: "123456" });
  });

  it("rejects non-numeric recovery codes", () => {
    expect(
      recoveryOtpSchema.safeParse({
        email: "staff@example.com",
        token: "12AB56",
      }).success,
    ).toBe(false);
  });
});
