import { useState, useEffect } from "react";
import UserEditModal from "../components/UserEditModal";
import CampaignEditModal from "../components/CampaignEditModal";
import ConfirmationModal from "../components/ConfimationModal";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import "../styles/adminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuthContext();

  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalProgress, setTotalProgress] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [manageTab, setManageTab] = useState("Users");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [isCampaignEditModalOpen, setIsCampaignEditModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = async () => {
    try {
      const [
        campaignResponse,
        userResponse,
        progressResponse,
        transactionResponse,
      ] = await Promise.all([
        api.get("/admin/campaigns"),
        api.get("/admin/users"),
        api.get("/admin/campaigns/progress"),
        api.get("/admin/transaction"),
      ]);
      const campaignJson = await campaignResponse.data;
      const userJson = await userResponse.data;
      const progressJson = await progressResponse.data;
      const transactionJson = await transactionResponse.data;
      if (campaignResponse.status === 200)
        setCampaigns(campaignJson.data.campaigns);
      if (userResponse.status === 200) setUsers(userJson.data.users);
      if (progressResponse.status === 200)
        setTotalProgress(progressJson.totalProgress);
      if (transactionResponse.status === 200)
        setTransactions(transactionJson.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (endpoint, id, callback) => {
    try {
      const response = await api.delete(`/admin/${endpoint}/${id}`);

      if (response.data.success) {
        callback((prev) => prev.filter((item) => item._id !== id)); // Directly update state
      }

      setIsModalOpen(false);
      setSelectedCampaignId(null);
      setSelectedUserId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedCampaignId(null);
    setSelectedUserId(null);
  };

  const openUserEditModal = (user) => {
    setSelectedUser(user);
    setIsUserEditModalOpen(true);
  };

  const closeUserEditModal = () => {
    setSelectedUser(null);
    setIsUserEditModalOpen(false);
  };
  const openCampaignEditModal = (campaign) => {
    setSelectedCampaign(campaign);
    setIsCampaignEditModalOpen(true);
  };

  const closeCampaignEditModal = () => {
    setSelectedCampaign(null);
    setIsCampaignEditModalOpen(false);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) =>
      prev.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };
  const handleCampaignUpdated = (updatedCampaign) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign._id === updatedCampaign._id ? updatedCampaign : campaign
      )
    );
  };

  const handleDeleteCampaign = (_id) => {
    setSelectedCampaignId(_id);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (_id) => {
    setSelectedUserId(_id);
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>
      <main className="dashboard-main">
        <section className="dashboard-stats">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div onClick={() => setManageTab("Users")} className="stat-card">
              <h3>Users</h3>
              <p>{users.length.toLocaleString("en-US")}</p>
            </div>
            <div
              onClick={() => setManageTab("Campaigns")}
              className="stat-card"
            >
              <h3>Campaigns</h3>
              <p>{campaigns.length.toLocaleString("en-US")}</p>
            </div>
            <div
              onClick={() => setManageTab("Transactions")}
              className="stat-card"
            >
              <h3>Revenue</h3>
              <p>Rs.{totalProgress.toLocaleString("en-US") || 0}</p>
            </div>
          </div>
        </section>

        <section className="dashboard-table">
          <h2>Manage {manageTab}</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>
                  {manageTab === "Users"
                    ? "Name"
                    : manageTab === "Campaigns"
                    ? "Title"
                    : "Username"}
                </th>
                <th>
                  {manageTab === "Users"
                    ? "Email"
                    : manageTab === "Campaigns"
                    ? "Goal Amount (Rs)"
                    : "Campaign"}
                </th>
                {manageTab === "Users" && <th>Rank</th>}
                <th>
                  {manageTab === "Users"
                    ? "Role"
                    : manageTab === "Campaigns"
                    ? "Progress (Rs)"
                    : "Amount"}
                </th>

                {manageTab === "Campaigns" && <th>State</th>}
                {manageTab === "Campaigns" || manageTab === "Users" ? (
                  <th>Actions</th>
                ) : (
                  <th>Date</th>
                )}
              </tr>
            </thead>
            <tbody>
              {manageTab === "Campaigns" &&
                campaigns.map((campaign, index) => (
                  <tr key={campaign._id}>
                    <td>{index + 1}</td>
                    <td>
                      {" "}
                      <Link to={"/campaign/" + campaign?._id}>
                        {campaign.title}
                      </Link>
                    </td>
                    <td>{campaign.goalAmount}</td>
                    <td>{campaign.progress}</td>
                    {manageTab === "Campaigns" && <td>{campaign.status}</td>}
                    <td>
                      <button onClick={() => openCampaignEditModal(campaign)}>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(campaign._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

              {manageTab === "Users" &&
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>
                      {" "}
                      <Link to={"/profile/" + user?.username}>
                        {user.username || "none"}
                      </Link>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.rank}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => openUserEditModal(user)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteUser(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

              {manageTab === "Transactions" &&
                transactions.map((transaction, index) => (
                  <tr key={transaction._id}>
                    <td>{index + 1}</td>

                    <td>
                      <Link to={"/profile/" + transaction.donor?.username}>
                        {transaction.donor?.username || "N/A"}{" "}
                      </Link>
                    </td>

                    <td>
                      <Link to={"/campaign/" + transaction.campaign?._id}>
                        {transaction.campaign?.title || "N/A"}
                      </Link>
                    </td>
                    <td>Rs.{transaction.amount || 0}</td>
                    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </main>

      {manageTab === "Users" && (
        <ConfirmationModal
          isOpen={isModalOpen}
          message="Are you sure you want to delete this user?"
          onConfirm={() => handleDelete("users", selectedUserId, setUsers)}
          onCancel={handleCancelDelete}
        />
      )}
      {manageTab === "Campaigns" && (
        <ConfirmationModal
          isOpen={isModalOpen}
          message="Are you sure you want to delete this campaign?"
          onConfirm={() =>
            handleDelete("campaign", selectedCampaignId, setCampaigns)
          }
          onCancel={handleCancelDelete}
        />
      )}
      {manageTab === "Users" && (
        <UserEditModal
          isOpen={isUserEditModalOpen}
          initialUserData={selectedUser}
          onClose={closeUserEditModal}
          onUserUpdated={handleUserUpdated}
        />
      )}
      {manageTab === "Campaigns" && (
        <CampaignEditModal
          isOpen={isCampaignEditModalOpen}
          initialCampaignData={selectedCampaign}
          onClose={closeCampaignEditModal}
          onCampaignUpdated={handleCampaignUpdated}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
