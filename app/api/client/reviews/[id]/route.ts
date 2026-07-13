import { requireAuthFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/seo/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Review from "@/models/Review";
import Tour from "@/models/Tour";
import Destination from "@/models/Destination";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuthFromRequest(req);

    await connectToDatabase();

    const { id: reviewId } = await params;

    const review = await Review.findOne({
      $or: [{ _id: reviewId }, { id: reviewId }],
      userId: user.userId,
    }).lean();

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 },
      );
    }

    // Get item details
    let itemName = "";
    let itemImage = "";

    if (review.itemType === "tour") {
      const tour = await Tour.findOne({
        $or: [{ _id: review.itemId }, { id: review.itemId }],
      }).lean();
      itemName = tour?.name || "Unknown Tour";
      itemImage = tour?.images?.[0] || "";
    } else if (review.itemType === "destination") {
      const destination = await Destination.findOne({
        $or: [{ _id: review.itemId }, { id: review.itemId }],
      }).lean();
      itemName = destination?.name || "Unknown Destination";
      itemImage = destination?.images?.[0] || "";
    }

    return NextResponse.json({
      success: true,
      data: {
        id: review._id.toString(),
        itemId: review.itemId,
        itemType: review.itemType,
        itemName,
        itemImage,
        rating: review.rating,
        title: review.title,
        content: review.content,
        pros: review.pros || [],
        cons: review.cons || [],
        images: review.images || [],
        helpful: review.helpful || 0,
        verified: review.verified || false,
        status: review.status || "pending",
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        response: review.response
          ? {
              content: review.response.content,
              createdAt: review.response.createdAt,
              author: review.response.author,
            }
          : undefined,
      },
    });
  } catch (error: any) {
    console.error("Error fetching review:", error);

    if (error.message === "Authentication required") {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch review" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuthFromRequest(req);

    await connectToDatabase();

    const { id: reviewId } = await params;
    const updates = await req.json();

    const review = await Review.findOne({
      $or: [{ _id: reviewId }, { id: reviewId }],
      userId: user.userId,
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 },
      );
    }

    // Only allow editing if review is pending
    if (review.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot edit a review that has been published",
        },
        { status: 400 },
      );
    }

    // Update fields
    const allowedUpdates = [
      "rating",
      "title",
      "content",
      "pros",
      "cons",
      "images",
    ];

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        review[field] = updates[field];
      }
    });

    review.updatedAt = new Date();

    await review.save();

    return NextResponse.json({
      success: true,
      data: {
        id: review._id.toString(),
        ...review.toObject(),
      },
    });
  } catch (error: any) {
    console.error("Error updating review:", error);

    if (error.message === "Authentication required") {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to update review" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuthFromRequest(req);

    await connectToDatabase();

    const { id: reviewId } = await params;

    const review = await Review.findOne({
      $or: [{ _id: reviewId }, { id: reviewId }],
      userId: user.userId,
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 },
      );
    }

    const itemId = review.itemId;
    const itemType = review.itemType;

    await Review.deleteOne({ _id: review._id });

    // Update item's average rating
    await updateItemRating(itemId, itemType);

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting review:", error);

    if (error.message === "Authentication required") {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete review" },
      { status: 500 },
    );
  }
}

async function updateItemRating(itemId: string, itemType: string) {
  try {
    const reviews = await Review.find({
      itemId,
      itemType,
      status: "published",
    });

    const averageRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

    if (itemType === "tour") {
      await Tour.findOneAndUpdate(
        { $or: [{ _id: itemId }, { id: itemId }] },
        {
          rating: Math.round(averageRating * 10) / 10,
          reviewCount: reviews.length,
        },
      );
    } else if (itemType === "destination") {
      await Destination.findOneAndUpdate(
        { $or: [{ _id: itemId }, { id: itemId }] },
        {
          rating: Math.round(averageRating * 10) / 10,
          reviewCount: reviews.length,
        },
      );
    }
  } catch (error) {
    console.error("Error updating item rating:", error);
  }
}
