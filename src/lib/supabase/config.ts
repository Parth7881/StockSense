type SupabaseEnvironment = Record<string, string | undefined>;

export type SupabaseConfig = {
  url: string;
  publishableKey: string;
};

export function isSupabaseConfigured(
  environment: SupabaseEnvironment = process.env,
): boolean {
  return Boolean(
    environment.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim(),
  );
}

function requiredEnvironmentValue(
  environment: SupabaseEnvironment,
  name:
    | "NEXT_PUBLIC_SUPABASE_URL"
    | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    | "NEXT_PUBLIC_APP_URL",
) {
  const value = environment[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseConfig(
  environment: SupabaseEnvironment = process.env,
): SupabaseConfig {
  return {
    url: requiredEnvironmentValue(environment, "NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: requiredEnvironmentValue(
      environment,
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ),
  };
}

export function getApplicationUrl(
  environment: SupabaseEnvironment = process.env,
): string {
  const value = requiredEnvironmentValue(environment, "NEXT_PUBLIC_APP_URL");
  const url = new URL(value);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_APP_URL must use http or https.");
  }

  return url.origin;
}
