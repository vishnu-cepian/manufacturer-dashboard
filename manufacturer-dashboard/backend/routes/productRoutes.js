const express = require("express");
const crypto = require("crypto");
const QRCode = require("qrcode");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadToIPFS } = require("../utils/ipfsUtils");
const { registerProductOnBlockchain } = require("../utils/blockchainUtils");

const router = express.Router();

router.post("/register", authMiddleware, async (req, res) => {
  try {
    const { productName, serialNumber, batch } = req.body;
    const companyName = req.user.companyName;
  
    const productData = { productName, serialNumber, batch, companyName };
    const qrhash = crypto.createHash("sha256").update(JSON.stringify(productData)).digest("hex");

    const ipfsUploadData = {productData, qrhash}
    const ipfsCID = await uploadToIPFS(JSON.stringify(ipfsUploadData));

    const finalQRData = {ipfsCID, qrhash}
    const finalQRHash = crypto.createHash("sha256").update(JSON.stringify(finalQRData)).digest("hex");
    console.log(finalQRData)
    
    try{
      const txHash = await registerProductOnBlockchain(companyName,finalQRHash);
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const qrContent = JSON.stringify({ ipfsCID, qrhash });
    const qrCode = await QRCode.toDataURL(qrContent);


    const newProduct = new Product({
      productName,
      serialNumber,
      batch,
      companyName,
      ipfsCID,
      qrhash,
      qrCode,
      manufacturer: req.user._id,
    });

    await newProduct.save();
    res.json({ message: "Product registered successfully", ipfsCID, qrhash });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error registering product", error: err.message });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  try {
      const products = await Product.find({ manufacturer: req.user._id });
      res.json(products);
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ success: false, message: "Server error!" });
  }
});

module.exports = router;
