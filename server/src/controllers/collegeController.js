
const College = require("../models/College");
const Review = require("../models/Review");

async function createCollege(req, res, next) {
  try {
    const college = await College.create(req.body);

    res.status(201).json({
      success: true,
      data: college,
    });
  } catch (error) {
    next(error);
  }
}

async function getColleges(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const search = String(req.query.search || "").trim();

    const filter = search
      ? { name: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }
      : {};

    const [colleges, total] = await Promise.all([
      College.find(filter)
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      College.countDocuments(filter),
    ]);

    const ids = colleges.map((college) => college._id);

    const stats = await Review.aggregate([
      { $match: { college: { $in: ids } } },
      {
        $group: {
          _id: "$college",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const statsMap = new Map(
      stats.map((item) => [item._id.toString(), item])
    );

    const data = colleges.map((college) => {
      const stat = statsMap.get(college._id.toString());

      return {
        ...college,
        averageRating: stat
          ? Math.round(stat.averageRating * 100) / 100
          : 0,
        reviewCount: stat ? stat.reviewCount : 0,
      };
    });

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

async function getCollegeById(req, res, next) {
  try {
    const college = await College.findById(req.params.id).lean();

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    const [stat] = await Review.aggregate([
      { $match: { college: college._id } },
      {
        $group: {
          _id: "$college",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        ...college,
        averageRating: stat
          ? Math.round(stat.averageRating * 100) / 100
          : 0,
        reviewCount: stat ? stat.reviewCount : 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updateCollege(req, res, next) {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.json({ success: true, data: college });
  } catch (error) {
    next(error);
  }
}

async function deleteCollege(req, res, next) {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    await Review.deleteMany({ college: college._id });
    await college.deleteOne();

    res.json({
      success: true,
      message: "College and its reviews deleted",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCollege,
  getColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
};
