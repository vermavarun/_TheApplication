import { NextResponse } from "next/server";

export async function POST(payload) {
  try {

    const userPayloadBody = await payload.json();
    const thirdParty = userPayloadBody.thirdParty;

    let client_id = "";
    let client_secret = "";
    let redirect_uri = "";
    let apiURL = "";

    switch (thirdParty) {

        case "github":
            client_id = process.env.GITHUB_CLIENT_ID;
            client_secret = process.env.GITHUB_CLIENT_SECRET;
            redirect_uri = process.env.GITHUB_REDIRECT_URI;
            apiURL = process.env.GITHUB_OAUTH_TOKEN_URL;
            break;
        case "google":
            client_id = process.env.GOOGLE_CLIENT_ID;
            client_secret = process.env.GOOGLE_CLIENT_SECRET;
            redirect_uri = process.env.GOOGLE_REDIRECT_URI;
            apiURL = process.env.GOOGLE_OAUTH_TOKEN_URL;
            break;
    }

    const bodyPayLoad = {
        client_id: client_id,
        client_secret: client_secret,
        code: userPayloadBody.code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
    }

    console.log(`${thirdParty} Login Payload: ${JSON.stringify(bodyPayLoad)}`);

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
        console.log(`${thirdParty} User logged in successfully`);
        const response = await fetchResponse.json();
        return NextResponse.json(
            { message: "User logged in successfully",status: 200, details: response }
        );
    }
    else {
      const resp = await fetchResponse.json();
      console.error(`${thirdParty} User logged in failed`);
      return NextResponse.json(
        { message: "User logged in failed", details: resp }
      );
    }
  } catch (error) {
    console.error("Error in POST / login:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", details: error.message, status: 500 },
    );
  }
}
