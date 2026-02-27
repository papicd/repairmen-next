import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import { connectDB } from "../lib/mongodb";
import User from "../models/User";

async function runMigration() {
  await connectDB();

  const updates = [
    {
      id: "6990b2293d5da8381ab40877",
      phone: "+0000000000",
    },
    {
      id: "69930fe602e9c23835405530",
      phone: "+11111111111111",
    },
  ];

  for (const user of updates) {
    const result = await User.updateOne(
      { _id: user.id },
      { $set: { phone: user.phone } }
    );

    console.log(`Updated user ${user.id}:`, result.modifiedCount === 1 ? "OK" : "NOT FOUND");
  }

  console.log("Phone migration complete");
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
