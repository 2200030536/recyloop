import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTrash2, FiPlus } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState('');
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();

    const fetchProducts = async () => {
        try {
            const response = await api.get('/admin/products');
            setProducts(response.data);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleAddProduct = async () => {
        if (!newProduct) return;
        try {
            await api.post('/admin/product', { name: newProduct });
            setNewProduct('');
            fetchProducts();
            toast.success('Product added');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add product');
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await api.delete(`/admin/product/${id}`);
            fetchProducts();
            toast.success('Product deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    if (loading) {
        return <div className="spinner-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <FiArrowLeft /> Back
                </button>
                <h1>Manage Products</h1>
                <div></div>
            </div>

            <div className="page-content">
                <div className="form-row" style={{ marginBottom: '20px' }}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="New product name"
                            value={newProduct}
                            onChange={(e) => setNewProduct(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddProduct()}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleAddProduct} style={{ marginBottom: '16px' }}>
                        <FiPlus /> Add
                    </button>
                </div>

                {products.map((item) => (
                    <div key={item._id} className="list-item">
                        <div className="list-item-icon"><FiPackage /></div>
                        <div className="list-item-content">
                            <div className="list-item-title">{item.name}</div>
                        </div>
                        <button
                            className="btn-icon danger"
                            onClick={() => setConfirmDelete(item)}
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                ))}
            </div>

            {confirmDelete && (
                <ConfirmDialog
                    title="Delete Product"
                    message={`Are you sure you want to delete "${confirmDelete.name}"?`}
                    confirmText="Delete"
                    danger
                    onConfirm={() => { handleDeleteProduct(confirmDelete._id); setConfirmDelete(null); }}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
};

export default ProductManagement;
