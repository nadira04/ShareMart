import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Heart,
  Bookmark,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import "./AdminDashboard.css";

function UserDashboard() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const getUserDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://sharemart.onrender.com/api/user/dashboard",
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

    getUserDashboard();
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
            <ShoppingBag size={20} />
            {sidebarOpen && <span>Marketplace</span>}
          </button>

          <button className="sidebar-item">
            <Package size={20} />
            {sidebarOpen && <span>My Orders</span>}
          </button>

          <button className="sidebar-item">
            <Heart size={20} />
            {sidebarOpen && <span>Donations</span>}
          </button>

          <button className="sidebar-item">
            <Bookmark size={20} />
            {sidebarOpen && <span>Saved Items</span>}
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
            <h1>User Dashboard</h1>
            <p>Manage your ShareMart activities</p>
          </div>

          <div className="dashboard-profile">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div>
              <strong>{user?.name || "User"}</strong>
              <small>ShareMart User</small>
            </div>
          </div>

        </div>

        {/* Welcome */}
        <div className="dashboard-welcome">
          <div>
            <h2>
              Welcome back, {user?.name || "User"}! 👋
            </h2>

            <p>
              Explore the marketplace, manage your orders and make a difference.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard-cards">

          <div className="dashboard-card">
            <div className="card-icon">
              <Package size={24} />
            </div>

            <div>
              <p>My Orders</p>
              <h3>0</h3>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <Bookmark size={24} />
            </div>

            <div>
              <p>Saved Items</p>
              <h3>0</h3>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <Heart size={24} />
            </div>

            <div>
              <p>My Donations</p>
              <h3>0</h3>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <ShoppingBag size={24} />
            </div>

            <div>
              <p>Marketplace Items</p>
              <h3>0</h3>
            </div>
          </div>

        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">

          <div className="section-header">
            <h2>Recent Activity</h2>
          </div>

          <div className="empty-dashboard">
            <Package size={40} />

            <h3>No activity yet</h3>

            <p>
              Your orders, saved items and donations will appear here.
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

export default UserDashboard;