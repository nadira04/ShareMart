const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const userModel = require("./models/user");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await userModel.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@12345", 10);

    const admin = await userModel.create({
      name: "ShareMart Admin",
      email: "admin@sharemart.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
    console.log("Email:", admin.email);

    process.exit();
  } catch (error) {
    console.log("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();