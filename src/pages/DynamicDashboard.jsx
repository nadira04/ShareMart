
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    ShoppingBag,
    Heart,
    Plus,
    Package,
    ClipboardList
} from "lucide-react";

function DynamicDashboard({
    onAddProduct,
    onViewDonations,
    onViewMyRequests,
    onCreateDonation
}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");

            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error("Could not read saved user:", error);
        }
    }, []);

    if (!user) {
        return <div>Loading dashboard...</div>;
    }

    const permissions = user.permissions || [];

    const userRoles = (user.roles || []).map((role) =>
        (typeof role === "string" ? role : role?.name || "").toLowerCase()
    );

    const isNGO = userRoles.some((role) => role.includes("ngo"));

    const canViewProducts = permissions.includes("product.view");
    const canCreateProducts = permissions.includes("product.create");
    const canViewDonations = permissions.includes("donation.view");
    const canCreateDonations = permissions.includes("donation.create");

    return (
        <div className="dashboard-container">
            <div className="dashboard-main">
                <div className="dashboard-topbar">
                    <div>
                        <h1>My Dashboard</h1>
                        <p>Welcome back, {user.name}!</p>
                    </div>

                    <div className="dashboard-profile">
                        <div className="profile-avatar">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <strong>{user.name}</strong>
                            <small>ShareMart User</small>
                        </div>
                    </div>
                </div>

                <div className="dashboard-welcome">
                    <div>
                        <h2>Welcome to ShareMart! 👋</h2>
                        <p>
                            Your dashboard is based on the permissions assigned to you.
                        </p>
                    </div>
                </div>

                <div className="dashboard-cards">
                    {canViewProducts && (
                        <div className="dashboard-card">
                            <div className="card-icon">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <p>Products</p>
                                <h3>Marketplace</h3>
                            </div>
                        </div>
                    )}

                    {canViewDonations && (
                        <div className="dashboard-card">
                            <div className="card-icon">
                                <Heart size={24} />
                            </div>
                            <div>
                                <p>Donations</p>
                                <h3>Donation Center</h3>
                            </div>
                        </div>
                    )}

                    {canCreateProducts && (
                        <div className="dashboard-card">
                            <div className="card-icon">
                                <Plus size={24} />
                            </div>
                            <div>
                                <p>Product Access</p>
                                <h3>Can Create</h3>
                            </div>
                        </div>
                    )}

                    {canCreateDonations && (
                        <div className="dashboard-card">
                            <div className="card-icon">
                                <Plus size={24} />
                            </div>
                            <div>
                                <p>Donation Access</p>
                                <h3>Can Create</h3>
                            </div>
                        </div>
                    )}

                    {isNGO && (
                        <div className="dashboard-card">
                            <div className="card-icon">
                                <ClipboardList size={24} />
                            </div>
                            <div>
                                <p>NGO Requests</p>
                                <h3>Track Requests</h3>
                            </div>
                        </div>
                    )}
                </div>

                {!canViewProducts && !canViewDonations && !isNGO && (
                    <div className="empty-dashboard">
                        <LayoutDashboard size={40} />
                        <h3>No dashboard features available</h3>
                        <p>
                            Your account does not have any dashboard feature
                            permissions yet.
                        </p>
                    </div>
                )}

                {canViewProducts && (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <div>
                                <h2>Marketplace</h2>
                                <p>
                                    Features available through your product permissions.
                                </p>
                            </div>
                        </div>

                        <div className="overview-grid">
                            <button type="button">
                                <Package size={25} />
                                <strong>View Products</strong>
                                <span>Browse marketplace products</span>
                            </button>

                            {canCreateProducts && (
                                <button type="button" onClick={onAddProduct}>
                                    <Plus size={25} />
                                    <strong>Add Product</strong>
                                    <span>Create a new product</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {canViewDonations && (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <div>
                                <h2>Donations</h2>
                                <p>
                                    Features available through your donation permissions.
                                </p>
                            </div>
                        </div>

                        <div className="overview-grid">
                            <button type="button" onClick={onViewDonations}>
                                <Heart size={25} />
                                <strong>View Donations</strong>
                                <span>Browse available donations</span>
                            </button>

                            {canCreateDonations && (
                                <button type="button" onClick={onCreateDonation}>
                                    <Plus size={25} />
                                    <strong>Create Donation</strong>
                                    <span>Create a new donation</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {isNGO && (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <div>
                                <h2>NGO Donation Requests</h2>
                                <p>
                                    View all your requests and check their current status.
                                </p>
                            </div>
                        </div>

                        <div className="overview-grid">
                            <button type="button" onClick={onViewMyRequests}>
                                <ClipboardList size={25} />
                                <strong>My Requests</strong>
                                <span>
                                    Track Pending, Accepted and Rejected requests
                                </span>
                            </button>

                            <button type="button" onClick={onViewDonations}>
                                <Heart size={25} />
                                <strong>Find Donations</strong>
                                <span>Browse available donations to request</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DynamicDashboard;
