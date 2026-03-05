import mongoose, { Model } from "mongoose";
import { IUser } from '@/interfaces/IUser';

const UserSchema = new mongoose.Schema<IUser>(
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

    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },

    serviceType: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "ServiceType",
      default: [],
    },

    isServiceProvider: {
      type: Boolean,
      required: false,
    },
    isAdmin: { type: Boolean, default: false, required: true },
    isApproved: { type: Boolean, default: false, required: true },
    phone: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
mongoose.model("User", UserSchema);
