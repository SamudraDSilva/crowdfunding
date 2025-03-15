import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNotificationContext } from "../hooks/useNotificationContext";
import axios from "axios";
export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const { dispatch: notificationDispatch } = useNotificationContext();

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
        dispatch({
          type: "CREATE_NOTIFICATION",
          payload: notificationRes.data,
        });
      }
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  const signup = async (username, email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context
      dispatch({ type: "LOGIN", payload: json });

      createNotification(json, `Welcome ${username.toUpperCase()}`);

      // update loading state
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
