import React, { useState, useEffect } from "react";
import { useNotificationContext } from "../hooks/useNotificationContext";
import axios from "axios";
import "../styles/campaignEditModal.css";

const CampaignEditModal = ({
  isOpen,
  initialCampaignData,
  onClose,
  onCampaignUpdated,
}) => {
  const [campaignData, setCampaignData] = useState(initialCampaignData || {});
  const [imagePreview, setImagePreview] = useState(
    initialCampaignData?.image || ""
  ); // Store current image preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch: notificationDispatch } = useNotificationContext();

  useEffect(() => {
    if (initialCampaignData) {
      // Convert ISO date to "YYYY-MM-DDTHH:mm" format
      setCampaignData(initialCampaignData);
      const formattedDate = initialCampaignData.endDate
        ? new Date(initialCampaignData.endDate).toISOString().slice(0, 16)
        : "";

      setCampaignData((prev) => ({ ...prev, endDate: formattedDate }));

      if (initialCampaignData.image.startsWith("http")) {
        setImagePreview(initialCampaignData.image); // Already a full URL
      } else {
        setImagePreview(
          `http://localhost:5000/api/${initialCampaignData.image.replace(
            /\\/g,
            "/"
          )}`
        );
      }
    }
  }, [initialCampaignData]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setCampaignData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createNotification = async (message) => {
    try {
      const notificationRes = await axios.post(
        `http://localhost:5000/api/notification/`,
        {
          userId: campaignData?.owner,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCampaignData((prev) => ({
        ...prev,
        image: file, // Store file for upload
      }));
      setImagePreview(URL.createObjectURL(file)); // Preview new image
      e.target.value = null;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.keys(campaignData).forEach((key) => {
        if (key === "image" && typeof campaignData.image === "string") {
          // Don't append if the image is still a URL (unchanged)
          return;
        }
        formData.append(key, campaignData[key]);
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/campaign/${campaignData._id}`,
        {
          method: "PATCH",
          body: formData, // Send formData instead of JSON
        }
      );
      const json = await response.json();

      if (!response.ok) {
        throw new Error("Failed to update campaign");
      }

      if (
        campaignData.status === "Active" &&
        initialCampaignData.status !== "Active"
      ) {
        createNotification(`${campaignData.title} Campaign is now active!`);
      }
      const updatedCampaign = json.data.campaign;
      onCampaignUpdated(updatedCampaign);
      onClose();
    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Campaign</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>Title:</label>
        <input
          type="text"
          value={campaignData.title || ""}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />

        <label>Subtitle:</label>
        <input
          type="text"
          value={campaignData.subtitle || ""}
          onChange={(e) => handleInputChange("subtitle", e.target.value)}
        />

        <label>Category:</label>
        <select
          value={campaignData.category || ""}
          onChange={(e) => handleInputChange("category", e.target.value)}
        >
          <option value="Technology">Technology</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Art">Art</option>
          <option value="Food">Food</option>
          <option value="Discover">Discover</option>
          <option value="Environment">Environment</option>
          <option value="Others">Others</option>
        </select>

        <label>Subcategory:</label>
        <input
          type="text"
          value={campaignData.subcategory || ""}
          onChange={(e) => handleInputChange("subcategory", e.target.value)}
        />

        <label>Select Date & Time:</label>
        <input
          type="datetime-local"
          value={
            campaignData.endDate ? campaignData.endDate.substring(0, 16) : "0"
          }
          onChange={(e) => handleInputChange("date", e.target.value)}
        />

        <label>Goal Amount:</label>
        <input
          type="number"
          value={campaignData.goalAmount || ""}
          onChange={(e) => handleInputChange("goalAmount", e.target.value)}
        />

        <label>Project Story:</label>
        <textarea
          value={campaignData.projectStory || ""}
          onChange={(e) => handleInputChange("projectStory", e.target.value)}
        />

        <label>Upload a New Image:</label>
        <div
          className="file-input-wrapper"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <span>
            {/* <label>Current Image:</label> */}
            {imagePreview && (
              <div className="image-preview">
                <img
                  src={imagePreview}
                  alt={`Campaign Preview ${imagePreview}`}
                  style={{ width: "50%", borderRadius: "8px" }}
                />
              </div>
            )}
            {campaignData.image?.name || "No new file chosen"}
          </span>
          <button type="button">Choose File</button>
        </div>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <label>Status:</label>
        <select
          value={campaignData.status || ""}
          onChange={(e) => handleInputChange("status", e.target.value)}
        >
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Deactive">Deactive</option>
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
  );
};

export default CampaignEditModal;
