import Place from "../models/Place.js";
import Story from "../models/Story.js";
import Founder from "../models/Founder.js";
import Reel from "../models/Reel.js";
import YouTubeVideo from "../models/YouTubeVideo.js";
import Member from "../models/Member.js";
import Trip from "../models/Trip.js";
import Booking from "../models/Booking.js";
import Customer from "../models/Customer.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route  GET /api/dashboard/stats
// @access Private
export const getStats = asyncHandler(async (req, res) => {
  const [
    totalPlaces,
    totalStories,
    totalFounders,
    totalReels,
    totalYouTube,
    totalMembers,
    newMembers,
    totalTrips,
    totalBookings,
    totalCustomers,
    pendingCodPayments,
    recentMembers,
    recentPlaces,
    recentReels,
    recentBookings,
  ] = await Promise.all([
    Place.countDocuments(),
    Story.countDocuments(),
    Founder.countDocuments(),
    Reel.countDocuments(),
    YouTubeVideo.countDocuments(),
    Member.countDocuments(),
    Member.countDocuments({ status: "new" }),
    Trip.countDocuments(),
    Booking.countDocuments(),
    Customer.countDocuments(),
    Booking.countDocuments({ paymentMethod: "COD", paymentStatus: "PENDING" }),
    Member.find().sort({ createdAt: -1 }).limit(5).select("fullName email city createdAt status"),
    Place.find().sort({ createdAt: -1 }).limit(5).select("title slug published createdAt"),
    Reel.find().sort({ createdAt: -1 }).limit(5).select("title instagramUrl createdAt"),
    Booking.find().sort({ createdAt: -1 }).limit(5).populate("trip", "title"),
  ]);

  // Total images = every place's cover + gallery. Cheap enough to compute here
  // rather than maintaining a separate counter.
  const places = await Place.find().select("coverImage gallery");
  const totalImages = places.reduce(
    (sum, p) => sum + (p.coverImage?.url ? 1 : 0) + p.gallery.length,
    0
  );

  const revenueAgg = await Booking.aggregate([
    { $match: { paymentStatus: "PAID" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  res.json({
    success: true,
    stats: {
      totalPlaces,
      totalStories,
      totalImages,
      totalReels,
      totalYouTube,
      totalFounders,
      totalMembers,
      newMembers,
      totalTrips,
      totalBookings,
      totalCustomers,
      pendingCodPayments,
      totalRevenue: revenueAgg[0]?.total || 0,
    },
    recent: { members: recentMembers, places: recentPlaces, reels: recentReels, bookings: recentBookings },
  });
});
