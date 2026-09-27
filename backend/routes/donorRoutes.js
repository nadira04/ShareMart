const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("donor"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome to Donor Dashboard",
      user: req.user,
    });
  }
);

module.exports = router;