
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/seo/mongodb";
import User from "@/models/User";
import Booking from "@/models/Booking";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth("admin");
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(
      1,
      Math.min(100, parseInt(searchParams.get("limit") || "10")),
    );
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const verified = searchParams.get("verified");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (role && role !== "all") {
      query.role = role;
    }

    if (status && status !== "all") {
      if (status === "banned") {
        query.banned = true;
      } else {
        query.status = status;
        query.banned = false;
      }
    }

    if (verified) {
      query.verified = verified === "true";
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder;

    // Fetch users
    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .lean(),
      User.countDocuments(query),
    ]);

    // Get booking stats for users
    const userIds = users.map((u) => u._id);
    const bookingStats = await Booking.aggregate([
      {
        $match: {
          user: { $in: userIds },
          paymentStatus: { $in: ["paid", "partial"] },
        },
      },
      {
        $group: {
          _id: "$user",
          totalBookings: { $sum: 1 },
        },
      },
    ]);

    // Create stats map
    const statsMap = new Map();
    bookingStats.forEach((stat) => {
      statsMap.set(stat._id.toString(), stat);
    });

    // Calculate stats
    const stats = {
      total: await User.countDocuments(),
      active: await User.countDocuments({ status: "active", banned: false }),
      inactive: await User.countDocuments({
        status: "inactive",
        banned: false,
      }),
      banned: await User.countDocuments({ banned: true }),
      verified: await User.countDocuments({ verified: true }),
      unverified: await User.countDocuments({ verified: false }),
      clients: await User.countDocuments({ role: "client" }),
      guides: await User.countDocuments({ role: "guide" }),
      admins: await User.countDocuments({ role: "admin" }),
      owners: await User.countDocuments({ role: "owner" }),
    };

    // Enhance users with stats
    const enhancedUsers = users.map((u) => ({
      ...u,
      _id: u._id.toString(),
      id: u._id.toString(),
      bookingsCount: statsMap.get(u._id.toString())?.totalBookings || 0,
      totalSpent: statsMap.get(u._id.toString())?.totalSpent || 0,
      createdAt: u.createdAt?.toISOString(),
      updatedAt: u.updatedAt?.toISOString(),
      joinedAt: u.createdAt?.toISOString(),
      lastActive: u.lastActive?.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: enhancedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
      stats,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth("owner");
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email", "password", "role"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Generate ID
    const count = await User.countDocuments();
    const prefix = data.role.substring(0, 3);
    const id = `${prefix}-${(count + 1).toString().padStart(3, "0")}`;

    // Create user
    const newUser = await User.create({
      ...data,
      id,
      password: hashedPassword,
      verified: data.verified || false,
      status: data.status || "active",
      banned: false,
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json(
      {
        success: true,
        data: {
          ...userResponse,
          _id: userResponse._id.toString(),
          id: userResponse.id,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 },
    );
  }
}

