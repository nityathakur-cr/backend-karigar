const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true },
);

const Verification = mongoose.model("Verification", verificationSchema);
module.exports = Verification;
