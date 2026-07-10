import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // '/' cascades to the right place: /onboarding/profile for a new user,
      // /survey or /character for a returning one.
      return NextResponse.redirect(new URL("/", origin));
    }

    // The PKCE code is single-use. If a duplicate/retried request already
    // exchanged it (a real case on flaky mobile networks — the browser
    // resends the redirect, or a double-tap on the Google button races two
    // exchanges), this second exchange errors even though the user is
    // already signed in. Don't bounce them back to a "failed" login when
    // they actually succeeded — check for a live session before giving up.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      return NextResponse.redirect(new URL("/", origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=oauth_failed", origin));
}
