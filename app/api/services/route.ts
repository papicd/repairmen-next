import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from '@/lib/mongodb';
import Service from '@/models/Service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();

    const services = await Service.find().populate("owner", "username email");
    console.log(services);
    return NextResponse.json({ services });

  } catch (error) {
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
    const { name, description, price } = body;

    const newService = await Service.create({
      name,
      description,
      price,
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
