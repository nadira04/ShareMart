import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import "./AdminDashboard.css";

function SellerDashboard() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const getSellerDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://sharemart.onrender.com/api/seller/dashboard",
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

    getSellerDashboard();
  }, []);

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
            {sidebarOpen && <span>My Products</span>}
          </button>

          <button className="sidebar-item">
            <PlusCircle size={20} />
            {sidebarOpen && <span>Add Product</span>}
          </button>

          <button className="sidebar-item">
            <Package size={20} />
            {sidebarOpen && <span>Orders</span>}
          </button>

          <button className="sidebar-item">
            <ShoppingCart size={20} />
            {sidebarOpen && <span>Sales</span>}
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
            <h1>Seller Dashboard</h1>
            <p>Manage your products and sales</p>
          </div>

          <div className="dashboard-profile">
            <div className="profile-avatar">S</div>

            <div>
              <strong>Seller</strong>
              <small>ShareMart Seller</small>
            </div>
          </div>

        </div>

        {/* Welcome */}
        <div className="dashboard-welcome">
          <div>
            <h2>Welcome back, Seller! 👋</h2>
            <p>
              Manage your products, orders and sales from your dashboard.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard-cards">

          <div className="dashboard-card">
            <div className="card-icon">
              <ShoppingBag size={24} />
            </div>

            <div>
              <p>Total Products</p>
              <h3>0</h3>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <Package size={24} />
            </div>

            <div>
              <p>Active Products</p>
              <h3>0</h3>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <ShoppingCart size={24} />
            </div>

            <div>
              <p>Total Orders</p>
              <h3>0</h3>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <PlusCircle size={24} />
            </div>

            <div>
              <p>Total Sales</p>
              <h3>0</h3>
            </div>
          </div>

        </div>

        {/* Recent Products */}
        <div className="dashboard-section">

          <div className="section-header">
            <h2>Recent Products</h2>
            <button>View All</button>
          </div>

          <div className="empty-dashboard">
            <ShoppingBag size={40} />
            <h3>No products yet</h3>
            <p>
              Add your first product to start selling on ShareMart.
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

export default SellerDashboard;