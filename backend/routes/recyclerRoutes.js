const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { getProducts, updateDemand, getMyDemand } = require('../controllers/recyclerController');

router.use(protect);
router.use(authorize('recycler'));

router.get('/products', getProducts);
router.post('/update-demand', updateDemand);
router.get('/my-demand', getMyDemand);

module.exports = router;
