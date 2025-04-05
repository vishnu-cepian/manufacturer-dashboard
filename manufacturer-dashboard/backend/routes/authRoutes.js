const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CompanyNames = require("../models/CompanyNames");

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new manufacturer
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;

    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    user = new User({ name, email, password: hashedPassword, companyName });
    await user.save();

    const existingCompany = await CompanyNames.findOne({ name: companyName });
    if (!existingCompany) {
        await CompanyNames.create({ name: companyName }); 
    }

    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Manufacturer login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// @route   GET /api/auth/user
// @desc    Get manufacturer profile
router.get("/user", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password"); 

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
});

module.exports = router;
