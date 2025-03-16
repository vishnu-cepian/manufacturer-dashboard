const jwt = require("jsonwebtoken");
const User = require("../models/User")

module.exports = async function (req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: "No token, authorization denied" });
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("companyName");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
