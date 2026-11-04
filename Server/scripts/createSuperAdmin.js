
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../model/User.js";

const createSuperAdmin = async () => {
  try {
    const { SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } =
      process.env;

    if (!SUPER_ADMIN_NAME || !SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
      throw new Error("Super Admin environment variables are required");
    }

    if (SUPER_ADMIN_PASSWORD.length < 12) {
      throw new Error("Super Admin password must be at least 12 characters");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const email = SUPER_ADMIN_EMAIL.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error(
        "This email already exists. No account was changed."
      );
    }

    const hashedPassword = await bcrypt.hash(
      SUPER_ADMIN_PASSWORD,
      12
    );

    const admin = await User.create({
      name: SUPER_ADMIN_NAME.trim(),
      email,
      password: hashedPassword,
      role: "super_admin",
      isActive: true
    });

    console.log("Super Admin created successfully.");
    console.log("Name:", admin.name);
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);

  } catch (error) {
    console.error("Setup error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createSuperAdmin();
