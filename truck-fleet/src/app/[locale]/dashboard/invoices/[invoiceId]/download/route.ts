import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const json = await request.json();

  return NextResponse.json({
    message: "Hello World",
    status: 200,
  });
}
