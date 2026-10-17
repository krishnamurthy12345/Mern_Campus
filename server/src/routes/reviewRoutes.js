
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

const {
  createReview,
  getReviews,
  getReviewById,
  getMyReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const {
  createReviewSchema,
  updateReviewSchema,
  reviewQuerySchema,
} = require("../validators/reviewValidator");

// IMPORTANT: Specific route must come before "/:id"
router.get("/my-reviews", auth, getMyReviews);

router.get("/", validate(reviewQuerySchema, "query"), getReviews);
router.get("/:id", getReviewById);

router.post("/", auth, validate(createReviewSchema), createReview);

router.patch(
  "/:id",
  auth,
  validate(updateReviewSchema),
  updateReview
);

router.delete("/:id", auth, deleteReview);

module.exports = router;
