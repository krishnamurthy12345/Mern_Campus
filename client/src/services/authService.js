
import api from "./api";

// Register a new user
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response;
};

// Login an existing user
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response;
};

// Get the currently logged-in user's details
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response;
};
