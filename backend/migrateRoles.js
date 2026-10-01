const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./models/user");
const Role = require("./models/role");

dotenv.config();

const migrateRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const users = await User.collection.find({}).toArray();

    for (const oldUser of users) {
      if (!oldUser.role) {
        continue;
      }

      const role = await Role.findOne({
        name: oldUser.role,
      });

      if (!role) {
        console.log(`Role not found: ${oldUser.role}`);
        continue;
      }

      await User.collection.updateOne(
        {
          _id: oldUser._id,
        },
        {
          $set: {
            roles: [role._id],
          },
          $unset: {
            role: "",
          },
        }
      );

      console.log(
        `${oldUser.email} migrated to ${oldUser.role}`
      );
    }

    console.log("Migration completed");

    process.exit();
  } catch (error) {
    console.log("Migration error:", error.message);
    process.exit(1);
  }
};

migrateRoles();