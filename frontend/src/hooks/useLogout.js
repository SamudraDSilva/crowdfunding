import { useAuthContext } from "./useAuthContext";
import { useCampaignContext } from "./useCampaignContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: campaignDispatch } = useCampaignContext();

  const logout = () => {
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });

    campaignDispatch({ type: "SET_CAMPAIGN", payload: null });
  };

  return { logout };
};
