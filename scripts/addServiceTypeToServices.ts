import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import { connectDB } from "../lib/mongodb";
import User from "../models/User";
import Service from '../models/Service';
import ServiceRequest from '../models/ServiceRequest';

async function runMigration() {
  await connectDB();

  const serviceType = new mongoose.Types.ObjectId(
    "69a549b6d984ff5aad08eead"
  );
  // const resultUser = await User.updateMany(
  //   { }, // all users
  //   { $set: { serviceType: serviceType } }
  // );

  const resultService = await Service.updateMany(
    { }, // all users
    { $set: { serviceType: serviceType } }
  );

  const resultServiceRequest = await ServiceRequest.updateMany(
    { }, // all users
    { $set: { serviceType: serviceType } }
  );

  // console.log("Migration complete:", resultUser);
  console.log("Migration complete:", resultService);
  console.log("Migration complete:", resultServiceRequest);

  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
