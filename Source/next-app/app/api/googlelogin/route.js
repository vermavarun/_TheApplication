import { access, stat } from "fs";
import { NextResponse } from "next/server";

export async function POST(payload) {
  try {
    const userPayloadBody = await payload.json();
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri = process.env.GOOGLE_REDIRECT_URI;
    const grant_type = "authorization_code";
    const apiURL = `https://oauth2.googleapis.com/token`;

    const bodyPayLoad = {
        grant_type: grant_type,
        client_id: client_id,
        client_secret: client_secret,
        code: userPayloadBody.code,
        redirect_uri: redirect_uri,
    }
    console.log("Google Login Payload:", bodyPayLoad);

    // Make the API call

    const fetchResponse = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(
        bodyPayLoad
      ),
    });

    // Ensure the response body can be read
    if(fetchResponse.status === 200) {
        console.log("Google User logged in successfully");
        const resps = await fetchResponse.json();
        return NextResponse.json(
            { message: "User logged in successfully",status: 200, details: resps }
        );
    }
    else {
      const resp = await fetchResponse.json();
      console.error("Google User logged in failed", resp);
      return NextResponse.json(
        { message: "Google User logged in failed", details: resp }
      );
    }
  } catch (error) {
    console.error("Error in POST /Google login:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", details: error.message, status: 500 },
    );
  }
}
