
const mongoose = require("mongoose");
const productModel = require("../models/product");
const cloudinary = require("../config/cloudinary");

const uploadProductImage = async (file) => {
    if (!file) return "";

    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "sharemart/products",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(file.buffer);
    });

    return result.secure_url;
};


// CREATE NORMAL PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            condition,
            location,
        } = req.body;

        if (
            !name ||
            !description ||
            price === undefined ||
            price === "" ||
            !category ||
            !condition ||
            !location
        ) {
            return res.status(400).json({
                message: "All required fields are required",
            });
        }

        const imageUrl = await uploadProductImage(req.file);

        const product = await productModel.create({
            name,
            description,
            price,
            category,
            condition,
            location,
            image: imageUrl,
            seller: req.user.userId,
            status: "pending",
        });

        res.status(201).json({
            message: "Product submitted for admin approval",
            product,
        });

    } catch (error) {
        console.log("PRODUCT ERROR:", error);

        res.status(500).json({
            message: "Failed to add product",
            error: error.message,
        });
    }
};


// CREATE DISCOUNT PRODUCT
const createDiscountProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            condition,
            location,
            discountPercentage,
            expiryDate,
        } = req.body;

        if (
            !name ||
            !description ||
            price === undefined ||
            price === "" ||
            !category ||
            !condition ||
            !location ||
            discountPercentage === undefined ||
            discountPercentage === "" ||
            !expiryDate
        ) {
            return res.status(400).json({
                message: "All required fields are required",
            });
        }

        const originalPrice = Number(price);
        const discount = Number(discountPercentage);
        const expiry = new Date(expiryDate);

        if (
            !Number.isFinite(originalPrice) ||
            originalPrice <= 0
        ) {
            return res.status(400).json({
                message: "Please enter a valid original price",
            });
        }

        if (
            !Number.isFinite(discount) ||
            discount < 1 ||
            discount > 99
        ) {
            return res.status(400).json({
                message: "Discount must be between 1 and 99 percent",
            });
        }

        if (
            Number.isNaN(expiry.getTime()) ||
            expiry <= new Date()
        ) {
            return res.status(400).json({
                message: "Expiry date must be in the future",
            });
        }

        const discountPrice = Number(
            (originalPrice * (100 - discount) / 100).toFixed(2)
        );

        const imageUrl = await uploadProductImage(req.file);

        const product = await productModel.create({
            name,
            description,
            price: originalPrice,
            category,
            condition,
            location,
            image: imageUrl,
            seller: req.user.userId,
            isDiscount: true,
            discountPercentage: discount,
            discountPrice,
            expiryDate: expiry,
            status: "pending",
        });

        res.status(201).json({
            message: "Discount product submitted for admin approval",
            product,
        });

    } catch (error) {
        console.log("DISCOUNT PRODUCT ERROR:", error);

        res.status(500).json({
            message: "Failed to add discount product",
            error: error.message,
        });
    }
};


// GET ALL APPROVED PRODUCTS
const getProducts = async (req, res) => {
    try {
        const testId = "6ae771bf8ea8cdc67151385b";

        // Database information
        console.log("DATABASE:", mongoose.connection.name);

        console.log(
            "USER COLLECTION:",
            mongoose.model("User").collection.name
        );

        // Check seller in User collection
        const testUser = await mongoose
            .model("User")
            .findById(testId)
            .select("name email phone");

        console.log("TEST USER:", testUser);

        // Check product seller ID
        const testProduct = await productModel.findById(
            "6aecd4433bc1d2173a7beddc"
        );

        console.log(
            "PRODUCT SELLER ID:",
            testProduct?.seller
        );

        // Test populate
        const populatedProduct = await productModel
            .findById("6aecd4433bc1d2173a7beddc")
            .populate("seller", "name email phone");

        console.log(
            "POPULATED SELLER:",
            populatedProduct?.seller
        );

        // Get all approved products
        const products = await productModel
            .find({
                status: "approved",
                isDiscount: { $ne: true },
            })
            .populate("seller", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({
            products,
        });

    } catch (error) {
        console.log("PRODUCT ERROR:", error);

        res.status(500).json({
            message: "Failed to load products",
            error: error.message,
        });
    }
};


// GET DISCOUNT PRODUCTS
const getDiscountProducts = async (req, res) => {
    try {
        console.log("DATABASE:", productModel.db.name);
        console.log("COLLECTION:", productModel.collection.name);

        const total = await productModel.countDocuments({
            isDiscount: true
        });

        const approved = await productModel.countDocuments({
            isDiscount: true,
            status: "approved"
        });

        const products = await productModel.find({
            isDiscount: true,
            status: "approved"
        });

        console.log("TOTAL DISCOUNT:", total);
        console.log("APPROVED DISCOUNT:", approved);
        console.log("FOUND PRODUCTS:", products.length);

        res.status(200).json({
            database: productModel.db.name,
            collection: productModel.collection.name,
            total,
            approved,
            products
        });

    } catch (error) {
        console.log("DISCOUNT PRODUCT ERROR:", error);

        res.status(500).json({
            message: "Failed to load discount products",
            error: error.message
        });
    }
};


// GET SELLER DISCOUNT HISTORY
const getSellerDiscountHistory = async (req, res) => {
    try {
        const products = await productModel
            .find({
                seller: req.user.userId,
                isDiscount: true,
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            products,
        });

    } catch (error) {
        console.log("DISCOUNT HISTORY ERROR:", error);

        res.status(500).json({
            message: "Failed to load discount history",
        });
    }
};


module.exports = {
    createProduct,
    createDiscountProduct,
    getProducts,
    getDiscountProducts,
    getSellerDiscountHistory,
};
