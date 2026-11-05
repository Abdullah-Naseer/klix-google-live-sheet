
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { hasPermission } from "../config/permissions.js";
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Fetch the latest user details from MongoDB.
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is deactivated"
      });
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token"
    });
  }
};

// Restrict access according to user role.
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource"
      });
    }

    next();
  };
};

export const authorizeModule = (module) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!hasPermission(req.user.role, module)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this module"
      });
    }

    next();
  };
};
