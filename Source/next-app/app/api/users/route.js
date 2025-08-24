import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiURL = process.env.API_URL + "/api/users";
    console.log("Fetching users from:", apiURL);
    const res = await fetch(apiURL, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("API response not ok:", res.status, res.statusText);
      return NextResponse.json(
        { error: `API returned ${res.status}: ${res.statusText}` },
        { status: res.status }
      );
    }

    const users = await res.json();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const apiURL = process.env.API_URL + "/api/users";
    const res = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("API response not ok:", res.status, res.statusText);
      return NextResponse.json(
        { error: `API returned ${res.status}: ${res.statusText}` },
        { status: res.status }
      );
    }

    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(payLoad) {
  try {
    const userToPut = await payLoad.json();
    const apiURL = process.env.API_URL + "/api/users/";
    const res = await fetch(apiURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToPut),
    });

    if (!res.ok) {
      console.error("API response not ok:", res.status, res.statusText);
      return NextResponse.json(
        { error: `API returned ${res.status}: ${res.statusText}` },
        { status: res.status }
      );
    }

    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(payLoad) {
  try {
    const userToDelete = await payLoad.json();
    const apiURL = process.env.API_URL + "/api/users/";
    const res = await fetch(apiURL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToDelete),
    });

    if (!res.ok) {
      console.error("API response not ok:", res.status, res.statusText);
      return NextResponse.json(
        { error: `API returned ${res.status}: ${res.statusText}` },
        { status: res.status }
      );
    }

    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user", details: error.message },
      { status: 500 }
    );
  }
}
