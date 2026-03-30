import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiBox, FiDollarSign, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const RateUpdate = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState('');
    const [rate, setRate] = useState('');
    const [loading, setLoading] = useState(false);
    const [allRates, setAllRates] = useState([]);
    const [filterCity, setFilterCity] = useState('');
    const [filterProduct, setFilterProduct] = useState('');
    const [sortOption, setSortOption] = useState('city-asc');

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, cityRes, rateRes] = await Promise.all([
                    api.get('/admin/products'),
                    api.get('/admin/cities'),
                    api.get('/admin/rates')
                ]);
                setProducts(productRes.data);
                if (productRes.data.length > 0) setSelectedProduct(productRes.data[0]._id);
                setCities(cityRes.data);
                if (cityRes.data.length > 0) setCity(cityRes.data[0].name);
                setAllRates(rateRes.data);
            } catch (error) {
                console.error('Failed to fetch data');
            }
        };
        fetchData();
    }, []);

    const handleUpdateRate = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !city || !rate) {
            toast.error('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/admin/rate/update', {
                product_id: selectedProduct,
                city,
                rate: Number(rate)
            });
            toast.success('City rate updated successfully');
            setRate('');

            // Refresh all rates
            const rateRes = await api.get('/admin/rates');
            setAllRates(rateRes.data);
        } catch (error) {
            toast.error('Failed to update rate');
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
                <h1>Update City Rate</h1>
                <div></div>
            </div>

            <div className="page-content">
                <form onSubmit={handleUpdateRate} className="glass-card" style={{ padding: '25px', borderRadius: '15px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiBox className="text-primary" /> Product
                            </label>
                            <select
                                className="form-select"
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                            >
                                {products.map((p) => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiMapPin className="text-primary" /> City
                            </label>
                            <select
                                className="form-select"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            >
                                <option value="">Select City</option>
                                {cities.map((c) => (
                                    <option key={c._id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '25px' }}>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiDollarSign className="text-primary" /> New Rate (₹) per kg
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="form-input"
                            placeholder="Enter rate per kg"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? <span className="spinner-btn"></span> : null}
                        Update Rate
                    </button>
                </form>

                <div style={{ marginTop: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            All Declared Rates
                        </h2>
                    </div>

                    <div className="glass-card" style={{ padding: '20px', borderRadius: '15px', marginBottom: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--text-secondary)' }}>
                            <FiFilter /> <span style={{ fontWeight: '500' }}>Filter & Sort Options</span>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                                <select
                                    className="form-select"
                                    value={filterCity}
                                    onChange={(e) => setFilterCity(e.target.value)}
                                    style={{ padding: '10px 15px' }}
                                >
                                    <option value="">All Cities</option>
                                    {cities.map((c) => (
                                        <option key={c._id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0, position: 'relative' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search product name..."
                                    value={filterProduct}
                                    onChange={(e) => setFilterProduct(e.target.value)}
                                    style={{ padding: '10px 15px', paddingLeft: '35px' }}
                                />
                                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            </div>
                            <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                                <select
                                    className="form-select"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    style={{ padding: '10px 15px' }}
                                >
                                    <option value="city-asc">City: A to Z</option>
                                    <option value="product-asc">Product: A to Z</option>
                                    <option value="rate-desc">Rate: High to Low</option>
                                    <option value="rate-asc">Rate: Low to High</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '0', borderRadius: '15px', overflow: 'hidden' }}>
                        <div className="table-responsive" style={{ margin: 0 }}>
                            <table className="data-table" style={{ margin: 0 }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '20px' }}>City</th>
                                        <th style={{ padding: '20px' }}>Product</th>
                                        <th style={{ padding: '20px' }}>Rate (₹/kg)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        let processedRates = [...allRates];
                                        if (filterCity) {
                                            processedRates = processedRates.filter(r => r.city === filterCity);
                                        }
                                        if (filterProduct) {
                                            processedRates = processedRates.filter(r => r.product_id?.name?.toLowerCase().includes(filterProduct.toLowerCase()));
                                        }

                                        processedRates.sort((a, b) => {
                                            if (sortOption === 'city-asc') return a.city.localeCompare(b.city);
                                            if (sortOption === 'product-asc') {
                                                const nameA = a.product_id?.name || '';
                                                const nameB = b.product_id?.name || '';
                                                return nameA.localeCompare(nameB);
                                            }
                                            if (sortOption === 'rate-desc') return b.rate - a.rate;
                                            if (sortOption === 'rate-asc') return a.rate - b.rate;
                                            return 0;
                                        });

                                        if (processedRates.length === 0) {
                                            return (
                                                <tr>
                                                    <td colSpan="3" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                                            <FiBox size={40} style={{ opacity: 0.2 }} />
                                                            <p>No rates found matching the filters.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        return processedRates.map((rateItem) => (
                                            <tr key={rateItem._id} style={{ transition: 'background-color 0.2s ease', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                <td style={{ padding: '15px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                                            <FiMapPin size={18} />
                                                        </div>
                                                        <span style={{ fontWeight: '600', fontSize: '15px' }}>{rateItem.city}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '15px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(var(--secondary-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                                                            <FiBox size={18} />
                                                        </div>
                                                        <span style={{ fontWeight: '500', fontSize: '15px' }}>{rateItem.product_id?.name || 'Unknown Product'}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '15px 20px' }}>
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '24px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', fontWeight: 'bold', fontSize: '15px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                                        ₹{rateItem.rate} <span style={{ fontSize: '12px', opacity: 0.8, fontWeight: 'normal' }}>/ kg</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ));
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RateUpdate;


