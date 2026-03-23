import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDeleteUser = async (id) => {
        try {
            await api.delete(`/admin/user/${id}`);
            fetchUsers();
            toast.success('User deleted');
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
                <h1>Manage Users</h1>
                <div></div>
            </div>

            <div className="page-content">
                {users.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-state-text">No users found</p>
                    </div>
                ) : (
                    users.map((item) => (
                        <div key={item._id} className="list-item">
                            <div className="list-item-icon"><FiUser /></div>
                            <div className="list-item-content">
                                <div className="list-item-title">{item.name}</div>
                                <div className="list-item-desc">
                                    Role: {item.role.toUpperCase()} · Phone: {item.phone} · City: {item.city || 'N/A'}
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
                    title="Delete User"
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

export default UserManagement;
