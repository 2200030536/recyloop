const Product = require('../models/Product');
const VendorRate = require('../models/VendorRate');
const VendorSupply = require('../models/VendorSupply');

const getProductsWithRate = async (req, res) => {
    try {
        const city = req.user.city;
        const products = await Product.find({});
        const rates = await VendorRate.find({ city });

        const productsWithRate = products.map(product => {
            const rateObj = rates.find(r => r.product_id.toString() === product._id.toString());
            return {
                _id: product._id,
                name: product.name,
                rate: rateObj ? rateObj.rate : null
            };
        });

        res.json(productsWithRate);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateSupply = async (req, res) => {
    try {
        const { product_id, weight } = req.body;
        const vendor_id = req.user._id;
        const city = req.user.city;

        const updatedSupply = await VendorSupply.findOneAndUpdate(
            { vendor_id, product_id },
            { city, weight, updatedAt: Date.now() },
            { returnDocument: 'after', upsert: true }
        ).populate('product_id', 'name');

        res.json(updatedSupply);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMySupply = async (req, res) => {
    try {
        const supplies = await VendorSupply.find({ vendor_id: req.user._id })
            .populate('product_id', 'name');
        res.json(supplies);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getProductsWithRate, updateSupply, getMySupply };
