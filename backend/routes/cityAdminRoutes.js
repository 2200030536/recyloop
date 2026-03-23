const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
    getCityVendors,
    approveCityVendor,
    getCityRecyclers,
    deleteCityUser,
    getCityDashboardStats,
    getCityVendorSupply,
    updateCityVendorSupplyStatus,
    getCityRecyclerDemand,
    updateCityRecyclerDemandStatus,
    getCityProducts,
    getCityRates,
    updateCityRate
} = require('../controllers/cityAdminController');

router.use(protect);
router.use(authorize('city_admin'));

router.get('/dashboard', getCityDashboardStats);

router.get('/vendors', getCityVendors);
router.put('/vendor/approve/:id', approveCityVendor);

router.get('/recyclers', getCityRecyclers);

router.delete('/user/:id', deleteCityUser);

router.get('/vendor-supply', getCityVendorSupply);
router.put('/vendor-supply/:id/status', updateCityVendorSupplyStatus);

router.get('/recycler-demand', getCityRecyclerDemand);
router.put('/recycler-demand/:id/status', updateCityRecyclerDemandStatus);

router.get('/products', getCityProducts);
router.get('/rates', getCityRates);
router.post('/rate/update', updateCityRate);

module.exports = router;
