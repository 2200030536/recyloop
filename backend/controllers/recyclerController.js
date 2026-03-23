const Product = require('../models/Product');
const RecyclerDemand = require('../models/RecyclerDemand');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateDemand = async (req, res) => {
    try {
        const { product_id, rate, weight } = req.body;
        const recycler_id = req.user._id;
        const city = req.user.city;

        const updatedDemand = await RecyclerDemand.findOneAndUpdate(
            { recycler_id, product_id },
            { city, rate, weight, updatedAt: Date.now() },
            { returnDocument: 'after', upsert: true }
        ).populate('product_id', 'name');

        res.json(updatedDemand);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMyDemand = async (req, res) => {
    try {
        const demands = await RecyclerDemand.find({ recycler_id: req.user._id })
            .populate('product_id', 'name');
        res.json(demands);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getProducts, updateDemand, getMyDemand };
