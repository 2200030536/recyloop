const express = require('express');
const router = express.Router();
const { registerVendor, loginUser } = require('../controllers/authController');
const { getCities } = require('../controllers/adminController');

router.post('/vendor-signup', registerVendor);
router.post('/login', loginUser);
router.get('/cities', getCities);

module.exports = router;
