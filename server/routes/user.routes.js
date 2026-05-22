const express = require("express");
const {
  getAllUsers,
  getUserByID,
  updateUser,
  deleteUser,
} = require("../api/user/userController");
const { verifyToken, checkUser, isAdmin } = require("../middleware/auth.middleware");
const userRouter = express.Router();

userRouter.post("/createuser", (_req, res) =>
  res.status(410).json({
    message:
      "Deprecated. Use POST /api/auth/login with a Firebase ID token instead.",
  }),
);

userRouter.post("/getallusers", verifyToken, checkUser, isAdmin, getAllUsers);
userRouter.post("/getuserbyid", verifyToken, checkUser, getUserByID);
userRouter.post("/updateuserbyid", verifyToken, checkUser, updateUser);
userRouter.post("/deleteuserbyid", verifyToken, checkUser, isAdmin, deleteUser);

module.exports = userRouter;
