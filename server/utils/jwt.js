const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is not set. Server cannot start.");
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const verifyAppToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = { verifyAppToken, JWT_SECRET, JWT_EXPIRES_IN };
