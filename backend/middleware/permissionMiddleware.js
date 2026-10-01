const userModel = require("../models/user");

const permissionMiddleware = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = await userModel
        .findById(req.user.userId)
        .populate({
          path: "roles",
          populate: {
            path: "permissions",
          },
        });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const userPermissions = [];

      user.roles.forEach((role) => {
        role.permissions.forEach((permission) => {
          if (!userPermissions.includes(permission.name)) {
            userPermissions.push(permission.name);
          }
        });
      });

      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: "You do not have permission",
        });
      }

      req.userData = user;

      next();
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
};

module.exports = permissionMiddleware;