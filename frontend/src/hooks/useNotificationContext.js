import { useContext } from "react";

import { NotificationContext } from "../contexts/NotificationContext.js";

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw Error(
      "useNotificationContext must be used inside a NotificationContextProvider"
    );
  }
  return context;
};
