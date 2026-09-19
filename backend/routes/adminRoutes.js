const express = require("express");

const router = express.Router();

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// Test Admin Route
router.get(
  "/test",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.status(200).json({
      message: "Admin access successful",
      admin: req.user,
    });
  }
);

module.exports = router;