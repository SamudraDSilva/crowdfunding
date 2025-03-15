import api from "./api";

// Login
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  saveUser(response.data); // Store the full user object
  return response.data;
};

// Signup
export const signup = async (username, email, password) => {
  const response = await api.post("/auth/signup", {
    username,
    email,
    password,
  });
  saveUser(response.data);
  return response.data;
};

// Refresh Access Token
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await api.post("/auth/refresh", { refreshToken });

  // Update the stored user object with the new accessToken
  const user = getUser();
  if (user) {
    user.accessToken = response.data.accessToken;
    saveUser(user);
  }

  return response.data.accessToken;
};

// Logout
export const logout = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("user"); // Clear the entire user object
};

// Helper function to save user object
const saveUser = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
};

// Helper function to get user object
const getUser = () => {
  const userJson = localStorage.getItem("user");
  return userJson ? JSON.parse(userJson) : null;
};

// Helper function to get refresh token
const getRefreshToken = () => {
  const user = getUser();
  return user?.refreshToken || null;
};
