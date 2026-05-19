const express = require("express");
const router = express.Router();
const {
  verifyToken,
  checkUser,
  isBusinessOwner,
} = require("../middleware/auth.middleware");
const {
  registerBusiness,
  updateBusiness,
  updateBusinessTiming,
  updateBusinessImages,
  getMyBusinesses,
  deleteBusiness,
  getApprovedBusinesses,
  getBusinessDetails,
  trackBusinessAction,
  suspendBusiness,
} = require("../api/business/businessController");
const { isAdmin } = require("../middleware/auth.middleware");

// Business Owner Routes
router.post(
  "/register",
  verifyToken,
  checkUser,
  isBusinessOwner,
  registerBusiness,
);  
router.post(
  "/owner/me",
  verifyToken,
  checkUser,
  isBusinessOwner,
  getMyBusinesses,
);
router.post(
  "/:businessId/update",
  verifyToken,
  checkUser,
  isBusinessOwner,
  updateBusiness,
);
router.post(
  "/:businessId/timing",
  verifyToken,
  checkUser,
  isBusinessOwner,
  updateBusinessTiming,
);
router.post(
  "/:businessId/images",
  verifyToken,
  checkUser,
  isBusinessOwner,
  updateBusinessImages,
);
router.post(
  "/:businessId/delete",
  verifyToken,
  checkUser,
  isBusinessOwner,
  deleteBusiness,
);

// User routes
router.post("/list", getApprovedBusinesses);
router.post("/details/:idOrSlug", getBusinessDetails);
router.post("/:businessId/track/:action", trackBusinessAction);

// Admin routes
router.post(
  "/:businessId/suspend",
  verifyToken,
  checkUser,
  isAdmin,
  suspendBusiness,
);

module.exports = router;
