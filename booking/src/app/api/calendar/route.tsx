
import { NextResponse } from "next/server";
import { fetchBookings } from "./CalendarActions";

export async function GET(request: Request) {
  try {
    const bookings = await fetchBookings();
    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("Error fetching bookings in API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
