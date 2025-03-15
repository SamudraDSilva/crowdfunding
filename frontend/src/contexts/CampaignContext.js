import { createContext, useReducer } from "react";

export const CampaignContext = createContext();

export const campaignReducer = (state, action) => {
  switch (action.type) {
    case "SET_CAMPAIGN":
      return {
        campaigns: action.payload,
      };

    case "CREATE_CAMPAIGN":
      return {
        campaigns: [action.payload, ...state.campaign],
      };

    case "DELETE_CAMPAIGN":
      return {
        campaigns: state.campaign.filter((c) => c._id !== action.payload._id),
      };

    default:
      return state;
  }
};

export const CampaignContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(campaignReducer, { campaigns: [] });

  return (
    <CampaignContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CampaignContext.Provider>
  );
};
