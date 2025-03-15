import { createContext, useReducer } from "react";

export const NotificationContext = createContext();

export const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      return {
        notifications: action.payload.notifications,
        unreadCount: action.payload.unreadCount,
      };
    case "CREATE_NOTIFICATION":
      return {
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };

    case "CLEAR_NOTIFICATIONS":
      return {
        notifications: [],
        unreadCount: 0,
      };
    case "MARK_NOTIFICATIONS_AS_READ":
      return {
        ...state,
        unreadCount: 0,
      };
    default:
      return state;
  }
};
export const NotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    unreadCount: 0,
  });

  return (
    <NotificationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};
