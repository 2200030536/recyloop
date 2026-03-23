import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import VendorSignupPage from './pages/Auth/VendorSignupPage';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import VendorApproval from './pages/Admin/VendorApproval';
import ProductManagement from './pages/Admin/ProductManagement';
import CityManagement from './pages/Admin/CityManagement';
import UserManagement from './pages/Admin/UserManagement';
import RateUpdate from './pages/Admin/RateUpdate';
import VendorSupplyList from './pages/Admin/VendorSupplyList';
import RecyclerDemandList from './pages/Admin/RecyclerDemandList';
import CreateRecycler from './pages/Admin/CreateRecycler';

// Vendor Pages
import VendorDashboard from './pages/Vendor/VendorDashboard';
import UpdateSupply from './pages/Vendor/UpdateSupply';

// Recycler Pages
import RecyclerDashboard from './pages/Recycler/RecyclerDashboard';
import UpdateDemand from './pages/Recycler/UpdateDemand';

// City Admin Pages
import CityAdminDashboard from './pages/CityAdmin/CityAdminDashboard';
import CityAdminVendorList from './pages/CityAdmin/CityAdminVendorList';
import CityAdminRecyclerList from './pages/CityAdmin/CityAdminRecyclerList';
import CityAdminVendorSupplyList from './pages/CityAdmin/CityAdminVendorSupplyList';
import CityAdminRecyclerDemandList from './pages/CityAdmin/CityAdminRecyclerDemandList';
import CityAdminRateUpdate from './pages/CityAdmin/CityAdminRateUpdate';
import CityAdminManagement from './pages/Admin/CityAdminManagement';
import CreateCityAdmin from './pages/Admin/CreateCityAdmin';

// Profile Page
import ProfilePage from './pages/Profile/ProfilePage';

const AppRoutes = () => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<VendorSignupPage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    if (user.role === 'admin') {
        return (
            <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/vendor-approval" element={<VendorApproval />} />
                <Route path="/products" element={<ProductManagement />} />
                <Route path="/cities" element={<CityManagement />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/city-admins" element={<CityAdminManagement />} />
                <Route path="/create-city-admin" element={<CreateCityAdmin />} />
                <Route path="/rates" element={<RateUpdate />} />
                <Route path="/vendor-supply" element={<VendorSupplyList />} />
                <Route path="/recycler-demand" element={<RecyclerDemandList />} />
                <Route path="/create-recycler" element={<CreateRecycler />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        );
    }

    if (user.role === 'city_admin') {
        return (
            <Routes>
                <Route path="/" element={<CityAdminDashboard />} />
                <Route path="/city-vendors" element={<CityAdminVendorList />} />
                <Route path="/city-recyclers" element={<CityAdminRecyclerList />} />
                <Route path="/city-supply" element={<CityAdminVendorSupplyList />} />
                <Route path="/city-demand" element={<CityAdminRecyclerDemandList />} />
                <Route path="/city-rates" element={<CityAdminRateUpdate />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        );
    }

    if (user.role === 'vendor') {
        return (
            <Routes>
                <Route path="/" element={<VendorDashboard />} />
                <Route path="/update-supply" element={<UpdateSupply />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        );
    }

    // recycler
    return (
        <Routes>
            <Route path="/" element={<RecyclerDashboard />} />
            <Route path="/update-demand" element={<UpdateDemand />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <AppRoutes />
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
