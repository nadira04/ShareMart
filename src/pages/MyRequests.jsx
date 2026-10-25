
import { useEffect, useState } from "react";
import { ArrowLeft, RefreshCw, MapPin, Package, Clock } from "lucide-react";

const API_BASE = (
    import.meta.env.VITE_API_URL || "https://sharemart.onrender.com"
).replace(/\/+$/, "");

const REQUESTS_URL = API_BASE.endsWith("/api")
    ? `${API_BASE}/donations/my-requests`
    : `${API_BASE}/api/donations/my-requests`;

function MyRequests({ onBack }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRequests = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please log in to view your donation requests.");
            }

            const response = await fetch(REQUESTS_URL, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Could not load your donation requests."
                );
            }

            setRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case "Accepted":
                return "request-status accepted";
            case "Rejected":
                return "request-status rejected";
            default:
                return "request-status pending";
        }
    };

    return (
        <div className="my-requests-page" style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "32px 20px",
            minHeight: "60vh"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "24px"
            }}>
                <div>
                    <h1 style={{ marginBottom: "8px" }}>My Donation Requests</h1>
                    <p style={{ margin: 0 }}>
                        Track the status of donation requests you have submitted.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        type="button"
                        onClick={fetchRequests}
                        disabled={loading}
                        style={{
                            padding: "10px 14px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            background: "#fff",
                            cursor: loading ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        style={{
                            padding: "10px 14px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#2f7d3c",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <ArrowLeft size={16} />
                        Dashboard
                    </button>
                </div>
            </div>

            {loading && <p>Loading your requests...</p>}

            {!loading && error && (
                <div style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: "#fff1f0",
                    color: "#b42318",
                    marginBottom: "20px"
                }}>
                    <p>{error}</p>
                    <button type="button" onClick={fetchRequests}>
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && requests.length === 0 && (
                <div style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    border: "1px solid #eee",
                    borderRadius: "12px"
                }}>
                    <Package size={42} />
                    <h3>No donation requests yet</h3>
                    <p>
                        Browse available donations and request an item to see it here.
                    </p>
                </div>
            )}

            {!loading && !error && requests.length > 0 && (
                <>
                    <p>
                        Total requests: <strong>{requests.length}</strong>
                    </p>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "20px"
                    }}>
                        {requests.map((request) => (
                            <article
                                key={`${request._id}-${request.requestId}`}
                                style={{
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    background: "#fff",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                                }}
                            >
                                {request.image ? (
                                    <img
                                        src={request.image}
                                        alt={request.title}
                                        style={{
                                            width: "100%",
                                            height: "190px",
                                            objectFit: "cover"
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        height: "130px",
                                        background: "#f3f7f3",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Package size={42} color="#2f7d3c" />
                                    </div>
                                )}

                                <div style={{ padding: "18px" }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        gap: "10px"
                                    }}>
                                        <h3 style={{ margin: "0 0 12px" }}>
                                            {request.title}
                                        </h3>

                                        <span className={getStatusClass(request.requestStatus)}
                                            style={{
                                                display: "inline-block",
                                                padding: "5px 9px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                whiteSpace: "nowrap",
                                                background:
                                                    request.requestStatus === "Accepted"
                                                        ? "#dcfce7"
                                                        : request.requestStatus === "Rejected"
                                                            ? "#fee2e2"
                                                            : "#fef3c7",
                                                color:
                                                    request.requestStatus === "Accepted"
                                                        ? "#166534"
                                                        : request.requestStatus === "Rejected"
                                                            ? "#991b1b"
                                                            : "#92400e"
                                            }}
                                        >
                                            {request.requestStatus || "Pending"}
                                        </span>
                                    </div>

                                    <p>{request.description}</p>

                                    <p>
                                        <strong>Category:</strong>{" "}
                                        {request.category}
                                    </p>

                                    <p>
                                        <strong>Quantity:</strong>{" "}
                                        {request.quantity}
                                    </p>

                                    <p style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}>
                                        <MapPin size={16} />
                                        {request.location}
                                    </p>

                                    <p>
                                        <strong>Donor:</strong>{" "}
                                        {request.donor?.name || "Not available"}
                                    </p>

                                    <p>
                                        <strong>Donation status:</strong>{" "}
                                        {request.donationStatus || "Available"}
                                    </p>

                                    <p>
                                        <strong>Admin approval:</strong>{" "}
                                        {request.approvalStatus || "Unknown"}
                                    </p>

                                    {request.requestedAt && (
                                        <p style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            fontSize: "13px",
                                            color: "#666"
                                        }}>
                                            <Clock size={15} />
                                            Requested:{" "}
                                            {new Date(request.requestedAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default MyRequests;
