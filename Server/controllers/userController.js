
import bcrypt from "bcryptjs";
import User from "../model/User.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch users"
    });
  }
};

// Create a user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters"
      });
    }

    if (!["admin", "agent"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    // Admins can only create Agents.
    if (req.user.role === "admin" && role !== "agent") {
      return res.status(403).json({
        success: false,
        message: "Admins can only create Agent accounts"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error("Create user error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create user"
    });
  }
};

// Activate or deactivate a user
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false"
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Super Admin accounts cannot be changed here"
      });
    }

    if (
      req.user.role === "admin" &&
      user.role !== "agent"
    ) {
      return res.status(403).json({
        success: false,
        message: "Admins can only manage Agent accounts"
      });
    }

    if (user._id.equals(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account"
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User status updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update user status"
    });
  }
};
