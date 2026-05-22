const express = require("express");
const router = express.Router();
const {
  verifyToken,
  checkUser,
  optionalCheckUser,
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
  getHomeSections,
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
  "/update",
  verifyToken,
  checkUser,
  isBusinessOwner,
  updateBusiness,
);
router.post(
  "/timing",
  verifyToken,
  checkUser,
  isBusinessOwner,
  updateBusinessTiming,
);
router.post(
  "/images",
  verifyToken,
  checkUser,
  isBusinessOwner,
  updateBusinessImages,
);
router.post(
  "/delete",
  verifyToken,
  checkUser,
  isBusinessOwner,
  deleteBusiness,
);

// User routes
router.post("/home", getHomeSections);
router.post("/list", getApprovedBusinesses);
router.post("/details", optionalCheckUser, getBusinessDetails);
router.post("/track", trackBusinessAction);

// Admin routes
router.post(
  "/suspend",
  verifyToken,
  checkUser,
  isAdmin,
  suspendBusiness,
);

module.exports = router;
