import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const RegisterProduct = () => {
  const [formData, setFormData] = useState({ productName: "", serialNumber: "", batch: "" });
  const [qrCode, setQrCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const qrRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/products/register", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const qrContent = JSON.stringify({ ipfsCID: res.data.ipfsCID, qrhash: res.data.qrhash });
      setQrCode(qrContent);
      alert("Product registered successfully!");
    } catch (err) {
      alert("Error: " + err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleDownloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas"); 
    if (canvas) {
      const url = canvas.toDataURL("image/png"); 
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png"; 
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      {qrCode && (
        <div>
          <h3>QR Code:</h3>
          <div ref={qrRef}>
            <QRCodeCanvas value={qrCode} />
          </div>
          <p>Scan this QR to verify product authenticity</p>
          <button onClick={handleDownloadQR}>Save QR Code</button>
        </div>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <style>
        {`
          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
          }
          
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #fff;
            border-top: 4px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default RegisterProduct;
