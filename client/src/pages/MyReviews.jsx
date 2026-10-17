
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Star, MessageSquare, CalendarDays } from "lucide-react";
import {
  getMyReviews,
  updateReview,
  deleteReview,
} from "../services/reviewService";

function MyReviews({ user, onBack }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingReview, setEditingReview] = useState(null);
const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");
const [saving, setSaving] = useState(false);
const [deletingReviewId, setDeletingReviewId] = useState(null);

  const loadMyReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMyReviews();
      const data = response?.data?.data ?? response?.data;
      const reviewList = Array.isArray(data)
        ? data
        : data?.reviews;

      if (!Array.isArray(reviewList)) {
        throw new Error("Unexpected reviews response format.");
      }

      setReviews(reviewList);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load your reviews."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyReviews();
  }, [loadMyReviews]);

  
const handleSaveEdit = async (event) => {
  event.preventDefault();

  if (!comment.trim()) {
    setError("Please enter your review.");
    return;
  }

  setSaving(true);
  setError("");

  try {
    await updateReview(editingReview._id, {
      rating: Number(rating),
      comment: comment.trim(),
    });

    setEditingReview(null);
    setRating(5);
    setComment("");
    await loadMyReviews();
  } catch (err) {
    setError(
      err.response?.data?.message || "Failed to update review."
    );
  } finally {
    setSaving(false);
  }
};

const handleDelete = async (reviewId) => {
  if (!window.confirm("Are you sure you want to delete this review?")) {
    return;
  }

  setDeletingReviewId(reviewId);
  setError("");

  try {
    await deleteReview(reviewId);

    setReviews((current) =>
      current.filter((review) => review._id !== reviewId)
    );

    if (editingReview?._id === reviewId) {
      setEditingReview(null);
      setComment("");
      setRating(5);
    }
  } catch (err) {
    setError(
      err.response?.data?.message || "Failed to delete review."
    );
  } finally {
    setDeletingReviewId(null);
  }
};


  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">
            My Reviews
          </h1>

          <p className="mt-2 text-slate-600">
            Welcome, {user?.name || user?.username || "Student"}!
          </p>

          <div className="mt-6 flex items-center gap-3 rounded-xl bg-blue-50 p-4">
            <MessageSquare className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-blue-700">
                Total reviews submitted
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {reviews.length}
              </p>
            </div>
          </div>

          {loading ? (
            <p className="py-12 text-center text-slate-500">
              Loading your reviews...
            </p>
          ) : error ? (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
              <p>{error}</p>
              <button
                type="button"
                onClick={loadMyReviews}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center">
              <MessageSquare
                className="mx-auto text-slate-400"
                size={40}
              />
              <h2 className="mt-4 font-semibold text-slate-800">
                No reviews yet
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Visit a college and share your experience.
              </p>
              <button
                type="button"
                onClick={onBack}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Explore Colleges
              </button>
            </div>
          ) : (
            
<div className="mt-6 space-y-4">
  {reviews.map((review) => {
    const reviewRating = Math.max(
      0,
      Math.min(5, Number(review.rating) || 0)
    );

    const collegeName =
      review.college?.name ||
      review.collegeName ||
      "College";

    return (
      <article
        key={review._id}
        className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-200"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {collegeName}
            </h2>

            {review.createdAt && (
              <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <CalendarDays size={14} />
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Star
              size={18}
              className="fill-amber-400 text-amber-400"
            />
            <span className="font-bold text-slate-800">
              {reviewRating}/5
            </span>
          </div>
        </div>

        {editingReview?._id === review._id ? (
          <form onSubmit={handleSaveEdit} className="mt-4 space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Rating
              <select
                value={rating}
                onChange={(event) =>
                  setRating(Number(event.target.value))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} / 5
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Comment
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={2000}
                required
                minLength={3}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingReview(null);
                  setComment("");
                  setRating(5);
                  setError("");
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                {review.comment}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  setEditingReview(review);
                  setRating(Number(review.rating));
                  setComment(review.comment || "");
                  setError("");
                }}
                className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >
                Edit Review
              </button>

              <button
                type="button"
                disabled={deletingReviewId === review._id}
                onClick={() => handleDelete(review._id)}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
              >
                {deletingReviewId === review._id
                  ? "Deleting..."
                  : "Delete Review"}
              </button>
            </div>
          </>
        )}
      </article>
    );
  })}
</div>

          )}
        </section>
      </div>
    </main>
  );
}

export default MyReviews;
