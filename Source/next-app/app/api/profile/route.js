import { NextResponse } from "next/server";

export async function GET(req) {
  const profileId = req.nextUrl.searchParams.get("id");
  console.log("Fetching user profile with ID:", profileId);
  try {
    const apiURL = `${process.env.API_URL}/api/users/profile/${profileId}`;
    const res = await fetch(apiURL);
    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}