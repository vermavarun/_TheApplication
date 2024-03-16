import { NextResponse } from 'next/server';

export async function GET() {
  const secretValue = process.env.SECRETKEY;
  return NextResponse.json({ name: 'Varun' + secretValue });
}