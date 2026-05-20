const mongoose = require("mongoose");
const Business = require("./businessModel");
const Verification = require("../verification/verificationModel");
const Analytics = require("../businessAnalytics/analyticsModel");

const createSlug = (value) =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildUniqueSlug = async (name, requestedSlug) => {
  const baseSlug = createSlug(requestedSlug || name);
  let slug = baseSlug;
  let counter = 1;

  while (await Business.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

// Business Owner
const registerBusiness = async (req, res) => {
  try {
    const {
      name,
      slug,
      category,
      sub_category,
      description,
      phone,
      whatsapp,
      website,
      email,
      address,
      city,
      state,
      country,
      pincode,
      coordinates,
      timing,
      services,
      logo,
      images,
    } = req.body;

    if (
      !name ||
      !category ||
      !sub_category ||
      !description ||
      !phone ||
      !images ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return res.status(400).json({
        message: "Bad request",
      });
    }

    const existingPhone = await Business.findOne({
      phone,
      owner_id: req.dbUser._id,
    });
    if (existingPhone) {
      return res
        .status(409)
        .json({ message: "Business with this phone already exists" });
    }

    const uniqueSlug = await buildUniqueSlug(name, slug);

    const business = await Business.create({
      owner_id: req.dbUser._id,
      name,
      slug: uniqueSlug,
      category,
      sub_category,
      description,
      phone,
      whatsapp,
      website,
      email,
      address,
      city,
      state,
      country,
      pincode,
      coordinates,
      timing,
      services,
      logo,
      images,
      verified_status: "pending",
      is_active: true,
    });

    await Verification.create({
      business_id: business._id,
      action: "pending",
    });

    return res.status(201).json({
      message: "Business registered successfully and sent for admin approval",
      business,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Business with this slug or phone already exists",
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ message: "Invalid business id" });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const ownsBusiness =
      business.owner_id.toString() === req.dbUser._id.toString();
    if (!ownsBusiness && req.dbUser.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not allowed to update this business" });
    }

    const currentName = business.name;
    const allowedFields = [
      "name",
      "category",
      "sub_category",
      "description",
      "phone",
      "whatsapp",
      "website",
      "email",
      "address",
      "city",
      "state",
      "country",
      "pincode",
      "coordinates",
      "services",
      "logo",
      "images",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        business[field] = req.body[field];
      }
    });

    if (req.body.name !== currentName) {
      business.slug = await buildUniqueSlug(req.body.name, req.body.slug);
    }

    if (ownsBusiness) {
      if (business.verified_status !== "pending") {
        business.verified_status = "pending";
        business.verified_by = undefined;
        business.reject_reason = undefined;
        await Verification.create({
          business_id: business._id,
          action: "pending",
          reason: "Business updated by owner",
        });
      }
    }

    await business.save();

    return res.status(200).json({
      message: "Business updated successfully",
      business,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Business phone or slug already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateBusinessTiming = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { timing } = req.body;

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ message: "Invalid business id" });
    }
    if (!Array.isArray(timing)) {
      return res.status(400).json({ message: "Timing must be an array" });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    if (
      business.owner_id.toString() !== req.dbUser._id.toString() &&
      req.dbUser.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed to update this business" });
    }

    business.timing = timing;
    await business.save();

    return res
      .status(200)
      .json({ message: "Business timing updated", business });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateBusinessImages = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { logo, images } = req.body;

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ message: "Invalid business id" });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    if (
      business.owner_id.toString() !== req.dbUser._id.toString() &&
      req.dbUser.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed to update this business" });
    }

    if (logo !== undefined) business.logo = logo;
    if (images !== undefined) business.images = images;
    await business.save();

    return res
      .status(200)
      .json({ message: "Business images updated", business });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMyBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ owner_id: req.dbUser._id })
      .populate("category", "name image icon")
      .populate("sub_category", "name image icon")
      .sort({ createdAt: -1 });

    return res.status(200).json({ businesses });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ message: "Invalid Business Id" });
    }

    const business = await Business.findOneAndDelete({
      _id: businessId,
      owner_id: req.dbUser._id,
    });

    if (!business) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

    return res.status(200).json({
      message: "Business deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// User
const getApprovedBusinesses = async (req, res) => {
  try {
    const {
      category,
      sub_category,
      city,
      search,
      page = 1,
      limit = 20,
    } = req.body;

    const filter = {
      verified_status: "verified",
      is_active: true,
    };

    if (category) filter.category = category;
    if (sub_category) filter.sub_category = sub_category;
    if (city) filter.city = new RegExp(city, "i");
    if (search) {
      filter.$text = {
        $search: search,
      };
    }
    // if (search) {
    //   filter.$or = [
    //     { name: new RegExp(search, "i") },
    //     { description: new RegExp(search, "i") },
    //     { services: new RegExp(search, "i") },
    //   ];
    // }

    const businesses = await Business.find(filter)
      .populate("category", "name image icon")
      .populate("sub_category", "name image icon")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Business.countDocuments(filter);

    return res.status(200).json({
      businesses,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getBusinessDetails = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const filter = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const business = await Business.findOne({
      ...filter,
      verified_status: "verified",
      is_active: true,
    })
      .populate("category", "name image icon")
      .populate("sub_category", "name image icon")
      .populate("reviews");

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    return res.status(200).json({ business });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const trackBusinessAction = async (req, res) => {
  try {
    const { businessId, action } = req.params;
    const actionFields = {
      view: "views",
      call: "call_click",
      whatsapp: "whatsapp_click",
      website: "website_click",
    };

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ message: "Invalid business id" });
    }
    if (!actionFields[action]) {
      return res.status(400).json({ message: "Invalid tracking action" });
    }

    const business = await Business.findOneAndUpdate(
      { _id: businessId, verified_status: "verified", is_active: true },
      { $inc: { [actionFields[action]]: 1 } },
      { new: true },
    );

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const analyticsField =
      action === "view" ? "profile_views" : actionFields[action];

    await Analytics.findOneAndUpdate(
      { business_id: businessId, date: startOfDay },
      { $inc: { [analyticsField]: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({ message: "Business action tracked" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const suspendBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { is_active } = req.body;

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ message: "Invalid business id" });
    }
    if (typeof is_active !== "boolean") {
      return res.status(400).json({ message: "is_active must be boolean" });
    }

    const business = await Business.findByIdAndUpdate(
      businessId,
      { is_active },
      { new: true },
    );
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    return res.status(200).json({
      message: `Business ${is_active ? "activated" : "suspended"} successfully`,
      business,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerBusiness,
  updateBusiness,
  updateBusinessTiming,
  updateBusinessImages,
  getMyBusinesses,
  deleteBusiness,
  getApprovedBusinesses,
  getBusinessDetails,
  trackBusinessAction,
  suspendBusiness,
};
