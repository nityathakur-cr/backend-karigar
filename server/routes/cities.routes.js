const express = require("express");
const {
  checkUser,
  isAdmin,
  verifyToken,
} = require("../middleware/auth.middleware");
const {
  createCity,
  getAllCities,
  getCityById,
  updateCity,
  deleteCity,
  getActiveCities,
} = require("../api/cities/citiesController");
const router = express.Router();

router.post("/createcity", verifyToken, checkUser, isAdmin, createCity);
router.post("/getallcities", verifyToken, checkUser, isAdmin, getAllCities);
router.post("/getactivecities", verifyToken, checkUser, getActiveCities);
router.post("/getcitybyid", verifyToken, checkUser, isAdmin, getCityById);
router.post("/updatecitybyid", verifyToken, checkUser, isAdmin, updateCity);
router.post("/deletecitybyid", verifyToken, checkUser, isAdmin, deleteCity);

module.exports = router;
