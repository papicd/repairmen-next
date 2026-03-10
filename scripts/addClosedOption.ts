import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import { connectDB } from "../lib/mongodb";
import Listing from "../models/Listing";
import User from "../models/User";

async function runMigration() {
  await connectDB();

    const result = await Listing.updateMany(
      {  },
      { $set: { closed: false } }
    );



  console.log("Phone migration complete");
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
