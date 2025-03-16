import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <p>Company: {user?.companyName}</p>
      <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>Logout</button>
      <Link to="/register-product">
  <button>Register Product</button>
</Link>
    </div>
  );
};

export default Dashboard;
