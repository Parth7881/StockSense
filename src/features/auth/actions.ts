"use server";

import { redirect } from "next/navigation";

import {
  getApplicationUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

import { safeNextPath } from "./redirects";
import {
  forgotPasswordSchema,
  loginSchema,
  recoveryOtpSchema,
  signUpSchema,
  updatePasswordSchema,
} from "./schemas";
import type { AuthActionState } from "./state";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function invalidInput(message: string): AuthActionState {
  return { status: "error", message };
}

function setupRequired(): AuthActionState | null {
  if (isSupabaseConfigured()) {
    return null;
  }

  return invalidInput(
    "Supabase is not connected yet. Add the project URL and publishable key to .env.local.",
  );
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: field(formData, "email"),
    password: field(formData, "password"),
  });

  if (!parsed.success) {
    return invalidInput(parsed.error.issues[0]?.message ?? "Check your details.");
  }

  const missingSetup = setupRequired();
  if (missingSetup) return missingSetup;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return invalidInput("Email or password is incorrect.");
  }

  redirect(safeNextPath(field(formData, "next")));
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    fullName: field(formData, "fullName"),
    email: field(formData, "email"),
    password: field(formData, "password"),
  });

  if (!parsed.success) {
    return invalidInput(parsed.error.issues[0]?.message ?? "Check your details.");
  }

  const missingSetup = setupRequired();
  if (missingSetup) return missingSetup;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${getApplicationUrl()}/auth/callback`,
    },
  });

  if (error) {
    return invalidInput("We could not create the account. Try again shortly.");
  }

  if (!data.session) {
    return {
      status: "success",
      message: "Check your email to confirm the account, then sign in.",
    };
  }

  redirect("/");
}

export async function forgotPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: field(formData, "email"),
  });

  if (!parsed.success) {
    return invalidInput(parsed.error.issues[0]?.message ?? "Enter a valid email.");
  }

  const missingSetup = setupRequired();
  if (missingSetup) return missingSetup;

  const supabase = await createClient();
  const recoveryUrl = new URL("/auth/callback", getApplicationUrl());
  recoveryUrl.searchParams.set("next", "/update-password");

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: recoveryUrl.toString(),
  });

  return {
    status: "success",
    message: "If that account exists, a secure recovery link is on its way.",
  };
}

export async function verifyRecoveryOtpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = recoveryOtpSchema.safeParse({
    email: field(formData, "email"),
    token: field(formData, "token"),
  });

  if (!parsed.success) {
    return invalidInput(parsed.error.issues[0]?.message ?? "Check the recovery code.");
  }

  const missingSetup = setupRequired();
  if (missingSetup) return missingSetup;

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.token,
    type: "recovery",
  });

  if (error) {
    return invalidInput("The recovery code is invalid or expired.");
  }

  redirect("/update-password");
}

export async function updatePasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = updatePasswordSchema.safeParse({
    password: field(formData, "password"),
    confirmPassword: field(formData, "confirmPassword"),
  });

  if (!parsed.success) {
    return invalidInput(parsed.error.issues[0]?.message ?? "Check your password.");
  }

  const missingSetup = setupRequired();
  if (missingSetup) return missingSetup;

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return invalidInput("The reset link is invalid or expired. Request a new one.");
  }

  await supabase.auth.signOut();
  redirect("/login");
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/login");
}
