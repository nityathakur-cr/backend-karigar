const express = require("express");
const router = express.Router();
const {
  verifyToken,
  checkUser,
  isVerifier,
} = require("../middleware/auth.middleware");
const {
  getVerificationBusinesses,
  approveBusiness,
  rejectBusiness,
  getVerificationHistory,
} = require("../api/verification/verificationController");

router.post(
  "/list",
  verifyToken,
  checkUser,
  isVerifier,
  getVerificationBusinesses,
);
router.post(
  "/approve",
  verifyToken,
  checkUser,
  isVerifier,
  approveBusiness,
);
router.post(
  "/reject",
  verifyToken,
  checkUser,
  isVerifier,
  rejectBusiness,
);
router.post(
  "/history",
  verifyToken,
  checkUser,
  isVerifier,
  getVerificationHistory,
);

module.exports = router;
