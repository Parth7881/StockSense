import { beforeEach, describe, expect, it, vi } from "vitest";

const { resetPasswordForEmail } = vi.hoisted(() => ({
  resetPasswordForEmail: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { resetPasswordForEmail },
  })),
}));

import { forgotPasswordAction } from "./actions";

describe("forgotPasswordAction", () => {
  beforeEach(() => {
    resetPasswordForEmail.mockReset();
    resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  });

  it("sends the recovery email back to the password update flow", async () => {
    const formData = new FormData();
    formData.set("email", "user@example.com");

    await forgotPasswordAction({ status: "idle", message: "" }, formData);

    expect(resetPasswordForEmail).toHaveBeenCalledWith("user@example.com", {
      redirectTo:
        "http://localhost:3000/auth/callback?next=%2Fupdate-password",
    });
  });

  it("tells the user to follow the secure recovery link", async () => {
    const formData = new FormData();
    formData.set("email", "user@example.com");

    const result = await forgotPasswordAction(
      { status: "idle", message: "" },
      formData,
    );

    expect(result).toEqual({
      status: "success",
      message: "If that account exists, a secure recovery link is on its way.",
    });
  });
});
