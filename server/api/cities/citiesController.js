const City = require("./citiesModel");

// API to create City
const createCity = async (req, res) => {
  try {
    const { name, state } = req.body;
    if (!name && !state) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const existingCity = await City.findOne({ name, state });
    if (existingCity) {
      return res.status(409).json({
        message: "City already exists",
      });
    }
    const city = await City.create({
      name,
      state,
    });
    return res.status(201).json({
      message: "City Created",
      data: city,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// API to get all the cities
const getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    return res.status(200).json({
      message: "All Cities fetched",
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// API to get active cities
const getActiveCities = async (req, res) => {
  try {
    const cities = await City.find({status: "active"});
    return res.status(200).json({
      message: "Fetched Active Cities",
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// API to get city by ID
const getCityById = async (req, res) => {
  try {
    const { city_id } = req.body;
    if (!city_id) {
      return res.status(400).json({
        message: "CityID is required",
      });
    }
    const city = await City.findById(city_id);
    if (!city) {
      return res.status(404).json({
        message: "City Not Found",
      });
    }
    return res.status(200).json({
      message: "City fetched by ID",
      data: city,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// API to update City
const updateCity = async (req, res) => {
  try {
    const { id, name, state } = req.body;

    if (!name && !state) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const existingCity = await City.findById(id);
    if (!existingCity) {
      return res.status(404).json({
        message: "City Not Found",
      });
    }
    const city = await City.findByIdAndUpdate(
      id,
      {
        name,
        state,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      message: "City Updated",
      data: city,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// API to delete City
const deleteCity = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        message: "City ID is required",
      });
    }
    const city = await City.findById(id);
    city.status = "inactive";
    await city.save();

    return res.status(200).json({
      message: "City Deleted(soft)",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createCity,
  getAllCities,
  getActiveCities,
  getCityById,
  updateCity,
  deleteCity,
};
