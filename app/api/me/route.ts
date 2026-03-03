import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ user: null });
    }

    // Verify & decode token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    await connectDB();

    const user = await User.findById(decoded.userId)
      .select("-password")
      .populate("place", "country place currency")
      .populate("serviceType", "type description price");

    if (!user) {
      return Response.json({ user: null });
    }

    return Response.json({ user });

  } catch (error) {
    console.error("Invalid token:", error);
    return Response.json({ user: null });
  }
}

export async function PUT(req: NextRequest) {
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
    const { firstName, lastName, email, phone, place, serviceType } = body;

    const updateData: any = {
      firstName,
      lastName,
      email,
    };

    // Only update optional fields if they are provided
    if (phone !== undefined) updateData.phone = phone;
    if (place !== undefined) updateData.place = place;
    if (serviceType !== undefined) updateData.serviceType = serviceType;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true }
    ).select("-password")
      .populate("place", "country place currency")
      .populate("serviceType", "type description price");

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Profile updated",
      user: updatedUser,
    });

  } catch (error) {
    console.error("PUT ME ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
