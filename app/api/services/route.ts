import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from '@/lib/mongodb';
import Service from '@/models/Service';
import Place from '@/models/Place';
import User from '@/models/User';
import ServiceType from '@/models/ServiceType';
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

export async function GET() {
  const auth = await verifyAuth();
  
  if (!auth) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    await connectDB();

    const services = await Service.find().populate("owner", "username email").populate("place", "country place currency").populate("serviceType", "type description price");
    return NextResponse.json({ services });

  } catch (error) {
    console.error("GET SERVICES ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: string };

    const body = await req.json();
    const { name, description, price, date, place, serviceType } = body;

    const newService = await Service.create({
      name,
      description,
      price,
      date,
      place: place || undefined,
      serviceType: serviceType || undefined,
      owner: decoded.userId,
    });

    return NextResponse.json({
      message: "Service created",
      service: newService,
    });

  } catch (error) {
    console.error("CREATE SERVICE ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
