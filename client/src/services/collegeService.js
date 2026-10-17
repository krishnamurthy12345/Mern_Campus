
import api from "./api";

// Get all colleges
export const getColleges = async (params = {}) => {
  const response = await api.get("/colleges", { params });
  return response.data;
};

// Get a single college by ID
export const getCollegeById = async (id) => {
  const response = await api.get(`/colleges/${id}`);
  return response.data;
};

// Create a new college (Admin only)
export const createCollege = async (collegeData) => {
  const response = await api.post("/colleges", collegeData);
  return response.data;
};

// Update an existing college (Admin only)
export const updateCollege = async (id, collegeData) => {
  const response = await api.patch(`/colleges/${id}`, collegeData);
  return response.data;
};

// Delete a college (Admin only)
export const deleteCollege = async (id) => {
  const response = await api.delete(`/colleges/${id}`);
  return response.data;
};
