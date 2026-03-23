import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { FiUser, FiPhone, FiLock, FiMapPin, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';

const InputWithIcon = React.memo(({ icon: Icon, ...props }) => (
    <div style={{ position: 'relative' }}>
        <Icon
            style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                fontSize: '1.1rem'
            }}
        />
        <input {...props} style={{ ...props.style, paddingLeft: '42px' }} />
    </div>
));

const VendorSignupPage = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await api.get('/auth/cities');
                setCities(response.data);

                if (response.data.length > 0) {
                    setCity(response.data[0].name);
                }
            } catch (error) {
                console.error('Failed to fetch cities');
            }
        };

        fetchCities();
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!name || !phone || !password || !address || !city) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/vendor-signup', {
                name,
                phone,
                password,
                address,
                city
            });

            toast.success('Signup successful! Your account is pending admin approval.');

            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo" style={{ textAlign: 'center' }}>
                    <img src="/logo.png" alt="Recyloop Logo" style={{ width: '150px', height: 'auto', marginBottom: '5px' }} />
                    <h2 style={{ fontSize: '1.5rem', marginTop: '10px' }}>Vendor Signup</h2>
                </div>

                <p className="auth-subtitle">
                    Join the recycling network in your city
                </p>

                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label className="form-label">Business Name</label>
                        <InputWithIcon
                            icon={FiUser}
                            type="text"
                            className="form-input"
                            placeholder="Enter business name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <InputWithIcon
                            icon={FiPhone}
                            type="tel"
                            className="form-input"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <InputWithIcon
                            icon={FiLock}
                            type="password"
                            className="form-input"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <InputWithIcon
                            icon={FiMapPin}
                            type="text"
                            className="form-input"
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">City</label>
                        <select
                            className="form-select"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        >
                            <option value="">Select City</option>
                            {cities.map((c) => (
                                <option key={c._id} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                        style={{
                            marginTop: '8px',
                            padding: '14px 24px',
                            fontSize: '0.95rem'
                        }}
                    >
                        {loading ? <span className="spinner-btn"></span> : null}

                        {loading ? (
                            'Signing up...'
                        ) : (
                            <>
                                Sign Up <FiArrowRight />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        className="btn-link"
                        onClick={() => navigate('/login')}
                    >
                        <FiArrowLeft
                            style={{ marginRight: '4px', verticalAlign: 'middle' }}
                        />
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorSignupPage;