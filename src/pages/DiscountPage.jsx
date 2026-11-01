
import { useEffect, useState } from "react";

function DiscountPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const fetchDiscountProducts = async () => {
            try {
                const response = await fetch(
                    "https://sharemart.onrender.com/api/products/discount"
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Failed to load discount products");
                    return;
                }

                setProducts(data.products || []);
            } catch (error) {
                setError("Server connection failed.");
            } finally {
                setLoading(false);
            }
        };

        fetchDiscountProducts();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getCountdown = (expiryDate) => {
        const difference = new Date(expiryDate).getTime() - now;

        if (difference <= 0) {
            return "EXPIRED";
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );
        const minutes = Math.floor(
            (difference / (1000 * 60)) % 60
        );
        const seconds = Math.floor(
            (difference / 1000) % 60
        );

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const activeProducts = products.filter(
        (product) =>
            new Date(product.expiryDate).getTime() > now
    );

    if (loading) {
        return <div>Loading discount products...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="marketplace-page">
            <div className="marketplace-container">
                <div className="marketplace-header">
                    <h1>Discount Products</h1>

                    <p>
                        Grab amazing products at special discounted prices
                        before the offer expires.
                    </p>
                </div>

                {activeProducts.length === 0 ? (
                    <div className="empty-marketplace">
                        <h3>No Discount Products Available</h3>

                        <p>
                            Active discount products will appear here.
                            Please check again later.
                        </p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {activeProducts.map((product) => (
                            <div
                                className="product-card discount-product-card"
                                key={product._id}
                            >
                                <div className="discount-badge">
                                    {product.discountPercentage}% OFF
                                </div>

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

                                    <div className="discount-prices">
                                        <span className="original-price">
                                            ৳{product.price}
                                        </span>

                                        <strong className="discount-price">
                                            ৳{product.discountPrice}
                                        </strong>
                                    </div>

                                    <div className="discount-countdown">
                                        <span>Offer ends in</span>

                                        <strong>
                                            {getCountdown(product.expiryDate)}
                                        </strong>
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

export default DiscountPage;
