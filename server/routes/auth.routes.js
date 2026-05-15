const express = require("express");
const router = express.Router();
const {
  verifyToken,
  checkUser,
  isAdmin,
} = require("../middleware/auth.middleware");
const {
  loginUser,
  getMe,
  updateProfile,
  blockUser,
  getAllUsers,
  changeUserRole,
} = require("../api/auth/auth.controller");

router.post("/login", verifyToken, loginUser);
router.post("/me", verifyToken, getMe);
router.post("/profile", verifyToken, updateProfile);

// admin only routes
router.post("/users", verifyToken, checkUser, isAdmin, getAllUsers);
router.post("/users/:userId/block", verifyToken, checkUser, isAdmin, blockUser);
router.post(
  "/users/:userId/role",
  verifyToken,
  checkUser,
  isAdmin,
  changeUserRole,
);

module.exports = router;
