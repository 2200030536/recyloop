import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiCheckCircle, FiPackage, FiMapPin, FiUsers, FiDollarSign, FiTruck, FiRepeat, FiUserPlus, FiLogOut, FiZap, FiUser, FiBriefcase } from 'react-icons/fi';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const menuItems = [
        { title: 'Vendor Approvals', route: '/vendor-approval', icon: <FiCheckCircle />, color: '#FF9800' },
        { title: 'Manage Products', route: '/products', icon: <FiPackage />, color: '#4CAF50' },
        { title: 'Manage Cities', route: '/cities', icon: <FiMapPin />, color: '#E91E63' },
        { title: 'Manage Users', route: '/users', icon: <FiUsers />, color: '#2196F3' },
        { title: 'Manage City Admins', route: '/city-admins', icon: <FiBriefcase />, color: '#673AB7' },
        { title: 'Update Rates', route: '/rates', icon: <FiDollarSign />, color: '#9C27B0' },
        { title: 'Vendor Supply', route: '/vendor-supply', icon: <FiTruck />, color: '#00BCD4' },
        { title: 'Recycler Demand', route: '/recycler-demand', icon: <FiRepeat />, color: '#FF5722' },
        { title: 'Create Account', route: '/create-recycler', icon: <FiUserPlus />, color: '#607D8B' },
    ];

    return (
        <div className="page-container">
            <div className="animated-bg"></div>

            <div className="page-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <img src="/logo.png" alt="Recyloop Logo" style={{ height: '24px', objectFit: 'contain' }} />
                        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#fff', letterSpacing: '0.5px' }}>Recyloop</span>
                    </div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiZap style={{ color: 'var(--accent)' }} />
                        Admin Dashboard
                    </h1>
                    <span className="subtitle">Welcome back, {user?.name || 'Admin'}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-icon" onClick={() => navigate('/profile')} title="My Profile"
                        style={{ color: 'rgba(255,255,255,0.7)' }}>
                        <FiUser />
                    </button>
                    <button className="btn-icon" onClick={logout} title="Logout"
                        style={{ color: 'rgba(255,255,255,0.7)' }}>
                        <FiLogOut />
                    </button>
                </div>
            </div>

            <div className="page-content">
                <div className="dashboard-grid">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className="card card-clickable dashboard-card"
                            onClick={() => navigate(item.route)}
                        >
                            <div className="dashboard-card-icon"
                                style={{
                                    background: `linear-gradient(135deg, ${item.color}dd, ${item.color}88)`,
                                    boxShadow: `0 4px 20px ${item.color}25`
                                }}>
                                {item.icon}
                            </div>
                            <span className="dashboard-card-label">{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
