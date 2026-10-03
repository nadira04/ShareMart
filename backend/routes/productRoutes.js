const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createProduct,
    getProducts,
} = require("../controllers/productController");

router.post(
    "/",
    authMiddleware,
    permissionMiddleware("product.create"),
    upload.single("image"),
    createProduct
);

router.get(
    "/",
    authMiddleware,
    permissionMiddleware("product.view"),
    getProducts
);

module.exports = router;