"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { AUTH_INITIAL_STATE, type AuthActionState } from "./state";

type AuthMode = "login" | "signup" | "forgot" | "verify" | "update";
type AuthAction = (
  state: AuthActionState,
  formData: FormData,
) => Promise<AuthActionState>;

const content: Record<
  AuthMode,
  { title: string; description: string; submitLabel: string }
> = {
  login: {
    title: "Welcome back",
    description: "Sign in to continue to inventory operations.",
    submitLabel: "Sign in",
  },
  signup: {
    title: "Create your account",
    description: "New accounts start with warehouse staff access.",
    submitLabel: "Create account",
  },
  forgot: {
    title: "Reset your password",
    description: "We will email a secure, single-use recovery link.",
    submitLabel: "Send reset link",
  },
  verify: {
    title: "Enter recovery code",
    description: "Use the six-digit code from your password recovery email.",
    submitLabel: "Verify code",
  },
  update: {
    title: "Choose a new password",
    description: "Use at least eight characters with letters and numbers.",
    submitLabel: "Update password",
  },
};

export function AuthForm({ mode, action }: { mode: AuthMode; action: AuthAction }) {
  const [state, formAction, pending] = useActionState(action, AUTH_INITIAL_STATE);
  const copy = content[mode];

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6 py-16 text-foreground">
      <section className="w-full max-w-md rounded-2xl border bg-card p-7 shadow-sm sm:p-9">
        <Link className="text-sm font-semibold tracking-wide text-primary" href="/">
          StockSense
        </Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.description}</p>

        <form action={formAction} className="mt-8">
          <FieldGroup>
            {mode === "signup" ? (
              <Field>
                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                <Input autoComplete="name" id="fullName" name="fullName" required />
              </Field>
            ) : null}

            {mode !== "update" ? (
              <Field>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <Input autoComplete="email" id="email" name="email" required type="email" />
              </Field>
            ) : null}

            {mode === "login" || mode === "signup" || mode === "update" ? (
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  id="password"
                  minLength={8}
                  name="password"
                  required
                  type="password"
                />
              </Field>
            ) : null}

            {mode === "verify" ? (
              <Field>
                <FieldLabel htmlFor="token">Recovery code</FieldLabel>
                <Input
                  autoComplete="one-time-code"
                  id="token"
                  inputMode="numeric"
                  maxLength={6}
                  minLength={6}
                  name="token"
                  pattern="[0-9]{6}"
                  required
                />
              </Field>
            ) : null}

            {mode === "update" ? (
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                <Input
                  autoComplete="new-password"
                  id="confirmPassword"
                  minLength={8}
                  name="confirmPassword"
                  required
                  type="password"
                />
              </Field>
            ) : null}

            <Button className="mt-2 h-11 w-full" disabled={pending} type="submit">
              {pending ? "Please wait…" : copy.submitLabel}
            </Button>
          </FieldGroup>
        </form>

        {state.message ? (
          <p
            aria-live="polite"
            className={`mt-5 text-sm ${state.status === "error" ? "text-destructive" : "text-foreground"}`}
          >
            {state.message}
          </p>
        ) : null}

        <div className="mt-7 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              <Link className="hover:text-foreground" href="/forgot-password">
                Forgot password?
              </Link>
              <Link className="hover:text-foreground" href="/signup">
                Create account
              </Link>
            </>
          ) : mode === "forgot" ? (
            <>
              <Link className="hover:text-foreground" href="/verify-recovery">
                Enter recovery code
              </Link>
              <Link className="hover:text-foreground" href="/login">
                Back to sign in
              </Link>
            </>
          ) : (
            <Link className="hover:text-foreground" href="/login">
              Back to sign in
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
