import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const CreateRecycler = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [cities, setCities] = useState([]);
    const [role, setRole] = useState('recycler');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await api.get('/admin/cities');
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

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name || !phone || !password || !address || !city) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/admin/create-recycler', { name, phone, password, address, city, role });
            toast.success(`${role === 'admin' ? 'Admin' : 'Recycler'} account created successfully.`);
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <FiArrowLeft /> Back
                </button>
                <h1>Create Account</h1>
                <div></div>
            </div>

            <div className="page-content">
                <form onSubmit={handleCreate}>
                    <div className="form-group">
                        <label className="form-label">Account Type</label>
                        <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="recycler">Recycler Account</option>
                            <option value="admin">Admin Account</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Business Name</label>
                        <input type="text" className="form-input" placeholder="Enter business name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input type="tel" className="form-input" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-input" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <input type="text" className="form-input" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">City</label>
                        <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                            <option value="">Select City</option>
                            {cities.map((c) => (
                                <option key={c._id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? <span className="spinner-btn"></span> : null}
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateRecycler;
