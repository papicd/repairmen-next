import mongoose from "mongoose";

export type NotificationType = "apply" | "info";
export type ApplicationStatus = "pending" | "accepted" | "denied";

export interface INotification {
  _id: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  listing: mongoose.Types.ObjectId;
  type: NotificationType;
  message: string;
  isRead: boolean;
  applicationStatus: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new mongoose.Schema<INotification>(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    type: {
      type: String,
      enum: ["apply", "info"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },

    applicationStatus: {
      type: String,
      enum: ["pending", "accepted", "denied"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
