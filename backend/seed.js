
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Permission = require("./models/permission");
const Role = require("./models/role");

dotenv.config();

const permissions = [
  { name: "dashboard.view", description: "View dashboard" },
  { name: "user.view", description: "View users" },
  { name: "user.create", description: "Create users" },
  { name: "user.update", description: "Update users" },
  { name: "user.delete", description: "Delete users" },
  { name: "user.manage", description: "Manage users and assign roles" },
  { name: "role.view", description: "View roles" },
  { name: "role.create", description: "Create roles" },
  { name: "role.update", description: "Update roles" },
  { name: "role.delete", description: "Delete roles" },
  { name: "permission.view", description: "View permissions" },
  { name: "permission.create", description: "Create permissions" },
  { name: "permission.update", description: "Update permissions" },
  { name: "permission.delete", description: "Delete permissions" },
  { name: "permission.manage", description: "Manage permissions" },
  { name: "product.view", description: "View products" },
  { name: "product.create", description: "Create products" },
  { name: "product.update", description: "Update products" },
  { name: "product.delete", description: "Delete products" },
  { name: "product.approve", description: "Approve products" },
  { name: "product.reject", description: "Reject products" },
  { name: "product.manage", description: "Manage products" },
  { name: "donation.view", description: "View donations" },
  { name: "donation.create", description: "Create donations" },
  { name: "donation.update", description: "Update donations" },
  { name: "donation.delete", description: "Delete donations" },
  { name: "donation.request", description: "Request available donations" },
  { name: "donation.accept", description: "Accept NGO donation requests" },
  { name: "donation.approve", description: "Approve donations" },
  { name: "donation.reject", description: "Reject donations" },
  { name: "discount.view", description: "View discount products" },
  { name: "discount.create", description: "Create discount products" },
  { name: "discount.update", description: "Update discount products" },
  { name: "discount.delete", description: "Delete discount products" },
  { name: "discount.approve", description: "Approve discount products" },
  { name: "order.view", description: "View orders" },
  { name: "order.create", description: "Create orders" },
  { name: "order.update", description: "Update orders" },
  { name: "order.cancel", description: "Cancel orders" },
  { name: "order.manage", description: "Manage orders" },
  { name: "profile.view", description: "View own profile" },
  { name: "profile.update", description: "Update own profile" },
  { name: "profile.delete", description: "Delete own account" },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const permissionMap = {};

    for (const permissionData of permissions) {
      const permission = await Permission.findOneAndUpdate(
        { name: permissionData.name },
        { $set: permissionData },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

      permissionMap[permission.name] = permission._id;
    }

    const getPermissions = (names) => {
      return names.map((name) => {
        if (!permissionMap[name]) {
          throw new Error(`Permission not found: ${name}`);
        }

        return permissionMap[name];
      });
    };

    await Role.findOneAndUpdate(
      { name: "admin" },
      {
        $set: {
          name: "admin",
          description: "Full system access",
          permissions: Object.values(permissionMap),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    await Role.findOneAndUpdate(
      { name: "seller" },
      {
        $set: {
          name: "seller",
          description: "Seller access",
          permissions: getPermissions([
            "dashboard.view",
            "profile.view",
            "profile.update",
            "product.view",
            "product.create",
            "product.update",
            "product.delete",
            "discount.view",
            "discount.create",
            "discount.update",
            "discount.delete",
            "order.view",
            "order.update",
          ]),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    await Role.findOneAndUpdate(
      { name: "donor" },
      {
        $set: {
          name: "donor",
          description: "Donor access",
          permissions: getPermissions([
            "dashboard.view",
            "profile.view",
            "profile.update",
            "donation.view",
            "donation.create",
            "donation.update",
            "donation.delete",
            "donation.accept",
          ]),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    await Role.findOneAndUpdate(
      { name: "user" },
      {
        $set: {
          name: "user",
          description: "Normal user access",
          permissions: getPermissions([
            "dashboard.view",
            "profile.view",
            "profile.update",
            "product.view",
            "discount.view",
            "donation.view",
            "order.view",
            "order.create",
            "order.cancel",
          ]),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    await Role.findOneAndUpdate(
      { name: "ngo" },
      {
        $set: {
          name: "ngo",
          description: "NGO donation access",
          permissions: getPermissions([
            "dashboard.view",
            "profile.view",
            "profile.update",
            "donation.view",
            "donation.request",
          ]),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    console.log("All permissions created or updated");
    console.log("All five roles created or updated");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log("Seed error:", error.message);

    await mongoose.disconnect().catch(() => { });
    process.exit(1);
  }
};

seed();
