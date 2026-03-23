import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiPlus, FiActivity, FiUser } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const RecyclerDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [demands, setDemands] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();

    const fetchData = async () => {
        try {
            const [demandRes, productRes] = await Promise.all([
                api.get('/recycler/my-demand'),
                api.get('/recycler/products')
            ]);
            setDemands(demandRes.data);
            setProducts(productRes.data);
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (loading) {
        return <div className="spinner-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="page-container">
            <div className="animated-bg"></div>

            <div className="page-header" style={{
                background: 'linear-gradient(135deg, rgba(13,71,161,0.95), rgba(21,101,192,0.9))'
            }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiActivity style={{ color: '#42A5F5' }} />
                        Hello, {user.name}
                    </h1>
                    <span className="subtitle">Your Demand Dashboard</span>
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
                <h2 className="section-title">Your Current Demands</h2>

                {demands.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <p className="empty-state-text">You haven't posted any demands yet.</p>
                    </div>
                ) : (
                    demands.map((item) => (
                        <div key={item._id} className="list-item">
                            <div className="list-item-icon" style={{
                                background: 'linear-gradient(135deg, rgba(21,101,192,0.2), rgba(66,165,245,0.1))',
                                color: 'var(--info-light)'
                            }}>📦</div>
                            <div className="list-item-content">
                                <div className="list-item-title">{item.product_id?.name || 'Unknown Product'}</div>
                                <div className="list-item-desc">
                                    <span style={{ color: 'var(--info-light)', fontWeight: 600 }}>
                                        ₹{item.rate}/kg
                                    </span>
                                    {' · '}
                                    {item.weight} kg required
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button
                className="btn btn-primary fab"
                onClick={() => navigate('/update-demand', { state: { products } })}
                style={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }}
            >
                <FiPlus /> Post New Demand
            </button>
        </div>
    );
};

export default RecyclerDashboard;
