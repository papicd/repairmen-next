import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import { connectDB } from "../lib/mongodb";
import User from "../models/User";

async function migrateApprovalStatus() {
  await connectDB();

  // Set isApproved to true for all existing users who don't have this field
  const result = await User.updateMany(
    { isApproved: { $exists: false } }, // only users without the field
    { $set: { isApproved: true } }
  );

  console.log("Migration complete!");
  console.log("Users updated:", result.modifiedCount);
  console.log("Users matched:", result.matchedCount);

  process.exit(0);
}

migrateApprovalStatus().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
