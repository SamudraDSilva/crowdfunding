import { useState, useEffect, useRef } from "react";
import { useLogin } from "../hooks/useLogin";
import { useAuthContext } from "../hooks/useAuthContext.js";

import "../styles/login.css";

const Login = ({ onClose, onSignupClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
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
    <div className="login-container">
      {user && onClose()}
      <div className="modal" ref={modalRef}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

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

          <button disabled={isLoading} type="submit" className="login">
            Log in
          </button>
          {error && <div className="error">{error}</div>}
        </form>
        <div className="signup-link">
          <span>New to crowdfunding? </span>
          <span onClick={onSignupClick} className="link-text">
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
