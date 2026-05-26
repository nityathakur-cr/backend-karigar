const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
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
router.post(
  "/create",
  verifyToken,
  checkUser,
  isAdmin,
  upload.single("category_image"),
  createCategory,
);
router.post(
  "/sub-categories/create",
  verifyToken,
  checkUser,
  isAdmin,
  upload.single("subcategory_image"),
  createSubCategory,
);
router.post(
  "/update",
  verifyToken,
  checkUser,
  isAdmin,
  upload.single("category_image"),
  updateCategory,
);
router.post(
  "/sub-categories/update",
  verifyToken,
  checkUser,
  isAdmin,
  upload.single("subcategory_image"),

  updateSubCategory,
);

module.exports = router;
