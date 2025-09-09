require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@utgssa.edu.gm" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      console.log("Email:", existingAdmin.email);
      console.log("Username:", existingAdmin.username);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123456", 10);

    // Create admin user
    const admin = new User({
      username: "admin",
      email: "admin@utgssa.edu.gm",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    await admin.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@utgssa.edu.gm");
    console.log("Password: admin123456");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
