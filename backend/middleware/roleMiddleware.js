const userModel = require("../models/user");

const roleMiddleware = (...requiredRoles) => {
  return async (req, res, next) => {
    try {
      const user = await userModel
        .findById(req.user.userId)
        .populate("roles");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const userRoles = user.roles.map((role) => role.name);

      const hasRole = requiredRoles.some((role) =>
        userRoles.includes(role)
      );

      if (!hasRole) {
        return res.status(403).json({
          message: "Access denied",
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

module.exports = roleMiddleware;