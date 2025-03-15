import { Link, useLocation } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import { useState, useEffect, useRef } from "react"; // Add useRef
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNotificationContext } from "../hooks/useNotificationContext";
import { FaBell } from "react-icons/fa";
import axios from "axios";

import "../styles/navbar.css";

const Navbar = ({ onModalStateChange, onSearch }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { notifications, unreadCount, dispatch } = useNotificationContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const searchTimeoutRef = useRef(null); // Ref to store the timeout ID

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(".user-dropdown") &&
        !event.target.closest(".notification-icon") &&
        !event.target.closest(".notification-dropdown")
      ) {
        setIsDropdownOpen(false);
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationRes = await axios.get(
          `http://localhost:5000/api/notification?userId=${user._id}`
        );
        const data = notificationRes.data.data;

        if (notificationRes.status) {
          try {
            const unreadCountRes = await axios.get(
              `http://localhost:5000/api/notification/unread-count?userId=${user._id}`
            );

            if (unreadCountRes.status) {
              const filteredNotifications = data.notifications.filter(
                (notification) => notification.userId === user._id
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
  }, [user]);

  const handleClearNotifications = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notification/clear-all?userId=${user?._id}`
      );
      dispatch({ type: "CLEAR_NOTIFICATIONS" });
    } catch (error) {
      console.error("Error clearing notifications", error);
    }
  };

  const markAsReadNotification = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/notification/mark-as-read?userId=${user._id}`
      );
    } catch (error) {
      console.error("Erroe mark as read notifications", error);
    }
  };

  const handleNotificationClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleNotificationIconClick = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    dispatch({ type: "MARK_NOTIFICATIONS_AS_READ" });

    markAsReadNotification();
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // Deselect if already selected
      onSearch(""); // Clear search filter
    } else {
      setSelectedCategory(category);
      onSearch(category); // Apply selected category filter
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedCategory(null);

    // Clear the previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout to trigger the search after 1 second
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, 1000); // 1-second delay
  };

  const handleSearchSubmit = () => {
    setSelectedCategory(null);
    // Clear the timeout and trigger the search immediately
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onSearch(searchQuery);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(); // Trigger search on Enter key press
    }
  };

  const handleOpenLogin = () => {
    onModalStateChange(true);
    setIsSignupOpen(false); // Close Signup if open
    setIsLoginOpen(true); // Open Login
  };

  const handleOpenSignup = () => {
    onModalStateChange(true);
    setIsLoginOpen(false); // Close Login if open
    setIsSignupOpen(true); // Open Signup
  };

  const handleCloseModals = () => {
    onModalStateChange(false);
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  const handleLogOut = () => {
    logout();
    setIsDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        {/* First Row */}
        <div className="navbar-row">
          <div className="navbar-logo">
            <Link to="/">Crowdfunding</Link>
          </div>
          {location.pathname === "/" && (
            <div className="navbar-search">
              <div className="search-wrapper">
                <div className="search-icon" onClick={handleSearchSubmit}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search campaigns"
                  aria-label="Search campaigns"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown} // Listen for Enter key press
                />
              </div>
            </div>
          )}

          <div className="navbar-buttons">
            {!user ? (
              <p onClick={handleOpenLogin} className="btn btn-primary">
                Start a Campaign
              </p>
            ) : (
              <Link to="/create-a-campaign" className="btn btn-primary">
                Start a campaign
              </Link>
            )}
            {user ? (
              <>
                <div className="user-dropdown">
                  <Link to={`/profile/${user.username}`}>
                    <img
                      src="https://img.freepik.com/free-vector/hand-drawn-cross-eyed-cartoon-illustration_23-2151126677.jpg" // Replace with user's profile picture
                      alt="User Avatar"
                      className="user-avatar"
                    />
                  </Link>
                  <span
                    className="username"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {user.username || "user"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className={`bi bi-caret-down-fill dropdown-icon ${
                        isDropdownOpen ? "open" : ""
                      }`}
                      viewBox="0 0 16 16"
                    >
                      <path d="M7.247 11.14l-4.796-5.481A.5.5 0 0 1 2.501 5h10.998a.5.5 0 0 1 .37.659l-4.797 5.481a.5.5 0 0 1-.745 0z" />
                    </svg>
                  </span>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      {user.role === "admin" && (
                        <Link className="dropdown-item admin" to="/admin">
                          Admin Dashboard
                        </Link>
                      )}
                      <button onClick={handleLogOut} className="dropdown-item">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-box-arrow-right"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-1h1v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1h-1V5a2 2 0 0 0-2-2H6z"
                          />
                          <path
                            fillRule="evenodd"
                            d="M11.854 8.354a.5.5 0 0 0 0-.708l-2-2a.5.5 0 1 0-.708.708L10.293 8l-1.147 1.146a.5.5 0 0 0 .708.708l2-2z"
                          />
                        </svg>
                        Log out
                      </button>
                    </div>
                  )}
                </div>
                {/* Notification Bell Icon */}

                <div
                  className="notification-icon"
                  onClick={handleNotificationIconClick}
                >
                  <FaBell size={20} color="#0b6623" />
                  {notifications.length > 0 && (
                    <span
                      className={`notification-count ${
                        unreadCount > 0 ? "show" : ""
                      }`}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>

                {/* Notification Dropdown */}
                {isNotificationDropdownOpen && (
                  <div
                    className={`notification-dropdown ${
                      isNotificationDropdownOpen ? "show" : ""
                    }`}
                  >
                    <ul>
                      {notifications.length === 0 ? (
                        <li>No new notifications</li>
                      ) : (
                        notifications.map((notification, index) => (
                          <li
                            key={index}
                            className={
                              expandedIndex === index ? "expanded" : "collapsed"
                            }
                            onClick={() => handleNotificationClick(index)}
                          >
                            {notification.message}
                          </li>
                        ))
                      )}
                    </ul>
                    <button
                      className="clear-notifications"
                      onClick={handleClearNotifications}
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button onClick={handleOpenLogin} className="btn btn-secondary">
                Log in
              </button>
            )}
          </div>
        </div>

        {/* Second Row */}
        {location.pathname === "/" && (
          <div className="navbar-row2">
            <div className="navbar-categories">
              <ul aria-label="Categories">
                {[
                  "art",
                  "technology",
                  "education",
                  "health",
                  "food",
                  "discover",
                  "environment",
                ].map((category) => (
                  <li key={category}>
                    <p
                      className={
                        selectedCategory === category ? "selected-category" : ""
                      }
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>
      {/* Render Modals */}
      {isLoginOpen && (
        <Login onClose={handleCloseModals} onSignupClick={handleOpenSignup} />
      )}
      {isSignupOpen && (
        <Signup onClose={handleCloseModals} onLoginClick={handleOpenLogin} />
      )}
    </>
  );
};

export default Navbar;
