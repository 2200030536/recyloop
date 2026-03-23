import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTruck, FiCheck, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';

const CityAdminVendorList = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [confirmApprove, setConfirmApprove] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();

    const fetchVendors = async () => {
        try {
            const response = await api.get('/city-admin/vendors');
            setVendors(response.data);
        } catch (error) {
            toast.error('Failed to fetch vendors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVendors(); }, []);

    const handleApprove = async (id) => {
        try {
            await api.put(`/city-admin/vendor/approve/${id}`);
            fetchVendors();
            toast.success('Vendor approved');
        } catch (error) {
            toast.error('Failed to approve vendor');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/city-admin/user/${id}`);
            fetchVendors();
            toast.success('Vendor deleted');
        } catch (error) {
            toast.error('Failed to delete vendor');
        }
    };

    if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <FiArrowLeft /> Back
                </button>
                <h1>City Vendors</h1>
                <div></div>
            </div>

            <div className="page-content">
                {vendors.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-state-text">No vendors found in your city</p>
                    </div>
                ) : (
                    vendors.map((item) => (
                        <div key={item._id} className="list-item">
                            <div className="list-item-icon"><FiTruck /></div>
                            <div className="list-item-content">
                                <div className="list-item-title">{item.name}</div>
                                <div className="list-item-desc">
                                    Phone: {item.phone} · Status:{' '}
                                    <span style={{ color: item.status === 'approved' ? '#4CAF50' : '#FF9800', fontWeight: 'bold' }}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {item.status === 'pending' && (
                                    <button
                                        className="btn-primary"
                                        style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                                        onClick={() => setConfirmApprove(item)}
                                    >
                                        <FiCheck /> Approve
                                    </button>
                                )}
                                <button
                                    className="btn-icon danger"
                                    onClick={() => setConfirmDelete(item)}
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {confirmApprove && (
                <ConfirmDialog
                    title="Approve Vendor"
                    message={`Are you sure you want to approve "${confirmApprove.name}"?`}
                    confirmText="Approve"
                    onConfirm={() => { handleApprove(confirmApprove._id); setConfirmApprove(null); }}
                    onCancel={() => setConfirmApprove(null)}
                />
            )}

            {confirmDelete && (
                <ConfirmDialog
                    title="Delete Vendor"
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

export default CityAdminVendorList;
