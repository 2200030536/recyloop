const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { getProductsWithRate, updateSupply, getMySupply } = require('../controllers/vendorController');

router.use(protect);
router.use(authorize('vendor'));

router.get('/products-with-rate', getProductsWithRate);
router.post('/update-supply', updateSupply);
router.get('/my-supply', getMySupply);

module.exports = router;
