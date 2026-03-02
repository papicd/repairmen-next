import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import ServiceRequest from '@/models/ServiceRequest';

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

export async function GET() {
  const auth = await verifyAuth();
  if (!auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const services = await ServiceRequest
    .find()
    .populate("requestOwner", "username email");

  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const auth = await verifyAuth();
  if (!auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const body = await req.json();
  const { name, description, priceRange, date } = body;

  if (!name || !description) {
    return NextResponse.json(
      { message: "Name and description required" },
      { status: 400 }
    );
  }

  const newService = await ServiceRequest.create({
    name,
    description,
    priceRange,
    date,
    requestOwner: auth.userId,
  });

  return NextResponse.json({
    message: "Service request created",
    service: newService,
  });
}
