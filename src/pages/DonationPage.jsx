
import { useEffect, useState } from "react";
import { Search, Heart, MapPin, Package } from "lucide-react";
import "./AdminDashboard.css";

const API = "https://sharemart.onrender.com/api";

const categories = [
    "All",
    "Food",
    "Clothes",
    "Books",
    "Furniture",
    "Other"
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
            setMessage(
                "Please login with your NGO account to request a donation."
            );
            return;
        }

        if (!isNGO) {
            setMessage(
                "Only logged-in NGO accounts can request donations."
            );
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
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to request donation."
                );
            }

            setMessage(
                data.message ||
                "Donation request submitted successfully."
            );

        } catch (err) {
            setMessage(
                err.message || "Could not submit your request."
            );
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
            donation.location
        ]
            .filter(Boolean)
            .some((value) =>
                value.toLowerCase().includes(search.toLowerCase())
            );

        return categoryMatch && searchMatch;
    });

    return (
        <main className="dashboard-container donation-page">

            <div className="donation-page-inner">

                {/* Heading */}
                <div className="donation-heading">
                    <Heart size={38} color="#2f7d3c" />

                    <h1>Donated Items</h1>

                    <p>
                        Discover donated items shared by generous people.
                    </p>
                </div>

                {/* Search */}
                <div className="donation-search-wrap">
                    <div className="donation-search-box">

                        <Search size={19} color="#777" />

                        <input
                            type="text"
                            placeholder="Search donated items..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>
                </div>

                {/* Categories */}
                <div className="donation-categories">

                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className={
                                selectedCategory === category
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setSelectedCategory(category)
                            }
                        >
                            {category}
                        </button>
                    ))}

                </div>

                {/* Message */}
                {message && (
                    <p
                        className="donation-message"
                        role="status"
                    >
                        {message}
                    </p>
                )}

                {/* Loading */}
                {loading ? (
                    <p className="donation-status">
                        Loading donated items...
                    </p>

                ) : error ? (

                    <p className="donation-error">
                        {error}
                    </p>

                ) : filteredDonations.length === 0 ? (

                    <div className="donation-empty">
                        <Package size={44} color="#999" />

                        <h3>No donated items found</h3>

                        <p>
                            Try another category or search keyword.
                        </p>
                    </div>

                ) : (

                    /* Product Grid */
                    <div className="donation-grid">

                        {filteredDonations.map((donation) => (

                            <article
                                className="donation-card"
                                key={donation._id}
                            >

                                <span className="donation-category-badge">
                                    {donation.category}
                                </span>

                                <h3>
                                    {donation.title || donation.name}
                                </h3>

                                <p className="donation-description">
                                    {donation.description ||
                                        "No description available."}
                                </p>

                                <p className="donation-detail">
                                    <Package size={16} />

                                    <span>
                                        Quantity: {donation.quantity ?? "—"}
                                    </span>
                                </p>

                                <p className="donation-detail donation-location">
                                    <MapPin size={16} />

                                    <span>
                                        {donation.location ||
                                            "Location not provided"}
                                    </span>
                                </p>

                                {/* NGO Request Button */}
                                {isNGO && (
                                    <button
                                        type="button"
                                        className="donation-request-button"
                                        disabled={
                                            requestingId === donation._id
                                        }
                                        onClick={() =>
                                            handleRequest(donation._id)
                                        }
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
