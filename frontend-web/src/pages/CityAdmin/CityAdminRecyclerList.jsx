import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiRepeat, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';

const CityAdminRecyclerList = () => {
    const [recyclers, setRecyclers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();

    const fetchRecyclers = async () => {
        try {
            const response = await api.get('/city-admin/recyclers');
            setRecyclers(response.data);
        } catch (error) {
            toast.error('Failed to fetch recyclers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRecyclers(); }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/city-admin/user/${id}`);
            fetchRecyclers();
            toast.success('Recycler deleted');
        } catch (error) {
            toast.error('Failed to delete recycler');
        }
    };

    if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <FiArrowLeft /> Back
                </button>
                <h1>City Recyclers</h1>
                <div></div>
            </div>

            <div className="page-content">
                {recyclers.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-state-text">No recyclers found in your city</p>
                    </div>
                ) : (
                    recyclers.map((item) => (
                        <div key={item._id} className="list-item">
                            <div className="list-item-icon"><FiRepeat /></div>
                            <div className="list-item-content">
                                <div className="list-item-title">{item.name}</div>
                                <div className="list-item-desc">Phone: {item.phone}</div>
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
                    title="Delete Recycler"
                    message={`Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    danger
                    onConfirm={() => { handleDelete(confirmDelete._id); setConfirmDelete(null); }}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
};

export default CityAdminRecyclerList;
