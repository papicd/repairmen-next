import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isServiceProvider: {
      type: Boolean,
      default: false,
    },
    isAdmin: { type: Boolean, default: false },
    phone: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
mongoose.model("User", UserSchema);
