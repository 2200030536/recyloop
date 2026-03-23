import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBriefcase, FiTrash2, FiPlus } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';

const CityAdminManagement = () => {
    const [cityAdmins, setCityAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();

    const fetchCityAdmins = async () => {
        try {
            const response = await api.get('/admin/city-admins');
            setCityAdmins(response.data);
        } catch (error) {
            toast.error('Failed to fetch city admins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCityAdmins(); }, []);

    const handleDeleteUser = async (id) => {
        try {
            await api.delete(`/admin/user/${id}`);
            fetchCityAdmins();
            toast.success('City Admin deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    if (loading) {
        return <div className="spinner-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <FiArrowLeft /> Back
                </button>
                <h1>Manage City Admins</h1>
                <button className="btn-primary" onClick={() => navigate('/create-city-admin')}>
                    <FiPlus /> New
                </button>
            </div>

            <div className="page-content">
                {cityAdmins.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-state-text">No city admins found</p>
                    </div>
                ) : (
                    cityAdmins.map((item) => (
                        <div key={item._id} className="list-item">
                            <div className="list-item-icon"><FiBriefcase /></div>
                            <div className="list-item-content">
                                <div className="list-item-title">{item.name}</div>
                                <div className="list-item-desc">
                                    Phone: {item.phone} · City: <span style={{fontWeight: 'bold'}}>{item.city}</span>
                                </div>
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
                    title="Delete City Admin"
                    message={`Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    danger
                    onConfirm={() => { handleDeleteUser(confirmDelete._id); setConfirmDelete(null); }}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
};

export default CityAdminManagement;
