import { NextResponse } from "next/server";

// export async function GET() {
//   const secretValue = process.env.SECRETKEY;
//   return NextResponse.json({ name: 'Varun ' + secretValue });
// }

export async function GET() {
  const apiURL = process.env.API_URL + "/userlist";
  console.log(apiURL);
  const res = await fetch(apiURL);
  const users = await res.json();
  return NextResponse.json(users);
}
