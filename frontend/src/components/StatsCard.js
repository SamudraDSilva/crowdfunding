import React, { useEffect, useState } from "react";
import { useCampaignContext } from "../hooks/useCampaignContext";
import api from "../services/api";
import "../styles/stats.css";
const StatsSection = () => {
  const { campaigns } = useCampaignContext();
  const [stats, setStats] = useState({ uniqueDonors: 0, totalDonated: 0 });

  useEffect(() => {
    const fetchStat = async () => {
      try {
        const response = await api.get("transaction/stats");

        if (response.status === 200) {
          const { uniqueDonors, totalDonated } = response.data;
          setStats({ uniqueDonors, totalDonated });
        }
      } catch (error) {
        console.log("Error feching stats", error);
      }
    };

    fetchStat();
  }, [campaigns]);

  return (
    <div className="stats-section">
      <div className="stats-box">
        <div className="stat-item">
          <h3>
            {campaigns
              .filter((campaign) => campaign.status === "Active")
              .length.toLocaleString("en-US") || "Start Now"}
          </h3>
          <p>campaigns </p>
        </div>
        <div className="divider">
          <div className="stat-item">
            <h3>Rs {stats.totalDonated.toLocaleString("en-US")}</h3>
            <p>donations</p>
          </div>
        </div>
        <div className="stat-item">
          <h3>{stats.uniqueDonors.toLocaleString("en-US")}</h3>
          <p>doners</p>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
