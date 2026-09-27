import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Heart,
  Package,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import "./AdminDashboard.css";
function AdminDashboard() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
  const getAdminDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://sharemart.onrender.com/api/admin/dashboard",
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

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://sharemart.onrender.com/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      console.log("Failed to fetch users");
    }
  };

  getAdminDashboard();
  getUsers();
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
            <Users size={20} />
            {sidebarOpen && <span>Users</span>}
          </button>

          <button className="sidebar-item">
            <ShoppingBag size={20} />
            {sidebarOpen && <span>Marketplace</span>}
          </button>

          <button className="sidebar-item">
            <Heart size={20} />
            {sidebarOpen && <span>Donations</span>}
          </button>

          <button className="sidebar-item">
            <Package size={20} />
            {sidebarOpen && <span>Products</span>}
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
            <h1>Admin Dashboard</h1>
            <p>Manage your ShareMart platform</p>
          </div>

          <div className="dashboard-profile">
            <div className="profile-avatar">A</div>

            <div>
              <strong>Admin</strong>
              <small>Administrator</small>
            </div>
          </div>

        </div>

        {/* Welcome */}
        <div className="dashboard-welcome">
          <div>
            <h2>Welcome back, Admin!</h2>
            <p>
              Here's what's happening with your ShareMart platform today.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard-cards">

          <div className="dashboard-card">
            <div className="card-icon">
              <Users size={24} />
            </div>

            <div>
              <p>Total Users</p>
              <h3>{users.length}</h3>
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
              <Package size={24} />
            </div>

            <div>
              <p>Total Products</p>
              <h3>0</h3>
            </div>
          </div>

        </div>

       {/* Users */}
<div className="dashboard-section">

  <div className="section-header">
    <h2>Users</h2>
  </div>

  {users.length === 0 ? (
    <div className="empty-dashboard">
      <Users size={40} />
      <h3>No users found</h3>
      <p>Registered users will appear here.</p>
    </div>
  ) : (
    <div>
      {users.map((user) => (
        <div
          key={user._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <div>
            <strong>{user.name}</strong>
            <p style={{ margin: "5px 0 0", color: "#888" }}>
              {user.email}
            </p>
          </div>

          <select
            value={user.role}
            onChange={async (e) => {
              const token = localStorage.getItem("token");

              const response = await fetch(
                `https://sharemart.onrender.com/api/admin/users/${user._id}/role`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    role: e.target.value,
                  }),
                }
              );

              const data = await response.json();

              if (response.ok) {
                setUsers(
                  users.map((u) =>
                    u._id === user._id
                      ? { ...u, role: data.user.role }
                      : u
                  )
                );
              }
            }}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="donor">Donor</option>
          </select>
        </div>
      ))}
    </div>
  )}

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

export default AdminDashboard;