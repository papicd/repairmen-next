import mongoose from "mongoose";

const ServiceTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: false,
      trim: true,
    },

    price: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ServiceType ||
mongoose.model("ServiceType", ServiceTypeSchema);
