
import { useCallback, useEffect, useState } from "react";

import { getCollegeById } from "../services/collegeService";
import {
  getReviewsByCollege,
  createReview,
  updateReview,
  deleteReview,
} from "../services/reviewService";

function CollegeDetails({ college: initialCollege, user, onBack, onAuth }) {
  const id = initialCollege?._id || initialCollege?.id;

  const [college, setCollege] = useState(initialCollege || null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingReview, setEditingReview] = useState(null);
const [deletingReviewId, setDeletingReviewId] = useState(null);

  const loadCollegeDetails = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [collegeResponse, reviewResponse] =
        await Promise.all([
          getCollegeById(id),
          getReviewsByCollege(id),
        ]);


const collegeData =
  collegeResponse?.data?.data ?? collegeResponse?.data;

if (!collegeData?._id && !collegeData?.id) {
  throw new Error("College not found.");
}

setCollege(collegeData);

const reviewData = reviewResponse?.data;
const reviewList = Array.isArray(reviewData)
  ? reviewData
  : reviewData?.data;

if (!Array.isArray(reviewList)) {
  throw new Error("Invalid reviews response.");
}

setReviews(reviewList);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load college details."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCollegeDetails();
  }, [loadCollegeDetails]);

  const averageRating = reviews.length
    ? (
        reviews.reduce(
          (total, review) =>
            total + Number(review.rating || 0),
          0
        ) / reviews.length
      ).toFixed(1)
    : "0.0";

    
const handleEditReview = (review) => {
  setEditingReview(review);
  setRating(Number(review.rating));
  setComment(review.comment || "");
  setError("");
  setMessage("");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleCancelEdit = () => {
  setEditingReview(null);
  setRating(5);
  setComment("");
  setError("");
};

const handleDeleteReview = async (reviewId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete your review?"
  );

  if (!confirmed) return;

  setDeletingReviewId(reviewId);
  setError("");
  setMessage("");

  try {
    await deleteReview(reviewId);

    setReviews((current) =>
      current.filter((review) => review._id !== reviewId)
    );

    if (editingReview?._id === reviewId) {
      handleCancelEdit();
    }

    setMessage("Your review was deleted successfully.");
  } catch (err) {
    setError(
      err.response?.data?.message ||
        err.message ||
        "Failed to delete review."
    );
  } finally {
    setDeletingReviewId(null);
  }
};


  const handleSubmitReview = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!user) {
      setError("Please log in to submit a review.");
      return;
    }

    if (!comment.trim()) {
      setError("Please enter your review.");
      return;
    }

    setSubmitting(true);

    
try {
  if (editingReview) {
    await updateReview(editingReview._id, {
      rating: Number(rating),
      comment: comment.trim(),
    });

    setMessage("Your review was updated successfully.");
    setEditingReview(null);
  } else {
    await createReview({
      college: id,
      rating: Number(rating),
      comment: comment.trim(),
    });

    setMessage("Your review was submitted successfully.");
  }

  setComment("");
  setRating(5);

  await loadCollegeDetails();
} catch (err) {
  setError(
    err.response?.data?.message ||
      err.message ||
      "Failed to save review."
  );
} finally {
  setSubmitting(false);
}

  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">
            Loading college details...
          </p>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <h2 className="text-2xl font-bold text-slate-800">
          College not found
        </h2>
        <p className="text-center text-slate-500">
          {error || "The requested college could not be found."}
        </p>
        <button
  type="button"
  onClick={onBack}
  className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
>
  <span aria-hidden="true">←</span>
  Back to Colleges
</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button
  type="button"
  onClick={onBack}
  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
>
  Back to Colleges
</button>

        {/* College information */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-10 text-white sm:px-10">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              College Overview
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {college.name}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-sm text-blue-100 sm:text-base">
              <span aria-hidden="true">📍</span>
              {college.location}
            </p>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                About this College
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                {college.description ||
                  "No description is available for this college yet."}
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-5 text-center">
              <p className="text-3xl font-bold text-slate-900">
                <span className="text-amber-500">★</span>{" "}
                {averageRating}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">
                Average Rating
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        </section>

        {/* Feedback messages */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Submit review */}
          <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
  {editingReview ? "Edit Your Review" : "Write a Review"}
</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Share your experience to help other students.
            </p>

            {user ? (
              <form
                onSubmit={handleSubmitReview}
                className="mt-6 space-y-5"
              >
                <div>
                  <label
                    htmlFor="review-rating"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Your Rating
                  </label>

                  <select
                    id="review-rating"
                    value={rating}
                    onChange={(event) =>
                      setRating(Number(event.target.value))
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value={5}>★★★★★ — Excellent</option>
                    <option value={4}>★★★★ — Very Good</option>
                    <option value={3}>★★★ — Good</option>
                    <option value={2}>★★ — Fair</option>
                    <option value={1}>★ — Poor</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="review-comment"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Your Review
                  </label>

                  <textarea
  id="review-comment"
  value={comment}
  onChange={(event) => setComment(event.target.value)}
  rows={5}
  minLength={3}
  maxLength={2000}
  required
  placeholder="Tell us about the faculty, campus, facilities, and student experience..."
  className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
/>

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {comment.length}/2000
                  </p>
                </div>

               <button
  type="submit"
  disabled={submitting}
  className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
>
  {submitting
    ? "Saving..."
    : editingReview
      ? "Update Review"
      : "Submit Review"}
</button>

{editingReview && (
  <button
    type="button"
    onClick={handleCancelEdit}
    className="w-full rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
  >
    Cancel Edit
  </button>
)}
              </form>
            ) : (
              <div className="mt-6 rounded-xl bg-slate-50 p-5 text-center">
                <p className="text-sm text-slate-600">
                  Please log in to share your experience.
                </p>
                <button
  type="button"
  onClick={() => onAuth("login")}
  className="mt-4 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
>
  Log In
</button>
              </div>
            )}
          </section>

          {/* Reviews list */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Student Reviews
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Honest feedback from students
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                {reviews.length} total
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                <div className="text-4xl">💬</div>
                <h3 className="mt-4 font-semibold text-slate-800">
                  No reviews yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Be the first to share your experience!
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {reviews.map((review) => {
                  const stars = Math.max(
                    0,
                    Math.min(5, Number(review.rating) || 0)
                  );

                  return (
                    <article
                      key={review._id}
                      className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-200"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {review.user?.name ||
                              review.user?.username ||
                              "Student"}
                          </h3>

                          {review.createdAt && (
                            <p className="mt-1 text-xs text-slate-400">
                              {new Date(
                                review.createdAt
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <span
                          className="text-lg tracking-wider text-amber-500"
                          aria-label={`${stars} out of 5 stars`}
                        >
                          {"★".repeat(stars)}
                          <span className="text-slate-200">
                            {"★".repeat(5 - stars)}
                          </span>
                        </span>
                      </div>

                      
{user &&
  String(
    review.user?._id || review.user?.id || review.user
  ) ===
    String(user._id || user.id || user.userId || user._id?.toString()) && (
    <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={() => handleEditReview(review)}
        className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
      >
        Edit Review
      </button>

      <button
        type="button"
        disabled={deletingReviewId === review._id}
        onClick={() => handleDeleteReview(review._id)}
        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
      >
        {deletingReviewId === review._id
          ? "Deleting..."
          : "Delete Review"}
      </button>
    </div>
  )}

                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default CollegeDetails;
