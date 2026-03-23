import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiTrash2, FiPlus } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';

const CityManagement = () => {
    const [cities, setCities] = useState([]);
    const [newCity, setNewCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();

    const fetchCities = async () => {
        try {
            const response = await api.get('/admin/cities');
            setCities(response.data);
        } catch (error) {
            toast.error('Failed to fetch cities');
        }
    };

    useEffect(() => { fetchCities(); }, []);

    const handleAddCity = async () => {
        if (!newCity) {
            toast.error('Please enter a city name');
            return;
        }

        setLoading(true);
        try {
            await api.post('/admin/city', { name: newCity });
            toast.success('City added successfully');
            setNewCity('');
            fetchCities();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add city');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCity = async (id) => {
        try {
            await api.delete(`/admin/city/${id}`);
            fetchCities();
            toast.success('City deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete city');
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <FiArrowLeft /> Back
                </button>
                <h1>Manage Cities</h1>
                <div></div>
            </div>

            <div className="page-content">
                <div className="form-row" style={{ marginBottom: '20px' }}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="New city name"
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCity()}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleAddCity} disabled={loading} style={{ marginBottom: '16px' }}>
                        <FiPlus /> Add City
                    </button>
                </div>

                {cities.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-state-text">No cities found</p>
                    </div>
                ) : (
                    cities.map((item) => (
                        <div key={item._id} className="list-item">
                            <div className="list-item-icon"><FiMapPin /></div>
                            <div className="list-item-content">
                                <div className="list-item-title">{item.name}</div>
                            </div>
                            <button
                                className="btn-icon danger"
                                onClick={() => setConfirmDelete(item)}
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {confirmDelete && (
                <ConfirmDialog
                    title="Delete City"
                    message={`Are you sure you want to delete "${confirmDelete.name}"?`}
                    confirmText="Delete"
                    danger
                    onConfirm={() => { handleDeleteCity(confirmDelete._id); setConfirmDelete(null); }}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
};

export default CityManagement;
