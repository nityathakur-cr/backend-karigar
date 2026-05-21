const express = require("express");
const { checkUser, verifyToken, isAdmin } = require("../middleware/auth.middleware");
const { createReport, getAllReports } = require("../api/reports/reportController");
const router = express.Router();

router.post("/createreport", verifyToken, checkUser, createReport);
router.post("/getallreports", verifyToken, checkUser, isAdmin, getAllReports);

module.exports = router;
