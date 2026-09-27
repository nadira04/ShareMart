const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const userModel = require("../models/user");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome to Admin Dashboard",
      user: req.user,
    });
  }
);

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const users = await userModel
        .find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.status(200).json({
        users,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch users",
        error: error.message,
      });
    }
  }
);

router.put(
  "/users/:id/role",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!["user", "seller", "donor"].includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      const user = await userModel.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        message: "User role updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update user role",
        error: error.message,
      });
    }
  }
);

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete user",
        error: error.message,
      });
    }
  }
);

module.exports = router;