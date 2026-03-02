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


  const serviceTypeId = new mongoose.Types.ObjectId(
    "69a549b6d984ff5aad08eead"
  );

  const result = await User.updateMany(
    {}, // 👈 all users
    {
      $set: { serviceType: [serviceTypeId] }, // overwrite with array
    }
  );

  console.log("Migration complete:", result);

  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
