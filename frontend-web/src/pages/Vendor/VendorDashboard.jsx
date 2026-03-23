import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiPlus, FiTrendingUp, FiUser } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const VendorDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();

    const fetchProducts = async () => {
        try {
            const response = await api.get('/vendor/products-with-rate');
            setProducts(response.data);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    if (loading) {
        return <div className="spinner-container"><div className="spinner"></div></div>;
    }

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
                        <FiTrendingUp style={{ color: 'var(--accent)' }} />
                        Hello, {user.name}
                    </h1>
                    <span className="subtitle">{user.city} · Material Rates</span>
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
                <h2 className="section-title">Current Material Rates</h2>

                {products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">♻</div>
                        <p className="empty-state-text">No products available</p>
                    </div>
                ) : (
                    products.map((item) => (
                        <div key={item._id} className="list-item">
                            <div className="list-item-icon" style={{
                                background: 'linear-gradient(135deg, rgba(46,125,50,0.2), rgba(129,199,132,0.1))'
                            }}>♻</div>
                            <div className="list-item-content">
                                <div className="list-item-title">{item.name}</div>
                                <div className="list-item-desc">
                                    {item.rate ? (
                                        <span style={{
                                            color: 'var(--accent)',
                                            fontWeight: 600,
                                            fontSize: '0.85rem'
                                        }}>₹{item.rate}/kg</span>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)' }}>Rate: Not Set</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button
                className="btn btn-primary fab"
                onClick={() => navigate('/update-supply', { state: { products } })}
                style={{ background: 'linear-gradient(135deg, #2E7D32, #00E676)' }}
            >
                <FiPlus /> Update Supply
            </button>
        </div>
    );
};

export default VendorDashboard;
