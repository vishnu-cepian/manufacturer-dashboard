const express = require("express");
const router = express.Router();
const CompanyNames = require("../models/CompanyNames"); 

router.get("/companies", async (req, res) => {
  try {
    const companies = await CompanyNames.find({}, "name"); 
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
