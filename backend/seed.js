const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Permission = require("./models/permission");
const Role = require("./models/role");

dotenv.config();

const permissions = [
  {
    name: "dashboard.view",
    description: "View dashboard",
  },
  {
    name: "user.view",
    description: "View users",
  },
  {
    name: "user.create",
    description: "Create users",
  },
  {
    name: "user.update",
    description: "Update users",
  },
  {
    name: "user.delete",
    description: "Delete users",
  },
  {
    name: "role.view",
    description: "View roles",
  },
  {
    name: "role.create",
    description: "Create roles",
  },
  {
    name: "role.update",
    description: "Update roles",
  },
  {
    name: "role.delete",
    description: "Delete roles",
  },
  {
    name: "permission.view",
    description: "View permissions",
  },
  {
    name: "permission.create",
    description: "Create permissions",
  },
  {
    name: "permission.update",
    description: "Update permissions",
  },
  {
    name: "permission.delete",
    description: "Delete permissions",
  },
  {
    name: "product.view",
    description: "View products",
  },
  {
    name: "product.create",
    description: "Create products",
  },
  {
    name: "product.update",
    description: "Update products",
  },
  {
    name: "product.delete",
    description: "Delete products",
  },
  {
    name: "donation.view",
    description: "View donations",
  },
  {
    name: "donation.create",
    description: "Create donations",
  },
  {
    name: "donation.update",
    description: "Update donations",
  },
  {
    name: "donation.delete",
    description: "Delete donations",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const permissionMap = {};

    for (const permissionData of permissions) {
      const permission = await Permission.findOneAndUpdate(
        { name: permissionData.name },
        permissionData,
        {
          new: true,
          upsert: true,
        }
      );

      permissionMap[permission.name] = permission._id;
    }

    const allPermissions = Object.values(permissionMap);

    await Role.findOneAndUpdate(
      { name: "admin" },
      {
        name: "admin",
        description: "Full system access",
        permissions: allPermissions,
      },
      {
        new: true,
        upsert: true,
      }
    );

    await Role.findOneAndUpdate(
      { name: "seller" },
      {
        name: "seller",
        description: "Seller access",
        permissions: [
          permissionMap["dashboard.view"],
          permissionMap["product.view"],
          permissionMap["product.create"],
          permissionMap["product.update"],
          permissionMap["product.delete"],
        ],
      },
      {
        new: true,
        upsert: true,
      }
    );

    await Role.findOneAndUpdate(
      { name: "donor" },
      {
        name: "donor",
        description: "Donor access",
        permissions: [
          permissionMap["dashboard.view"],
          permissionMap["donation.view"],
          permissionMap["donation.create"],
          permissionMap["donation.update"],
          permissionMap["donation.delete"],
        ],
      },
      {
        new: true,
        upsert: true,
      }
    );

    await Role.findOneAndUpdate(
      { name: "user" },
      {
        name: "user",
        description: "Normal user access",
        permissions: [
          permissionMap["dashboard.view"],
          permissionMap["product.view"],
          permissionMap["donation.view"],
        ],
      },
      {
        new: true,
        upsert: true,
      }
    );

    console.log("Permissions created");
    console.log("Roles created");

    process.exit();
  } catch (error) {
    console.log("Seed error:", error.message);
    process.exit(1);
  }
};

seed();