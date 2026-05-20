const express = require("express")
const { checkUser, isAdmin } = require("../middleware/auth.middleware")
const { createCity, getAllCities, getCityById, updateCity, deleteCity, getActiveCities } = require("../api/cities/citiesController")
const router = express.Router()

router.post('/createcity', createCity )
// router.post('/createcity', isAdmin, createCity )
router.post("/getallcities", getAllCities)
router.post("/getactivecities", getActiveCities)
router.post("/getcitybyid", getCityById)
router.post("/updatecitybyid", updateCity)
router.post("/deletecitybyid", deleteCity)


module.exports = router