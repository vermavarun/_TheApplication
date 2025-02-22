
///
import { NextRequest, NextResponse } from "next/server";
const apiURL = process.env.API_URL + "/api/users/upload-large-file";

export async function POST(req) {
  try {
    // Ensure Next.js allows streamed requests
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    // Create a fetch stream to forward the request to ASP.NET Core API
    const apiResponse = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
      },
      body: req.body, // Pass streaming body directly
      duplex: "half", // ✅ Required for streaming requests in Next.js API (server-side only)

    });

    const result = await apiResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error forwarding file:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
