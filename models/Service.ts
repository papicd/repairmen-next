import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
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

    price: {
      type: Number,
      required: false,
    },

    date: {
      type: Date,
      required: false
    }
  },
  { timestamps: true }
);

export default mongoose.models.Service ||
mongoose.model("Service", ServiceSchema);
