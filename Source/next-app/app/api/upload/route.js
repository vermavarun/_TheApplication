import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse form data
    const formData = await req.formData();

    // Convert FormData to an object
    const userToPost = {};
    formData.forEach((value, key) => {
      userToPost[key] = value;
    });

    // Handle the file (ProfilePicture)
    const profilePicture = formData.get("ProfilePicture")
    if (profilePicture) {
      const arrayBuffer = await profilePicture.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer); // Convert to buffer

      // Optionally, convert buffer to base64 if needed
      userToPost.ProfilePicture = buffer.toString("base64");
    }

    const apiURL = `${process.env.API_URL}/api/users/profile`;
    const res = await fetch(apiURL, {
      method: "POST",
      body: formData, // Directly send FormData
    });

    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error processing form data:", error);
    return NextResponse.json({ error: "Failed to process form data" }, { status: 500 });
  }
}
