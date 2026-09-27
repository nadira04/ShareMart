import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Heart,
  PlusCircle,
  Package,
  Clock,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import "./AdminDashboard.css";

function DonorDashboard() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const getDonorDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://sharemart.onrender.com/api/donor/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Server connection failed.");
      }
    };

    getDonorDashboard();
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}>

        <div className="dashboard-logo">
          <div className="logo-icon">♻</div>

          {sidebarOpen && (
            <span>
              Share<span>Mart</span>
            </span>
          )}
        </div>

        <div className="sidebar-menu">

          <button className="sidebar-item active">
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button className="sidebar-item">
            <Heart size={20} />
            {sidebarOpen && <span>My Donations</span>}
          </button>

          <button className="sidebar-item">
            <PlusCircle size={20} />
            {sidebarOpen && <span>Donate Food</span>}
          </button>

          <button className="sidebar-item">
            <Package size={20} />
            {sidebarOpen && <span>Donation Requests</span>}
          </button>

          <button className="sidebar-item">
            <Clock size={20} />
            {sidebarOpen && <span>Donation History</span>}
          </button>

          <button className="sidebar-item">
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </button>

        </div>

        <button className="sidebar-item logout">
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </button>

      </aside>

      {/* Main Dashboard */}
      <div className="dashboard-main">

        {/* Topbar */}
        <div className="dashboard-topbar">

          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={22} />
          </button>

          <div>
            <h1>Donor Dashboard</h1>
            <p>Manage your donations and contribution</p>
          </div>

          <div className="dashboard-profile">

            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || "D"}
            </div>

            <div>
              <strong>{user?.name || "Donor"}</strong>
              <small>ShareMart Donor</small>
            </div>

          </div>

        </div>

        {/* Welcome */}
        <div className="dashboard-welcome">

          <div>
            <h2>
              Welcome back, {user?.name || "Donor"}! 👋
            </h2>

            <p>
              Share surplus food and useful items with people who need them.
            </p>
          </div>

        </div>

        {/* Stats */}
        <div className="dashboard-cards">

          <div className="dashboard-card">

            <div className="card-icon">
              <Heart size={24} />
            </div>

            <div>
              <p>Total Donations</p>
              <h3>0</h3>
            </div>

          </div>

          <div className="dashboard-card">

            <div className="card-icon">
              <Clock size={24} />
            </div>

            <div>
              <p>Active Donations</p>
              <h3>0</h3>
            </div>

          </div>

          <div className="dashboard-card">

            <div className="card-icon">
              <Package size={24} />
            </div>

            <div>
              <p>Completed Donations</p>
              <h3>0</h3>
            </div>

          </div>

          <div className="dashboard-card">

            <div className="card-icon">
              <PlusCircle size={24} />
            </div>

            <div>
              <p>Donation Requests</p>
              <h3>0</h3>
            </div>

          </div>

        </div>

        {/* Recent Donations */}
        <div className="dashboard-section">

          <div className="section-header">
            <h2>Recent Donations</h2>
          </div>

          <div className="empty-dashboard">

            <Heart size={40} />

            <h3>No donations yet</h3>

            <p>
              Your food and item donations will appear here.
            </p>

          </div>

        </div>

        {/* API Message */}
        {message && (
          <div className="dashboard-api-message">
            {message}
          </div>
        )}

        {error && (
          <div className="dashboard-api-error">
            {error}
          </div>
        )}

      </div>
    </div>
  );
}

export default DonorDashboard;