const mongoose = require("mongoose");
const Report = require("./reportModel");
const Business = require("../business/businessModel");
const createReport = async (req, res) => {
  try {
    const { business_id, reason } = req.body;

    if(!req.user){
      return res.status(401).json({
        message : "Unauthorized"
      })
    }
    if (!business_id) {
      return res.status(400).json({
        message: "Business ID is required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(business_id)) {
      return res.status(400).json({
        message: "Invalid Business ID",
      });
    }
    if (!reason) {
      return res.status(400).json({
        message: "Reason is required",
      });
    }

    const business = await Business.findById(business_id);
    if (!business) {
      return res.status(404).json({
        message: "Business Not Found",
      });
    }
    const report = await Report.create({
      user_id: req.user.id,
      business_id: business_id,
      reason,
    });
    return res.status(201).json({
      message: "Report Created",
      data: report,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
    createReport
}
