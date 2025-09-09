require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");

async function checkAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find all users
    const users = await User.find({});
    console.log("All users in database:");
    users.forEach((user) => {
      console.log("- Username:", user.username);
      console.log("  Email:", user.email);
      console.log("  Role:", user.role);
      console.log("  Active:", user.isActive);
      console.log("---");
    });
  } catch (error) {
    console.error("Error checking users:", error);
  } finally {
    mongoose.disconnect();
  }
}

checkAdmin();
