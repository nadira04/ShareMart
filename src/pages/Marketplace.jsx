
import { useEffect, useState } from "react";
import ProductDetails from "./ProductDetails";

function Marketplace({ selectedCategory = "", searchQuery = "" }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    "https://sharemart.onrender.com/api/products",
                    {
                        method: "GET",
                        cache: "no-store",
                        headers: {
                            Accept: "application/json",
                            "Cache-Control": "no-cache"
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load products"
                    );
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

    // Search and category filtering
    const filteredProducts = products.filter((product) => {
        const category = (product.category || "").toLowerCase().trim();
        const selected = selectedCategory.toLowerCase().trim();

        const query = searchQuery.toLowerCase().trim();

        const matchesCategory =
            !selected ||
            category === selected ||
            category.includes(selected) ||
            selected.includes(category);

        const matchesSearch =
            !query ||
            (product.name || "").toLowerCase().includes(query) ||
            (product.description || "").toLowerCase().includes(query) ||
            (product.category || "").toLowerCase().includes(query) ||
            (product.location || "").toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="marketplace-page">
                <div className="marketplace-container">
                    <h2>Loading products...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="marketplace-page">
                <div className="marketplace-container">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
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

                    {selectedCategory && (
                        <p>
                            Category: <strong>{selectedCategory}</strong>
                        </p>
                    )}

                    {searchQuery && (
                        <p>
                            Search results for: <strong>{searchQuery}</strong>
                        </p>
                    )}
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="empty-marketplace">
                        <h3>No products found</h3>

                        <p>
                            Try searching with another keyword or category.
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="marketplace-result-count">
                            Showing {filteredProducts.length} products
                        </p>

                        <div className="product-grid">

                            {filteredProducts.map((product) => (
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
                    </>
                )}

            </div>
        </div>
    );
}

export default Marketplace;
