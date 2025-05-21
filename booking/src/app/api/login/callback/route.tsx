import { NextResponse } from "next/server";
import { createServerSideClient } from "@/lib/supabase/CreateServerSideClient";

// Initialize Supabase client directly

export async function POST(request: Request) {
  const supabase = await createServerSideClient();

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check whitelist directly without auth session
    const { data, error } = await supabase
      .from("AdminAccessUsers")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: true,
          portal: "customer",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        portal: "admin",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
