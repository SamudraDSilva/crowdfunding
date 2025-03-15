import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNotificationContext } from "./useNotificationContext";
import { login as authLogin } from "../services/authService";

import axios from "axios";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const { dispatch: notifyDispatch } = useNotificationContext(); // Notification context

  const createNotification = async (user, message) => {
    try {
      const notificationRes = await axios.post(
        `http://localhost:5000/api/notification/`,
        {
          userId: user._id,
          message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (notificationRes.status) {
        // update the notification context
        notifyDispatch({
          type: "CREATE_NOTIFICATION",
          payload: notificationRes.data,
        });
      }
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await authLogin(email, password); // Use API service
      localStorage.setItem("user", JSON.stringify(userData));
      dispatch({ type: "LOGIN", payload: userData });

      // Create a login notification
      createNotification(
        userData,
        `Welcome back ${userData.username.toUpperCase()}`
      );

      notifyDispatch({
        type: "CREATE_NOTIFICATION",
        payload: {
          userId: userData._id,
          message: `Welcome back ${userData.username.toUpperCase()}`,
        },
      });
    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
