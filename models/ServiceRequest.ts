import mongoose from "mongoose";

const ServiceRequestSchema = new mongoose.Schema(
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

    requestOwner: {
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
      required: false
    }
  },
  { timestamps: true }
);

export default mongoose.models.ServiceRequest ||
mongoose.model("ServiceRequest", ServiceRequestSchema);
