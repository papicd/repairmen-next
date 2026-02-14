import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();

  cookieStore.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return Response.json({ message: "Logged out" });
}
