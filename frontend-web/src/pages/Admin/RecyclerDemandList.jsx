import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBox, FiTrash2, FiEdit2, FiFilter, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';

const RecyclerDemandList = () => {
    const [demands, setDemands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [updateModal, setUpdateModal] = useState(null);
    const [ordersCompleted, setOrdersCompleted] = useState('');
    const [updateStatus, setUpdateStatus] = useState('Active');
    
    // Filtering and sorting state
    const [searchRecycler, setSearchRecycler] = useState('');
    const [searchCity, setSearchCity] = useState('');
    const [searchProduct, setSearchProduct] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');

    const navigate = useNavigate();
    const toast = useToast();

    const fetchDemands = async () => {
        try {
            const response = await api.get('/admin/recycler-demand');
            setDemands(response.data);
        } catch (error) {
            toast.error('Failed to fetch recycler demand');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDemands(); }, []);

    const handleDeleteDemand = async (id) => {
        try {
            await api.delete(`/admin/recycler-demand/${id}`);
            fetchDemands();
            toast.success('Record deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete record');
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/recycler-demand/${updateModal._id}/status`, {
                ordersCompleted: Number(ordersCompleted),
                status: updateStatus
            });
            fetchDemands();
            toast.success('Status updated successfully');
            setUpdateModal(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    // Apply Filters & Sorting
    const filteredDemands = demands.filter(item => {
        const recyclerMatch = item.recycler_id?.name?.toLowerCase().includes(searchRecycler.toLowerCase()) || false;
        const cityMatch = item.city?.toLowerCase().includes(searchCity.toLowerCase()) || false;
        const productMatch = item.product_id?.name?.toLowerCase().includes(searchProduct.toLowerCase()) || false;
        const statusMatch = filterStatus === 'All' ? true : item.status === filterStatus;
        return recyclerMatch && cityMatch && productMatch && statusMatch;
    }).sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt);
        const dateB = new Date(b.createdAt || b.updatedAt);
        if (sortBy === 'Newest') return dateB - dateA;
        if (sortBy === 'Oldest') return dateA - dateB;
        return 0;
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown Date';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const openUpdateModal = (item) => {
        setUpdateModal(item);
        setOrdersCompleted(item.ordersCompleted || 0);
        setUpdateStatus(item.status || 'Active');
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
                <h1>Recycler Demand</h1>
                <div></div>
            </div>

            <div className="page-content">
                <div className="filters-container glass-card" style={{ padding: '15px', marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiFilter className="text-muted" />
                        <span className="font-medium">Filters:</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search Recycler Name..." 
                        className="form-input" 
                        style={{ flex: 1, minWidth: '150px', padding: '8px' }}
                        value={searchRecycler}
                        onChange={(e) => setSearchRecycler(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Search Product..." 
                        className="form-input" 
                        style={{ flex: 1, minWidth: '150px', padding: '8px' }}
                        value={searchProduct}
                        onChange={(e) => setSearchProduct(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Search City..." 
                        className="form-input" 
                        style={{ flex: 1, minWidth: '150px', padding: '8px' }}
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                    />
                    <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                    <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <option value="Newest">Sort: Newest First</option>
                        <option value="Oldest">Sort: Oldest First</option>
                    </select>
                </div>

                {filteredDemands.length === 0 ? (
                    <div className="empty-state glass-card">
                        <div className="empty-state-icon">🏭</div>
                        <p className="empty-state-text">No demand records match your filters</p>
                    </div>
                ) : (
                    <div className="list-grid">
                        {filteredDemands.map((item) => (
                            <div key={item._id} className="list-item glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '20px', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div className="list-item-icon" style={{ fontSize: '24px', color: 'var(--primary)' }}>
                                        {item.status === 'Resolved' ? <FiCheckCircle style={{color: 'var(--success)'}}/> : <FiBox />}
                                    </div>
                                    <div className="list-item-content">
                                        <div className="list-item-title" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                            {item.product_id?.name} — {item.weight} kg @ ₹{item.rate}
                                        </div>
                                        <div className="list-item-desc" style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                            Recycler: {item.recycler_id?.name || 'Unknown'} · {item.recycler_id?.phone} · {item.city}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                            Ordered: {formatDate(item.createdAt || item.updatedAt)}
                                        </div>
                                        <div style={{ marginTop: '5px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <span className={`badge ${item.status === 'Resolved' ? 'badge-success' : 'badge-primary'}`} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: item.status === 'Resolved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)', color: item.status === 'Resolved' ? '#10B981' : '#3B82F6' }}>
                                                Status: {item.status || 'Active'}
                                            </span>
                                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                Orders Completed: {item.ordersCompleted || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-actions" style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        className="btn-icon primary"
                                        onClick={() => openUpdateModal(item)}
                                        title="Update Status"
                                        style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        className="btn-icon danger"
                                        onClick={() => setConfirmDelete(item)}
                                        title="Delete Record"
                                        style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {confirmDelete && (
                <ConfirmDialog
                    title="Delete Record"
                    message="Are you sure you want to delete this demand record?"
                    confirmText="Delete"
                    danger
                    onConfirm={() => { handleDeleteDemand(confirmDelete._id); setConfirmDelete(null); }}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}

            {updateModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content glass-card" style={{ width: '90%', maxWidth: '400px', padding: '25px', borderRadius: '15px', background: 'var(--surface)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Update Status</h3>
                        
                        <form onSubmit={handleUpdateStatus}>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Orders Completed</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    className="form-input" 
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                                    value={ordersCompleted}
                                    onChange={(e) => setOrdersCompleted(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="form-group" style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Status</label>
                                <select 
                                    className="form-select" 
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                                    value={updateStatus}
                                    onChange={(e) => setUpdateStatus(e.target.value)}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </div>

                            <div className="modal-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn-secondary" onClick={() => setUpdateModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--text)' }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: 'var(--primary)', color: 'white' }}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecyclerDemandList;
