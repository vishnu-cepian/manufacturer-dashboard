
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/products/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(res.data);
            } catch (err) {
                setError("Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div>
            <h2>My Registered Products</h2>
            {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
                <ul>
                    {products.map((product) => (
                        <li key={product._id}>
                            <strong>{product.productName}</strong> (Batch: {product.batch})
                            <br />
                            Serial Number: {product.serialNumber}
                            <br />
                            Company: {product.companyName}
                            <br />
                            CID: {product.ipfsCID} 
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyProducts;
