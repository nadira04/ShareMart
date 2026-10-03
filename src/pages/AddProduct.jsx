import { useState } from "react";

function AddProduct() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        condition: "",
        location: "",
    });

    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const token = localStorage.getItem("token");

        const data = new FormData();

        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("category", formData.category);
        data.append("condition", formData.condition);
        data.append("location", formData.location);

        if (image) {
            data.append("image", image);
        }

        try {
            const response = await fetch(
                "https://sharemart.onrender.com/api/products",
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
                setError(result.message || "Failed to add product");
                return;
            }

            setMessage("Product added successfully!");

            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                condition: "",
                location: "",
            });

            setImage(null);

            document.getElementById("product-image").value = "";
        } catch (error) {
            setError("Server connection failed.");
        }
    };

    return (
        <div className="add-product-page">
            <div className="add-product-container">
                <h1>Add Second-Hand Product</h1>

                <p>
                    Sell your used products on ShareMart Marketplace.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Product Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Example: Dell Latitude 5420"
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
                        <label>Price (BDT)</label>

                        <input
                            type="number"
                            name="price"
                            placeholder="Example: 25000"
                            value={formData.price}
                            onChange={handleChange}
                            required
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
                            <option value="Electronics">Electronics</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Books">Books</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Education">Education</option>
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
                        <label>Product Image</label>

                        <input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {image && (
                            <small>
                                Selected: {image.name}
                            </small>
                        )}
                    </div>

                    <button type="submit">
                        Add Product
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

export default AddProduct;