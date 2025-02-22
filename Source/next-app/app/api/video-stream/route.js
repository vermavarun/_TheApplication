import { NextRequest } from "next/server";

const API_URL = process.env.API_URL + "/api/video/stream";

export async function GET(req) {
  try {
    const range = req.headers.get("range");

    const response = await fetch(API_URL, {
      method: "GET",
      headers: range ? { range } : {},
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": response.headers.get("Content-Length") || "",
        "Accept-Ranges": "bytes",
        "Content-Range": response.headers.get("Content-Range") || "",
      },
    });
  } catch (error) {
    console.error("Streaming error:", error);
    return new Response("Error streaming video", { status: 500 });
  }
}
