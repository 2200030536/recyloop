import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const CityAdminRateUpdate = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [rate, setRate] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentRates, setCurrentRates] = useState([]);

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, rateRes] = await Promise.all([
                    api.get('/city-admin/products'),
                    api.get('/city-admin/rates')
                ]);
                setProducts(productRes.data);
                setCurrentRates(rateRes.data);
                if (productRes.data.length > 0) {
                    setSelectedProduct(productRes.data[0]._id);
                    // Pre-fill rate if it exists
                    const existingRate = rateRes.data.find(r => r.product_id?._id === productRes.data[0]._id);
                    if (existingRate) setRate(existingRate.rate);
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
                toast.error('Failed to load initial data');
            }
        };
        fetchData();
    }, [toast]);

    const handleProductChange = (e) => {
        const prodId = e.target.value;
        setSelectedProduct(prodId);
        const existingRate = currentRates.find(r => r.product_id?._id === prodId);
        setRate(existingRate ? existingRate.rate : '');
    };

    const handleUpdateRate = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !rate) {
            toast.error('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/city-admin/rate/update', {
                product_id: selectedProduct,
                rate: Number(rate)
            });
            toast.success('City rate updated successfully');
            
            // Refresh rates to update standard list
            const rateRes = await api.get('/city-admin/rates');
            setCurrentRates(rateRes.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update rate');
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
                <h1>Manage City Rates</h1>
                <div></div>
            </div>

            <div className="page-content">
                <form onSubmit={handleUpdateRate} className="glass-card" style={{ padding: '20px', borderRadius: '15px' }}>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="form-label">Product</label>
                        <select
                            className="form-select"
                            value={selectedProduct}
                            onChange={handleProductChange}
                        >
                            {products.map((p) => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="form-label">City Rate (₹) per kg</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
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

                <div style={{ marginTop: '30px' }}>
                    <h2>Current Active Rates</h2>
                    <div className="list-grid" style={{ marginTop: '15px' }}>
                        {currentRates.length === 0 ? (
                            <div className="empty-state glass-card">
                                <p className="empty-state-text">No rates defined for your city yet.</p>
                            </div>
                        ) : (
                            currentRates.map((rateItem) => (
                                <div key={rateItem._id} className="list-item glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                        {rateItem.product_id?.name || 'Unknown Product'}
                                    </div>
                                    <div style={{ color: 'var(--success)', fontSize: '20px', fontWeight: 'bold' }}>
                                        ₹{rateItem.rate} <span style={{fontSize: '14px', color: 'var(--text-secondary)'}}>/ kg</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CityAdminRateUpdate;
