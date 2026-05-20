const express = require('express')
const { createUser, getAllUsers, getUserByID, updateUser, deleteUser } = require('../api/user/userController')
const userRouter = express.Router()

userRouter.post("/createuser", createUser)
userRouter.post("/getallusers", getAllUsers)
userRouter.post("/getuserbyid", authMiddleware,  getUserByID)
userRouter.post("/updateuserbyid", updateUser)
userRouter.post("/deleteuserbyid", deleteUser)

module.exports = userRouter