
const Review = require("../models/Review");
const College = require("../models/College");


async function createReview(req, res, next) {
  try {
    const { college, rating, comment } = req.body;

    if (!college) {
      return res.status(400).json({
        success: false,
        message: "College ID is required",
      });
    }

    const exists = await College.exists({ _id: college });

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // Prevent the same user from reviewing the same college twice.
    const existingReview = await Review.findOne({
      college,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message:
          "You have already reviewed this college. You can update your existing review instead.",
      });
    }

    const review = await Review.create({
      college,
      rating,
      comment,
      user: req.user._id,
    });

    await review.populate("user", "name role");
    await review.populate("college", "name location");

    return res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    // Handle duplicate-key errors from the unique MongoDB index.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this college.",
      });
    }

    next(error);
  }
}


async function getReviews(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const { search, college, rating } = req.query;

    const filter = {};

    if (college) filter.college = college;
    if (rating !== undefined) filter.rating = Number(rating);

    if (search) {
      filter.comment = {
        $regex: String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    const [data, total] = await Promise.all([
      Review.find(filter)
        .populate("user", "name role")
        .populate("college", "name location")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Review.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}


async function getMyReviews(req, res, next) {
  try {
    const reviews = await Review.find({
      user: req.user._id,
    })
      .populate("college", "name location")
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
}


async function getReviewById(req, res, next) {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "name role")
      .populate("college", "name location");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

async function updateReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You cannot update another user's review",
      });
    }

    if (req.body.rating !== undefined) {
      review.rating = req.body.rating;
    }

    if (req.body.comment !== undefined) {
      review.comment = req.body.comment;
    }

    await review.save();
    await review.populate("user", "name role");
    await review.populate("college", "name location");

    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

async function deleteReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete another user's review",
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  getMyReviews,
  updateReview,
  deleteReview,
};