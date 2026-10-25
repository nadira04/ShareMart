const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ["Food", "Clothes", "Furniture", "Books", "Other"],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            default: "",
        },
        expiryDate: {
            type: Date,
            required: function () {
                return this.category === "Food";
            },
        },
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        requests: [
            {
                ngo: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["Pending", "Accepted", "Rejected"],
                    default: "Pending",
                },
                requestedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        acceptedNgo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        approvalStatus: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        approvedAt: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ["Available", "Donated", "Expired"],
            default: "Available",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Donation", donationSchema);
