const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

const userModel = require("../models/user");
const Role = require("../models/role");
const Permission = require("../models/permission");

router.get(
  "/dashboard",
  authMiddleware,
  permissionMiddleware("dashboard.view"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome to Dashboard",
      user: req.userData,
    });
  }
);

router.get(
  "/users",
  authMiddleware,
  permissionMiddleware("user.view"),
  async (req, res) => {
    try {
      const users = await userModel
        .find()
        .select("-password")
        .populate("roles")
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
  "/users/:id/roles",
  authMiddleware,
  permissionMiddleware("user.update"),
  async (req, res) => {
    try {
      const { roles } = req.body;

      if (!Array.isArray(roles)) {
        return res.status(400).json({
          message: "Roles must be an array",
        });
      }

      const user = await userModel
        .findByIdAndUpdate(
          req.params.id,
          {
            roles,
          },
          {
            new: true,
          }
        )
        .select("-password")
        .populate("roles");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        message: "User roles updated successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update user roles",
        error: error.message,
      });
    }
  }
);

router.get(
  "/roles",
  authMiddleware,
  permissionMiddleware("role.view"),
  async (req, res) => {
    try {
      const roles = await Role.find()
        .populate("permissions")
        .sort({ createdAt: -1 });

      res.status(200).json({
        roles,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch roles",
        error: error.message,
      });
    }
  }
);

router.post(
  "/roles",
  authMiddleware,
  permissionMiddleware("role.create"),
  async (req, res) => {
    try {
      const { name, description, permissions } = req.body;

      if (!name) {
        return res.status(400).json({
          message: "Role name is required",
        });
      }

      const existingRole = await Role.findOne({ name });

      if (existingRole) {
        return res.status(400).json({
          message: "Role already exists",
        });
      }

      const role = await Role.create({
        name,
        description,
        permissions: permissions || [],
      });

      const populatedRole = await Role.findById(role._id).populate(
        "permissions"
      );

      res.status(201).json({
        message: "Role created successfully",
        role: populatedRole,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create role",
        error: error.message,
      });
    }
  }
);

router.put(
  "/roles/:id",
  authMiddleware,
  permissionMiddleware("role.update"),
  async (req, res) => {
    try {
      const { name, description, permissions } = req.body;

      const role = await Role.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          permissions,
        },
        {
          new: true,
        }
      ).populate("permissions");

      if (!role) {
        return res.status(404).json({
          message: "Role not found",
        });
      }

      res.status(200).json({
        message: "Role updated successfully",
        role,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update role",
        error: error.message,
      });
    }
  }
);

router.delete(
  "/roles/:id",
  authMiddleware,
  permissionMiddleware("role.delete"),
  async (req, res) => {
    try {
      const role = await Role.findById(req.params.id);

      if (!role) {
        return res.status(404).json({
          message: "Role not found",
        });
      }

      if (role.name === "admin") {
        return res.status(400).json({
          message: "Admin role cannot be deleted",
        });
      }

      await userModel.updateMany(
        {
          roles: role._id,
        },
        {
          $pull: {
            roles: role._id,
          },
        }
      );

      await Role.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Role deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete role",
        error: error.message,
      });
    }
  }
);

router.get(
  "/permissions",
  authMiddleware,
  permissionMiddleware("permission.view"),
  async (req, res) => {
    try {
      const permissions = await Permission.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        permissions,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch permissions",
        error: error.message,
      });
    }
  }
);

router.post(
  "/permissions",
  authMiddleware,
  permissionMiddleware("permission.create"),
  async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          message: "Permission name is required",
        });
      }

      const existingPermission = await Permission.findOne({
        name,
      });

      if (existingPermission) {
        return res.status(400).json({
          message: "Permission already exists",
        });
      }

      const permission = await Permission.create({
        name,
        description,
      });

      res.status(201).json({
        message: "Permission created successfully",
        permission,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create permission",
        error: error.message,
      });
    }
  }
);

router.put(
  "/permissions/:id",
  authMiddleware,
  permissionMiddleware("permission.update"),
  async (req, res) => {
    try {
      const { name, description } = req.body;

      const permission = await Permission.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
        },
        {
          new: true,
        }
      );

      if (!permission) {
        return res.status(404).json({
          message: "Permission not found",
        });
      }

      res.status(200).json({
        message: "Permission updated successfully",
        permission,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update permission",
        error: error.message,
      });
    }
  }
);

router.delete(
  "/permissions/:id",
  authMiddleware,
  permissionMiddleware("permission.delete"),
  async (req, res) => {
    try {
      const permission = await Permission.findById(
        req.params.id
      );

      if (!permission) {
        return res.status(404).json({
          message: "Permission not found",
        });
      }

      await Role.updateMany(
        {
          permissions: permission._id,
        },
        {
          $pull: {
            permissions: permission._id,
          },
        }
      );

      await Permission.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Permission deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete permission",
        error: error.message,
      });
    }
  }
);

router.delete(
  "/users/:id",
  authMiddleware,
  permissionMiddleware("user.delete"),
  async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(
        req.params.id
      );

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