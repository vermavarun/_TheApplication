import { NextResponse } from "next/server";

const apiBaseUrl = process.env.API_BASE_URL;

export async function GET() {
  if (!apiBaseUrl) {
    return NextResponse.json({ healthy: false }, { status: 500 });
  }

  try {
    const response = await fetch(`${apiBaseUrl}/news`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ healthy: false }, { status: 503 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ healthy: false }, { status: 503 });
  }
}
