import { auth } from "@/app/lib/auth";
import { NextResponse } from "next/server";

const BACKEND_TOKEN_COOKIE = "backend_access_token";

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, name, provider, providerAccountId } = session.user;

  if (!email || !name || !provider || !providerAccountId) {
    return NextResponse.json(
      { error: "Missing user claims required to mint backend token" },
      { status: 400 },
    );
  }

  const apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) {
    return NextResponse.json({ error: "API_BASE_URL is not configured" }, { status: 500 });
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/auth/social-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        provider,
        providerAccountId,
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "Backend auth API is unavailable" }, { status: 502 });
  }

  if (!response.ok) {
    return NextResponse.json({ error: "Backend auth API returned an error" }, { status: 502 });
  }

  const payload = (await response.json()) as { token?: string; expiresAt?: string };
  if (!payload.token || !payload.expiresAt) {
    return NextResponse.json({ error: "Backend auth API returned an invalid payload" }, { status: 502 });
  }

  const nextResponse = NextResponse.json({ ok: true, expiresAt: payload.expiresAt });
  nextResponse.cookies.set(BACKEND_TOKEN_COOKIE, payload.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(payload.expiresAt),
  });

  return nextResponse;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(BACKEND_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
