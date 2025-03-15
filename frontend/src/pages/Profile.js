import { useEffect, useState } from "react";
import "../styles/profile.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNotificationContext } from "../hooks/useNotificationContext";
import CampaignCard from "../components/CampaignCard";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import api from "../services/api";
import { FaPen, FaCheck } from "react-icons/fa";
import goldAward from "../assets/images/rank-badge/gold.png";
import platinumAward from "../assets/images/rank-badge/platinum.png";
import silverAward from "../assets/images/rank-badge/silver.png";
import bronzeAward from "../assets/images/rank-badge/bronze.png";
import { useNavigate } from "react-router-dom";
const awardImages = {
  gold: goldAward,
  platinum: platinumAward,
  bronze: bronzeAward,
  silver: silverAward,
};

const UserProfile = () => {
  const { user, dispatch } = useAuthContext();
  const { dispatch: notificationDispatch } = useNotificationContext();
  const [rank, setRank] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [donatedCampaigns, setDonatedCampaigns] = useState([]);
  const [donations, setDonations] = useState(0);
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    // email: user?.email || "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;

      try {
        const [rankRes, campaignRes, donationRes, donatedCampaignRes] =
          await Promise.allSettled([
            api.get(`/profile/rank?userId=${user._id}`),
            api.get(`/profile/${user._id}`),
            api.get(`/transaction/totalDonation/${user._id}`),
            api.get(`/transaction/${user._id}`),
          ]);

        console.log(rankRes, campaignRes, donationRes, donatedCampaignRes);

        if (rankRes.status === "fulfilled")
          setRank(rankRes.value.data.data.rank);

        if (campaignRes.status === "fulfilled")
          setCampaigns(campaignRes.value.data.data.campaigns);

        if (donationRes.status === "fulfilled")
          setDonations(donationRes.value.data.total);

        if (donatedCampaignRes.status === "fulfilled")
          setDonatedCampaigns(donatedCampaignRes.value.data.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchUserDetails();
  }, [user]);

  const awardImage = awardImages[rank.toLowerCase()] || null;

  const createNotification = async (message) => {
    try {
      const notificationRes = await api.post(`/notification`, {
        userId: user._id,
        message,
      });

      if (notificationRes.status === 200) {
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

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const updatedData = {};
    if (profileData.username && profileData.username !== user?.username) {
      updatedData.username = profileData.username;
    }
    if (passwordData.newPassword) {
      passwordData.newPassword === passwordData.confirmNewPassword
        ? (updatedData.passwordData = { ...passwordData })
        : setErrorMessage("New passwords do not match");
    }

    if (Object.keys(updatedData).length > 0) {
      try {
        const response = await api.put("/profile/update", {
          userId: user?._id,
          ...updatedData,
          ...updatedData?.passwordData,
        });

        const data = await response.data;
        console.log(data);
        if (response.status === 200) {
          setSuccessMessage(data.message);
          setIsUsernameEditable(false);
          setIsPasswordEditable(false);
          setErrorMessage("");
          dispatch({ type: "UPDATE_USER", payload: updatedData });
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              username: data.user.username,
              accessToken: data.accessToken || user?.accessToken,
              refreshToken: data.refreshToken || user?.refreshToken,
            })
          );

          createNotification("Profile updated successfully");
          setTimeout(() => navigate(`/profile/${data.user.username}`), 500); // Redirect to new profile page
        } else {
          setErrorMessage(data.message || "Error updating profile.");
        }
      } catch (error) {
        setErrorMessage(error.response?.data.message || "Something went wrong");
        setSuccessMessage(""); // Clear any previous success messages

        console.error("Error updating profile:", error);
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="award-container">
        <h1 className="rank-title">{rank}</h1>
        <div className="award-glow"></div>

        {awardImage && (
          <img src={awardImage} alt="User Award" className="award-image" />
        )}
      </div>

      {/* My Created Campaigns */}
      <div className="column campaigns-column">
        <h2>My Campaigns</h2>
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <CampaignCard campaign={campaign} key={campaign._id} />
          ))
        ) : (
          <h4>No campaigns yet</h4>
        )}
      </div>

      {/* Donation History */}
      <div className="column donations-column">
        <h2>Donation History</h2>
        <h3 className="total-donations">Total Donations: Rs {donations}</h3>

        {donatedCampaigns?.length > 0 ? (
          <div className="donated-campaigns">
            {donatedCampaigns.map((donatedCampaign) => (
              <div className="donated-campaign-card" key={donatedCampaign._id}>
                <CampaignCard campaign={donatedCampaign.campaign} />
                <div className="donation-info">
                  <p className="donation-amount">
                    Donated: <strong>${donatedCampaign.amount}</strong>
                  </p>
                  <p className="donation-time">
                    {formatDistanceToNow(new Date(donatedCampaign.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h4>No donations yet</h4>
        )}
      </div>

      {/* Update Profile Section */}
      <div className="column profile-update-column">
        <h2>Update Profile</h2>
        <form className="profile-form" onSubmit={updateProfile}>
          <div className="editable-field">
            <label>Username</label>
            {isUsernameEditable ? (
              <input
                type="text"
                name="username"
                value={profileData.username || user?.username}
                onChange={handleProfileChange}
              />
            ) : (
              <div className="profile-text">{user?.username}</div>
            )}
            <span
              className="edit-icon"
              onClick={() => setIsUsernameEditable(!isUsernameEditable)}
            >
              {isUsernameEditable ? (
                <FaCheck color="#44b94a" />
              ) : (
                <FaPen color="#20d657" />
              )}
            </span>
          </div>

          <label>Password</label>
          <div className="editable-field password-field">
            {isPasswordEditable ? (
              <div className="password-field">
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current Password"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                />
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm New Password"
                />
              </div>
            ) : (
              <div className="profile-text">**********</div>
            )}
            <span
              className="edit-icon"
              onClick={() => setIsPasswordEditable(!isPasswordEditable)}
            >
              {isPasswordEditable ? (
                <FaCheck color="#44b94a" />
              ) : (
                <FaPen color="#20d657" />
              )}
            </span>
          </div>

          <button type="submit">Save Changes</button>
        </form>
        {errorMessage && (
          <div
            style={{ color: "red", textAlign: "center", paddingTop: "15px" }}
          >
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div
            style={{ color: "green", textAlign: "center", paddingTop: "15px" }}
          >
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
