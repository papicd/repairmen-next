import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import { connectDB } from "../lib/mongodb";
import User from "../models/User";

async function runMigration() {
  await connectDB();

  const placeId = new mongoose.Types.ObjectId(
    "69a20493d984ff5aad08eea5"
  );
  const result = await User.updateMany(
    { }, // all users
    { $set: { place: placeId } }
  );

  console.log("Migration complete:", result);

  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
