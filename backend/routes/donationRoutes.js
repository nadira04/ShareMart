
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

const {
    createDonation,
    getDonations,
    getMyDonations,
    getMyAcceptedDonations,
    getMyRequests,
    requestDonation,
    updateDonationRequest,
    getPendingDonations,
    reviewDonation
} = require("../controllers/donationController");

router.get("/", getDonations);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("donor"),
    permissionMiddleware("donation.create"),
    createDonation
);

router.get(
    "/my",
    authMiddleware,
    roleMiddleware("donor"),
    getMyDonations
);

router.get(
    "/my-accepted",
    authMiddleware,
    roleMiddleware("ngo"),
    getMyAcceptedDonations
);

router.get(
    "/my-requests",
    authMiddleware,
    roleMiddleware("ngo"),
    getMyRequests
);

router.post(
    "/:id/request",
    authMiddleware,
    roleMiddleware("ngo"),
    permissionMiddleware("donation.request"),
    requestDonation
);

router.patch(
    "/:id/requests/:requestId",
    authMiddleware,
    roleMiddleware("donor"),
    permissionMiddleware("donation.accept"),
    updateDonationRequest
);

router.get(
    "/admin/pending",
    authMiddleware,
    roleMiddleware("admin"),
    getPendingDonations
);

router.patch(
    "/admin/:id/review",
    authMiddleware,
    roleMiddleware("admin"),
    permissionMiddleware("donation.approve"),
    reviewDonation
);

module.exports = router;
