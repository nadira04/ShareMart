
import React from "react";
import "./ProductDetails.css";

function ProductDetails({ product, onBack }) {
    if (!product) {
        return <div>Product not found.</div>;
    }

    const sellerPhone =
        product.seller?.phone ||
        product.seller?.phoneNumber ||
        product.seller?.mobile ||
        "";

    const sellerEmail = product.seller?.email || "";
    const sellerName = product.seller?.name || "ShareMart Seller";

    // Remove spaces and formatting from phone number
    const cleanPhone = sellerPhone.replace(/[^\d+]/g, "");

    const emailSubject = `Inquiry about ${product.name}`;

    const emailBody = `Hello ${sellerName},

I am interested in your product "${product.name}" listed on ShareMart.

Could you please provide more details about this product?

Thank you.`;

    const emailLink = `mailto:${sellerEmail}?subject=${encodeURIComponent(
        emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;

    return (
        <div className="product-details-page">
            <div className="product-details-container">

                <button
                    className="back-marketplace-btn"
                    onClick={onBack}
                >
                    ← Back to Marketplace
                </button>

                <div className="product-details-card">

                    <div className="details-image-section">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="details-product-image"
                            />
                        ) : (
                            <div className="details-no-image">
                                No Image Available
                            </div>
                        )}
                    </div>

                    <div className="details-info-section">

                        <span className="details-category">
                            {product.category}
                        </span>

                        <h1>{product.name}</h1>

                        <h2 className="details-price">
                            ৳{product.price}
                        </h2>

                        <div className="details-condition">
                            Condition: <strong>{product.condition}</strong>
                        </div>

                        <div className="details-description">
                            <h3>Product Description</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className="details-location">
                            <h3>📍 Pickup Address</h3>
                            <p>
                                {product.location || "Address not provided"}
                            </p>
                        </div>

                        <div className="details-seller">
                            <h3>Seller Information</h3>

                            <p>
                                <strong>Name:</strong> {sellerName}
                            </p>

                            <p>
                                <strong>Phone:</strong>{" "}
                                {sellerPhone || "Not available"}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {sellerEmail || "Not available"}
                            </p>
                        </div>

                        <div className="seller-contact-buttons">

                            {cleanPhone ? (
                                <a
                                    href={`tel:${cleanPhone}`}
                                    className="call-seller-btn"
                                >
                                    ☎ Call Now
                                </a>
                            ) : (
                                <button
                                    className="call-seller-btn"
                                    disabled
                                >
                                    ☎ Phone Not Available
                                </button>
                            )}

                            {sellerEmail ? (
                                <a
                                    href={emailLink}
                                    className="email-seller-btn"
                                >
                                    ✉ Email Seller
                                </a>
                            ) : (
                                <button
                                    className="email-seller-btn"
                                    disabled
                                >
                                    ✉ Email Not Available
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
