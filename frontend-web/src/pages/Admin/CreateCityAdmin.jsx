import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUserPlus } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const CreateCityAdmin = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [cities, setCities] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        city: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await api.get('/admin/cities');
                setCities(response.data);
            } catch (error) {
                toast.error('Failed to load cities');
            }
        };
        fetchCities();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/admin/city-admin', formData);
            toast.success('City Admin created successfully!');
            navigate('/city-admins');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create city admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/city-admins')}>
                    <FiArrowLeft /> Back
                </button>
                <h1>Create City Admin</h1>
                <div></div>
            </div>

            <div className="page-content">
                <form className="auth-form" onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="form-group">
                        <label>City Admin Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter full name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Enter 10-digit number"
                            pattern="[0-9]{10}"
                            title="Please enter exactly 10 digits"
                        />
                    </div>

                    <div className="form-group">
                        <label>Assigned City</label>
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a city...</option>
                            {cities.map((city) => (
                                <option key={city._id} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Address (Optional)</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter address details"
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password"
                            minLength="6"
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
                        {loading ? 'Creating...' : <><FiUserPlus /> Create City Admin</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCityAdmin;
