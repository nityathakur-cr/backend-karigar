const express = require("express");
const { checkUser } = require("../middleware/auth.middleware");
const { createReport } = require("../api/reports/reportController");
const router = express.Router();

router.post("/create", checkUser, createReport);

module.exports = router;
