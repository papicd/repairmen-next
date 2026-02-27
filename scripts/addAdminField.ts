import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import { connectDB } from "../lib/mongodb";
import User from "../models/User";

async function runMigration() {
  await connectDB();

  const result = await User.updateMany(
    { isAdmin: { $exists: false } }, // only users without field
    { $set: { isAdmin: true } }
  );

  console.log("Migration complete:", result);

  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
