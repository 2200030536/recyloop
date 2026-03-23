import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiCheck, FiX } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';

const VendorApproval = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmAction, setConfirmAction] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();

    const fetchVendors = async () => {
        try {
            const response = await api.get('/admin/vendors/pending');
            setVendors(response.data);
        } catch (error) {
            toast.error('Failed to fetch pending vendors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVendors(); }, []);

    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/vendor/approve/${id}`);
            toast.success('Vendor approved successfully');
            fetchVendors();
        } catch (error) {
            toast.error('Failed to approve vendor');
        }
    };

    const handleReject = async (id) => {
        try {
            await api.delete(`/admin/user/${id}`);
            toast.success('Vendor rejected and deleted');
            fetchVendors();
        } catch (error) {
            toast.error('Failed to reject vendor');
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
                <h1>Vendor Approvals</h1>
                <div></div>
            </div>

            <div className="page-content">
                {vendors.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">✓</div>
                        <p className="empty-state-text">No pending approvals</p>
                    </div>
                ) : (
                    vendors.map((item) => (
                        <div key={item._id} className="list-item">
                            <div className="list-item-icon"><FiClock /></div>
                            <div className="list-item-content">
                                <div className="list-item-title">{item.name}</div>
                                <div className="list-item-desc">{item.city} | {item.phone}</div>
                            </div>
                            <div className="list-item-actions">
                                <button className="btn btn-primary btn-sm" onClick={() => handleApprove(item._id)}>
                                    <FiCheck /> Approve
                                </button>
                                <button
                                    className="btn-icon danger"
                                    onClick={() => setConfirmAction({ id: item._id, name: item.name })}
                                >
                                    <FiX />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {confirmAction && (
                <ConfirmDialog
                    title="Reject Vendor"
                    message={`Are you sure you want to reject and delete "${confirmAction.name}"?`}
                    confirmText="Reject"
                    danger
                    onConfirm={() => { handleReject(confirmAction.id); setConfirmAction(null); }}
                    onCancel={() => setConfirmAction(null)}
                />
            )}
        </div>
    );
};

export default VendorApproval;
