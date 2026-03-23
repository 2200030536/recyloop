import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const UpdateDemand = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const products = location.state?.products || [];
    const [selectedProduct, setSelectedProduct] = useState(products.length > 0 ? products[0]._id : '');
    const [rate, setRate] = useState('');
    const [weight, setWeight] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !rate || !weight) {
            toast.error('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/recycler/update-demand', {
                product_id: selectedProduct,
                rate: Number(rate),
                weight: Number(weight)
            });
            toast.success('Demand updated successfully');
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            toast.error('Failed to update demand');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header" style={{ background: 'linear-gradient(135deg, #0D47A1, #1565C0)' }}>
                <button className="back-btn" onClick={() => navigate('/')}>
                    <FiArrowLeft /> Back
                </button>
                <h1>Post Demand</h1>
                <div></div>
            </div>

            <div className="page-content">
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label className="form-label">Select Product</label>
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
                        <label className="form-label">Offered Rate (₹/kg)</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Enter offered rate"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Required Weight (kg)</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Enter required weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? <span className="spinner-btn"></span> : null}
                        {loading ? 'Submitting...' : 'Submit Demand'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateDemand;
