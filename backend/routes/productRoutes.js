const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createProduct,
    createDiscountProduct,
    getProducts,
    getDiscountProducts,
    getSellerDiscountHistory,
} = require("../controllers/productController");


router.post(
    "/",
    authMiddleware,
    permissionMiddleware("product.create"),
    upload.single("image"),
    createProduct
);

router.post(
    "/discount",
    authMiddleware,
    permissionMiddleware("discount.create"),
    upload.single("image"),
    createDiscountProduct
);

router.get(
    "/discount",
    getDiscountProducts
);
router.get(
    "/my-discounts",
    authMiddleware,
    getSellerDiscountHistory
);

router.get(
    "/",
    getProducts
);

module.exports = router;
