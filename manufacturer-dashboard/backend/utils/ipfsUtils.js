const axios = require("axios");
require("dotenv").config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const PINATA_JWT = process.env.PINATA_JWT;

// Function to upload JSON data to Pinata IPFS
async function uploadToIPFS(data) {
  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataContent: data,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_JWT}`, // Use JWT if available
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );

    return res.data.IpfsHash; // CID (Content Identifier)
  } catch (err) {
    console.error("IPFS Upload Error:", err);
    throw new Error("Failed to upload data to IPFS");
  }
}

module.exports = { uploadToIPFS };
