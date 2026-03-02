import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      trim: true,
    },

    place: {
      type: String,
      required: true,
      trim: true,
    },

    currency: {
      type: String,
      required: false,
    },

  },
  { timestamps: true }
);

export default mongoose.models.Place ||
mongoose.model("Place", PlaceSchema);
