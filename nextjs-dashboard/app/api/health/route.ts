import { NextResponse } from "next/server";

const apiBaseUrl = process.env.API_BASE_URL;

export async function GET() {
  if (!apiBaseUrl) {
    return NextResponse.json({ healthy: false }, { status: 500 });
  }

  try {
    const response = await fetch(`${apiBaseUrl}/health`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ healthy: false }, { status: 503 });
    }

    const text = await response.text();
    return NextResponse.json({ healthy: true, message: text });
  } catch {
    return NextResponse.json({ healthy: false }, { status: 503 });
  }
}
