import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiURL = process.env.API_URL + "/api/users";
    console.log("Fetching users from:", apiURL);
    const res = await fetch(apiURL, {
      cache: "no-store",
    });
    const users = await res.json();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.error(error);
  }
}

export async function POST(request) {
  try {
    const apiURL = process.env.API_URL + "/api/users";
    const res = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.body),
    });
    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.error(error);
  }
}

export async function PUT(payLoad) {
  const userToPut = await payLoad.json();
  try {
    const apiURL = process.env.API_URL + "/api/users/";
    const res = await fetch(apiURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToPut),
    });
    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.error(error);
  }
}

export async function DELETE(payLoad) {
  const userToPut = await payLoad.json();
  try {
    const apiURL = process.env.API_URL + "/api/users/";
    const res = await fetch(apiURL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToPut),
    });
    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.error(error);
  }
}
