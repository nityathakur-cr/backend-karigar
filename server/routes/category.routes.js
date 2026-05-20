const express = require("express");
const router = express.Router();
const {
  verifyToken,
  checkUser,
  isAdmin,
} = require("../middleware/auth.middleware");
const {
  getCategories,
  createCategory,
  updateCategory,
  createSubCategory,
  getSubCategories,
  updateSubCategory,
} = require("../api/category/categoryController");

router.post("/list", getCategories);
router.post("/sub-categories/list", getSubCategories);

// admin routes
router.post("/create", verifyToken, checkUser, isAdmin, createCategory);
router.post(
  "/sub-categories/create",
  verifyToken,
  checkUser,
  isAdmin,
  createSubCategory,
);
router.post(
  "/:categoryId/update",
  verifyToken,
  checkUser,
  isAdmin,
  updateCategory,
);
router.post(
  "/sub-categories/:subCategoryId/update",
  verifyToken,
  checkUser,
  isAdmin,
  updateSubCategory,
);

module.exports = router;
