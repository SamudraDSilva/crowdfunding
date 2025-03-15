import { useState } from "react";
import { useNavigate } from "react-router-dom";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import "../styles/campaignCard.css";

const CampaignCard = ({ campaign }) => {
  const filePath = campaign?.image ? campaign.image.replace("\\", "/") : null; // Convert to 'uploads/1737285121983-1657939273893.jpeg'
  const imageUrl =
    process.env.REACT_APP_API_URL + filePath ||
    `http://localhost:5000/api/${filePath}`;
  const navigate = useNavigate(); // Hook to enable navigation
  const [hoveredIndex, setHoveredIndex] = useState(false);

  const handleClick = () => {
    navigate(`/campaign/${campaign._id}`); // Navigate to a dynamic route
  };

  return (
    <div>
      <div
        className="campaign-card"
        onMouseEnter={() => setHoveredIndex(true)}
        onMouseLeave={() => setHoveredIndex(false)}
        onClick={handleClick}
      >
        <div className="image-container">
          <img src={imageUrl} alt={campaign?.title} />
        </div>
        <div className="campaign-info">
          <h4>{campaign?.title}</h4>
          <div>
            <p>
              {campaign &&
                formatDistanceToNow(new Date(campaign?.activeAt), {
                  addSuffix: true,
                })}
            </p>
            <p>
              {campaign?.goalAmount !== 0
                ? Math.round((campaign?.progress / campaign?.goalAmount) * 100)
                : 0}
              % funded
            </p>
          </div>
        </div>
        {hoveredIndex && (
          <div className="campaign-description">
            <p>{campaign?.subtitle}</p>
            <div className="extra-info">
              <span>{campaign?.category}</span>
              <span>{campaign?.subcategory}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;
