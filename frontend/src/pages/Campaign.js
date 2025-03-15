import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNotificationContext } from "../hooks/useNotificationContext";
import api from "../services/api";
import "../styles/campaign.css";

const Campaign = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState({});
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true); // New loading state
  const [transactionLoading, setTransactionLoading] = useState(false); // New loading state
  const { user } = useAuthContext();
  const { dispatch } = useNotificationContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationRes = await api.get(
          `/notification?userId=${user?._id}`
        );
        const data = notificationRes.data.data;

        if (notificationRes.status === 200) {
          try {
            const unreadCountRes = await api.get(
              `/notification/unread-count?userId=${user?._id}`
            );

            if (unreadCountRes.status) {
              const filteredNotifications = data.notifications.filter(
                (notification) => notification.userId === user?._id
              );
              dispatch({
                type: "SET_NOTIFICATIONS",
                payload: {
                  notifications: filteredNotifications,
                  unreadCount: unreadCountRes.data.count,
                },
              });
            }
          } catch (error) {
            console.log("Error fetch unread notification:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user, transactionLoading]);

  const handleEdit = () => {
    navigate("/edit-campaign/" + id);
  };

  const handleClick = async () => {
    if (!user) {
      alert("Please Log in");
      return;
    }

    setTransactionLoading(true);

    const parsedAmount = Number(amount);

    //Create a transaction
    try {
      const response = await api.post("/transaction", {
        donorId: user?._id,
        campaignId: campaign?._id,
        amount: parsedAmount,
      });

      if (response.status === 201) {
        //restore updated token if exist

        if (response.data.token) {
          const currentData = JSON.parse(localStorage.getItem("user"));

          if (currentData && response.data.rank) {
            currentData.rank = response.data.rank;

            // Store the updated data back to localStorage
            localStorage.setItem("user", JSON.stringify(currentData));
          }
        }

        //update progress of the campaign
        try {
          const donationRes = await api.patch(`/campaigns/donate/${id}`, {
            amount: parsedAmount,
          });

          if (donationRes.status === 200) {
            try {
              const notificationRes = await api.post(`/notification/`, {
                userId: user?._id,
                message: `Thank you for the donation - ${campaign.title}`,
              });

              if (notificationRes.status === 201) {
                // update the notification context
                dispatch({
                  type: "CREATE_NOTIFICATION",
                  payload: notificationRes.data,
                });
              }
            } catch (error) {
              console.error("Error adding notification:", error);
            }
          }
        } catch (error) {
          console.error("Error sending donation:", error);
        }
        setAmount(0);
      }
    } catch (error) {
      console.log("Error transferring money", error);
    } finally {
      setTransactionLoading(false);
    }
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      try {
        const response = await api.get(
          `http://localhost:5000/api/campaigns/${id}`
        );

        if (response.status === 200) {
          setCampaign(response.data.data.campaign);
        } else {
          console.error("Error: Failed to fetch campaign");
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchCampaign();
  }, [id, transactionLoading]);

  const filePath = campaign.image ? campaign.image.replace("\\", "/") : null;
  const imageUrl = filePath
    ? process.env.REACT_APP_API_URL + filePath ||
      `http://localhost:5000/api/${filePath}`
    : "https://picsum.photos/200/300";

  if (loading) {
    // Show skeleton screen or spinner while loading
    return (
      <div className="campaign-container">
        <div className="campaign-header">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-paragraph"></div>
          <div className="skeleton skeleton-img"></div>
        </div>
        <div className="skeleton skeleton-stats"></div>
        <div className="skeleton skeleton-progress"></div>
        <div className="skeleton skeleton-paragraph"></div>
      </div>
    );
  }

  return (
    <div className="campaign-container">
      <div className="campaign-header">
        <h2>{campaign.title}</h2>
        <p>by {campaign.owner?.username}</p>
        <img src={imageUrl} alt="Campaign" className="campaign-img" />
      </div>

      <div className="campaign-stats">
        <div className="stat">
          <p>{campaign.category}</p>
        </div>
        <div className="stat">
          <p>{campaign.subcategory}</p>
        </div>
      </div>

      <div className="campaign-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${
                campaign.goalAmount !== 0
                  ? Math.round((campaign.progress / campaign.goalAmount) * 100)
                  : 0
              }%`,
            }}
          ></div>
        </div>
        <div className="progress-text">
          <p>Raised: Rs {campaign.progress.toLocaleString("en-US")}</p>
          <p>Goal: Rs {campaign.goalAmount.toLocaleString("en-US")}</p>
        </div>
      </div>

      <div className="campaign-backers">
        <p>{campaign.projectStory}</p>
      </div>

      <div className="campaign-pledge-levels">
        <button onClick={() => setAmount(20)} className="pledge-level">
          Rs.20
        </button>
        <button onClick={() => setAmount(50)} className="pledge-level">
          Rs.50
        </button>
        <button onClick={() => setAmount(100)} className="pledge-level">
          Rs.100
        </button>
        <button onClick={() => setAmount(500)} className="pledge-level">
          Rs.500
        </button>
      </div>
      <div className="donation-container">
        {user?._id === campaign.owner?._id ? (
          <input
            type="number"
            id="donation-amount"
            placeholder="Enter amount"
            disabled={true}
            className="donation-input"
          />
        ) : (
          <input
            type="number"
            id="donation-amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
            className="donation-input"
            disabled={campaign.status !== "Active"}
          />
        )}

        {user?._id === campaign.owner?._id ? (
          <button
            onClick={handleEdit}
            className="edit-button"
            disabled={campaign.status !== "Active" || transactionLoading}
          >
            Edit Campaign
          </button>
        ) : (
          <button
            disabled={campaign.status !== "Active" || transactionLoading}
            className="back-campaign-button"
            onClick={handleClick}
          >
            {transactionLoading ? "Processing..." : "Donate →"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Campaign;
