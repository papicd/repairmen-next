import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import { connectDB } from "../lib/mongodb";
import User from "../models/User";
import Place from "../models/Place";

async function createAdminUser() {
  await connectDB();

  // Check if admin already exists
  const existingAdmin = await User.findOne({ isAdmin: true });
  if (existingAdmin) {
    console.log("Admin user already exists!");
    console.log("Admin email:", existingAdmin.email);
    process.exit(0);
  }

  // Get a default place (first one found)
  const defaultPlace = await Place.findOne();
  if (!defaultPlace) {
    console.error("No places found in database. Please add a place first using the admin panel.");
    console.log("You can create a place manually or through the admin UI after setting up the initial admin.");
    
    // Create admin without place temporarily
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      username: "admin",
      password: hashedPassword,
      isAdmin: true,
      isApproved: true,
      place: null,
    });
    
    console.log("Admin user created (without place):");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
    console.log("\nIMPORTANT: Set a place for this user in the database or admin panel!");
    process.exit(0);
  }

  // Create admin with the default place
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await User.create({
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    username: "admin",
    password: hashedPassword,
    isAdmin: true,
    isApproved: true,
    place: defaultPlace._id,
  });

  console.log("Admin user created successfully!");
  console.log("Email: admin@example.com");
  console.log("Password: admin123");
  console.log("Place:", defaultPlace.place, "-", defaultPlace.country);
  
  process.exit(0);
}

createAdminUser().catch((err) => {
  console.error("Failed to create admin user:", err);
  process.exit(1);
});
