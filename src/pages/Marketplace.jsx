
import { useEffect, useState } from "react";
import ProductDetails from "./ProductDetails";

function Marketplace() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    "https://sharemart.onrender.com/api/products",
                    {
                        method: "GET",
                        cache: "no-store",
                        headers: {
                            "Accept": "application/json",
                            "Cache-Control": "no-cache"
                        }
                    }
                );

                console.log("API Status:", response.status);

                if (response.status === 304) {
                    throw new Error("Server returned 304. Please check backend caching.");
                }

                const data = await response.json();

                console.log("Products Data:", data);
                console.log("Seller Data:", data.products?.map(p => p.seller));

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load products");
                }

                setProducts(data.products || []);
                setError("");

            } catch (error) {
                console.error("Marketplace Error:", error);
                setError(error.message || "Server connection failed.");
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

    if (selectedProduct) {
        return (
            <ProductDetails
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
            />
        );
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
                            Approved products will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="product-grid">

                        {products.map((product) => (
                            <div
                                className="product-card"
                                key={product._id}
                                onClick={() => setSelectedProduct(product)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        setSelectedProduct(product);
                                    }
                                }}
                            >
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

                                    <button
                                        className="view-details-btn"
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedProduct(product);
                                        }}
                                    >
                                        View Details →
                                    </button>

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
