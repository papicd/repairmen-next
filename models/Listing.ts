import mongoose from "mongoose";

export type ListingType = "offer" | "demand";

export interface IListing {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  place: mongoose.Types.ObjectId;
  serviceType: mongoose.Types.ObjectId;
  closed: boolean;
  priceRange?: string;
  date?: Date;
  type: ListingType;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new mongoose.Schema<IListing>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },

    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceType",
      required: true,
    },

    priceRange: {
      type: String,
      required: false,
    },

    date: {
      type: Date,
      required: false,
    },

    type: {
      type: String,
      enum: ["offer", "demand"],
      required: true,
    },

    closed: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Listing ||
  mongoose.model("Listing", ListingSchema);
