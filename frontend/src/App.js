import "./App.css";
import { useAuthContext } from "./hooks/useAuthContext";
import Navbar from "./components/Navbar.js";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

//Pages
import Home from "./pages/Home.js";
import Campaign from "./pages/Campaign.js";
import NotFound from "./pages/NotFound.js";
import CreateCampaignForm from "./components/CreateCampaignForm.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import Footer from "./components/Footer.js";
import Login from "./components/Login.js";
import Profile from "./pages/Profile.js";

function App() {
  const { user } = useAuthContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleModalState = (state) => {
    setIsModalOpen(state);
  };

  return (
    <Router>
      <header>
        <Navbar
          onModalStateChange={handleModalState}
          onSearch={setSearchQuery}
        />
      </header>
      <div className={`app-container ${isModalOpen ? "blurred" : ""}`}>
        <main>
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/campaign/:id" element={<Campaign />} />
            <Route
              path="/create-a-campaign"
              element={
                !user ? (
                  <>
                    <Navigate to="/" />
                  </>
                ) : (
                  <CreateCampaignForm />
                )
              }
            />
            <Route
              path="/edit-campaign/:id"
              element={
                !user ? (
                  <>
                    <Navigate to="/" />
                  </>
                ) : (
                  <CreateCampaignForm />
                )
              }
            />
            <Route
              path="/admin"
              element={
                user === null ? null : user?.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/profile/:username"
              element={user ? <Profile /> : <Navigate to="/" />}
            />
            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      <footer>
        <Footer />
      </footer>
    </Router>
  );
}

export default App;
