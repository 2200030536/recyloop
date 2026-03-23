import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const RateUpdate = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState('');
    const [rate, setRate] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, cityRes] = await Promise.all([
                    api.get('/admin/products'),
                    api.get('/admin/cities')
                ]);
                setProducts(productRes.data);
                if (productRes.data.length > 0) setSelectedProduct(productRes.data[0]._id);
                setCities(cityRes.data);
                if (cityRes.data.length > 0) setCity(cityRes.data[0].name);
            } catch (error) {
                console.error('Failed to fetch data');
            }
        };
        fetchData();
    }, []);

    const handleUpdateRate = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !city || !rate) {
            toast.error('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/admin/rate/update', {
                product_id: selectedProduct,
                city,
                rate: Number(rate)
            });
            toast.success('City rate updated successfully');
            setRate('');
        } catch (error) {
            toast.error('Failed to update rate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <FiArrowLeft /> Back
                </button>
                <h1>Update City Rate</h1>
                <div></div>
            </div>

            <div className="page-content">
                <form onSubmit={handleUpdateRate}>
                    <div className="form-group">
                        <label className="form-label">Product</label>
                        <select
                            className="form-select"
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                            {products.map((p) => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">City</label>
                        <select
                            className="form-select"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        >
                            <option value="">Select City</option>
                            {cities.map((c) => (
                                <option key={c._id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">New Rate (₹)</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Enter rate"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? <span className="spinner-btn"></span> : null}
                        Update Rate
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RateUpdate;
