import { NextResponse } from "next/server";

import { safeNextPath } from "@/features/auth/redirects";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(
        new URL(safeNextPath(requestUrl.searchParams.get("next")), requestUrl.origin),
      );
    }
  }

  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
