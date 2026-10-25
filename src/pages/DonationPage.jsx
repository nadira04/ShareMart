
import { useEffect, useState } from "react";
import {
    Search,
    Heart,
    MapPin,
    Package,
} from "lucide-react";
import "./AdminDashboard.css";

const API = "https://sharemart.onrender.com/api";

const categories = [
    "All",
    "Food",
    "Clothes",
    "Books",
    "Furniture",
    "Other",
];

function DonationPage() {
    const [donations, setDonations] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [requestingId, setRequestingId] = useState(null);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const isNGO =
        !!token &&
        user?.roles?.some((role) =>
            (typeof role === "string" ? role : role.name)
                ?.toLowerCase()
                .includes("ngo")
        );

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API}/donations`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load donations."
                    );
                }

                const items = Array.isArray(data)
                    ? data
                    : data.donations || [];

                setDonations(
                    items.filter(
                        (item) => item.approvalStatus === "Approved"
                    )
                );
            } catch (err) {
                setError(err.message || "Could not load donations.");
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, []);

    const handleRequest = async (donationId) => {
        if (!token) {
            setMessage("Please login with your NGO account to request a donation.");
            return;
        }

        if (!isNGO) {
            setMessage("Only logged-in NGO accounts can request donations.");
            return;
        }

        try {
            setRequestingId(donationId);
            setMessage("");

            const response = await fetch(
                `${API}/donations/${donationId}/request`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to request donation."
                );
            }

            setMessage(data.message || "Donation request submitted successfully.");
        } catch (err) {
            setMessage(err.message || "Could not submit your request.");
        } finally {
            setRequestingId(null);
        }
    };

    const filteredDonations = donations.filter((donation) => {
        const categoryMatch =
            selectedCategory === "All" ||
            donation.category?.toLowerCase() ===
            selectedCategory.toLowerCase();

        const searchMatch = [
            donation.title,
            donation.name,
            donation.description,
            donation.category,
            donation.location,
        ]
            .filter(Boolean)
            .some((value) =>
                value.toLowerCase().includes(search.toLowerCase())
            );

        return categoryMatch && searchMatch;
    });

    return (
        <main
            className="dashboard-container"
            style={{ minHeight: "70vh", padding: "32px 5%" }}
        >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <Heart
                        size={38}
                        color="#2f7d3c"
                        style={{ margin: "0 auto 12px" }}
                    />

                    <h1>Donated Items</h1>
                    <p>Discover donated items shared by generous people.</p>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: "24px",
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flex: "1",
                            minWidth: "220px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "0 12px",
                            background: "#fff",
                        }}
                    >
                        <Search size={19} color="#777" />
                        <input
                            type="text"
                            placeholder="Search donated items..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 0",
                                border: "none",
                                outline: "none",
                            }}
                        />
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginBottom: "28px",
                    }}
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                padding: "10px 18px",
                                borderRadius: "24px",
                                border: "1px solid #2f7d3c",
                                background:
                                    selectedCategory === category ? "#2f7d3c" : "#fff",
                                color:
                                    selectedCategory === category ? "#fff" : "#2f7d3c",
                                cursor: "pointer",
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {message && (
                    <p
                        role="status"
                        style={{
                            padding: "12px",
                            marginBottom: "20px",
                            borderRadius: "8px",
                            background: "#e8f5e9",
                            color: "#246b32",
                        }}
                    >
                        {message}
                    </p>
                )}

                {loading ? (
                    <p style={{ textAlign: "center", padding: "40px" }}>
                        Loading donated items...
                    </p>
                ) : error ? (
                    <p style={{ textAlign: "center", color: "red" }}>{error}</p>
                ) : filteredDonations.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 16px" }}>
                        <Package
                            size={44}
                            color="#999"
                            style={{ margin: "0 auto 12px" }}
                        />
                        <h3>No donated items found</h3>
                        <p>Try another category or search keyword.</p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(240px, 1fr))",
                            gap: "22px",
                        }}
                    >
                        {filteredDonations.map((donation) => (
                            <article
                                key={donation._id}
                                style={{
                                    background: "#fff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "12px",
                                    padding: "22px",
                                    boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        background: "#e8f5e9",
                                        color: "#2f7d3c",
                                        borderRadius: "20px",
                                        padding: "5px 12px",
                                        fontSize: "13px",
                                        marginBottom: "14px",
                                    }}
                                >
                                    {donation.category}
                                </span>

                                <h3 style={{ marginBottom: "10px" }}>
                                    {donation.title || donation.name}
                                </h3>

                                <p
                                    style={{
                                        color: "#666",
                                        lineHeight: "1.6",
                                        marginBottom: "14px",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {donation.description || "No description available."}
                                </p>

                                <p style={{ marginBottom: "8px" }}>
                                    <Package
                                        size={16}
                                        style={{
                                            display: "inline",
                                            verticalAlign: "middle",
                                            marginRight: "6px",
                                        }}
                                    />
                                    Quantity: {donation.quantity ?? "—"}
                                </p>

                                <p style={{ marginBottom: "16px" }}>
                                    <MapPin
                                        size={16}
                                        style={{
                                            display: "inline",
                                            verticalAlign: "middle",
                                            marginRight: "6px",
                                        }}
                                    />
                                    {donation.location || "Location not provided"}
                                </p>

                                {isNGO && (
                                    <button
                                        type="button"
                                        disabled={requestingId === donation._id}
                                        onClick={() => handleRequest(donation._id)}
                                        style={{
                                            width: "100%",
                                            padding: "11px",
                                            border: "none",
                                            borderRadius: "8px",
                                            background: "#2f7d3c",
                                            color: "#fff",
                                            cursor:
                                                requestingId === donation._id
                                                    ? "wait"
                                                    : "pointer",
                                            opacity:
                                                requestingId === donation._id ? 0.7 : 1,
                                        }}
                                    >
                                        {requestingId === donation._id
                                            ? "Requesting..."
                                            : "Request Donation"}
                                    </button>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default DonationPage;
