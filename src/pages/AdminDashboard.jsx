import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Menu,
  Shield,
  Plus,
  KeyRound,
  Trash2,
  Pencil,
  ClipboardCheck,
  RefreshCw,
} from "lucide-react";
import "./AdminDashboard.css";

const API = "https://sharemart.onrender.com/api/admin";

function AdminDashboard() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [processingProduct, setProcessingProduct] = useState("");
  const [pendingDonations, setPendingDonations] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(false);
  const [processingDonation, setProcessingDonation] = useState("");

  const [showRoleForm, setShowRoleForm] = useState(false);
  const [showPermissionForm, setShowPermissionForm] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [permissionName, setPermissionName] = useState("");
  const [permissionDescription, setPermissionDescription] = useState("");

  const [selectedRoles, setSelectedRoles] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState({});

  const [editingRole, setEditingRole] = useState(null);
  const [editingPermission, setEditingPermission] = useState(null);

  const token = localStorage.getItem("token");

  const request = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  };

  useEffect(() => {
    getAdminDashboard();
    getUsers();
    getRoles();
    getPermissions();
    getPendingProducts();
    getPendingDonations();
  }, []);

  const getAdminDashboard = async () => {
    try {
      const data = await request(`${API}/dashboard`);
      setMessage(data.message || "");
    } catch (err) {
      setError(err.message);
    }
  };

  const getUsers = async () => {
    try {
      const data = await request(`${API}/users`);
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const getRoles = async () => {
    try {
      const data = await request(`${API}/roles`);
      setRoles(data.roles || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const getPermissions = async () => {
    try {
      const data = await request(`${API}/permissions`);
      setPermissions(data.permissions || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const getPendingProducts = async () => {
    try {
      setLoadingProducts(true);

      const data = await request(`${API}/pending-products`);

      setPendingProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const getPendingDonations = async () => {
    try {
      setLoadingDonations(true);

      const data = await request(
        "https://sharemart.onrender.com/api/donations/admin/pending"
      );

      setPendingDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDonations(false);
    }
  };

  const updateDonationStatus = async (donationId, action) => {
    const actionText = action === "Approved" ? "approve" : "reject";

    if (
      !window.confirm(
        `Are you sure you want to ${actionText} this donation?`
      )
    ) {
      return;
    }

    try {
      setError("");
      setMessage("");
      setProcessingDonation(donationId);

      const data = await request(
        `https://sharemart.onrender.com/api/donations/admin/${donationId}/review`,
        {
          method: "PATCH",
          body: JSON.stringify({ action }),
        }
      );

      setMessage(
        data.message ||
        `Donation ${action.toLowerCase()} successfully.`
      );

      await getPendingDonations();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingDonation("");
    }
  };

  const updateProductStatus = async (productId, action) => {
    const actionText = action === "approve" ? "approve" : "reject";

    if (
      !window.confirm(
        `Are you sure you want to ${actionText} this product?`
      )
    ) {
      return;
    }

    try {
      setError("");
      setMessage("");
      setProcessingProduct(productId);

      const data = await request(
        `${API}/products/${productId}/${action}`,
        { method: "PATCH" }
      );

      setMessage(
        data.message ||
        (action === "approve"
          ? "Product approved successfully."
          : "Product rejected successfully.")
      );

      await getPendingProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingProduct("");
    }
  };

  const createRole = async (e) => {
    e.preventDefault();

    if (!roleName.trim()) {
      alert("Role name is required.");
      return;
    }

    try {
      const data = await request(`${API}/roles`, {
        method: "POST",
        body: JSON.stringify({
          name: roleName,
          description: roleDescription,
          permissions: [],
        }),
      });

      setRoleName("");
      setRoleDescription("");
      setShowRoleForm(false);

      await getRoles();

      alert(data.message || "Role created successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  const updateRole = async (e) => {
    e.preventDefault();

    if (!roleName.trim()) {
      alert("Role name is required.");
      return;
    }

    try {
      await request(`${API}/roles/${editingRole._id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: roleName,
          description: roleDescription,
        }),
      });

      setEditingRole(null);
      setRoleName("");
      setRoleDescription("");
      setShowRoleForm(false);

      await getRoles();

      alert("Role updated successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteRole = async (roleId, name) => {
    if (name === "admin") {
      alert("Admin role cannot be deleted.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${name} role?`)) {
      return;
    }

    try {
      await request(`${API}/roles/${roleId}`, {
        method: "DELETE",
      });

      await getRoles();
      await getUsers();

      alert("Role deleted successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  const createPermission = async (e) => {
    e.preventDefault();

    if (!permissionName.trim()) {
      alert("Permission name is required.");
      return;
    }

    try {
      await request(`${API}/permissions`, {
        method: "POST",
        body: JSON.stringify({
          name: permissionName,
          description: permissionDescription,
        }),
      });

      setPermissionName("");
      setPermissionDescription("");
      setShowPermissionForm(false);

      await getPermissions();

      alert("Permission created successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  const updatePermission = async (e) => {
    e.preventDefault();

    if (!permissionName.trim()) {
      alert("Permission name is required.");
      return;
    }

    try {
      await request(`${API}/permissions/${editingPermission._id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: permissionName,
          description: permissionDescription,
        }),
      });

      setEditingPermission(null);
      setPermissionName("");
      setPermissionDescription("");
      setShowPermissionForm(false);

      await getPermissions();

      alert("Permission updated successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  const deletePermission = async (permissionId, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await request(`${API}/permissions/${permissionId}`, {
        method: "DELETE",
      });

      await getPermissions();
      await getRoles();

      alert("Permission deleted successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRoleChange = (userId, roleId) => {
    setSelectedRoles((prev) => {
      const current = prev[userId] || [];

      return {
        ...prev,
        [userId]: current.includes(roleId)
          ? current.filter((id) => id !== roleId)
          : [...current, roleId],
      };
    });
  };

  const updateRoles = async (userId, roleIds) => {
    if (!roleIds || roleIds.length === 0) {
      setError("Please select at least one role.");
      return;
    }

    try {
      setError("");
      setMessage("");

      await request(`${API}/users/${userId}/roles`, {
        method: "PUT",
        body: JSON.stringify({ roles: roleIds }),
      });

      setMessage("Roles updated successfully.");

      await getUsers();

      setSelectedRoles((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (err) {
      setError(err.message);
    }
  };


  const handlePermissionChange = (roleId, permissionId) => {
    const role = roles.find((item) => item._id === roleId);

    setSelectedPermissions((prev) => {
      const current =
        prev[roleId] ||
        role?.permissions?.map((permission) => permission._id) ||
        [];

      return {
        ...prev,
        [roleId]: current.includes(permissionId)
          ? current.filter((id) => id !== permissionId)
          : [...current, permissionId],
      };
    });
  };


  const updateRolePermissions = async (roleId, permissionIds) => {
    try {
      setError("");
      setMessage("");

      await request(`${API}/roles/${roleId}`, {
        method: "PUT",
        body: JSON.stringify({ permissions: permissionIds }),
      });

      setMessage("Permissions updated successfully.");


      await getRoles();

      setSelectedPermissions((prev) => ({
        ...prev,
        [roleId]: permissionIds,
      }));

    } catch (err) {
      setError(err.message);
    }
  };

  const deleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await request(`${API}/users/${userId}`, {
        method: "DELETE",
      });

      await getUsers();

      alert("User deleted successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  const openEditRole = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description || "");
    setShowRoleForm(true);
  };

  const openEditPermission = (permission) => {
    setEditingPermission(permission);
    setPermissionName(permission.name);
    setPermissionDescription(permission.description || "");
    setShowPermissionForm(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };
  const normalUsers = users.filter(
    (user) =>
      !user.roles?.length ||
      user.roles.some((role) => role.name === "user")
  );

  const sellers = users.filter((user) =>
    user.roles?.some((role) => role.name === "seller")
  );

  const donors = users.filter((user) =>
    user.roles?.some((role) => role.name === "donor")
  );


  const showSection = (section) => {
    setActiveSection(section);
    setMessage("");
    setError("");

    if (section === "pending-products") {
      getPendingProducts();
    }

    if (section === "pending-donations") {
      getPendingDonations();
    }
  };


  const renderUserRow = (user) => (
    <div key={user._id} className="user-row">
      <div className="user-info">
        <strong>{user.name}</strong>
        <p className="user-email">{user.email}</p>

        <div className="user-role-list">
          {user.roles?.length > 0 ? (
            user.roles.map((role) => (
              <span key={role._id} className="role-badge">
                {role.name}
              </span>
            ))
          ) : (
            <span className="role-badge">No Role</span>
          )}
        </div>
      </div>

      <div className="user-actions">
        <div className="role-selector">
          {roles
            .filter((role) => role.name !== "admin")
            .map((role) => {
              const current =
                selectedRoles[user._id] ||
                user.roles?.map((item) => item._id) ||
                [];

              return (
                <label key={role._id} className="role-checkbox">
                  <input
                    type="checkbox"
                    checked={current.includes(role._id)}
                    onChange={() => handleRoleChange(user._id, role._id)}
                  />
                  <span>{role.name}</span>
                </label>
              );
            })}

          <button
            className="save-role-btn"
            onClick={() =>
              updateRoles(
                user._id,
                selectedRoles[user._id] ||
                user.roles?.map((role) => role._id) ||
                []
              )
            }
          >
            Save Roles
          </button>
        </div>

        <button
          className="delete-user-btn"
          onClick={() => deleteUser(user._id, user.name)}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
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
            onClick={() => showSection("dashboard")}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button
            className={`sidebar-item ${activeSection === "users" ? "active" : ""
              }`}
            onClick={() => showSection("users")}
          >
            <Users size={20} />
            {sidebarOpen && <span>Users</span>}
          </button>

          <button
            className={`sidebar-item ${activeSection === "sellers" ? "active" : ""
              }`}
            onClick={() => showSection("sellers")}
          >
            <ShoppingBag size={20} />
            {sidebarOpen && <span>Sellers</span>}
          </button>

          <button
            className={`sidebar-item ${activeSection === "pending-products" ? "active" : ""
              }`}
            onClick={() => showSection("pending-products")}
          >
            <ClipboardCheck size={20} />
            {sidebarOpen && (
              <span>Pending Products ({pendingProducts.length})</span>
            )}
          </button>

          <button
            className={`sidebar-item ${activeSection === "pending-donations" ? "active" : ""
              }`}
            onClick={() => showSection("pending-donations")}
          >
            <Heart size={20} />
            {sidebarOpen && (
              <span>Pending Donations ({pendingDonations.length})</span>
            )}
          </button>

          <button
            className={`sidebar-item ${activeSection === "donors" ? "active" : ""
              }`}
            onClick={() => showSection("donors")}
          >
            <Heart size={20} />
            {sidebarOpen && <span>Donors</span>}
          </button>

          <button
            className={`sidebar-item ${activeSection === "roles" ? "active" : ""
              }`}
            onClick={() => showSection("roles")}
          >
            <Shield size={20} />
            {sidebarOpen && <span>Roles</span>}
          </button>

          <button
            className={`sidebar-item ${activeSection === "permissions" ? "active" : ""
              }`}
            onClick={() => showSection("permissions")}
          >
            <KeyRound size={20} />
            {sidebarOpen && <span>Permissions</span>}
          </button>

          <button
            className={`sidebar-item ${activeSection === "settings" ? "active" : ""
              }`}
            onClick={() => showSection("settings")}
          >
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>

        <button className="sidebar-item logout" onClick={logout}>
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      <div className="dashboard-main">
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

        {activeSection === "dashboard" && (
          <>
            <div className="dashboard-welcome">
              <div>
                <h2>Welcome back, Admin! 👋</h2>
                <p>
                  Here's what's happening with your ShareMart platform today.
                </p>
              </div>
            </div>

            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="card-icon"><Users size={24} /></div>
                <div><p>Total Users</p><h3>{users.length}</h3></div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon"><ShoppingBag size={24} /></div>
                <div><p>Sellers</p><h3>{sellers.length}</h3></div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon"><Heart size={24} /></div>
                <div><p>Donors</p><h3>{donors.length}</h3></div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon"><Shield size={24} /></div>
                <div><p>Total Roles</p><h3>{roles.length}</h3></div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon"><KeyRound size={24} /></div>
                <div><p>Permissions</p><h3>{permissions.length}</h3></div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon"><ClipboardCheck size={24} /></div>
                <div><p>Pending Products</p><h3>{pendingProducts.length}</h3></div>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2>Quick Overview</h2>
              </div>

              <div className="overview-grid">
                <button onClick={() => showSection("users")}>
                  <Users size={25} />
                  <strong>Manage Users</strong>
                  <span>View and manage users</span>
                </button>

                <button onClick={() => showSection("sellers")}>
                  <ShoppingBag size={25} />
                  <strong>Manage Sellers</strong>
                  <span>View seller accounts</span>
                </button>

                <button onClick={() => showSection("pending-products")}>
                  <ClipboardCheck size={25} />
                  <strong>Pending Products</strong>
                  <span>Review and approve product requests</span>
                </button>

                <button onClick={() => showSection("donors")}>
                  <Heart size={25} />
                  <strong>Manage Donors</strong>
                  <span>View donor accounts</span>
                </button>

                <button onClick={() => showSection("roles")}>
                  <Shield size={25} />
                  <strong>Manage Roles</strong>
                  <span>Create and manage roles</span>
                </button>

                <button onClick={() => showSection("permissions")}>
                  <KeyRound size={25} />
                  <strong>Manage Permissions</strong>
                  <span>Control role permissions</span>
                </button>
              </div>
            </div>
          </>
        )}

        {activeSection === "pending-products" && (
          <div className="dashboard-section">
            <div className="section-header">
              <div>
                <h2>Pending Product Requests</h2>
                <p>Review seller products before publishing them.</p>
              </div>

              <button onClick={getPendingProducts}>
                <RefreshCw size={15} />
                Refresh
              </button>
            </div>

            {loadingProducts ? (
              <div className="empty-dashboard">
                <p>Loading pending products...</p>
              </div>
            ) : pendingProducts.length === 0 ? (
              <div className="empty-dashboard">
                <ClipboardCheck size={40} />
                <h3>No pending products</h3>
                <p>New seller requests will appear here.</p>
              </div>
            ) : (
              <div className="pending-products-list">
                {pendingProducts.map((product) => (
                  <div className="pending-product-card" key={product._id}>
                    {product.image ? (
                      <img
                        className="pending-product-image"
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <div className="pending-product-no-image">
                        No Image
                      </div>
                    )}

                    <div className="pending-product-info">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <p><strong>Price:</strong> ৳{product.price}</p>
                      <p><strong>Category:</strong> {product.category}</p>
                      <p><strong>Condition:</strong> {product.condition}</p>
                      <p><strong>Location:</strong> {product.location}</p>
                      <p>
                        <strong>Seller:</strong>{" "}
                        {product.seller?.name || "Unknown"}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {product.seller?.email || "Not available"}
                      </p>

                      <span className="pending-product-status">
                        Pending Approval
                      </span>

                      <div className="pending-product-actions">
                        <button
                          className="approve-product-btn"
                          disabled={processingProduct === product._id}
                          onClick={() =>
                            updateProductStatus(product._id, "approve")
                          }
                        >
                          {processingProduct === product._id
                            ? "Please wait..."
                            : "Approve"}
                        </button>

                        <button
                          className="reject-product-btn"
                          disabled={processingProduct === product._id}
                          onClick={() =>
                            updateProductStatus(product._id, "reject")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === "pending-donations" && (
          <div className="dashboard-section">
            <div className="section-header">
              <div>
                <h2>Pending Donation Requests</h2>
                <p>Review donations submitted by donors before publishing.</p>
              </div>

              <button onClick={getPendingDonations}>
                <RefreshCw size={15} />
                Refresh
              </button>
            </div>

            {loadingDonations ? (
              <div className="empty-dashboard">
                <p>Loading pending donations...</p>
              </div>
            ) : pendingDonations.length === 0 ? (
              <div className="empty-dashboard">
                <Heart size={40} />
                <h3>No pending donations</h3>
                <p>New donor submissions will appear here.</p>
              </div>
            ) : (
              <div className="pending-products-list">
                {pendingDonations.map((donation) => (
                  <div className="pending-product-card" key={donation._id}>
                    {donation.image ? (
                      <img
                        className="pending-product-image"
                        src={donation.image}
                        alt={donation.title}
                      />
                    ) : (
                      <div className="pending-product-no-image">
                        No Image
                      </div>
                    )}

                    <div className="pending-product-info">
                      <h3>{donation.title}</h3>
                      <p>{donation.description}</p>
                      <p>
                        <strong>Category:</strong> {donation.category}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {donation.quantity}
                      </p>
                      <p>
                        <strong>Location:</strong> {donation.location}
                      </p>

                      {donation.category === "Food" && donation.expiryDate && (
                        <p>
                          <strong>Expiry Date:</strong>{" "}
                          {new Date(donation.expiryDate).toLocaleDateString()}
                        </p>
                      )}

                      <p>
                        <strong>Donor:</strong>{" "}
                        {donation.donor?.name || "Unknown"}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {donation.donor?.email || "Not available"}
                      </p>

                      <span className="pending-product-status">
                        Pending Approval
                      </span>

                      <div className="pending-product-actions">
                        <button
                          className="approve-product-btn"
                          disabled={processingDonation === donation._id}
                          onClick={() =>
                            updateDonationStatus(donation._id, "Approved")
                          }
                        >
                          {processingDonation === donation._id
                            ? "Please wait..."
                            : "Approve"}
                        </button>

                        <button
                          className="reject-product-btn"
                          disabled={processingDonation === donation._id}
                          onClick={() =>
                            updateDonationStatus(donation._id, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {activeSection === "users" && (
          <div className="dashboard-section">
            <div className="section-header">
              <div>
                <h2>Users</h2>
                <p>Manage normal users and their roles.</p>
              </div>
            </div>

            {normalUsers.length === 0 ? (
              <div className="empty-dashboard">
                <Users size={40} />
                <h3>No users found</h3>
                <p>Normal users will appear here.</p>
              </div>
            ) : normalUsers.map(renderUserRow)}
          </div>
        )}

        {activeSection === "sellers" && (
          <div className="dashboard-section">
            <div className="section-header">
              <div>
                <h2>Sellers</h2>
                <p>Manage users who have the seller role.</p>
              </div>
            </div>

            {sellers.length === 0 ? (
              <div className="empty-dashboard">
                <ShoppingBag size={40} />
                <h3>No sellers found</h3>
                <p>Users with seller role will appear here.</p>
              </div>
            ) : sellers.map(renderUserRow)}
          </div>
        )}

        {activeSection === "donors" && (
          <div className="dashboard-section">
            <div className="section-header">
              <div>
                <h2>Donors</h2>
                <p>Manage users who have the donor role.</p>
              </div>
            </div>

            {donors.length === 0 ? (
              <div className="empty-dashboard">
                <Heart size={40} />
                <h3>No donors found</h3>
                <p>Users with donor role will appear here.</p>
              </div>
            ) : donors.map(renderUserRow)}
          </div>
        )}

        {activeSection === "roles" && (
          <div className="dashboard-section">
            <div className="section-header">
              <div>
                <h2>Roles</h2>
                <p>Create roles and control their permissions.</p>
              </div>

              <button
                className="add-role-btn"
                onClick={() => {
                  setEditingRole(null);
                  setRoleName("");
                  setRoleDescription("");
                  setShowRoleForm(!showRoleForm);
                }}
              >
                <Plus size={17} /> Add Role
              </button>
            </div>

            {showRoleForm && (
              <form
                className="role-form"
                onSubmit={editingRole ? updateRole : createRole}
              >
                <input
                  placeholder="Role name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
                <input
                  placeholder="Role description"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                />
                <button type="submit">
                  {editingRole ? "Update Role" : "Create Role"}
                </button>
              </form>
            )}

            <div className="roles-list">
              {roles.map((role) => {
                const currentPermissions =
                  selectedPermissions[role._id] ||
                  role.permissions?.map((permission) => permission._id) ||
                  [];

                return (
                  <div className="role-management-card" key={role._id}>
                    <div className="role-card-header">
                      <div>
                        <strong>{role.name}</strong>
                        <p>{role.description || "No description"}</p>
                      </div>

                      <div className="role-card-actions">
                        <button className="edit-btn" onClick={() => openEditRole(role)}>
                          <Pencil size={14} /> Edit
                        </button>

                        {role.name !== "admin" && (
                          <button
                            className="delete-role-btn"
                            onClick={() => deleteRole(role._id, role.name)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="permission-title">
                      <KeyRound size={16} /> Manage Permissions
                    </div>

                    <div className="permission-checkbox-grid">
                      {permissions.map((permission) => (
                        <label
                          key={permission._id}
                          className="permission-checkbox"
                        >
                          <input
                            type="checkbox"
                            checked={currentPermissions.includes(permission._id)}
                            onChange={() =>
                              handlePermissionChange(role._id, permission._id)
                            }
                          />
                          <div>
                            <strong>{permission.name}</strong>
                            {permission.description && (
                              <small>{permission.description}</small>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="role-permission-footer">
                      <span>
                        {currentPermissions.length} permissions selected
                      </span>
                      <button
                        className="save-permission-btn"
                        onClick={() =>
                          updateRolePermissions(role._id, currentPermissions)
                        }
                      >
                        Save Permissions
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === "permissions" && (
          <div className="dashboard-section">
            <div className="section-header">
              <div>
                <h2>Permissions</h2>
                <p>Create and manage platform permissions.</p>
              </div>

              <button
                className="add-role-btn"
                onClick={() => {
                  setEditingPermission(null);
                  setPermissionName("");
                  setPermissionDescription("");
                  setShowPermissionForm(!showPermissionForm);
                }}
              >
                <Plus size={17} /> Add Permission
              </button>
            </div>

            {showPermissionForm && (
              <form
                className="role-form"
                onSubmit={
                  editingPermission ? updatePermission : createPermission
                }
              >
                <input
                  placeholder="Permission name"
                  value={permissionName}
                  onChange={(e) => setPermissionName(e.target.value)}
                />
                <input
                  placeholder="Permission description"
                  value={permissionDescription}
                  onChange={(e) => setPermissionDescription(e.target.value)}
                />
                <button type="submit">
                  {editingPermission
                    ? "Update Permission"
                    : "Create Permission"}
                </button>
              </form>
            )}

            <div className="permissions-list">
              {permissions.map((permission) => (
                <div className="permission-row" key={permission._id}>
                  <div>
                    <strong>{permission.name}</strong>
                    <p>{permission.description || "No description"}</p>
                  </div>

                  <div className="permission-actions">
                    <button
                      className="edit-btn"
                      onClick={() => openEditPermission(permission)}
                    >
                      <Pencil size={14} /> Edit
                    </button>

                    <button
                      className="delete-role-btn"
                      onClick={() =>
                        deletePermission(permission._id, permission.name)
                      }
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "settings" && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Settings</h2>
            </div>
            <div className="empty-dashboard">
              <Settings size={40} />
              <h3>Settings</h3>
              <p>Admin settings can be added here later.</p>
            </div>
          </div>
        )}

        {message && (
          <div className="dashboard-api-message">{message}</div>
        )}

        {error && (
          <div className="dashboard-api-error">{error}</div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;