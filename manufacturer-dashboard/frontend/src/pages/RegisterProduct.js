import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const RegisterProduct = () => {
  const [formData, setFormData] = useState({ productName: "", serialNumber: "", batch: "" });
  const [qrCode, setQrCode] = useState(null);
  const qrRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://localhost:5000/api/products/register", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const qrContent = JSON.stringify({ ipfsCID: res.data.ipfsCID, qrhash: res.data.qrhash });
      setQrCode(qrContent);
      alert("Product registered successfully!");
    } catch (err) {
      alert("Error: " + err.response.data.message);
    }
  };

  // Function to save QR Code as image
  const handleDownloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas"); // Get the QR code canvas
    if (canvas) {
      const url = canvas.toDataURL("image/png"); // Convert to image
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png"; // Set the download name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="registerProduct">
      <h2>Register Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="productName" placeholder="Product Name" onChange={handleChange} required />
        <input type="text" name="serialNumber" placeholder="Serial Number" onChange={handleChange} required />
        <input type="text" name="batch" placeholder="Batch Number" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>

      {qrCode && (
        <div>
          <h3>QR Code:</h3>
          <div ref={qrRef}>
            <QRCodeCanvas value={qrCode} />
          </div>
          <p>Scan this QR to verify product authenticity</p>
          <button onClick={handleDownloadQR}>Save QR Code</button> {/* Save Button */}
        </div>
      )}
    </div>
  );
};

export default RegisterProduct;
