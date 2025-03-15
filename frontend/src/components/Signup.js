import { useState, useEffect, useRef } from "react";
import { useSignup } from "../hooks/useSignup";
import { useAuthContext } from "../hooks/useAuthContext.js";

import "../styles/signup.css";

const Signup = ({ onClose, onLoginClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { signup, isLoading, error } = useSignup();
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(username, email, password);
  };
  // Ref to track the modal container
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose(); // Close modal when clicking outside
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="signup-container">
      {user && onClose()}

      <div className="modal" ref={modalRef}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>{" "}
        {/* Close button */}
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          <input
            type="text"
            name="name"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />

          <button type="submit" className="create-account" disabled={isLoading}>
            Create Account
          </button>
          {error && <div className="error">{error}</div>}
        </form>
        <div className="login-link">
          <span>Have an account? </span>
          <span onClick={onLoginClick} className="login-link-text">
            {" "}
            Log in
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
