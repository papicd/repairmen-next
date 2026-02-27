import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from 'next/server';

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

// GET all users
export async function GET() {
  const auth = await verifyAuth();
  
  if (!auth) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  
  await connectDB();

  const users = await User.find().select("-password");

  return NextResponse.json(users);
}

// CREATE new user (admin only - requires authentication)
export async function POST(req: Request) {
  const auth = await verifyAuth();
  
  if (!auth) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  
  await connectDB();

  const body = await req.json();
  const { firstName, lastName, email, username, password, isServiceProvider, phone } = body;
  
  // Validate required fields
  if (!firstName || !lastName || !email || !username || !password) {
    return NextResponse.json(
      { message: "All required fields must be filled" },
      { status: 400 }
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    password: hashedPassword,
    isServiceProvider: isServiceProvider ?? false,
    isAdmin: false,
    phone: phone ?? null,
  });

  // remove password from response
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return Response.json(userWithoutPassword);
}
