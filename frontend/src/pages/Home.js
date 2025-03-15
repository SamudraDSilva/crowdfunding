import { useEffect, useState, useRef } from "react"; // Add useRef
import { useCampaignContext } from "../hooks/useCampaignContext.js";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext.js";
import StatsSection from "../components/StatsCard.js";
import CampaignCard from "../components/CampaignCard.js";
import hero_img from "../assets/images/hero-img.png";
import { motion } from "framer-motion";
import api from "../services/api.js";
import "../styles/home.css";

const Home = ({ searchQuery }) => {
  const { user } = useAuthContext();
  const { campaigns, dispatch } = useCampaignContext();
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);

  // Create a reference to the campaigns section
  const campaignsRef = useRef(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await api.get("/campaigns");

        if (response.status === 200) {
          dispatch({
            type: "SET_CAMPAIGN",
            payload: response.data.data.campaigns,
          });
        } else {
          console.error("Error: Failed to fetch campaigns");
        }
      } catch (error) {
        console.log("Error fetching campaigns:", error);
      }
    };

    fetchCampaign();
  }, [user]);

  useEffect(() => {
    if (!campaigns) return;

    const filtered = campaigns
      .filter((campaign) => campaign?.status === "Active")
      .filter((campaign) =>
        [
          campaign.title || "",
          campaign.category || "",
          campaign.description || "",
        ]
          .join(" ") // Combine fields for searching
          .toLowerCase()
          .includes(searchQuery?.toLowerCase())
      );

    setFilteredCampaigns(filtered);

    // Scroll to the campaigns section whenever filteredCampaigns changes
    if (searchQuery && campaignsRef.current) {
      campaignsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchQuery, campaigns]);

  if (!campaigns) {
    return <div>Loading...</div>; // Show a loading state until data is available
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <h1>Empower Your Ideas with Crowdfunding</h1>
          <p>Start a campaign today and bring your vision to life.</p>
        </div>
        <motion.img
          src={hero_img}
          alt="Hero"
          className="hero-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </motion.div>

      {/* Stats Section */}
      <StatsSection />

      {/* Campaigns Section */}
      <div className="container">
        <div ref={campaignsRef} className="campaign-grid">
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign) => (
              <CampaignCard campaign={campaign} key={campaign._id} />
            ))
          ) : (
            <p>No campaigns found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
