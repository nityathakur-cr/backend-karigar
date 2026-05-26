const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    banner_image: {
      type: String,
      required: true,
    },
    redirect_url: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
