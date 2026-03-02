import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Place from "@/models/Place";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// Middleware to verify admin authentication
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user || !user.isAdmin) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export async function GET() {
  const auth = await verifyAdmin();

  if (!auth) {
    return NextResponse.json(
      { message: "Unauthorized - Admin access required" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const places = await Place.find().sort({ createdAt: -1 });
    return NextResponse.json({ places });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin();

  if (!auth) {
    return NextResponse.json(
      { message: "Unauthorized - Admin access required" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const body = await req.json();
    const { country, place, currency } = body;

    if (!country || !place) {
      return NextResponse.json(
        { message: "Country and place are required" },
        { status: 400 }
      );
    }

    const newPlace = await Place.create({
      country,
      place,
      currency: currency || "",
    });

    return NextResponse.json({
      message: "Place created",
      place: newPlace,
    });
  } catch (error) {
    console.error("CREATE PLACE ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
