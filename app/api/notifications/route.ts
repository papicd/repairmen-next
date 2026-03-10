import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// Middleware to verify authentication and get user
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };
    return decoded;
  } catch {
    return null;
  }
}

// GET: Get notifications for the logged-in user
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyAuth();
    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    // Build query
    const query: any = { recipient: decoded.userId };
    
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate("sender", "firstName lastName username email phone")
      .populate("listing", "name type")
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: decoded.userId,
      isRead: false,
    });

    return NextResponse.json({ 
      notifications,
      unreadCount 
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// POST: Create a notification (when user applies for a listing)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyAuth();
    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { listingId, message } = body;

    // Validate required fields
    if (!listingId) {
      return NextResponse.json(
        { message: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Get the listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    // Check if the listing is closed
    if (listing.closed) {
      return NextResponse.json(
        { message: "This listing is closed" },
        { status: 400 }
      );
    }

    // Check if user is applying to their own listing
    if (listing.owner.toString() === decoded.userId) {
      return NextResponse.json(
        { message: "You cannot apply to your own listing" },
        { status: 400 }
      );
    }

    // Check if user is serviceProvider when applying to demand
    if (listing.type === "demand" && !sender.isServiceProvider) {
      return NextResponse.json(
        { message: "Only service providers can apply for demands" },
        { status: 400 }
      );
    }

    // Get sender info
    const sender = await User.findById(decoded.userId);
    if (!sender) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Create notification message
    const notificationMessage = message || 
      `${sender.firstName} ${sender.lastName} has applied for your listing "${listing.name}"`;

    // Create notification
    const notification = await Notification.create({
      recipient: listing.owner,
      sender: decoded.userId,
      listing: listingId,
      type: "apply",
      message: notificationMessage,
      applicationStatus: "pending",
    });

    // Populate the notification
    const populatedNotification = await Notification.findById(notification._id)
      .populate("sender", "firstName lastName username email phone")
      .populate("listing", "name type");

    return NextResponse.json({
      message: "Application submitted successfully",
      notification: populatedNotification,
    });
  } catch (error) {
    console.error("CREATE NOTIFICATION ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT: Mark notifications as read or accept/deny application
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyAuth();
    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { notificationIds, markAllRead, acceptApplication, denyApplication, notificationId } = body;

    // Handle accept/deny application
    if (notificationId && (acceptApplication || denyApplication)) {
      const notification = await Notification.findById(notificationId);
      
      if (!notification) {
        return NextResponse.json(
          { message: "Notification not found" },
          { status: 404 }
        );
      }

      // Verify the user is the owner of the listing
      const listing = await Listing.findById(notification.listing);
      if (!listing || listing.owner.toString() !== decoded.userId) {
        return NextResponse.json(
          { message: "You can only respond to applications for your own listings" },
          { status: 403 }
        );
      }

      // Get the applicant (sender) info
      const applicant = await User.findById(notification.sender);
      if (!applicant) {
        return NextResponse.json(
          { message: "Applicant not found" },
          { status: 404 }
        );
      }

      // Get the owner info for contact details
      const owner = await User.findById(decoded.userId);

      // Update the original notification status
      const newStatus = acceptApplication ? "accepted" : "denied";
      notification.applicationStatus = newStatus;
      await notification.save();

      // Create response notification to the applicant
      let responseMessage: string;
      if (acceptApplication) {
        // Include owner's contact info in the acceptance message
        const contactInfo = [];
        if (owner?.email) contactInfo.push(`email: ${owner.email}`);
        if (owner?.phone) contactInfo.push(`phone: ${owner.phone}`);
        
        responseMessage = `Your application for "${listing.name}" has been accepted! You can contact the owner at: ${contactInfo.join(", ")}`;
      } else {
        responseMessage = `Your application for "${listing.name}" has been denied.`;
      }

      await Notification.create({
        recipient: notification.sender,
        sender: decoded.userId,
        listing: notification.listing,
        type: "info",
        message: responseMessage,
        applicationStatus: newStatus,
      });

      return NextResponse.json({
        message: acceptApplication ? "Application accepted" : "Application denied",
      });
    }

    // Handle mark as read
    if (markAllRead) {
      // Mark all notifications as read
      await Notification.updateMany(
        { recipient: decoded.userId, isRead: false },
        { isRead: true }
      );
    } else if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      await Notification.updateMany(
        { 
          _id: { $in: notificationIds },
          recipient: decoded.userId 
        },
        { isRead: true }
      );
    }

    return NextResponse.json({
      message: "Notifications marked as read",
    });
  } catch (error) {
    console.error("UPDATE NOTIFICATIONS ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
