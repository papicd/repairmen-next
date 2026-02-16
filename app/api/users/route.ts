import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from 'next/server';

// GET all users
export async function GET() {
  await connectDB();

  const users = await User.find().select("-password");
  // exclude password field

  return NextResponse.json(users);
}

// CREATE new user
export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  const user = await User.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    username: body.username,
    password: body.password, // later we will hash this
    isServiceProvider: body.isServiceProvider ?? false,
  });

  // remove password from response
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return Response.json(userWithoutPassword);
}
