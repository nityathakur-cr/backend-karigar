const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const { credential } = require("firebase-admin");
const authRoutes = require("./routes/auth.routes");
const businessRoutes = require("./routes/business.routes");
const verificationRoutes = require("./routes/verification.routes");

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/business", businessRoutes);

module.exports = app;
