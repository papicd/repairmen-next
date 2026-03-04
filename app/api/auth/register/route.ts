import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      firstName,
      lastName,
      email,
      username,
      password,
      place,
      serviceType,
      phone,
      isServiceProvider,
    } = await req.json();

    if (!firstName || !lastName || !email || !username || !password || !place) {
      return Response.json(
        { message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return Response.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return Response.json(
        { message: "Username already taken" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      place,
      serviceType: serviceType || [],
      phone: phone || undefined,
      isServiceProvider: isServiceProvider || false,
    });

    return Response.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
