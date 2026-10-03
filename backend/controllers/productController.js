const productModel = require("../models/product");
const cloudinary = require("../config/cloudinary");

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
            !price ||
            !category ||
            !condition ||
            !location
        ) {
            return res.status(400).json({
                message: "All required fields are required",
            });
        }

        let imageUrl = "";

        if (req.file) {
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

                stream.end(req.file.buffer);
            });

            imageUrl = result.secure_url;
        }

        const product = await productModel.create({
            name,
            description,
            price,
            category,
            condition,
            location,
            image: imageUrl,
            seller: req.user.userId,
        });

        res.status(201).json({
            message: "Product added successfully",
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

const getProducts = async (req, res) => {
    try {
        const products = await productModel
            .find()
            .populate("seller", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            products,
        });
    } catch (error) {
        console.log("PRODUCT ERROR:", error);

        res.status(500).json({
            message: "Failed to add product",
            error: error.message,
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
};