import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FiPhone, FiLock, FiArrowRight } from 'react-icons/fi';

const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!phone || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await login(phone, password);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo" style={{ textAlign: 'center' }}>
                    <img src="/logo.png" alt="Recyloop Logo" style={{ width: '200px', height: 'auto', marginBottom: '10px' }} />
                </div>
                <p className="auth-subtitle">City-Based Recycling Supply &amp; Demand</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <FiPhone style={{
                                position: 'absolute', left: '14px', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.1rem'
                            }} />
                            <input
                                type="tel"
                                className="form-input"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={{ paddingLeft: '42px' }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{
                                position: 'absolute', left: '14px', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.1rem'
                            }} />
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingLeft: '42px' }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}
                        style={{ marginTop: '8px', padding: '14px 24px', fontSize: '0.95rem' }}>
                        {loading ? <span className="spinner-btn"></span> : null}
                        {loading ? 'Logging in...' : <>Login <FiArrowRight /></>}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button className="btn-link" onClick={() => navigate('/signup')}>
                        Are you a Vendor? Sign Up Here
                    </button>
                </div>

                <div style={{
                    textAlign: 'center', marginTop: '24px', paddingTop: '20px',
                    borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)'
                }}>
                    Powered by Recyloop · Sustainable Recycling
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
