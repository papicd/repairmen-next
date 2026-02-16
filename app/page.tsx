import { cookies } from "next/headers";
import LogoutButton from "./components/LogoutButton";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const isLoggedIn = !!token;
  console.log(isLoggedIn);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome to Dashboard 🎉
      </h1>

      {isLoggedIn && <LogoutButton />}
    </div>
  );
}
