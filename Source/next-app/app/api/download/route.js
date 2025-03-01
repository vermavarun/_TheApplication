import { NextRequest, NextResponse } from "next/server";

const apiURL = process.env.API_URL + "/api/users/download-large-file";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");
    const metadata = searchParams.get("metadata");
    const start = searchParams.get("start");
    const chunkSize = searchParams.get("chunkSize");

    if (!fileName) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 });
    }

    // Request metadata (file size)
    if (metadata) {
      const metaResponse = await fetch(`${apiURL}?fileName=${fileName}&metadata=true`);
      const metaData = await metaResponse.json();
      return NextResponse.json(metaData);
    }

    // Request a chunk
    if (start !== null && chunkSize !== null) {
      const apiResponse = await fetch(`${apiURL}?fileName=${fileName}&start=${start}&chunkSize=${chunkSize}`);

      if (!apiResponse.ok) {
        return NextResponse.json({ error: "Chunk fetch failed" }, { status: 500 });
      }

      const stream = apiResponse.body;
      return new Response(stream, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
