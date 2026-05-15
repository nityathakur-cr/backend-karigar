const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
    helpful_count: {
      type: Number,
      default: 0,
    },
    unhelpful_count: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const reviewVoteSchema = new mongoose.Schema(
  {
    review_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["helpful", "unhelpful"],
      default: "helpful",
    },
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);
const ReviewVote = mongoose.model("ReviewVote", reviewVoteSchema);
module.exports = { Review, ReviewVote };
