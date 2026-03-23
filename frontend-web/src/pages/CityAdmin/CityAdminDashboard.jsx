import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiUsers, FiTruck, FiRepeat, FiUser, FiLogOut, FiBriefcase } from 'react-icons/fi';
import api from '../../services/api';

const CityAdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ vendorsCount: 0, pendingVendorsCount: 0, recyclersCount: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/city-admin/dashboard');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    const menuItems = [
        { title: 'Vendors', route: '/city-vendors', icon: <FiTruck />, color: '#4CAF50', badge: stats.pendingVendorsCount > 0 ? `${stats.pendingVendorsCount} Pending` : null },
        { title: 'Recyclers', route: '/city-recyclers', icon: <FiRepeat />, color: '#FF9800' },
        { title: 'City Supply', route: '/city-supply', icon: <FiTruck />, color: '#2196F3' },
        { title: 'City Demand', route: '/city-demand', icon: <FiRepeat />, color: '#9C27B0' },
        { title: 'City Rates', route: '/city-rates', icon: <FiBriefcase />, color: '#F44336' },
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
                        <FiBriefcase style={{ color: 'var(--accent)' }} />
                        City Admin - {user?.city}
                    </h1>
                    <span className="subtitle">Welcome back, {user?.name}</span>
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
                            {item.badge && (
                                <span style={{
                                    marginTop: '10px',
                                    background: '#FF3B30',
                                    color: 'white',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    {item.badge}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CityAdminDashboard;
