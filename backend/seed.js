
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
  {
    name: "donation.approve",
    description: "Approve or reject donations",
  },
  {
    name: "donation.request",
    description: "Request available donations",
  },
  {
    name: "donation.accept",
    description: "Accept NGO donation requests",
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

    // Admin role
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

    // Seller role
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

    // Donor role
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
          permissionMap["donation.accept"],
        ],
      },
      {
        new: true,
        upsert: true,
      }
    );

    // Normal user role
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

    // NGO role
    await Role.findOneAndUpdate(
      { name: "ngo" },
      {
        name: "ngo",
        description: "NGO donation access",
        permissions: [
          permissionMap["dashboard.view"],
          permissionMap["donation.view"],
          permissionMap["donation.request"],
        ],
      },
      {
        new: true,
        upsert: true,
      }
    );

    console.log("Permissions created or updated");
    console.log("Admin, seller, donor, user and ngo roles created or updated");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log("Seed error:", error.message);

    await mongoose.disconnect().catch(() => { });
    process.exit(1);
  }
};

seed();
