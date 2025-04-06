// frontend/app/api/auth/forgot-password/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Log email for now (simulate sending email)
    console.log("📨 Reset request for:", email);

    return NextResponse.json({ message: "Reset link sent (simulated)" }, { status: 200 });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
