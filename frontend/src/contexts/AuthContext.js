import { createContext, useReducer, useEffect } from "react";
import { refreshAccessToken } from "../services/authService";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    case "UPDATE_USER":
      return { user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        let user = JSON.parse(userJson);

        const refreshAccToken = async () => {
          try {
            const newAccessToken = await refreshAccessToken(); // Refresh token
            user = { ...user, accessToken: newAccessToken };
            localStorage.setItem("user", JSON.stringify(user)); // Save new token
            dispatch({ type: "LOGIN", payload: user });
          } catch (error) {
            console.error("Token refresh failed:", error);
            localStorage.removeItem("user");
            dispatch({ type: "LOGOUT" });
          }
        };

        refreshAccToken();
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
