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

// GET: Public can see offers, only logged-in users can see demands
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Check if user is authenticated
    const auth = await verifyAuth();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "offer", "demand", or null for all

    // Build query based on type filter and auth status
    const query: any = {};
    
    if (type === "offer") {
      query.type = "offer";
    } else if (type === "demand") {
      // If not logged in, don't return demands
      if (!auth) {
        return NextResponse.json(
          { message: "Unauthorized - Please login to view demands" },
          { status: 401 }
        );
      }
      query.type = "demand";
    } else if (!type) {
      // If no type specified and user is NOT logged in, only show offers
      if (!auth) {
        query.type = "offer";
      }
      // If logged in, show all (no filter)
    }

    const listings = await Listing.find(query)
      .populate("owner", "firstName lastName username email phone")
      .populate("place", "country place currency")
      .populate("serviceType", "type description price")
      .sort({ createdAt: -1 });

    return NextResponse.json({ listings, isLoggedIn: !!auth });
  } catch (error) {
    console.error("GET LISTINGS ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// POST: Only logged-in users can create
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
    const { name, description, priceRange, date, place, serviceType, type } = body;

    // Validate required fields
    if (!name || !description || !place || !serviceType || !type) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate type
    if (type !== "offer" && type !== "demand") {
      return NextResponse.json(
        { message: "Type must be 'offer' or 'demand'" },
        { status: 400 }
      );
    }

    // priceRange is required for both offers and demands
    if (!priceRange) {
      return NextResponse.json(
        { message: "Price range is required" },
        { status: 400 }
      );
    }

    const newListing = await Listing.create({
      name,
      description,
      priceRange,
      date: date || undefined,
      place,
      serviceType,
      type,
      owner: decoded.userId,
    });

    // Populate the created listing
    const populatedListing = await Listing.findById(newListing._id)
      .populate("owner", "firstName lastName username email phone")
      .populate("place", "country place currency")
      .populate("serviceType", "type description price");

    return NextResponse.json({
      message: "Listing created successfully",
      listing: populatedListing,
    });
  } catch (error) {
    console.error("CREATE LISTING ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
