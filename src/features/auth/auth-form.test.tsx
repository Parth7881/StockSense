import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthForm } from "./auth-form";

describe("AuthForm password recovery", () => {
  it("does not offer the unsupported manual recovery-code path", () => {
    render(
      <AuthForm
        action={async () => ({ status: "idle", message: "" })}
        mode="forgot"
      />,
    );

    expect(
      screen.queryByRole("link", { name: "Enter recovery code" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to sign in" }),
    ).toBeInTheDocument();
  });
});
