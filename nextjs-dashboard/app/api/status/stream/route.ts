import { NextResponse } from "next/server";

const apiBaseUrl = process.env.API_BASE_URL;

export const dynamic = "force-dynamic";

export async function GET() {
  if (!apiBaseUrl) {
    return new NextResponse("API_BASE_URL is not configured", { status: 500 });
  }

  try {
    const upstream = await fetch(`${apiBaseUrl}/status/stream`, {
      cache: "no-store",
      headers: {
        Accept: "text/event-stream",
      },
    });

    if (!upstream.ok || !upstream.body) {
      return new NextResponse("Upstream SSE stream is unavailable", { status: 502 });
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch {
    return new NextResponse("Failed to connect to upstream SSE stream", { status: 503 });
  }
}
