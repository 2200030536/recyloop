const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
    getPendingVendors, approveVendor, createProduct, getProducts,
    getAllRates, updateVendorRate, getVendorSupply, getRecyclerDemand, createRecycler,
    createCityAdmin, getCityAdmins,
    createCity, getCities, deleteProduct, deleteCity, deleteVendorSupply,
    deleteRecyclerDemand, deleteUser, getUsers,
    updateVendorSupplyStatus, updateRecyclerDemandStatus
} = require('../controllers/adminController');

router.use(protect);
router.use(authorize('admin'));

router.get('/vendors/pending', getPendingVendors);
router.put('/vendor/approve/:id', approveVendor);
router.delete('/user/:id', deleteUser);
router.get('/users', getUsers);
router.get('/city-admins', getCityAdmins);
router.post('/city-admin', createCityAdmin);

router.post('/product', createProduct);
router.get('/products', getProducts);
router.delete('/product/:id', deleteProduct);

router.get('/rates', getAllRates);
router.post('/rate/update', updateVendorRate);

router.post('/city', createCity);
router.get('/cities', getCities);
router.delete('/city/:id', deleteCity);

router.get('/vendor-supply', getVendorSupply);
router.delete('/vendor-supply/:id', deleteVendorSupply);
router.put('/vendor-supply/:id/status', updateVendorSupplyStatus);
router.get('/recycler-demand', getRecyclerDemand);
router.delete('/recycler-demand/:id', deleteRecyclerDemand);
router.put('/recycler-demand/:id/status', updateRecyclerDemandStatus);

router.post('/create-recycler', createRecycler);

module.exports = router;
