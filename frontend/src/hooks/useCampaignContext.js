import { useContext } from "react";
import { CampaignContext } from "../contexts/CampaignContext";

export const useCampaignContext = () => {
  const context = useContext(CampaignContext);

  if (!context) {
    throw Error(
      "useCampaignContext must be used inside a CampaignContextProvider"
    );
  }
  return context;
};
