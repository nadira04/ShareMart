
import { useState } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import "./AdminDashboard.css";

const API = "https://sharemart.onrender.com/api";

function AddDonation({ onBack, onSuccess }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "Food",
        quantity: "",
        location: "",
        expiryDate: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please login again.");
            }

            const payload = {
                title: form.title.trim(),
                description: form.description.trim(),
                category: form.category,
                quantity: Number(form.quantity),
                location: form.location.trim(),
            };

            if (form.category === "Food") {
                if (!form.expiryDate) {
                    throw new Error("Please select food expiry date.");
                }
                payload.expiryDate = form.expiryDate;
            }

            const response = await fetch(`${API}/donations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit donation.");
            }

            setMessage(
                data.message || "Donation submitted for admin approval!"
            );

            setForm({
                title: "",
                description: "",
                category: "Food",
                quantity: "",
                location: "",
                expiryDate: "",
            });

            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || "Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <main
                className="dashboard-main"
                style={{ maxWidth: "850px", margin: "0 auto", width: "100%" }}
            >
                <div className="dashboard-topbar">
                    {onBack && (
                        <button type="button" onClick={onBack}>
                            <ArrowLeft size={18} /> Back
                        </button>
                    )}
                    <div>
                        <h1>Add a Donation</h1>
                        <p>Share useful items with people who need them.</p>
                    </div>
                </div>

                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>
                            <Heart size={22} /> Donation Details
                        </h2>
                    </div>

                    {message && (
                        <div className="dashboard-api-message">{message}</div>
                    )}

                    {error && (
                        <div className="dashboard-api-error">{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "16px" }}>
                            <label htmlFor="title">Donation title</label>
                            <input
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Fresh vegetables"
                                required
                                maxLength={120}
                                style={{ width: "100%", padding: "12px", marginTop: "6px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the items you want to donate"
                                required
                                rows={4}
                                style={{ width: "100%", padding: "12px", marginTop: "6px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                style={{ width: "100%", padding: "12px", marginTop: "6px" }}
                            >
                                <option value="Food">Food</option>
                                <option value="Clothes">Clothes</option>
                                <option value="Books">Books</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label htmlFor="quantity">Quantity</label>
                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="1"
                                value={form.quantity}
                                onChange={handleChange}
                                placeholder="Enter quantity"
                                required
                                style={{ width: "100%", padding: "12px", marginTop: "6px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label htmlFor="location">Pickup location</label>
                            <input
                                id="location"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="Enter location"
                                required
                                style={{ width: "100%", padding: "12px", marginTop: "6px" }}
                            />
                        </div>

                        {form.category === "Food" && (
                            <div style={{ marginBottom: "16px" }}>
                                <label htmlFor="expiryDate">Food expiry date</label>
                                <input
                                    id="expiryDate"
                                    name="expiryDate"
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    value={form.expiryDate}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "100%", padding: "12px", marginTop: "6px" }}
                                />
                            </div>
                        )}

                        <button type="submit" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Donation"}
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default AddDonation;
