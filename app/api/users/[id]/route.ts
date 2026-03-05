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

// PATCH - Update user (admin can approve users)
export async function PATCH(
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

  // Get the current user to check if they're admin
  const currentUser = await User.findById(auth.userId);
  if (!currentUser || !currentUser.isAdmin) {
    return NextResponse.json(
      { message: "Only administrators can approve users" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { isApproved } = body;

  if (isApproved === undefined) {
    return NextResponse.json(
      { message: "isApproved field is required" },
      { status: 400 }
    );
  }

  const user = await User.findByIdAndUpdate(
    params.id,
    { isApproved },
    { new: true }
  ).select("-password");

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}
