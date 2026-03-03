import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// Ensure all models are registered before any operation
function registerModels() {
  // These imports register the schemas with mongoose
  require("@/models/User");
  require("@/models/Place");
  require("@/models/ServiceType");
  require("@/models/Service");
  require("@/models/ServiceRequest");
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      // Register all models after connection
      registerModels();
      console.log("Connected to DB:", mongoose.connection.name);
      console.log("Host:", mongoose.connection.host);
      console.log("Port:", mongoose.connection.port);
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

