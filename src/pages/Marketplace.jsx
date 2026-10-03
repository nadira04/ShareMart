import { useEffect, useState } from "react";

function Marketplace() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(
                    "https://sharemart.onrender.com/api/products",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Failed to load products");
                    return;
                }

                setProducts(data.products);
            } catch (error) {
                setError("Server connection failed.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="marketplace-page">
            <div className="marketplace-container">

                <div className="marketplace-header">
                    <h1>Marketplace</h1>

                    <p>
                        Discover quality second-hand products from ShareMart users.
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="empty-marketplace">
                        <h3>No products available</h3>

                        <p>
                            Be the first one to add a product!
                        </p>
                    </div>
                ) : (
                    <div className="product-grid">

                        {products.map((product) => (
                            <div className="product-card" key={product._id}>

                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />
                                ) : (
                                    <div className="no-image">
                                        No Image
                                    </div>
                                )}

                                <div className="product-info">

                                    <span className="product-category">
                                        {product.category}
                                    </span>

                                    <h2>{product.name}</h2>

                                    <p className="product-description">
                                        {product.description}
                                    </p>

                                    <div className="product-bottom">

                                        <strong>
                                            ৳{product.price}
                                        </strong>

                                        <span>
                                            {product.condition}
                                        </span>

                                    </div>

                                    <p className="product-location">
                                        📍 {product.location}
                                    </p>

                                    {product.seller && (
                                        <p className="product-seller">
                                            Seller: {product.seller.name}
                                        </p>
                                    )}

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}

export default Marketplace;