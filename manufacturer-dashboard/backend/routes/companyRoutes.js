const express = require("express");
const router = express.Router();
const CompanyNames = require("../models/CompanyNames"); // Import the model

// Fetch all company names
router.get("/companies", async (req, res) => {
  try {
    const companies = await CompanyNames.find({}, "name"); // Fetch only the "name" field
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
