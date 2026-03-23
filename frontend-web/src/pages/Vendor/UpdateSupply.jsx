import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const UpdateSupply = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const products = location.state?.products || [];
    const [selectedProduct, setSelectedProduct] = useState(products.length > 0 ? products[0]._id : '');
    const [weight, setWeight] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !weight) {
            toast.error('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/vendor/update-supply', {
                product_id: selectedProduct,
                weight: Number(weight)
            });
            toast.success('Supply updated successfully');
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            toast.error('Failed to update supply');
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
                <h1>Update Supply</h1>
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
                        <label className="form-label">Weight (kg)</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Enter weight in kg"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? <span className="spinner-btn"></span> : null}
                        {loading ? 'Submitting...' : 'Submit Supply'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateSupply;
