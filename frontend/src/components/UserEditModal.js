import React, { useState, useEffect } from "react";
import { useNotificationContext } from "../hooks/useNotificationContext";
import axios from "axios";
import "../styles/userEditModal.css";

const UserEditModal = ({ isOpen, initialUserData, onClose, onUserUpdated }) => {
  const [userData, setUserData] = useState(initialUserData || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch: notificationDispatch } = useNotificationContext();

  useEffect(() => {
    if (initialUserData) {
      setUserData(initialUserData);
    }
  }, [initialUserData]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createNotification = async (message) => {
    try {
      const notificationRes = await axios.post(
        `http://localhost:5000/api/notification/`,
        {
          userId: userData._id,
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
        notificationDispatch({
          type: "CREATE_NOTIFICATION",
          payload: notificationRes.data,
        });
      }
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      if (userData.role === "admin" && initialUserData.status !== "admin") {
        createNotification(`You are promoted as an admin.`);
      }

      if (userData.role !== "admin" && initialUserData.role === "admin") {
        createNotification(`You are demoted.`);
      }

      const updatedUser = await response.json();
      onUserUpdated(updatedUser.data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Edit User</h2>
          {error && <p>{error}</p>}

          <label>Username:</label>
          <input
            type="text"
            value={userData.username || ""}
            onChange={(e) => handleInputChange("username", e.target.value)}
          />

          <label>Email:</label>
          <input
            type="email"
            value={userData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />

          <label>Role:</label>
          <select
            value={userData.role || ""}
            onChange={(e) => handleInputChange("role", e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>

          <div style={{ marginTop: "1rem" }}>
            <button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserEditModal;
