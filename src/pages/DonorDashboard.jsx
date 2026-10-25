
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
  CheckCircle,
  XCircle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import "./AdminDashboard.css";

const API = "http://localhost:5000/api";

function DonorDashboard({ onAddProduct, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [donations, setDonations] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const getDonations = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(`${API}/donations/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load donations.");
      }

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.donations)
          ? data.donations
          : Array.isArray(data.data)
            ? data.data
            : [];

      setDonations(list);
    } catch (err) {
      setError(err.message || "Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDonations();
  }, []);

  const scrollToSection = (section) => {
    setActiveSection(section);
    setShowSettings(false);

    if (section === "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (section === "settings") {
      setShowSettings(true);
      return;
    }

    document.getElementById(section)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleRequest = async (donationId, requestId, action) => {
    try {
      setProcessing(requestId);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `${API}/donations/${donationId}/requests/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update request.");
      }

      setMessage(
        data.message || `Request ${action.toLowerCase()} successfully.`
      );

      await getDonations();
    } catch (err) {
      setError(err.message || "Failed to update request.");
    } finally {
      setProcessing("");
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
  };

  const totalDonations = donations.length;

  const activeDonations = donations.filter(
    (donation) => donation.status === "Available"
  ).length;

  const completedDonations = donations.filter(
    (donation) => donation.status === "Donated"
  ).length;

  const totalRequests = donations.reduce(
    (total, donation) => total + (donation.requests?.length || 0),
    0
  );

  const donationHistory = donations.filter(
    (donation) => donation.status === "Donated"
  );

  return (
    <div className="dashboard-container">
      <aside
        className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}
      >
        <div className="dashboard-logo">
          <div className="logo-icon">♻</div>
          {sidebarOpen && (
            <span>
              Share<span>Mart</span>
            </span>
          )}
        </div>

        <div className="sidebar-menu">
          <button
            className={`sidebar-item ${activeSection === "dashboard" ? "active" : ""
              }`}
            onClick={() => scrollToSection("dashboard")}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button
            className={`sidebar-item ${activeSection === "my-donations" ? "active" : ""
              }`}
            onClick={() => scrollToSection("my-donations")}
          >
            <Heart size={20} />
            {sidebarOpen && <span>My Donations</span>}
          </button>

          <button
            className="sidebar-item"
            onClick={() => {
              if (onAddProduct) {
                onAddProduct();
              } else {
                setMessage("Add Item navigation is not configured in App.jsx.");
              }
            }}
          >
            <PlusCircle size={20} />
            {sidebarOpen && <span>Add Item</span>}
          </button>

          <button
            className="sidebar-item"
            onClick={() => scrollToSection("donation-requests")}
          >
            <Package size={20} />
            {sidebarOpen && <span>Donation Requests</span>}
          </button>

          <button
            className="sidebar-item"
            onClick={() => scrollToSection("donation-history")}
          >
            <Clock size={20} />
            {sidebarOpen && <span>Donation History</span>}
          </button>

          <button
            className={`sidebar-item ${activeSection === "settings" ? "active" : ""
              }`}
            onClick={() => scrollToSection("settings")}
          >
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>

        <button className="sidebar-item logout" onClick={handleLogout}>
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>

          <div>
            <h1>Donor Dashboard</h1>
            <p>Manage your donations and contributions</p>
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

        <div className="dashboard-welcome" id="dashboard">
          <div>
            <h2>Welcome back, {user?.name || "Donor"}! 👋</h2>
            <p>
              Share surplus food and useful items with people who need them.
            </p>
          </div>

          <button
            type="button"
            className="sidebar-item"
            onClick={getDonations}
            disabled={loading}
          >
            <RefreshCw size={18} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon"><Heart size={24} /></div>
            <div>
              <p>Total Donations</p>
              <h3>{totalDonations}</h3>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon"><Clock size={24} /></div>
            <div>
              <p>Active Donations</p>
              <h3>{activeDonations}</h3>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon"><Package size={24} /></div>
            <div>
              <p>Completed Donations</p>
              <h3>{completedDonations}</h3>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon"><PlusCircle size={24} /></div>
            <div>
              <p>Total Requests</p>
              <h3>{totalRequests}</h3>
            </div>
          </div>
        </div>

        {message && (
          <div className="dashboard-api-message">{message}</div>
        )}

        {error && (
          <div className="dashboard-api-error">{error}</div>
        )}

        {showSettings && (
          <div className="dashboard-section" id="settings">
            <div className="section-header">
              <h2>Settings</h2>
            </div>
            <p>Name: {user?.name || "Not available"}</p>
            <p>Email: {user?.email || "Not available"}</p>
            <button
              type="button"
              className="sidebar-item"
              onClick={handleLogout}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}

        <div className="dashboard-section" id="my-donations">
          <div className="section-header">
            <h2>My Donations</h2>
          </div>

          {loading ? (
            <p>Loading donations...</p>
          ) : donations.length === 0 ? (
            <div className="empty-dashboard">
              <Heart size={40} />
              <h3>No donations yet</h3>
              <p>Your donations will appear here.</p>
            </div>
          ) : (
            <div className="donation-list">
              {donations.map((donation) => (
                <div
                  className="dashboard-card"
                  key={donation._id}
                  style={{
                    display: "block",
                    marginBottom: "16px",
                    width: "100%",
                  }}
                >
                  <h3>{donation.title}</h3>
                  <p>{donation.description}</p>
                  <p>Category: {donation.category}</p>
                  <p>Quantity: {donation.quantity}</p>
                  <p>Location: {donation.location}</p>
                  <p>
                    Status: <strong>{donation.status}</strong>
                  </p>

                  {donation.expiryDate && (
                    <p>
                      Expiry:{" "}
                      {new Date(donation.expiryDate).toLocaleDateString()}
                    </p>
                  )}

                  <div id="donation-requests">
                    <h4>NGO Requests ({donation.requests?.length || 0})</h4>

                    {!donation.requests?.length ? (
                      <p>No NGO requests yet.</p>
                    ) : (
                      donation.requests.map((request) => (
                        <div
                          key={request._id}
                          style={{
                            padding: "12px",
                            marginTop: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                          }}
                        >
                          <p>
                            NGO:{" "}
                            {typeof request.ngo === "object"
                              ? request.ngo?.name || request.ngo?.email || "NGO"
                              : `NGO ID: ${request.ngo}`}
                          </p>

                          <p>
                            Request status: <strong>{request.status}</strong>
                          </p>

                          {request.status === "Pending" &&
                            donation.status === "Available" && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  marginTop: "10px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRequest(
                                      donation._id,
                                      request._id,
                                      "Accepted"
                                    )
                                  }
                                  disabled={processing === request._id}
                                >
                                  <CheckCircle size={16} />
                                  {processing === request._id
                                    ? "Processing..."
                                    : "Accept"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRequest(
                                      donation._id,
                                      request._id,
                                      "Rejected"
                                    )
                                  }
                                  disabled={processing === request._id}
                                >
                                  <XCircle size={16} />
                                  {processing === request._id
                                    ? "Processing..."
                                    : "Reject"}
                                </button>
                              </div>
                            )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
              }
            </div>
          )}
        </div>

        <div className="dashboard-section" id="donation-history">
          <div className="section-header">
            <h2>Donation History</h2>
          </div>

          {loading ? (
            <p>Loading history...</p>
          ) : donationHistory.length === 0 ? (
            <p>No completed donations yet.</p>
          ) : (
            donationHistory.map((donation) => (
              <div className="dashboard-card" key={donation._id}>
                <h3>{donation.title}</h3>
                <p>Status: {donation.status}</p>
                <p>Location: {donation.location}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default DonorDashboard;
