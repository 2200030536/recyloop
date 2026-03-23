const User = require('../models/User');
const VendorSupply = require('../models/VendorSupply');
const RecyclerDemand = require('../models/RecyclerDemand');
const Product = require('../models/Product');
const VendorRate = require('../models/VendorRate');

// Get all vendors in the city administrator's city
const getCityVendors = async (req, res) => {
    try {
        const city = req.user.city;
        const vendors = await User.find({ role: 'vendor', city }).select('-password');
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Approve a vendor in the city administrator's city
const approveCityVendor = async (req, res) => {
    try {
        const city = req.user.city;
        const user = await User.findOne({ _id: req.params.id, role: 'vendor', city });
        if (user) {
            user.status = 'approved';
            await user.save();
            res.json({ message: 'Vendor approved', user: { _id: user._id, name: user.name, status: user.status } });
        } else {
            res.status(404).json({ message: 'Vendor not found in your city' });
        }
    } catch (error) {
        console.error('Approve vendor error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all recyclers in the city administrator's city
const getCityRecyclers = async (req, res) => {
    try {
        const city = req.user.city;
        const recyclers = await User.find({ role: 'recycler', city }).select('-password');
        res.json(recyclers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a user (vendor or recycler) in the city administrator's city
const deleteCityUser = async (req, res) => {
    try {
        const city = req.user.city;
        const user = await User.findOne({ _id: req.params.id, role: { $in: ['vendor', 'recycler'] }, city });
        if (user) {
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found in your city or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Overview counts for dashboard
const getCityDashboardStats = async (req, res) => {
    try {
        const city = req.user.city;
        const vendorsCount = await User.countDocuments({ role: 'vendor', city });
        const pendingVendorsCount = await User.countDocuments({ role: 'vendor', city, status: 'pending' });
        const recyclersCount = await User.countDocuments({ role: 'recycler', city });
        res.json({ vendorsCount, pendingVendorsCount, recyclersCount });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Supply Management ---
const getCityVendorSupply = async (req, res) => {
    try {
        const city = req.user.city;
        const supplies = await VendorSupply.find({ city })
            .populate('vendor_id', 'name phone city')
            .populate('product_id', 'name');
        res.json(supplies);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateCityVendorSupplyStatus = async (req, res) => {
    try {
        const { ordersCompleted, status } = req.body;
        const city = req.user.city;
        const supply = await VendorSupply.findOneAndUpdate(
            { _id: req.params.id, city },
            { ordersCompleted, status, updatedAt: Date.now() },
            { new: true }
        ).populate('vendor_id', 'name phone city').populate('product_id', 'name');
        
        if (!supply) {
            return res.status(404).json({ message: 'Supply record not found in your city' });
        }
        res.json(supply);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Demand Management ---
const getCityRecyclerDemand = async (req, res) => {
    try {
        const city = req.user.city;
        const demands = await RecyclerDemand.find({ city })
            .populate('recycler_id', 'name phone city')
            .populate('product_id', 'name');
        res.json(demands);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateCityRecyclerDemandStatus = async (req, res) => {
    try {
        const { ordersCompleted, status } = req.body;
        const city = req.user.city;
        const demand = await RecyclerDemand.findOneAndUpdate(
            { _id: req.params.id, city },
            { ordersCompleted, status, updatedAt: Date.now() },
            { new: true }
        ).populate('recycler_id', 'name phone city').populate('product_id', 'name');

        if (!demand) {
            return res.status(404).json({ message: 'Demand record not found in your city' });
        }
        res.json(demand);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Rate Management ---
const getCityProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getCityRates = async (req, res) => {
    try {
        const city = req.user.city;
        const rates = await VendorRate.find({ city }).populate('product_id', 'name');
        res.json(rates);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateCityRate = async (req, res) => {
    try {
        const { product_id, rate } = req.body;
        const city = req.user.city;
        const updatedRate = await VendorRate.findOneAndUpdate(
            { product_id, city },
            { rate, updatedAt: Date.now() },
            { returnDocument: 'after', upsert: true }
        ).populate('product_id', 'name');
        res.json(updatedRate);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
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
};
