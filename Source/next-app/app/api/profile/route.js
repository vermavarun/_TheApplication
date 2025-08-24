import { NextResponse } from "next/server";

export async function GET(req) {
  const profileId = req.nextUrl.searchParams.get("id");
  console.log("Fetching user profile with ID:", profileId);
  try {
    const apiURL = `${process.env.API_URL}/api/users/profile/${profileId}`;
    console.log("Profile API URL:", apiURL);
    const res = await fetch(apiURL);

    if (!res.ok) {
      // Handle 404 as a normal case - user profile doesn't exist yet
      if (res.status === 404) {
        console.log("Profile not found for user:", profileId);
        return NextResponse.json(
          { info: "Profile not found. User can create a new profile." },
          { status: 404 }
        );
      }

      // Log other errors as actual errors
      console.error("Profile API response not ok:", res.status, res.statusText);
      return NextResponse.json(
        { error: `API returned ${res.status}: ${res.statusText}` },
        { status: res.status }
      );
    }

    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile", details: error.message },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    // Parse form data
    const formData = await req.formData();

    console.log("Received FormData keys:", Array.from(formData.keys()));

    const apiURL = `${process.env.API_URL}/api/users/profile`;
    console.log("POST Profile API URL:", apiURL);

    const res = await fetch(apiURL, {
      method: "POST",
      body: formData, // Directly send FormData
    });

    if (!res.ok) {
      // Handle 404 for POST - profile doesn't exist, but that's okay for creation
      if (res.status === 404) {
        console.log("Profile doesn't exist yet, this might be expected for new profile creation");
        return NextResponse.json(
          { info: "Profile creation may have failed - profile doesn't exist yet" },
          { status: 404 }
        );
      }

      console.error("Profile POST API response not ok:", res.status, res.statusText);
      const errorText = await res.text();
      console.error("Error response body:", errorText);
      return NextResponse.json(
        { error: `API returned ${res.status}: ${res.statusText}`, details: errorText },
        { status: res.status }
      );
    }

    const user = await res.json();
    if (user.statusCode === 400) {
      return NextResponse.json(user, { status: 400 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error processing form data:", error);
    return NextResponse.json({ error: "Failed to process form data" }, { status: 500 });
  }
}


export async function PUT(req) {
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
      method: "PUT",
      body: formData, // Directly send FormData
    });

    const user = await res.json();
    if (user.statusCode === 400) {
      return NextResponse.json(user, { status: 400 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error processing form data:", error);
    return NextResponse.json({ error: "Failed to process form data" }, { status: 500 });
  }
}