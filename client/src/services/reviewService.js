
import api from "./api";

// Get all reviews for a specific college
export const getReviewsByCollege = async (collegeId) => {
  const response = await api.get("/reviews", {
    params: { college: collegeId },
  });

  return response.data;
};

// Get a single review by ID
export const getReviewById = async (reviewId) => {
  const response = await api.get(`/reviews/${reviewId}`);

  return response.data;
};

// Create a new review
export const createReview = async (reviewData) => {
  const response = await api.post("/reviews", reviewData);

  return response.data;
};

// Update an existing review
export const updateReview = async (reviewId, reviewData) => {
  const response = await api.patch(
    `/reviews/${reviewId}`,
    reviewData
  );

  return response.data;
};

// Delete a review
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);

  return response.data;
};

// Get reviews submitted by the logged-in user
export const getMyReviews = async () => {
  const response = await api.get("/reviews/my-reviews");

  return response.data;
};
