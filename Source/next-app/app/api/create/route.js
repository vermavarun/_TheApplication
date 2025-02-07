import { stat } from "fs";
import { NextResponse } from "next/server";

export async function POST(userPayloadBody) {
  try {
    // Parse incoming JSON request body
    const user = await userPayloadBody.json();
    const apiURL = process.env.API_URL + "/register";

    // Make the API call
    const fetchResponse = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // Ensure the response body can be read
    if(fetchResponse.status === 200) {
        console.log("User created successfully");
        return NextResponse.json(
            { message: "User created successfully",status: 200 }
        );
    }
    else {

      const resp = await fetchResponse.json();
      console.error("User creation failed", resp);
      return NextResponse.json(
        { message: "User creation failed", details: resp }
      );
    }
  } catch (error) {
    console.error("Error in POST /register:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", details: error.message, status: 500 },
    );
  }
}
