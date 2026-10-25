const Donation = require("../models/donation");

const createDonation = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            quantity,
            location,
            image,
            expiryDate
        } = req.body;

        if (!title || !description || !category || !quantity || !location) {
            return res.status(400).json({
                message: "Please provide all required fields."
            });
        }

        if (
            category === "Food" &&
            (!expiryDate || new Date(expiryDate) <= new Date())
        ) {
            return res.status(400).json({
                message: "Food donation must have a future expiry date."
            });
        }

        const donation = await Donation.create({
            title,
            description,
            category,
            quantity,
            location,
            image: image || "",
            expiryDate: category === "Food" ? expiryDate : undefined,
            donor: req.user.userId,
            approvalStatus: "Pending",
            status: "Available"
        });

        res.status(201).json({
            message: "Donation created successfully.",
            donation
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getDonations = async (req, res) => {
    try {
        const donations = await Donation.find({
            approvalStatus: "Approved"
        })
            .populate("donor", "name email")
            .populate("acceptedNgo", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(donations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({
            donor: req.user.userId
        })
            .populate("acceptedNgo", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(donations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getMyAcceptedDonations = async (req, res) => {
    try {
        const donations = await Donation.find({
            acceptedNgo: req.user.userId,
            status: "Donated"
        })
            .populate("donor", "name email")
            .sort({ updatedAt: -1 });

        res.status(200).json(donations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const requestDonation = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);


        if (!donation) {
            return res.status(404).json({
                message: "Donation not found."
            });
        }

        if (donation.approvalStatus !== "Approved") {
            return res.status(400).json({
                message: "This donation is not approved yet."
            });
        }


        if (donation.status !== "Available") {
            return res.status(400).json({
                message: "This donation is no longer available."
            });
        }

        if (donation.donor.toString() === req.user.userId.toString()) {
            return res.status(403).json({
                message: "You cannot request your own donation."
            });
        }

        if (
            donation.requests.some(
                (request) =>
                    request.ngo.toString() === req.user.userId.toString()
            )
        ) {
            return res.status(400).json({
                message: "You have already requested this donation."
            });
        }

        donation.requests.push({
            ngo: req.user.userId
        });

        await donation.save();

        res.status(200).json({
            message: "Donation request submitted successfully.",
            donation
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateDonationRequest = async (req, res) => {
    try {
        const { action } = req.body;

        if (!["Accepted", "Rejected"].includes(action)) {
            return res.status(400).json({
                message: "Action must be Accepted or Rejected."
            });
        }

        const donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({
                message: "Donation not found."
            });
        }

        if (donation.donor.toString() !== req.user.userId.toString()) {
            return res.status(403).json({
                message: "Only the donor can manage donation requests."
            });
        }

        if (donation.status !== "Available") {
            return res.status(400).json({
                message: "This donation is no longer available."
            });
        }

        const request = donation.requests.id(req.params.requestId);

        if (!request) {
            return res.status(404).json({
                message: "Donation request not found."
            });
        }

        if (request.status !== "Pending") {
            return res.status(400).json({
                message: "This request has already been processed."
            });
        }

        request.status = action;

        if (action === "Accepted") {
            donation.acceptedNgo = request.ngo;
            donation.status = "Donated";

            donation.requests.forEach((item) => {
                if (
                    item._id.toString() !== request._id.toString() &&
                    item.status === "Pending"
                ) {
                    item.status = "Rejected";
                }
            });
        }

        await donation.save();

        res.status(200).json({
            message: `Donation request ${action.toLowerCase()} successfully.`,
            donation
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Get donations waiting for admin approval
const getPendingDonations = async (req, res) => {
    try {
        const donations = await Donation.find({
            approvalStatus: "Pending"
        })
            .populate("donor", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(donations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Approve or reject a donation
const reviewDonation = async (req, res) => {
    try {
        const { action } = req.body;

        if (!["Approved", "Rejected"].includes(action)) {
            return res.status(400).json({
                message: "Action must be Approved or Rejected."
            });
        }

        const donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({
                message: "Donation not found."
            });
        }

        if (donation.approvalStatus !== "Pending") {
            return res.status(400).json({
                message: "This donation has already been reviewed."
            });
        }

        donation.approvalStatus = action;

        if (action === "Approved") {
            donation.approvedBy = req.user.userId;
            donation.approvedAt = new Date();
        }

        await donation.save();

        res.status(200).json({
            message: `Donation ${action.toLowerCase()} successfully.`,
            donation
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports = {
    createDonation,
    getDonations,
    getMyDonations,
    getMyAcceptedDonations,
    requestDonation,
    updateDonationRequest,
    getPendingDonations,
    reviewDonation
};
