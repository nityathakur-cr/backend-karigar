const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
      // unique: true,
    },
    subcategory_image: {
      type: String,
    },
    icon: {
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

subCategorySchema.index({ category_id: 1, name: 1 }, { unique: true });

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategory;
