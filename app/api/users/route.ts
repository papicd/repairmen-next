import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();
  const users = await User.find();
  return Response.json(users);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const user = await User.create({
    name: body.name,
    email: body.email,
  });

  return Response.json(user);
}
