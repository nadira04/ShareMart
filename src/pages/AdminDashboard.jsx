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
} from "lucide-react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

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

  useEffect(() => {
    getAdminDashboard();
    getUsers();
    getRoles();
    getPermissions();
  }, []);

  const getAdminDashboard = async () => {
    try {
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
        setUsers(data.users || []);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to fetch users.");
    }
  };

  const getRoles = async () => {
    try {
      const response = await fetch(
        "https://sharemart.onrender.com/api/admin/roles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRoles(data.roles || []);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to fetch roles.");
    }
  };

  const getPermissions = async () => {
    try {
      const response = await fetch(
        "https://sharemart.onrender.com/api/admin/permissions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPermissions(data.permissions || []);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to fetch permissions.");
    }
  };

  const createRole = async (e) => {
    e.preventDefault();

    if (!roleName.trim()) {
      alert("Role name is required.");
      return;
    }

    try {
      const response = await fetch(
        "https://sharemart.onrender.com/api/admin/roles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: roleName,
            description: roleDescription,
            permissions: [],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setRoleName("");
      setRoleDescription("");
      setShowRoleForm(false);

      await getRoles();

      alert("Role created successfully.");
    } catch (error) {
      alert("Server connection failed.");
    }
  };

  const updateRole = async (e) => {
    e.preventDefault();

    if (!roleName.trim()) {
      alert("Role name is required.");
      return;
    }

    try {
      const response = await fetch(
        `https://sharemart.onrender.com/api/admin/roles/${editingRole._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: roleName,
            description: roleDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setEditingRole(null);
      setRoleName("");
      setRoleDescription("");

      await getRoles();

      alert("Role updated successfully.");
    } catch (error) {
      alert("Server connection failed.");
    }
  };

  const deleteRole = async (roleId, roleName) => {
    if (roleName === "admin") {
      alert("Admin role cannot be deleted.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${roleName} role?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://sharemart.onrender.com/api/admin/roles/${roleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      await getRoles();
      await getUsers();

      alert("Role deleted successfully.");
    } catch (error) {
      alert("Server connection failed.");
    }
  };

  const createPermission = async (e) => {
    e.preventDefault();

    if (!permissionName.trim()) {
      alert("Permission name is required.");
      return;
    }

    try {
      const response = await fetch(
        "https://sharemart.onrender.com/api/admin/permissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: permissionName,
            description: permissionDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setPermissionName("");
      setPermissionDescription("");
      setShowPermissionForm(false);

      await getPermissions();

      alert("Permission created successfully.");
    } catch (error) {
      alert("Server connection failed.");
    }
  };

  const updatePermission = async (e) => {
    e.preventDefault();

    if (!permissionName.trim()) {
      alert("Permission name is required.");
      return;
    }

    try {
      const response = await fetch(
        `https://sharemart.onrender.com/api/admin/permissions/${editingPermission._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: permissionName,
            description: permissionDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setEditingPermission(null);
      setPermissionName("");
      setPermissionDescription("");

      await getPermissions();

      alert("Permission updated successfully.");
    } catch (error) {
      alert("Server connection failed.");
    }
  };

  const deletePermission = async (permissionId, permissionName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${permissionName}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://sharemart.onrender.com/api/admin/permissions/${permissionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      await getPermissions();
      await getRoles();

      alert("Permission deleted successfully.");
    } catch (error) {
      alert("Server connection failed.");
    }
  };

  const handleRoleChange = (userId, roleId) => {
    setSelectedRoles((prev) => {
      const currentRoles = prev[userId] || [];

      if (currentRoles.includes(roleId)) {
        return {
          ...prev,
          [userId]: currentRoles.filter((id) => id !== roleId),
        };
      }

      return {
        ...prev,
        [userId]: [...currentRoles, roleId],
      };
    });
  };

  const updateRoles = async (userId, roleIds) => {
    try {
      setError("");
      setMessage("");

      if (!roleIds || roleIds.length === 0) {
        setError("Please select at least one role.");
        return;
      }

      const response = await fetch(
        `https://sharemart.onrender.com/api/admin/users/${userId}/roles`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roles: roleIds,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update roles");
      }

      setMessage("Roles updated successfully.");

      await getUsers();

      setSelectedRoles((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePermissionChange = (roleId, permissionId) => {
    setSelectedPermissions((prev) => {
      const currentPermissions = prev[roleId] || [];

      if (currentPermissions.includes(permissionId)) {
        return {
          ...prev,
          [roleId]: currentPermissions.filter(
            (id) => id !== permissionId
          ),
        };
      }

      return {
        ...prev,
        [roleId]: [...currentPermissions, permissionId],
      };
    });
  };

  const updateRolePermissions = async (roleId, permissionIds) => {
    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `https://sharemart.onrender.com/api/admin/roles/${roleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            permissions: permissionIds,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update permissions"
        );
      }

      setMessage("Permissions updated successfully.");

      await getRoles();

      setSelectedPermissions((prev) => {
        const updated = { ...prev };
        delete updated[roleId];
        return updated;
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${userName}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://sharemart.onrender.com/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      await getUsers();

      alert("User deleted successfully.");
    } catch (error) {
      alert("Server connection failed.");
    }
  };

  const openEditRole = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description || "");
  };

  const openEditPermission = (permission) => {
    setEditingPermission(permission);
    setPermissionName(permission.name);
    setPermissionDescription(permission.description || "");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const normalUsers = users.filter((user) =>
    user.roles?.some((role) => role.name === "user")
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
  };

  const renderUserRow = (user) => {
    return (
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
                const currentRoles =
                  selectedRoles[user._id] ||
                  user.roles?.map((role) => role._id) ||
                  [];

                return (
                  <label key={role._id} className="role-checkbox">
                    <input
                      type="checkbox"
                      checked={currentRoles.includes(role._id)}
                      onChange={() =>
                        handleRoleChange(user._id, role._id)
                      }
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
  };

  return (
    <div className="dashboard-container">
      <aside
        className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"
          }`}
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
                  Here's what's happening with your ShareMart
                  platform today.
                </p>
              </div>
            </div>

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
                  <p>Sellers</p>
                  <h3>{sellers.length}</h3>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">
                  <Heart size={24} />
                </div>

                <div>
                  <p>Donors</p>
                  <h3>{donors.length}</h3>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">
                  <Shield size={24} />
                </div>

                <div>
                  <p>Total Roles</p>
                  <h3>{roles.length}</h3>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">
                  <KeyRound size={24} />
                </div>

                <div>
                  <p>Permissions</p>
                  <h3>{permissions.length}</h3>
                </div>
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
            ) : (
              <div>
                {normalUsers.map((user) => renderUserRow(user))}
              </div>
            )}
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
            ) : (
              <div>
                {sellers.map((user) => renderUserRow(user))}
              </div>
            )}
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
            ) : (
              <div>
                {donors.map((user) => renderUserRow(user))}
              </div>
            )}
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
                <Plus size={17} />
                Add Role
              </button>
            </div>

            {showRoleForm && (
              <form
                className="role-form"
                onSubmit={
                  editingRole ? updateRole : createRole
                }
              >
                <input
                  type="text"
                  placeholder="Role name"
                  value={roleName}
                  onChange={(e) =>
                    setRoleName(e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Role description"
                  value={roleDescription}
                  onChange={(e) =>
                    setRoleDescription(e.target.value)
                  }
                />

                <button type="submit">
                  {editingRole ? "Update Role" : "Create Role"}
                </button>
              </form>
            )}

            {roles.length === 0 ? (
              <div className="empty-dashboard">
                <Shield size={40} />
                <h3>No roles found</h3>
                <p>Create your first dynamic role.</p>
              </div>
            ) : (
              <div className="roles-list">
                {roles.map((role) => {
                  const currentPermissions =
                    selectedPermissions[role._id] ||
                    role.permissions?.map(
                      (permission) => permission._id
                    ) ||
                    [];

                  return (
                    <div
                      className="role-management-card"
                      key={role._id}
                    >
                      <div className="role-card-header">
                        <div>
                          <strong>{role.name}</strong>

                          <p>
                            {role.description ||
                              "No description"}
                          </p>
                        </div>

                        <div className="role-card-actions">
                          <button
                            className="edit-btn"
                            onClick={() => {
                              openEditRole(role);
                              setShowRoleForm(true);
                            }}
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          {role.name !== "admin" && (
                            <button
                              className="delete-role-btn"
                              onClick={() =>
                                deleteRole(
                                  role._id,
                                  role.name
                                )
                              }
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="permission-title">
                        <KeyRound size={16} />
                        Manage Permissions
                      </div>

                      <div className="permission-checkbox-grid">
                        {permissions.map((permission) => (
                          <label
                            key={permission._id}
                            className="permission-checkbox"
                          >
                            <input
                              type="checkbox"
                              checked={currentPermissions.includes(
                                permission._id
                              )}
                              onChange={() =>
                                handlePermissionChange(
                                  role._id,
                                  permission._id
                                )
                              }
                            />

                            <div>
                              <strong>
                                {permission.name}
                              </strong>

                              {permission.description && (
                                <small>
                                  {permission.description}
                                </small>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>

                      <div className="role-permission-footer">
                        <span>
                          {currentPermissions.length} permissions
                          selected
                        </span>

                        <button
                          className="save-permission-btn"
                          onClick={() =>
                            updateRolePermissions(
                              role._id,
                              currentPermissions
                            )
                          }
                        >
                          Save Permissions
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeSection === "permissions" && (
          <div className="dashboard-section">
            <div className="section-header">
              <div>
                <h2>Permissions</h2>
                <p>
                  Create and manage platform permissions.
                </p>
              </div>

              <button
                className="add-role-btn"
                onClick={() => {
                  setEditingPermission(null);
                  setPermissionName("");
                  setPermissionDescription("");
                  setShowPermissionForm(
                    !showPermissionForm
                  );
                }}
              >
                <Plus size={17} />
                Add Permission
              </button>
            </div>

            {showPermissionForm && (
              <form
                className="role-form"
                onSubmit={
                  editingPermission
                    ? updatePermission
                    : createPermission
                }
              >
                <input
                  type="text"
                  placeholder="Permission name"
                  value={permissionName}
                  onChange={(e) =>
                    setPermissionName(e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Permission description"
                  value={permissionDescription}
                  onChange={(e) =>
                    setPermissionDescription(e.target.value)
                  }
                />

                <button type="submit">
                  {editingPermission
                    ? "Update Permission"
                    : "Create Permission"}
                </button>
              </form>
            )}

            {permissions.length === 0 ? (
              <div className="empty-dashboard">
                <KeyRound size={40} />
                <h3>No permissions found</h3>
                <p>Create your first permission.</p>
              </div>
            ) : (
              <div className="permissions-list">
                {permissions.map((permission) => (
                  <div
                    className="permission-row"
                    key={permission._id}
                  >
                    <div>
                      <strong>{permission.name}</strong>

                      <p>
                        {permission.description ||
                          "No description"}
                      </p>
                    </div>

                    <div className="permission-actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          openEditPermission(permission);
                          setShowPermissionForm(true);
                        }}
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        className="delete-role-btn"
                        onClick={() =>
                          deletePermission(
                            permission._id,
                            permission.name
                          )
                        }
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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