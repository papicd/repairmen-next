import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from 'next/server';

// Middleware to verify authentication
async function verifyAuth() {
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
    return decoded;
  } catch {
    return null;
  }
}

// GET user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAuth();
  
  if (!auth) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  
  await connectDB();

  const user = await User.findById(params.id)
    .select("-password")
    .populate("place", "country place currency")
    .populate("serviceType", "type description price");

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}
