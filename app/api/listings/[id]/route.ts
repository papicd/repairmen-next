import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
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

// GET: Get a single listing by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    const listing = await Listing.findById(id)
      .populate("owner", "firstName lastName username email phone")
      .populate("place", "country place currency")
      .populate("serviceType", "type description price");

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("GET LISTING ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT: Close or reopen a listing (owner only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json();
    const { closed } = body;

    // Find the listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    // Check if user is the owner
    if (listing.owner.toString() !== decoded.userId) {
      return NextResponse.json(
        { message: "You can only modify your own listings" },
        { status: 403 }
      );
    }

    // Update the closed status
    listing.closed = closed !== undefined ? closed : !listing.closed;
    await listing.save();

    // Populate the updated listing
    const updatedListing = await Listing.findById(id)
      .populate("owner", "firstName lastName username email phone")
      .populate("place", "country place currency")
      .populate("serviceType", "type description price");

    return NextResponse.json({
      message: listing.closed ? "Listing closed successfully" : "Listing reopened successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.error("UPDATE LISTING ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a listing (owner only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Find the listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    // Check if user is the owner
    if (listing.owner.toString() !== decoded.userId) {
      return NextResponse.json(
        { message: "You can only delete your own listings" },
        { status: 403 }
      );
    }

    // Delete the listing
    await Listing.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("DELETE LISTING ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
