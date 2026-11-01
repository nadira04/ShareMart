
import { useState } from "react";

function AddDiscountProduct({ onBack }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        condition: "",
        location: "",
        discountPercentage: "",
        expiryDate: "",
    });

    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const originalPrice = Number(formData.price);
    const discount = Number(formData.discountPercentage);

    const discountPrice =
        originalPrice > 0 && discount >= 1 && discount <= 99
            ? (originalPrice * (100 - discount)) / 100
            : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (new Date(formData.expiryDate) <= new Date()) {
            setError("Please select a future expiry date and time.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first.");
            return;
        }

        const data = new FormData();

        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("category", formData.category);
        data.append("condition", formData.condition);
        data.append("location", formData.location);
        data.append("discountPercentage", formData.discountPercentage);

        data.append(
            "expiryDate",
            new Date(formData.expiryDate).toISOString()
        );

        if (image) {
            data.append("image", image);
        }

        try {
            setLoading(true);

            const response = await fetch(
                "https://sharemart.onrender.com/api/products/discount",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: data,
                }
            );

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Failed to add discount product");
                return;
            }

            setMessage(
                "Discount product submitted successfully! Pending for admin approval."
            );

            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                condition: "",
                location: "",
                discountPercentage: "",
                expiryDate: "",
            });

            setImage(null);

            const fileInput = document.getElementById("discount-product-image");

            if (fileInput) {
                fileInput.value = "";
            }
        } catch (error) {
            setError("Server connection failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-page">
            <div className="add-product-container">
                <h1>Discount Product Form</h1>

                <p>
                    Sell products at a special discount before their expiry date.
                </p>

                {onBack && (
                    <button type="button" onClick={onBack}>
                        Back to Dashboard
                    </button>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Example: Fresh Food Package"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            placeholder="Describe your product..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Original Price (BDT)</label>

                        <input
                            type="number"
                            name="price"
                            placeholder="Example: 1000"
                            min="0.01"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Discount Percentage (%)</label>

                        <input
                            type="number"
                            name="discountPercentage"
                            placeholder="Example: 50"
                            min="1"
                            max="99"
                            step="1"
                            value={formData.discountPercentage}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Discount Price (BDT)</label>

                        <input
                            type="text"
                            value={discountPrice > 0 ? discountPrice.toFixed(2) : ""}
                            placeholder="Automatically calculated"
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Food">Food</option>
                            <option value="Grocery">Grocery</option>
                            <option value="Bakery">Bakery</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Books">Books</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Condition</label>

                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Condition</option>
                            <option value="Like New">Like New</option>
                            <option value="Good">Good</option>
                            <option value="Used">Used</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Location</label>

                        <input
                            type="text"
                            name="location"
                            placeholder="Example: Sylhet, Bangladesh"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Expiry Date and Time</label>

                        <input
                            type="datetime-local"
                            name="expiryDate"
                            min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                                .toISOString()
                                .slice(0, 16)}
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Product Image</label>

                        <input
                            id="discount-product-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {image && (
                            <small>Selected: {image.name}</small>
                        )}
                    </div>

                    {discountPrice > 0 && (
                        <div className="discount-preview">
                            <h3>Discount Preview</h3>

                            <p>
                                Original Price: ৳{originalPrice.toFixed(2)}
                            </p>

                            <p>
                                Discount: {discount}%
                            </p>

                            <h2>
                                Discount Price: ৳{discountPrice.toFixed(2)}
                            </h2>
                        </div>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Add Discount Product"}
                    </button>
                </form>

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddDiscountProduct;
