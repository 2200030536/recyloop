import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { FiUser, FiPhone, FiLock, FiSave, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../../index.css';

const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== formData.confirmPassword) {
            return addToast('Passwords do not match.', 'error');
        }

        try {
            setLoading(true);
            const payload = {
                name: formData.name,
                phone: formData.phone
            };
            
            if (formData.password) {
                payload.password = formData.password;
            }

            const response = await api.put('/users/profile', payload);

            if (response.data) {
                // Update local context
                setUser({ ...user, ...response.data });
                // Update local storage
                localStorage.setItem('userInfo', JSON.stringify({ ...user, ...response.data }));
                
                addToast('Profile updated successfully!', 'success');
                // clear password fields after save
                setFormData(prev => ({
                    ...prev,
                    password: '',
                    confirmPassword: ''
                }));
            }
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Failed to update profile';
            addToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="animated-bg"></div>
            
            <div className="page-header" style={{ marginBottom: '20px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <img src="/logo.png" alt="Recyloop Logo" style={{ height: '24px', objectFit: 'contain' }} />
                        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#fff', letterSpacing: '0.5px' }}>Recyloop</span>
                    </div>
                    <button className="btn-icon" onClick={() => navigate(-1)} style={{ marginBottom: '10px' }} title="Go Back">
                        <FiArrowLeft />
                    </button>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiUser style={{ color: 'var(--accent)' }} />
                        My Profile
                    </h1>
                    <span className="subtitle">Update your personal information</span>
                </div>
            </div>

            <div className="page-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="glass-panel" style={{ padding: '30px', animation: 'slideUp 0.4s ease-out' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-with-icon">
                                <FiUser className="input-icon" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    required
                                    className="fancy-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-with-icon">
                                <FiPhone className="input-icon" />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    required
                                    className="fancy-input"
                                />
                            </div>
                        </div>

                        <div style={{ height: '1px', background: 'var(--border-color)', margin: '10px 0' }}></div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Leave blank if you do not want to change your password.</p>

                        <div className="form-group">
                            <label>New Password</label>
                            <div className="input-with-icon">
                                <FiLock className="input-icon" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="New password"
                                    className="fancy-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <div className="input-with-icon">
                                <FiLock className="input-icon" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    className="fancy-input"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary" 
                            disabled={loading}
                            style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        >
                            {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : <><FiSave /> Save Changes</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
