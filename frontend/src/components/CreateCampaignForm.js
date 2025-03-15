import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/createCampaignForm.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNotificationContext } from "../hooks/useNotificationContext";

const CreateCampaignForm = () => {
  const { id } = useParams(); // Get campaign ID if editing
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "",
    subcategory: "",
    endDate: "",
    goalAmount: "",
    projectStory: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { dispatch } = useNotificationContext();

  // Fetch existing campaign data if editing
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/campaigns/${id}`)
        .then((response) => {
          const campaignData = response.data.data.campaign;

          setFormData((prev) => ({
            ...prev,
            ...response.data.data.campaign,
            image: prev.image || response.data.data.campaign.image,
          }));

          // Convert ISO date to "YYYY-MM-DDTHH:mm" format
          const formattedDate = campaignData.endDate
            ? new Date(campaignData.endDate).toISOString().slice(0, 16)
            : "";

          setFormData((prev) => ({ ...prev, endDate: formattedDate }));
          // setImagePreview(response.data.data.campaign.image);

          // Fix image preview path
          if (campaignData.image) {
            const fixedImageUrl = campaignData.image.startsWith("http")
              ? campaignData.image
              : `http://localhost:5000/api/${campaignData.image.replace(
                  /\\/g,
                  "/"
                )}`;

            setImagePreview(fixedImageUrl);
          } else {
            setImagePreview("");
          }
        })
        .catch((error) => console.error("Error fetching campaign:", error));
    }
  }, [id]);
  //fix this
  // if (an && user._id !== formData.owner) navigate("/");

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      e.target.value = null;
    }
  };

  //create notification

  const createNotification = async (message) => {
    try {
      const notificationRes = await axios.post(
        `http://localhost:5000/api/notification/`,
        { userId: user._id, message },
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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("category", formData.category);
      data.append("subcategory", formData.subcategory);
      data.append("endDate", formData.endDate);
      data.append("goalAmount", formData.goalAmount);
      data.append("projectStory", formData.projectStory);
      data.append("owner", user._id);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (id) {
        // Editing existing campaign
        const response = await axios.patch(
          `http://localhost:5000/api/campaigns/${id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (response.status) {
          createNotification(`Campaign updated successfully! `);
          setSuccess("Campaign updated successfully!");
        }
      } else {
        // Creating new campaign
        const response = await axios.post(
          "http://localhost:5000/api/campaigns/creation",
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.status) {
          createNotification(
            `${formData.title} campaign created successfully!`
          );
          setSuccess("Campaign created successfully!");
        }
      }

      setTimeout(() => navigate("/"), 1500); // Redirect to home after success
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while saving."
      );
      createNotification(
        `${err.response?.data?.message || "An error occurred while saving."} `
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>{id ? "Edit Campaign" : "Create a Campaign"}</h2>

        <label>
          Title
          <input
            type="text"
            name="title"
            maxLength="60"
            placeholder="Enter the title (Max 60 characters)"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Subtitle
          <input
            type="text"
            name="subtitle"
            maxLength="135"
            placeholder="Enter the subtitle (Max 135 characters)"
            value={formData.subtitle}
            onChange={handleChange}
          />
        </label>

        <label>
          Primary Category
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Art">Art</option>
            <option value="Food">Food</option>
            <option value="Discover">Discover</option>
            <option value="Environment">Environment</option>
            <option value="Others">Others</option>
          </select>
        </label>

        <label>
          Primary Subcategory
          <input
            type="text"
            name="subcategory"
            placeholder="Enter the subcategory"
            value={formData.subcategory}
            onChange={handleChange}
          />
        </label>

        <label>Upload an Image</label>

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
                  style={{
                    width: "50%",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
            {formData.image instanceof File
              ? formData.image.name
              : "No file chosen"}
          </span>
          <button type="button">Choose File</button>
        </div>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }} // Hides input but keeps it functional
          onChange={handleFileChange}
        />

        <label>
          End on a Specific Date & Time
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)}
            required
          />
        </label>

        <label>
          Goal Amount (RS)
          <input
            type="number"
            name="goalAmount"
            placeholder="Enter your goal amount"
            value={formData.goalAmount}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Project Story
          <textarea
            name="projectStory"
            placeholder="Describe the project in detail..."
            value={formData.projectStory}
            onChange={handleChange}
            rows="5"
          ></textarea>
        </label>

        <button type="submit" disabled={loading}>
          {loading
            ? "Submitting..."
            : id
            ? "Update Campaign"
            : "Create Campaign"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
};

export default CreateCampaignForm;
