import React from "react";
import "../styles/footer.css";

// import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-sections">
        <div className="footer-section">
          <h4>ABOUT</h4>
          <ul>
            <li>
              <a href="/about">About us</a>
            </li>
            <li>
              <a href="/charter">Our charter</a>
            </li>
            <li>
              <a href="/stats">Stats</a>
            </li>
            <li>
              <a href="/press">Press</a>
            </li>
            <li>
              <a href="/jobs">Jobs</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>SUPPORT</h4>
          <ul>
            <li>
              <a href="/help">Help Center</a>
            </li>
            <li>
              <a href="/rules">Our Rules</a>
            </li>
            <li>
              <a href="/resources">Creator Resources</a>
            </li>
            <li>
              <a href="/funds">Forward Funds</a>
            </li>
            <li>
              <a href="/assets">Brand assets</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>MORE FROM CROWDFUNDING</h4>
          <ul>
            <li>
              <a href="/newsletters">Newsletters</a>
            </li>
            <li>
              <a href="/updates">Project Updates</a>
            </li>
            <li>
              <a href="/independent">The Creative Independent</a>
            </li>
            <li>
              <a href="/apps">Mobile apps</a>
            </li>
            <li>
              <a href="/research">Research</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>CrowdFunding, PBC © 2025</p>
        <div className="footer-social">
          <a href="https://www.facebook.com">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.twitter.com">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.youtube.com">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
        <div className="footer-language-currency">
          <select>
            <option value="english">English</option>
            {/* Add other languages */}
          </select>
          <select>
            <option value="usd">LKR (RS)</option>
            {/* Add other currencies */}
          </select>
        </div>
      </div>
      <div className="footer-links">
        <a href="/trust">Trust & Safety</a>
        <a href="/terms">Terms of Use</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/cookie">Cookie Policy</a>
        <a href="/accessibility">Accessibility Statement</a>
        <a href="/ca-notice">CA Notice of Consent</a>
      </div>
    </footer>
  );
};

export default Footer;
