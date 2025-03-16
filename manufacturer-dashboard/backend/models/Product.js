const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: String,
  serialNumber: String,
  batch: String,
  companyName: String,
  ipfsCID: String,
  hash: String,
  qrCode: String,
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Product", productSchema);
