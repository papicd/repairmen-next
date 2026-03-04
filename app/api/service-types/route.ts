import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import ServiceType from "@/models/ServiceType";
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

    if (!user || !user?.isAdmin) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    await connectDB();
    const serviceTypes = await ServiceType.find().sort({ createdAt: -1 });
    return NextResponse.json({ serviceTypes });
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
    const { type, description, price } = body;

    if (!type) {
      return NextResponse.json(
        { message: "Type is required" },
        { status: 400 }
      );
    }

    const newServiceType = await ServiceType.create({
      type,
      description: description || "",
      price: price || "",
    });

    return NextResponse.json({
      message: "Service type created",
      serviceType: newServiceType,
    });
  } catch (error) {
    console.error("CREATE SERVICE TYPE ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
